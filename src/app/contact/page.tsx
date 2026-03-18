import { client } from "@/sanity/client";
import { contactPageQuery, siteSettingsQuery } from "@/sanity/queries";
import type { ContactPage, SiteSettings } from "@/sanity/types";
import ContactContent from "./ContactContent";

export const revalidate = 30;

export default async function ContactPage() {
  const [contactData, settings] = await Promise.all([
    client.fetch<ContactPage | null>(contactPageQuery),
    client.fetch<SiteSettings | null>(siteSettingsQuery),
  ]);

  const heroHeading = contactData?.heroHeading || "Contact Us";
  const heroSub =
    contactData?.heroSubheading ||
    "We\u2019d love to hear from you. Reach out with any questions, prayer requests, or just to say hello.";
  const formHeading = contactData?.formHeading || "Send Us a Message";
  const formSubtitle = contactData?.formSubtitle || "";
  const successMessage =
    contactData?.successMessage ||
    "Thank you for reaching out! We\u2019ll get back to you soon.";
  const quoteText = contactData?.quoteText || "";
  const quoteAttribution = contactData?.quoteAttribution || "";
  const quoteRole = contactData?.quoteRole || "";

  const address = settings?.address;
  const addressLine1 = address?.street || "211 Montowese Street";
  const addressLine2 =
    address?.city && address?.state && address?.zip
      ? `${address.city}, ${address.state} ${address.zip}`
      : "North Haven, CT 06473";

  const phone = settings?.phone || "(203) 234-7328";
  const email = settings?.email || "";

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
    <ContactContent
      heroHeading={heroHeading}
      heroSub={heroSub}
      formHeading={formHeading}
      formSubtitle={formSubtitle}
      successMessage={successMessage}
      quoteText={quoteText}
      quoteAttribution={quoteAttribution}
      quoteRole={quoteRole}
      addressLine1={addressLine1}
      addressLine2={addressLine2}
      phone={phone}
      email={email}
      serviceTimes={serviceTimes}
    />
  );
}
