"use server";

import type { Json } from "@/lib/db/database.types";
import { settingsRegistry, type SettingsKey, type SettingsValue } from "@/lib/data/settings";
import { fail, type ActionResult } from "./result";
import { check, mutate } from "./helpers";

/** Saves one site_settings value (profile, links, website and resume configs). */
export async function saveSettings<K extends SettingsKey>(key: K, value: SettingsValue<K>): Promise<ActionResult<SettingsValue<K>>> {
  if (!Object.hasOwn(settingsRegistry, key)) return fail("Unknown settings.");
  const schema = settingsRegistry[key].schema;
  return mutate(schema, value, async (parsed, db) => {
    check(
      "settings",
      await db.from("site_settings").upsert({ key, value: parsed as Json }).select("key").single(),
    );
    return parsed as SettingsValue<K>;
  });
}
