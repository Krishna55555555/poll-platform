import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-5 border-b border-slate-800">

      <Link
        to="/"
        className="text-3xl font-bold text-purple-400"
      >
        Poll Baba 😎
      </Link>

      <div className="flex gap-4">

        <Link
          to="/login"
          className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700"
        >
          Get Started
        </Link>

      </div>

    </nav>
  );
}

export default Navbar;