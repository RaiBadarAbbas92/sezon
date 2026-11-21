import AdminDashboard from "../../components/AdminDashboard";

export const metadata = {
  title: "Sezon Admin",
  description: "Sezon store management dashboard"
};

export default async function AdminPage() {
  return <AdminDashboard />;
}
