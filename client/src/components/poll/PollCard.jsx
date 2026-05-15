import {
  BarChart3,
  Copy,
  Globe
} from "lucide-react";

import toast from "react-hot-toast";

import { Link } from "react-router-dom";

function PollCard({ poll }) {

  const copyPollLink = () => {

    const pollLink = `${window.location.origin}/poll/${poll._id}`;

    navigator.clipboard.writeText(
      pollLink
    );

    toast.success("Poll link copied!");
  };

  const expired =
    new Date(poll.expiresAt) < new Date();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-purple-500 transition">

      {/* Header */}

      <div className="flex items-start justify-between">

        <div>

          <h2 className="text-2xl font-bold">
            {poll.title}
          </h2>

          <p className="text-slate-400 mt-2">
            {poll.description}
          </p>

        </div>

        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            poll.isPublished
              ? "bg-green-500/20 text-green-400"
              : "bg-yellow-500/20 text-yellow-400"
          }`}
        >
          {poll.isPublished
            ? "Published"
            : "Draft"}
        </span>

      </div>

      {/* Info */}

      <div className="mt-6 space-y-2 text-slate-300">

        <p>
          <span className="text-slate-500">
            Mode:
          </span>{" "}
          {poll.responseMode}
        </p>

        <p>
          <span className="text-slate-500">
            Questions:
          </span>{" "}
          {poll.questions.length}
        </p>

        <p>
          <span className="text-slate-500">
            Expires:
          </span>{" "}
          {new Date(
            poll.expiresAt
          ).toLocaleString()}
        </p>

      </div>

      {/* Expiry Badge */}

      <div className="mt-5">

        {expired ? (

          <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm">
            Expired
          </span>

        ) : (

          <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
            Active
          </span>

        )}

      </div>

      {/* Actions */}

      <div className="flex gap-3 mt-8">

        <Link
          to={`/dashboard/poll/${poll._id}`}

          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 font-semibold"
        >
          <BarChart3 size={18} />
          Analytics
        </Link>

        <button
          onClick={copyPollLink}

          className="flex items-center justify-center px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700"
        >
          <Copy size={18} />
        </button>

        <a
          href={`/poll/${poll._id}`}
          target="_blank"

          className="flex items-center justify-center px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700"
        >
          <Globe size={18} />
        </a>

      </div>

    </div>
  );
}

export default PollCard;