/**
 * Generates lib/db/database.types.ts from the live database schema, in the
 * same shape as `supabase gen types typescript` (which needs Docker or
 * `supabase login`). Introspects the `public` schema over a direct Postgres
 * connection built from .env (NEXT_PUBLIC_SUPABASE_URL + SUPABASE_DB_PASSWORD).
 *
 *   npm run db:types
 */
import { writeFileSync } from "node:fs";
import postgres from "postgres";

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    console.error(`Missing ${name} in .env`);
    process.exit(1);
  }
  return value;
}

const projectRef = new URL(requireEnv("NEXT_PUBLIC_SUPABASE_URL")).hostname.split(".")[0];
const sql = postgres({
  host: `db.${projectRef}.supabase.co`,
  port: 5432,
  database: "postgres",
  username: "postgres",
  password: requireEnv("SUPABASE_DB_PASSWORD"),
  ssl: "require",
  max: 1,
});

const scalar: Record<string, string> = {
  int2: "number", int4: "number", int8: "number", float4: "number", float8: "number", numeric: "number",
  bool: "boolean", json: "Json", jsonb: "Json", void: "undefined",
  text: "string", varchar: "string", bpchar: "string", uuid: "string", date: "string", time: "string",
  timetz: "string", timestamp: "string", timestamptz: "string", interval: "string", bytea: "string", inet: "string",
};
const tsType = (udt: string) => (udt.startsWith("_") ? `${scalar[udt.slice(1)] ?? "unknown"}[]` : scalar[udt] ?? "unknown");

type Column = {
  table_name: string; column_name: string; udt_name: string; is_nullable: string;
  column_default: string | null; is_identity: string; identity_generation: string | null; is_generated: string;
};

try {
  const tables = await sql<{ table_name: string; table_type: string }[]>`
    select table_name, table_type from information_schema.tables
    where table_schema = 'public' order by table_name`;
  const columns = await sql<Column[]>`
    select table_name, column_name, udt_name, is_nullable, column_default, is_identity, identity_generation, is_generated
    from information_schema.columns where table_schema = 'public' order by table_name, column_name`;
  const fks = await sql<{ name: string; table_name: string; columns: string[]; ref_table: string; ref_columns: string[]; one_to_one: boolean }[]>`
    select c.conname as name, t.relname as table_name,
      array(select a.attname from unnest(c.conkey) k join pg_attribute a on a.attrelid = c.conrelid and a.attnum = k order by a.attname) as columns,
      rt.relname as ref_table,
      array(select a.attname from unnest(c.confkey) k join pg_attribute a on a.attrelid = c.confrelid and a.attnum = k order by a.attname) as ref_columns,
      exists (select 1 from pg_constraint u where u.conrelid = c.conrelid and u.contype in ('u', 'p') and u.conkey::int[] @> c.conkey::int[] and u.conkey::int[] <@ c.conkey::int[]) as one_to_one
    from pg_constraint c
    join pg_class t on t.oid = c.conrelid join pg_namespace n on n.oid = t.relnamespace
    join pg_class rt on rt.oid = c.confrelid
    where c.contype = 'f' and n.nspname = 'public' order by c.conname`;
  const functions = await sql<{ name: string; arg_names: string[] | null; arg_types: string[]; n_defaults: number; returns: string }[]>`
    select p.proname as name, p.proargnames as arg_names,
      array(select (select typname from pg_type where oid = u.t) from unnest(p.proargtypes) with ordinality u(t, o) order by u.o) as arg_types,
      p.pronargdefaults as n_defaults, (select typname from pg_type where oid = p.prorettype) as returns
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.prokind = 'f' and p.prorettype <> 'trigger'::regtype
    order by p.proname`;
  const enums = await sql<{ name: string; values: string[] }[]>`
    select t.typname as name, array_agg(e.enumlabel order by e.enumsortorder) as values
    from pg_type t join pg_enum e on e.enumtypid = t.oid join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public' group by t.typname order by t.typname`;

  const I = (n: number) => " ".repeat(n);
  const colsOf = (table: string) => columns.filter((c) => c.table_name === table);
  const rowType = (c: Column) => `${tsType(c.udt_name)}${c.is_nullable === "YES" ? " | null" : ""}`;
  const block = (label: string, lines: string[]) => `${I(8)}${label}: {\n${lines.join("")}${I(8)}}\n`;
  const writeOnly = (c: Column) => (c.is_identity === "YES" && c.identity_generation === "ALWAYS") || c.is_generated === "ALWAYS";

  const relation = (name: string, rows: { table_name: string }[]) =>
    rows.map(({ table_name: t }) => {
      const cols = colsOf(t);
      const rels = fks.filter((f) => f.table_name === t);
      const relText = rels.length === 0 ? "[]" : `[\n${rels.map((f) => `${I(10)}{\n${I(12)}foreignKeyName: "${f.name}"\n${I(12)}columns: [${f.columns.map((c) => `"${c}"`).join(", ")}]\n${I(12)}isOneToOne: ${f.one_to_one}\n${I(12)}referencedRelation: "${f.ref_table}"\n${I(12)}referencedColumns: [${f.ref_columns.map((c) => `"${c}"`).join(", ")}]\n${I(10)}},\n`).join("")}${I(8)}]`;
      let out = `${I(6)}${t}: {\n` + block("Row", cols.map((c) => `${I(10)}${c.column_name}: ${rowType(c)}\n`));
      if (name === "Tables") {
        out += block("Insert", cols.map((c) => {
          if (writeOnly(c)) return `${I(10)}${c.column_name}?: never\n`;
          const optional = c.is_nullable === "YES" || c.column_default !== null || c.is_identity === "YES";
          return `${I(10)}${c.column_name}${optional ? "?" : ""}: ${rowType(c)}\n`;
        }));
        out += block("Update", cols.map((c) => `${I(10)}${c.column_name}?: ${writeOnly(c) ? "never" : rowType(c)}\n`));
      }
      return out + `${I(8)}Relationships: ${relText}\n${I(6)}}\n`;
    }).join("");

  const empty = `{\n${I(6)}[_ in never]: never\n${I(4)}}`;
  const baseTables = tables.filter((t) => t.table_type === "BASE TABLE");
  const views = tables.filter((t) => t.table_type === "VIEW");
  const fnText = functions.length === 0 ? empty : `{\n${functions.map((f) => {
    const names = f.arg_names ?? [];
    const firstDefault = f.arg_types.length - f.n_defaults;
    const args = f.arg_types.length === 0 ? "never" : `{ ${f.arg_types.map((t, i) => `${names[i]}${i >= firstDefault ? "?" : ""}: ${tsType(t)}`).join("; ")} }`;
    return `${I(6)}${f.name}: {\n${I(8)}Args: ${args}\n${I(8)}Returns: ${tsType(f.returns)}\n${I(6)}}\n`;
  }).join("")}${I(4)}}`;
  const enumText = enums.length === 0 ? empty : `{\n${enums.map((e) => `${I(6)}${e.name}: ${e.values.map((v) => `"${v}"`).join(" | ")}\n`).join("")}${I(4)}}`;

  const output = `// Generated by scripts/gen-db-types.mts from the live database schema
// (same shape as \`supabase gen types typescript\`). Do not edit by hand:
// run \`npm run db:types\` after applying migrations.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: ${baseTables.length ? `{\n${relation("Tables", baseTables)}${I(4)}}` : empty}
    Views: ${views.length ? `{\n${relation("Views", views)}${I(4)}}` : empty}
    Functions: ${fnText}
    Enums: ${enumText}
    CompositeTypes: ${empty}
  }
}

type PublicSchema = Database["public"]

export type Tables<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Row"]
export type TablesInsert<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Update"]
`;
  writeFileSync("lib/db/database.types.ts", output);
  console.log(`Wrote lib/db/database.types.ts (${baseTables.length} tables, ${views.length} views, ${functions.length} functions).`);
} finally {
  await sql.end();
}
