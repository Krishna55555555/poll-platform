import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreatePoll from "./pages/CreatePoll";
import PublicPoll from "./pages/PublicPoll";
import Analytics from "./pages/Analytics";
import PublicResults from "./pages/PublicResults";
import ResultsHub from "./pages/ResultsHub";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/poll/:id" element={<PublicPoll />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/create"
        element={
          <ProtectedRoute>
            <CreatePoll />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/poll/:id"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />

      <Route path="/results/:id" element={<PublicResults />} />

      <Route path="/results" element={<ResultsHub />} />
    </Routes>
  );
}

export default App;
