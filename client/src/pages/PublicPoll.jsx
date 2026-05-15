import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import toast from "react-hot-toast";

import api from "../services/api";

function PublicPoll() {

  const { id } = useParams();

  const [poll, setPoll] = useState(null);

  const [answers, setAnswers] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  // Fetch Poll
  const fetchPoll = async () => {

    try {

      const res = await api.get(
        `/polls/${id}`
      );

      // Backend returns direct poll object
      setPoll(res.data);

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to load poll"
      );

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchPoll();

  }, []);

  // Select Answer
  const selectAnswer = (
    questionId,
    selectedOption
  ) => {

    const existing =
      answers.find(
        (a) =>
          a.questionId === questionId
      );

    if (existing) {

      const updatedAnswers =
        answers.map((answer) =>

          answer.questionId === questionId

            ? {
                ...answer,
                selectedOption
              }

            : answer
        );

      setAnswers(updatedAnswers);

    } else {

      setAnswers([
        ...answers,

        {
          questionId,
          selectedOption
        }
      ]);

    }
  };

  // Submit Response
  const handleSubmit = async () => {

    try {

      // Required validation
      for (const question of poll.questions) {

        if (question.required) {

          const answered =
            answers.find(
              (a) =>
                a.questionId ===
                question._id
            );

          if (!answered) {

            return toast.error(
              `${question.questionText} is required`
            );

          }
        }
      }

      setSubmitting(true);

      await api.post(
        `/responses/${id}`,

        {
          answers
        }
      );

      toast.success(
        "Response submitted successfully!"
      );

      setSubmitted(true);

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Submission failed"
      );

      console.log(error);

    } finally {

      setSubmitting(false);

    }
  };

  // Loading State
  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white text-3xl">
        Loading Poll...
      </div>
    );
  }

  // Poll Not Found
  if (!poll) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white text-3xl">
        Poll not found
      </div>
    );
  }

  // Submitted Screen
  if (submitted) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6">

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 max-w-xl text-center">

          <h1 className="text-5xl font-bold text-purple-400">
            Thank You 😎
          </h1>

          <p className="text-slate-400 mt-5 text-lg">
            Your response has been submitted successfully.
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-12">

      <div className="max-w-4xl mx-auto">

        {/* Poll Header */}

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10">

          <h1 className="text-5xl font-bold">
            {poll.title}
          </h1>

          <p className="text-slate-400 mt-5 text-lg">
            {poll.description}
          </p>

          <div className="mt-6 flex gap-4 flex-wrap">

            <span className="px-4 py-2 rounded-full bg-purple-500/20 text-purple-400 text-sm">

              {poll.responseMode}

            </span>

            <span className="px-4 py-2 rounded-full bg-green-500/20 text-green-400 text-sm">

              Expires:
              {" "}
              {
                new Date(
                  poll.expiresAt
                ).toLocaleDateString()
              }

            </span>

          </div>

        </div>

        {/* Questions */}

        <div className="mt-10 space-y-8">

          {poll?.questions?.map((
            question,
            questionIndex
          ) => (

            <div
              key={question._id}

              className="bg-slate-900 border border-slate-800 rounded-3xl p-8"
            >

              <div className="flex items-center gap-3 flex-wrap">

                <h2 className="text-2xl font-bold">

                  {questionIndex + 1}.
                  {" "}
                  {question.questionText}

                </h2>

                {question.required && (

                  <span className="text-red-400 text-xl">
                    *
                  </span>

                )}

              </div>

              {/* Options */}

              <div className="mt-6 space-y-4">

                {question?.options?.map(
                  (option) => {

                    const selected =
                      answers.find(
                        (a) =>
                          a.questionId ===
                            question._id &&

                          a.selectedOption ===
                            option.text
                      );

                    return (

                      <button
                        key={option._id}

                        onClick={() =>
                          selectAnswer(
                            question._id,
                            option.text
                          )
                        }

                        className={`w-full text-left p-5 rounded-2xl border transition ${
                          selected

                            ? "bg-purple-600 border-purple-500"

                            : "bg-slate-800 border-slate-700 hover:border-purple-500"
                        }`}
                      >

                        {option.text}

                      </button>

                    );
                  }
                )}

              </div>

            </div>

          ))}

        </div>

        {/* Submit Button */}

        <button
          onClick={handleSubmit}

          disabled={submitting}

          className="w-full mt-10 p-5 rounded-3xl bg-purple-600 hover:bg-purple-700 text-2xl font-bold"
        >

          {submitting
            ? "Submitting..."
            : "Submit Response 🚀"}

        </button>

      </div>

    </div>
  );
}

export default PublicPoll;