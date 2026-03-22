"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton({ fallbackHref = "/", label = "Back" }) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  };

  return (
    <button type="button" className="ghost-button" onClick={handleBack}>
      <ArrowLeft size={16} /> {label}
    </button>
  );
}
