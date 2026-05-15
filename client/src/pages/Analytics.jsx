import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import toast from "react-hot-toast";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import {
  Activity,
  Users,
  BarChart3,
  CheckCircle2,
  Globe,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";

import api from "../services/api";

import socket from "../socket";

const CustomTooltip = ({
  active,
  payload,
  label,
}) => {

  if (
    active &&
    payload &&
    payload.length
  ) {

    return (

      <div className="bg-slate-900/95 backdrop-blur-2xl border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.25)] rounded-3xl px-4 py-3 sm:px-5 sm:py-4">

        <p className="text-white font-bold text-sm sm:text-lg">
          {label}
        </p>

        <div className="mt-2 flex items-center gap-2">

          <div className="w-3 h-3 rounded-full bg-purple-400" />

          <p className="text-purple-300 font-semibold text-sm sm:text-lg">
            {payload[0].value} votes
          </p>

        </div>

      </div>
    );
  }

  return null;
};

function Analytics() {

  const { id } = useParams();

  const [analytics, setAnalytics] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // FETCH

  const fetchAnalytics = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res = await api.get(
        `/polls/${id}/analytics`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnalytics(res.data);

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to load analytics"
      );

    } finally {

      setLoading(false);

    }
  };

  // PUBLISH

  const publishResults = async () => {

    try {

      const token =
        localStorage.getItem("token");

      await api.put(
        `/polls/${id}/publish`,
        {},

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Results published successfully 🚀"
      );

      fetchAnalytics();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Publish failed"
      );
    }
  };

  useEffect(() => {

    fetchAnalytics();

  }, []);

  // SOCKET

  useEffect(() => {

    socket.emit("join_poll", id);

    socket.on(
      "new_response",

      () => {

        fetchAnalytics();

        toast.success(
          "New live response received 📊"
        );
      }
    );

    return () => {

      socket.off("new_response");

    };

  }, []);

  // LOADING

  if (loading) {

    return (

      <DashboardLayout>

        <div className="min-h-[60vh] flex items-center justify-center text-2xl sm:text-4xl font-bold">

          Loading Analytics...

        </div>

      </DashboardLayout>
    );
  }

  // EMPTY

  if (!analytics) {

    return (

      <DashboardLayout>

        <div className="min-h-[60vh] flex items-center justify-center text-2xl sm:text-4xl font-bold">

          Analytics not found

        </div>

      </DashboardLayout>
    );
  }

  return (

    <DashboardLayout>

      {/* HEADER */}

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

        <div>

          <div className="flex items-center gap-3">

            <div className="w-4 h-4 rounded-full bg-green-400 animate-pulse" />

            <p className="text-green-400 font-semibold tracking-wide uppercase text-xs sm:text-sm">

              Live Analytics Dashboard

            </p>

          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mt-4 leading-tight break-words">

            {analytics.title}

          </h1>

          <p className="text-slate-400 mt-4 text-sm sm:text-lg max-w-3xl leading-relaxed">

            Monitor live response activity,
            audience participation and voting
            trends in real time.

          </p>

        </div>

        <button
          onClick={publishResults}
          className="px-5 sm:px-7 py-3 sm:py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 transition font-bold text-sm sm:text-lg shadow-2xl w-full sm:w-auto"
        >

          Publish Results 🚀

        </button>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-12">

        {/* CARD */}

        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl">

          <div className="flex items-center justify-between gap-4">

            <div>

              <p className="text-slate-400 text-xs sm:text-sm uppercase tracking-wider">

                Total Responses

              </p>

              <h2 className="text-4xl sm:text-5xl font-black mt-5">

                {analytics.totalResponses}

              </h2>

            </div>

            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center shrink-0">

              <Users
                size={28}
                className="text-purple-400"
              />

            </div>

          </div>

        </div>

        {/* CARD */}

        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl">

          <div className="flex items-center justify-between gap-4">

            <div>

              <p className="text-slate-400 text-xs sm:text-sm uppercase tracking-wider">

                Questions

              </p>

              <h2 className="text-4xl sm:text-5xl font-black mt-5">

                {analytics.analytics.length}

              </h2>

            </div>

            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center shrink-0">

              <BarChart3
                size={28}
                className="text-cyan-400"
              />

            </div>

          </div>

        </div>

        {/* CARD */}

        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl">

          <div className="flex items-center justify-between gap-4">

            <div>

              <p className="text-slate-400 text-xs sm:text-sm uppercase tracking-wider">

                Poll Status

              </p>

              <h2 className="text-2xl sm:text-3xl font-black mt-6 text-green-400">

                Active

              </h2>

            </div>

            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-green-500/20 flex items-center justify-center shrink-0">

              <Activity
                size={28}
                className="text-green-400"
              />

            </div>

          </div>

        </div>

        {/* CARD */}

        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl">

          <div className="flex items-center justify-between gap-4">

            <div>

              <p className="text-slate-400 text-xs sm:text-sm uppercase tracking-wider">

                Published

              </p>

              <h2 className="text-2xl sm:text-3xl font-black mt-6 text-yellow-400">

                {analytics.isPublished
                  ? "Yes"
                  : "No"}

              </h2>

            </div>

            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-yellow-500/20 flex items-center justify-center shrink-0">

              <CheckCircle2
                size={28}
                className="text-yellow-400"
              />

            </div>

          </div>

        </div>

      </div>

      {/* QUESTIONS */}

      <div className="space-y-10 mt-14">

        {analytics.analytics.map(
          (question, index) => (

            <div
              key={index}
              className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-[32px] p-4 sm:p-6 lg:p-8 shadow-2xl overflow-hidden"
            >

              {/* TOP */}

              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

                <div>

                  <p className="text-purple-400 font-semibold uppercase tracking-widest text-xs sm:text-sm">

                    Question {index + 1}

                  </p>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mt-3 leading-tight max-w-4xl break-words">

                    {question.question}

                  </h2>

                </div>

                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 w-fit">

                  <Globe
                    size={20}
                    className="text-green-400"
                  />

                  <span className="font-semibold text-slate-300 text-sm sm:text-base">

                    Live Audience Voting

                  </span>

                </div>

              </div>

              {/* CHART */}

              <div className="mt-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 shadow-[0_0_80px_rgba(168,85,247,0.08)] rounded-3xl p-3 sm:p-6 overflow-x-auto">

                <div className="h-[320px] sm:h-[420px] lg:h-[500px] min-w-[500px] sm:min-w-0">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <BarChart
                      data={question.options}
                      margin={{
                        top: 30,
                        right: 20,
                        left: -10,
                        bottom: 10,
                      }}
                    >

                      <CartesianGrid
                        strokeDasharray="4 4"
                        stroke="#1e293b"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="option"
                        tick={{
                          fill: "#94a3b8",
                          fontSize:
                            window.innerWidth < 640
                              ? 12
                              : 16,
                          fontWeight: 600,
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis
                        allowDecimals={false}
                        tick={{
                          fill: "#64748b",
                          fontSize:
                            window.innerWidth < 640
                              ? 10
                              : 14,
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip
                        cursor={{
                          fill:
                            "rgba(168,85,247,0.08)",
                        }}
                        content={<CustomTooltip />}
                      />

                      <defs>

                        <linearGradient
                          id="premiumGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >

                          <stop
                            offset="0%"
                            stopColor="#e879f9"
                          />

                          <stop
                            offset="50%"
                            stopColor="#c084fc"
                          />

                          <stop
                            offset="100%"
                            stopColor="#7c3aed"
                          />

                        </linearGradient>

                      </defs>

                      <Bar
                        dataKey="count"
                        radius={[22, 22, 10, 10]}
                        fill="url(#premiumGradient)"
                        barSize={
                          window.innerWidth < 640
                            ? 60
                            : 160
                        }
                        animationDuration={1500}
                        className="drop-shadow-[0_0_30px_rgba(168,85,247,0.55)]"
                      />

                    </BarChart>

                  </ResponsiveContainer>

                </div>

              </div>

              {/* OPTIONS */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">

                {question.options.map(
                  (option, i) => (

                    <div
                      key={i}
                      className="bg-slate-800/70 backdrop-blur-xl border border-slate-700 rounded-3xl p-5 sm:p-6 hover:border-purple-500 transition"
                    >

                      <div className="flex items-start justify-between gap-4">

                        <div>

                          <h3 className="text-xl sm:text-2xl font-bold break-words">

                            {option.option}

                          </h3>

                          <p className="text-slate-400 mt-2 text-sm sm:text-lg">

                            Audience Vote Share

                          </p>

                        </div>

                        <div className="text-right shrink-0">

                          <h2 className="text-4xl sm:text-5xl font-black text-purple-400">

                            {option.count}

                          </h2>

                          <p className="text-slate-400 mt-1 text-sm">

                            votes

                          </p>

                        </div>

                      </div>

                      {/* PROGRESS */}

                      <div className="mt-6">

                        <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden">

                          <div
                            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                            style={{
                              width:
                                `${option.percentage}%`,
                            }}
                          />

                        </div>

                        <div className="flex justify-between mt-3 text-xs sm:text-sm text-slate-400">

                          <span>
                            Popularity Score
                          </span>

                          <span>
                            {option.percentage}%
                          </span>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

          )
        )}

      </div>

    </DashboardLayout>
  );
}

export default Analytics;