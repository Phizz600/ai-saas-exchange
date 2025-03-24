
import { Header } from "@/components/Header";
import { TestEmailSender } from "@/components/admin/TestEmailSender";

export const Admin = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="exo-2-heading text-3xl font-bold mb-6">Admin Tools</h1>
          
          <div className="grid gap-6">
            <TestEmailSender />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
