import AdminPageClient from "@/components/admin/AdminPageClient";

export const metadata = {
  title: "Google Analytics 4 | Cẩm Cù Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminAnalyticsPage() {
  return <AdminPageClient initialTab="analytics" />;
}
