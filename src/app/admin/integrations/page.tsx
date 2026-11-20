import AdminPageClient from "@/components/admin/AdminPageClient";

export const metadata = {
  title: "Tích hợp & Khóa | Cẩm Cù Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminIntegrationsPage() {
  return <AdminPageClient initialTab="integrations" />;
}
