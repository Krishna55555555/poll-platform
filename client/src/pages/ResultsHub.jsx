import {
  useEffect,
  useState
} from "react";

import {
  Link
} from "react-router-dom";

import {
  BarChart3,
  Vote,
  ArrowRight,
  Sparkles
} from "lucide-react";

import api from "../services/api";

function ResultsHub() {

  const [polls, setPolls] =
    useState([]);

  useEffect(() => {

    fetchPolls();

  }, []);

  const fetchPolls = async () => {

    try {

      const res = await api.get(
        "/polls/published/all"
      );

      setPolls(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="min-h-screen bg-[#070018] text-white px-4 sm:px-6 lg:px-10 py-10 lg:py-16 relative overflow-hidden">

      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-pink-500/10 blur-[160px] rounded-full" />

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[160px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto">

        <div className="text-center">

          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-pink-500/10 border border-pink-500/20">

            <Sparkles className="text-pink-400" size={18} />

            <span className="text-pink-300 font-semibold text-sm tracking-wide">
              LIVE PUBLIC RESULTS
            </span>

          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black mt-8 leading-tight">

            Humanity Has

            <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 text-transparent bg-clip-text mt-3">
              Already Voted 😎
            </span>

          </h1>

        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mt-16 lg:mt-20">

          {polls.map((poll) => (

            <div
              key={poll._id}
              className="group bg-[#120224]/80 border border-purple-500/10 hover:border-pink-500/40 rounded-[28px] p-5 sm:p-8 transition duration-300 hover:-translate-y-2 backdrop-blur-xl"
            >

              <div className="flex items-start justify-between gap-4">

                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-[0_0_35px_rgba(236,72,153,0.35)]">
                  <BarChart3 size={28} />
                </div>

                <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold">
                  LIVE
                </div>

              </div>

              <h2 className="text-2xl sm:text-3xl font-black mt-8 leading-tight">
                {poll.title}
              </h2>

              <p className="text-pink-100/60 mt-5 leading-relaxed min-h-[80px] text-sm sm:text-base">
                {poll.description || "No description provided."}
              </p>

              <div className="flex items-center justify-between mt-8 gap-4">

                <div className="flex items-center gap-3 text-pink-300">
                  <Vote size={20} />

                  <span className="font-semibold text-sm sm:text-base">
                    {poll.totalResponses} votes
                  </span>
                </div>

                <p className="text-pink-100/40 text-xs sm:text-sm">
                  {new Date(poll.createdAt).toLocaleDateString()}
                </p>

              </div>

              <Link
                to={`/results/${poll._id}`}
                className="group/button flex items-center justify-center gap-3 w-full mt-8 px-6 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-[1.02] transition font-bold text-base sm:text-lg shadow-[0_0_35px_rgba(236,72,153,0.35)]"
              >

                View Analytics

                <ArrowRight
                  size={20}
                  className="group-hover/button:translate-x-1 transition"
                />

              </Link>

            </div>

          ))}

        </div>

      </div>

    </div>

  );
}

export default ResultsHub;