import {
  useEffect,
  useState
} from "react";

import { useParams } from "react-router-dom";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from "recharts";

import toast from "react-hot-toast";

import api from "../services/api";

const COLORS = [
  "#a855f7",
  "#06b6d4",
  "#22c55e",
  "#f59e0b",
  "#ef4444"
];

function PublicResults() {

  const { id } = useParams();

  const [results, setResults] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const fetchResults = async () => {

    try {

      const res = await api.get(
        `/polls/${id}/results`
      );

      setResults(res.data);

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to load results"
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchResults();

  }, []);

  if (loading) {

    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-3xl">
        Loading Results...
      </div>
    );
  }

  if (!results) {

    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-3xl">
        Results not available
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-12">

      <div className="max-w-6xl mx-auto">

        {/* Header */}

        <div className="text-center">

          <p className="text-purple-400 font-semibold uppercase tracking-widest">
            Public Poll Results
          </p>

          <h1 className="text-6xl font-black mt-5">
            {results.title}
          </h1>

          <p className="text-slate-400 mt-5 text-xl">
            Final audience voting insights
          </p>

        </div>

        {/* Total Responses */}

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 mt-12 text-center">

          <h2 className="text-slate-400 text-lg">
            Total Responses
          </h2>

          <p className="text-7xl font-black mt-5 text-purple-400">

            {results.totalResponses}

          </p>

        </div>

        {/* Questions */}

        <div className="space-y-12 mt-14">

          {results.analytics.map(
            (question, index) => (

              <div
                key={index}

                className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-[32px] p-8"
              >

                <h2 className="text-4xl font-black">
                  {question.question}
                </h2>

                <div className="grid lg:grid-cols-2 gap-10 mt-10">

                  {/* Pie Chart */}

                  <div className="h-[400px]">

                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >

                      <PieChart>

                        <Pie
                          data={question.options}

                          dataKey="count"

                          nameKey="option"

                          outerRadius={140}

                          innerRadius={70}
                        >

                          {question.options.map(
                            (entry, index) => (

                              <Cell
                                key={index}

                                fill={
                                  COLORS[
                                    index %
                                    COLORS.length
                                  ]
                                }
                              />

                            )
                          )}

                        </Pie>

                        <Tooltip />

                      </PieChart>

                    </ResponsiveContainer>

                  </div>

                  {/* Stats */}

                  <div className="space-y-5">

                    {question.options.map(
                      (option, i) => (

                        <div
                          key={i}

                          className="bg-slate-800 border border-slate-700 rounded-3xl p-6"
                        >

                          <div className="flex items-center justify-between">

                            <div>

                              <h3 className="text-2xl font-bold">

                                {option.option}

                              </h3>

                              <p className="text-slate-400 mt-2">

                                {option.percentage}%

                              </p>

                            </div>

                            <div className="text-right">

                              <h2 className="text-5xl font-black text-purple-400">

                                {option.count}

                              </h2>

                              <p className="text-slate-400">
                                votes
                              </p>

                            </div>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      </div>

    </div>
  );
}

export default PublicResults;