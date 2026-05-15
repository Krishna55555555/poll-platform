import {
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  Plus,
  Trash2,
  Sparkles,
  ArrowLeft
} from "lucide-react";

import toast from "react-hot-toast";

import api from "../services/api";

function CreatePoll() {

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [pollData, setPollData] =
    useState({

      title: "",

      description: "",

      responseMode: "anonymous",

      expiresAt: "",

      questions: [
        {
          questionText: "",
          required: true,
          options: [
            { text: "" },
            { text: "" }
          ]
        }
      ]

    });

  // HANDLE INPUT

  const handleChange = (e) => {

    setPollData({
      ...pollData,
      [e.target.name]: e.target.value
    });

  };

  // QUESTION CHANGE

  const handleQuestionChange = (
    index,
    value
  ) => {

    const updatedQuestions = [
      ...pollData.questions
    ];

    updatedQuestions[index]
      .questionText = value;

    setPollData({
      ...pollData,
      questions: updatedQuestions
    });

  };

  // OPTION CHANGE

  const handleOptionChange = (
    qIndex,
    oIndex,
    value
  ) => {

    const updatedQuestions = [
      ...pollData.questions
    ];

    updatedQuestions[qIndex]
      .options[oIndex].text = value;

    setPollData({
      ...pollData,
      questions: updatedQuestions
    });

  };

  // ADD OPTION

  const addOption = (qIndex) => {

    const updatedQuestions = [
      ...pollData.questions
    ];

    updatedQuestions[qIndex]
      .options.push({ text: "" });

    setPollData({
      ...pollData,
      questions: updatedQuestions
    });

  };

  // REMOVE OPTION

  const removeOption = (
    qIndex,
    oIndex
  ) => {

    const updatedQuestions = [
      ...pollData.questions
    ];

    if (
      updatedQuestions[qIndex]
        .options.length <= 2
    ) {

      toast.error(
        "Minimum 2 options required"
      );

      return;

    }

    updatedQuestions[qIndex]
      .options.splice(oIndex, 1);

    setPollData({
      ...pollData,
      questions: updatedQuestions
    });

  };

  // ADD QUESTION

  const addQuestion = () => {

    setPollData({
      ...pollData,

      questions: [
        ...pollData.questions,

        {
          questionText: "",
          required: true,
          options: [
            { text: "" },
            { text: "" }
          ]
        }
      ]

    });

  };

  // REMOVE QUESTION

  const removeQuestion = (index) => {

    if (
      pollData.questions.length <= 1
    ) {

      toast.error(
        "Minimum 1 question required"
      );

      return;

    }

    const updatedQuestions =
      pollData.questions.filter(
        (_, i) => i !== index
      );

    setPollData({
      ...pollData,
      questions: updatedQuestions
    });

  };

  // SUBMIT

  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    try {

      setLoading(true);

      const token = localStorage.getItem("token");

await api.post(
  "/polls",
  pollData,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      toast.success(
        "Poll Created Successfully 🚀"
      );

      navigate("/dashboard");

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to create poll"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-[#070018] text-white px-4 sm:px-6 lg:px-10 py-8 lg:py-12 relative overflow-hidden">

      {/* GLOW */}

      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-pink-500/10 blur-[160px] rounded-full" />

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[160px] rounded-full" />

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* TOP */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-10">

          <div>

            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-pink-500/10 border border-pink-500/20 mb-5">

              <Sparkles
                className="text-pink-400"
                size={18}
              />

              <span className="text-pink-300 font-semibold text-sm tracking-wide">
                CREATE NEW POLL
              </span>

            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">

              Create Your

              <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 text-transparent bg-clip-text mt-2">
                Chaos Poll 😎
              </span>

            </h1>

          </div>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-3 px-5 py-3 rounded-2xl border border-purple-500/20 hover:border-pink-400 hover:bg-pink-500/10 transition font-semibold w-full sm:w-auto"
          >
            <ArrowLeft size={20} />
            Back
          </button>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* BASIC INFO */}

          <div className="bg-[#120224]/80 border border-purple-500/10 rounded-[28px] p-5 sm:p-8 backdrop-blur-xl">

            <h2 className="text-2xl sm:text-3xl font-black mb-8">
              Poll Details
            </h2>

            <div className="space-y-6">

              <div>
                <label className="block mb-3 text-pink-100/70 font-semibold">
                  Poll Title
                </label>

                <input
                  type="text"
                  name="title"
                  placeholder="What chaos are we asking today?"
                  value={pollData.title}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-900 border border-purple-500/10 rounded-2xl px-4 py-4 text-sm sm:text-base focus:outline-none focus:border-pink-500/40"
                />
              </div>

              <div>
                <label className="block mb-3 text-pink-100/70 font-semibold">
                  Description
                </label>

                <textarea
                  name="description"
                  placeholder="Tell people what this poll is about..."
                  value={pollData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-slate-900 border border-purple-500/10 rounded-2xl px-4 py-4 text-sm sm:text-base focus:outline-none focus:border-pink-500/40"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">

                <div>
                  <label className="block mb-3 text-pink-100/70 font-semibold">
                    Response Mode
                  </label>

                  <select
                    name="responseMode"
                    value={pollData.responseMode}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-purple-500/10 rounded-2xl px-4 py-4 text-sm sm:text-base focus:outline-none focus:border-pink-500/40"
                  >
                    <option value="anonymous">
                      Anonymous
                    </option>

                    <option value="authenticated">
                      Authenticated
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block mb-3 text-pink-100/70 font-semibold">
                    Expiry Date
                  </label>

                  <input
                    type="datetime-local"
                    name="expiresAt"
                    value={pollData.expiresAt}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-purple-500/10 rounded-2xl px-4 py-4 text-sm sm:text-base focus:outline-none focus:border-pink-500/40"
                  />
                </div>

              </div>

            </div>

          </div>

          {/* QUESTIONS */}

          <div className="space-y-8">

            {pollData.questions.map(
              (question, qIndex) => (

                <div
                  key={qIndex}
                  className="bg-[#120224]/80 border border-purple-500/10 rounded-[28px] p-5 sm:p-8 backdrop-blur-xl"
                >

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">

                    <h2 className="text-2xl sm:text-3xl font-black">
                      Question {qIndex + 1}
                    </h2>

                    <button
                      type="button"
                      onClick={() =>
                        removeQuestion(qIndex)
                      }
                      className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition w-full sm:w-auto"
                    >
                      <Trash2 size={18} />
                      Remove
                    </button>

                  </div>

                  {/* QUESTION */}

                  <input
                    type="text"
                    placeholder="Enter your question"
                    value={question.questionText}
                    onChange={(e) =>
                      handleQuestionChange(
                        qIndex,
                        e.target.value
                      )
                    }
                    required
                    className="w-full bg-slate-900 border border-purple-500/10 rounded-2xl px-4 py-4 text-sm sm:text-base focus:outline-none focus:border-pink-500/40"
                  />

                  {/* OPTIONS */}

                  <div className="space-y-4 mt-8">

                    {question.options.map(
                      (option, oIndex) => (

                        <div
                          key={oIndex}
                          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
                        >

                          <input
                            type="text"
                            placeholder={`Option ${oIndex + 1}`}
                            value={option.text}
                            onChange={(e) =>
                              handleOptionChange(
                                qIndex,
                                oIndex,
                                e.target.value
                              )
                            }
                            required
                            className="flex-1 bg-slate-900 border border-purple-500/10 rounded-2xl px-4 py-4 text-sm sm:text-base focus:outline-none focus:border-pink-500/40"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              removeOption(
                                qIndex,
                                oIndex
                              )
                            }
                            className="px-5 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition"
                          >
                            <Trash2 size={18} />
                          </button>

                        </div>

                      )
                    )}

                  </div>

                  {/* ADD OPTION */}

                  <button
                    type="button"
                    onClick={() =>
                      addOption(qIndex)
                    }
                    className="flex items-center justify-center gap-3 mt-8 px-6 py-4 rounded-2xl bg-pink-500/10 border border-pink-500/20 hover:bg-pink-500/20 transition font-semibold w-full sm:w-auto"
                  >
                    <Plus size={20} />
                    Add Option
                  </button>

                </div>

              )
            )}

          </div>

          {/* ACTIONS */}

          <div className="flex flex-col sm:flex-row gap-5">

            <button
              type="button"
              onClick={addQuestion}
              className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border border-purple-500/20 hover:border-pink-400 hover:bg-pink-500/10 transition font-semibold w-full sm:w-auto"
            >
              <Plus size={20} />
              Add Question
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-[1.02] transition font-bold shadow-[0_0_40px_rgba(236,72,153,0.35)] w-full sm:w-auto"
            >
              {
                loading
                  ? "Creating Poll..."
                  : "Create Poll 🚀"
              }
            </button>

          </div>

        </form>

      </div>

    </div>

  );
}

export default CreatePoll;

