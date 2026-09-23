import AdminGeneric from "@/components/admin/pages/AdminGeneric";

// Unknown /admin/* paths render the generic module page, as in the source app.
export default function Page() {
  return <AdminGeneric />;
}
