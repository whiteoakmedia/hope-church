"use client";

import { useState, type FormEvent } from "react";

export default function PlanYourVisitPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);
    data.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "");
    data.append("subject", "New Plan Your Visit Submission");
    data.append("from_name", "Hope Church Website");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (result.success) {
        setSubmitted(true);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* ================================================================ */}
      {/*  Form Section                                                     */}
      {/* ================================================================ */}
      <section className="section-padding bg-[#faf8f5] min-h-screen pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="container-wide max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-[#c8953e] font-medium text-sm tracking-[0.1em] uppercase mb-4">
              Plan Your Visit
            </p>
            <h1 className="font-heading heading-xl text-[#1a2332] mb-4">
              We can&apos;t wait to see you!
            </h1>
            <p className="text-[#6b6561] body-lg max-w-lg mx-auto">
              Fill out this short form and let us know when we can expect you.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(26,35,50,0.08)] border border-[#f0ece4] p-8 md:p-12">
            {submitted ? (
              /* ---- Success State ---- */
              <div className="text-center py-12 animate-fade-in" role="status" aria-live="polite">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#c8953e]/10 flex items-center justify-center">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#c8953e"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h2 className="font-heading text-[#1a2332] text-2xl md:text-3xl mb-3">
                  Thank you!
                </h2>
                <p className="text-[#6b6561] body-lg">
                  We can&apos;t wait to meet you!
                </p>
              </div>
            ) : (
              /* ---- Form ---- */
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-[#1a2332] font-medium text-sm mb-2"
                  >
                    Name <span className="text-[#c8953e]">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Your full name"
                    className="w-full px-4 py-3.5 rounded-xl border border-[#e8e4dc] bg-[#faf8f5] text-[#1a2332] placeholder:text-[#9a948e] text-[0.95rem] transition-all duration-200 focus:outline-none focus:border-[#c8953e] focus:ring-2 focus:ring-[#c8953e]/20 focus:bg-white hover:border-[#c8953e]/40"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-[#1a2332] font-medium text-sm mb-2"
                  >
                    Email Address <span className="text-[#c8953e]">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="you@example.com"
                    className="w-full px-4 py-3.5 rounded-xl border border-[#e8e4dc] bg-[#faf8f5] text-[#1a2332] placeholder:text-[#9a948e] text-[0.95rem] transition-all duration-200 focus:outline-none focus:border-[#c8953e] focus:ring-2 focus:ring-[#c8953e]/20 focus:bg-white hover:border-[#c8953e]/40"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label
                    htmlFor="gender"
                    className="block text-[#1a2332] font-medium text-sm mb-2"
                  >
                    Gender <span className="text-[#c8953e]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="gender"
                      name="gender"
                      required
                      defaultValue=""
                      className="w-full px-4 py-3.5 rounded-xl border border-[#e8e4dc] bg-[#faf8f5] text-[#1a2332] text-[0.95rem] transition-all duration-200 focus:outline-none focus:border-[#c8953e] focus:ring-2 focus:ring-[#c8953e]/20 focus:bg-white hover:border-[#c8953e]/40 appearance-none cursor-pointer"
                    >
                      <option value="" disabled>
                        Select your gender
                      </option>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#9a948e]">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Visit Date */}
                <div>
                  <label
                    htmlFor="visitDate"
                    className="block text-[#1a2332] font-medium text-sm mb-2"
                  >
                    What day will you be joining us?{" "}
                    <span className="text-[#c8953e]">*</span>
                  </label>
                  <input
                    type="date"
                    id="visitDate"
                    name="visitDate"
                    required
                    className="w-full px-4 py-3.5 rounded-xl border border-[#e8e4dc] bg-[#faf8f5] text-[#1a2332] text-[0.95rem] transition-all duration-200 focus:outline-none focus:border-[#c8953e] focus:ring-2 focus:ring-[#c8953e]/20 focus:bg-white hover:border-[#c8953e]/40 cursor-pointer"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 bg-[#c8953e] text-white font-semibold text-[0.95rem] rounded-xl tracking-wide transition-all duration-300 hover:bg-[#b8842e] hover:shadow-[0_8px_24px_rgba(200,149,62,0.35)] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>

                {error && (
                  <p className="text-red-600 text-sm text-center mt-4">{error}</p>
                )}
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
