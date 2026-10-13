import AdminPage from "../page";

export const metadata = {
  title: "Google Analytics 4 | Cẩm Cù Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminAnalyticsPage() {
  return <AdminPage initialTab="analytics" />;
}
