import { notFound } from "next/navigation";

// Unknown /admin/* paths (including removed modules) are a 404 inside the admin shell.
export default function Page() {
  notFound();
}
