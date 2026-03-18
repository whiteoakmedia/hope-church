"use client";

import { useState, type FormEvent } from "react";

interface ContactContentProps {
  heroHeading: string;
  heroSub: string;
  formHeading: string;
  formSubtitle: string;
  successMessage: string;
  quoteText: string;
  quoteAttribution: string;
  quoteRole: string;
  addressLine1: string;
  addressLine2: string;
  phone: string;
  email: string;
  serviceTimes: { label: string; time: string }[];
}

export default function ContactContent({
  heroHeading,
  heroSub,
  formHeading,
  formSubtitle,
  successMessage,
  quoteText,
  quoteAttribution,
  quoteRole,
  addressLine1,
  addressLine2,
  phone,
  email,
  serviceTimes,
}: ContactContentProps) {
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
    data.append("subject", "New Contact Form Submission");
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
      {/* Hero */}
      <section className="relative bg-primary pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 to-primary" />
        <div className="relative section-padding">
          <div className="container-wide text-center">
            <h1 className="font-heading heading-xl text-white mb-4">
              {heroHeading}
            </h1>
            <p className="body-lg text-white/70 max-w-2xl mx-auto">
              {heroSub}
            </p>
          </div>
        </div>
      </section>

      {/* Form + Info */}
      <section className="section-padding section-padding-y bg-bg">
        <div className="container-wide max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div>
              <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-accent font-body">
                Get in Touch
              </span>
              <h2 className="heading-lg accent-underline text-primary font-heading">
                {formHeading}
              </h2>
              {formSubtitle && (
                <p className="mt-4 text-text-muted font-body">
                  {formSubtitle}
                </p>
              )}

              {submitted ? (
                <div className="mt-8 rounded-xl bg-white p-8 shadow-sm text-center">
                  <div className="mb-4">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="mx-auto text-accent"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <h3 className="font-heading heading-sm text-primary mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-text-muted font-body">{successMessage}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5 font-body">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full rounded-lg border border-bg-alt bg-white px-4 py-3 text-sm font-body text-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5 font-body">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full rounded-lg border border-bg-alt bg-white px-4 py-3 text-sm font-body text-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5 font-body">
                      Phone <span className="text-text-light">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      className="w-full rounded-lg border border-bg-alt bg-white px-4 py-3 text-sm font-body text-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5 font-body">
                      Message
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      className="w-full rounded-lg border border-bg-alt bg-white px-4 py-3 text-sm font-body text-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>

                  {error && (
                    <p className="text-red-600 text-sm font-body">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary w-full py-3 text-base disabled:opacity-50"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>

            {/* Sidebar: Church Info + Quote */}
            <div className="space-y-8">
              {/* Church Info Card */}
              <div className="rounded-xl bg-white p-8 shadow-sm">
                <h3 className="heading-sm text-primary font-heading mb-6">
                  Visit Us
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 text-text-muted font-body">
                    <svg
                      className="h-5 w-5 text-accent shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <div>
                      <p className="font-medium text-primary">Address</p>
                      <p>{addressLine1}</p>
                      <p>{addressLine2}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-text-muted font-body">
                    <svg
                      className="h-5 w-5 text-accent shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                    </svg>
                    <div>
                      <p className="font-medium text-primary">Phone</p>
                      <p>{phone}</p>
                    </div>
                  </div>
                  {email && (
                    <div className="flex items-start gap-3 text-text-muted font-body">
                      <svg
                        className="h-5 w-5 text-accent shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      <div>
                        <p className="font-medium text-primary">Email</p>
                        <p>{email}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3 text-text-muted font-body">
                    <svg
                      className="h-5 w-5 text-accent shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                    <div>
                      <p className="font-medium text-primary">Service Times</p>
                      {serviceTimes.map((st, i) => (
                        <p key={i}>
                          {st.label ? `${st.label}: ` : ""}
                          {st.time}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quote */}
              {quoteText && (
                <div className="rounded-xl bg-bg-alt p-8 border-l-4 border-accent">
                  <blockquote className="font-heading text-lg text-primary italic leading-relaxed">
                    &ldquo;{quoteText}&rdquo;
                  </blockquote>
                  {quoteAttribution && (
                    <div className="mt-4 font-body text-sm text-text-muted">
                      — {quoteAttribution}
                      {quoteRole && (
                        <span className="text-text-light">, {quoteRole}</span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
