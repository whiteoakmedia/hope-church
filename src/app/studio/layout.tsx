export const metadata = {
  title: "Sanity Studio | Hope Christian Church",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Hide the site header, footer, and main-content padding when studio is active */}
      <style>{`
        header, footer { display: none !important; }
        #main-content { min-height: auto !important; }
      `}</style>
      <div
        id="sanity"
        style={{
          height: "100vh",
          maxHeight: "100dvh",
          overscrollBehavior: "none",
          WebkitFontSmoothing: "antialiased",
          overflow: "auto",
        }}
      >
        {children}
      </div>
    </>
  );
}
