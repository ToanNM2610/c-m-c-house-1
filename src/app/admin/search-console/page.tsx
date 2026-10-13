import AdminPage from "../page";

export const metadata = {
  title: "Search Console | Cẩm Cù Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminSearchConsolePage() {
  return <AdminPage initialTab="searchConsole" />;
}
