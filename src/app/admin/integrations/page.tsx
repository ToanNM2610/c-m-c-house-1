import AdminPage from "../page";

export const metadata = {
  title: "Tích hợp & Khóa | Cẩm Cù Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminIntegrationsPage() {
  return <AdminPage initialTab="integrations" />;
}
