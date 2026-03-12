import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sermons",
  description:
    "Watch and listen to sermons from Hope Christian Church in North Haven, CT. Explore messages from Pastor Jim and other speakers on faith, family, and Scripture.",
  openGraph: {
    title: "Sermons",
    description:
      "Watch and listen to sermons from Hope Christian Church in North Haven, CT. Explore messages on faith, family, and Scripture.",
  },
};

export default function SermonsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
