import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plan Your Visit",
  description:
    "Plan your first visit to Hope Christian Church in North Haven, CT. Find service times, directions, what to expect, and let us know you are coming so we can welcome you.",
  openGraph: {
    title: "Plan Your Visit",
    description:
      "Plan your first visit to Hope Christian Church in North Haven, CT. Find service times, directions, and what to expect.",
  },
};

export default function PlanYourVisitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
