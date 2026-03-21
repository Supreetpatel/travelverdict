"use client";

import { Toaster } from "react-hot-toast";

export default function AppToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 2500,
        style: {
          border: "1px solid rgba(15, 23, 42, 0.12)",
          background: "#ffffff",
          color: "#0f172a",
          borderRadius: "12px",
          fontSize: "0.92rem",
        },
      }}
    />
  );
}
