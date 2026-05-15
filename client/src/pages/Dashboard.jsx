import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import api from "../services/api";

import PollCard from "../components/poll/PollCard";

function Dashboard() {

  const [polls, setPolls] = useState([]);

  const [loading, setLoading] =
    useState(true);

  // Fetch Polls

  const fetchPolls = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res = await api.get(
        "/polls/my",

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setPolls(res.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchPolls();

  }, []);

  return (

    <DashboardLayout>

      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        <div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            My Polls 📊
          </h1>

          <p className="text-slate-400 mt-3 text-sm sm:text-base">
            Manage and analyze your polls
          </p>

        </div>

      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6">

          <h2 className="text-slate-400 text-sm sm:text-base">
            Total Polls
          </h2>

          <p className="text-4xl sm:text-5xl font-bold mt-4">
            {polls.length}
          </p>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6">

          <h2 className="text-slate-400 text-sm sm:text-base">
            Published
          </h2>

          <p className="text-4xl sm:text-5xl font-bold mt-4 text-green-400">

            {
              polls.filter(
                (p) => p.isPublished
              ).length
            }

          </p>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6">

          <h2 className="text-slate-400 text-sm sm:text-base">
            Active Polls
          </h2>

          <p className="text-4xl sm:text-5xl font-bold mt-4 text-purple-400">

            {
              polls.filter(
                (p) =>
                  new Date(p.expiresAt) >
                  new Date()
              ).length
            }

          </p>

        </div>

      </div>

      {/* Poll Cards */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-10">

        {loading ? (

          <p>Loading polls...</p>

        ) : polls.length === 0 ? (

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center col-span-full">

            <h2 className="text-2xl sm:text-3xl font-bold">
              No polls yet 😢
            </h2>

            <p className="text-slate-400 mt-3 text-sm sm:text-base">
              Create your first poll now.
            </p>

          </div>

        ) : (

          polls.map((poll) => (

            <PollCard
              key={poll._id}
              poll={poll}
            />

          ))

        )}

      </div>

    </DashboardLayout>
  );
}

export default Dashboard;