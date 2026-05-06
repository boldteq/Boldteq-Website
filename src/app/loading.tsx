export default function RootLoading() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading page content"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        width: "100%",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "3px solid #e5e7eb",
          borderTopColor: "#21cfff",
          animation: "spin 0.7s linear infinite",
        }}
      />
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
