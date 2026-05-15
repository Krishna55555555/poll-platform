import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  PlusCircle,
  BarChart3,
  LogOut,
  Home,
} from "lucide-react";

import logo from "../../assets/pollbaba-logo.png";

function Sidebar() {

  const location = useLocation();

  const navigate = useNavigate();

  const menu = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/dashboard",
    },

    {
      name: "Create Poll",
      icon: <PlusCircle size={20} />,
      path: "/dashboard/create",
    },

    {
      name: "Results",
      icon: <BarChart3 size={20} />,
      path: "/results",
    },
  ];

  // LOGOUT

  const handleLogout = () => {

    localStorage.removeItem("token");

    navigate("/login");

  };

  return (

    <aside className="w-full lg:w-[280px] bg-[#120224] border-r border-purple-500/10 lg:min-h-screen p-4 lg:p-7 flex lg:flex-col justify-between overflow-x-auto lg:overflow-visible">

      <div className="flex lg:flex-col items-center lg:items-start gap-4 lg:gap-10 w-full">

        {/* LOGO */}

        <Link
          to="/"
          className="shrink-0"
        >
          <img
            src={logo}
            alt="Poll Baba"
            className="w-28 sm:w-36 lg:w-44 object-contain hover:scale-105 transition duration-300"
          />
        </Link>

        {/* MENU */}

        <div className="flex lg:flex-col items-center lg:items-stretch gap-3 w-full overflow-x-auto no-scrollbar">

          {menu.map((item) => (

            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition whitespace-nowrap font-semibold min-w-fit ${
                location.pathname === item.path
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-[0_0_25px_rgba(236,72,153,0.35)]"
                  : "text-pink-100/60 hover:bg-pink-500/10 hover:text-white"
              }`}
            >
              {item.icon}

              <span className="hidden sm:block">
                {item.name}
              </span>

            </Link>

          ))}

        </div>
      </div>

      {/* FOOTER */}

      <div className="hidden lg:flex flex-col gap-3 mt-10 w-full">

        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-pink-100/60 hover:bg-pink-500/10 hover:text-white transition font-semibold"
        >
          <Home size={20} />

          Home
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-pink-100/60 hover:bg-red-500/10 hover:text-red-400 transition font-semibold"
        >
          <LogOut size={20} />

          Logout
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;