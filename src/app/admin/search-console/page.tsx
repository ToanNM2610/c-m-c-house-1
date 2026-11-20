import AdminPageClient from "@/components/admin/AdminPageClient";

export const metadata = {
  title: "Search Console | Cẩm Cù Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminSearchConsolePage() {
  return <AdminPageClient initialTab="searchConsole" />;
}
