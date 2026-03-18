export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Hide the root layout's Header (<header>) and Footer (<footer>).
  // The PreviewClient component renders its own simplified versions.
  return (
    <>
      <style>{`
        body > header,
        header.fixed,
        body > footer,
        footer.bg-\\[\\#1a2332\\],
        #main-content ~ footer {
          display: none !important;
        }
        #main-content {
          padding-top: 0 !important;
          min-height: auto !important;
        }
      `}</style>
      {children}
    </>
  );
}
