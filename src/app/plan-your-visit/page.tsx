import { client } from "@/sanity/client";
import { contactPageQuery, siteSettingsQuery } from "@/sanity/queries";
import type { ContactPage, SiteSettings } from "@/sanity/types";
import VisitForm from "./VisitForm";

export const revalidate = 30;

export default async function PlanYourVisitPage() {
  const [contactData, settings] = await Promise.all([
    client.fetch<ContactPage | null>(contactPageQuery),
    client.fetch<SiteSettings | null>(siteSettingsQuery),
  ]);

  const formHeading =
    contactData?.formHeading || "Fill out this short form and let us know when we can expect you.";
  const formSubtitle = contactData?.formSubtitle || "";
  const successMessage =
    contactData?.successMessage || "We can\u2019t wait to meet you!";

  const address = settings?.address;
  const addressLine1 = address?.street || "211 Montowese Street";
  const addressLine2 =
    address?.city && address?.state && address?.zip
      ? `${address.city}, ${address.state} ${address.zip}`
      : "North Haven, CT 06473";

  const defaultServiceTimes = [
    { label: "Sundays", time: "10:00 AM" },
    { label: "Wednesdays", time: "7:00 PM" },
  ];

  const serviceTimes =
    settings?.serviceTimes && settings.serviceTimes.length > 0
      ? settings.serviceTimes.map((st) => ({
          label: st.label || st.dayOfWeek,
          time: st.time,
        }))
      : defaultServiceTimes;

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
              {formHeading}
            </p>
          </div>

          {/* Form Card */}
          <VisitForm
            formHeading={formHeading}
            formSubtitle={formSubtitle}
            successMessage={successMessage}
          />

          {/* Service Times & Address Info */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {/* Address */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_20px_rgba(26,35,50,0.06)] border border-[#f0ece4] text-center">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[#c8953e]/10 flex items-center justify-center">
                <svg
                  className="h-5 w-5 text-[#c8953e]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <p className="font-heading text-[#1a2332] font-semibold mb-1">
                Our Address
              </p>
              <p className="text-[#6b6561] text-sm">{addressLine1}</p>
              <p className="text-[#6b6561] text-sm">{addressLine2}</p>
            </div>

            {/* Service Times */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_20px_rgba(26,35,50,0.06)] border border-[#f0ece4] text-center">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[#c8953e]/10 flex items-center justify-center">
                <svg
                  className="h-5 w-5 text-[#c8953e]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <p className="font-heading text-[#1a2332] font-semibold mb-1">
                Service Times
              </p>
              {serviceTimes.map((st, i) => (
                <p key={i} className="text-[#6b6561] text-sm">
                  {st.label}: {st.time}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
