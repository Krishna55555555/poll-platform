import Sidebar from "../components/layout/Sidebar";

function DashboardLayout({ children }) {

  return (

    <div className="min-h-screen bg-slate-950 text-white flex flex-col lg:flex-row">

      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">

        {children}

      </main>

    </div>

  );
}

export default DashboardLayout;