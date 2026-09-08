import { notFound } from "next/navigation";

export default function AdminDecoyPage() {
  // Return 404 to misdirect attackers
  notFound();
}
