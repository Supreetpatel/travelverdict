import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

// New crest and checkmark paths (same as Logo.js)
const crestPath =
  "M27 6C38 8 47 16 44 32C41 48 27 50 27 50C27 50 13 48 10 32C7 16 16 8 27 6Z";
const checkPath = "M20 30L26 36L36 22";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff",
      }}
    >
      <svg
        width="154"
        height="154"
        viewBox="0 0 54 54"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="outer" x1="8" y1="6" x2="46" y2="49">
            <stop offset="0%" stopColor="#c89f4a" />
            <stop offset="100%" stopColor="#a7263d" />
          </linearGradient>
          <linearGradient id="inner" x1="14" y1="10" x2="40" y2="45">
            <stop offset="0%" stopColor="#6f1324" />
            <stop offset="100%" stopColor="#a7263d" />
          </linearGradient>
          <radialGradient
            id="glow"
            cx="0"
            cy="0"
            r="1"
            gradientTransform="translate(27 27) scale(22)"
          >
            <stop offset="0%" stopColor="#fff" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Crest background */}
        <path d={crestPath} fill="url(#inner)" />
        {/* Crest gold outline */}
        <path d={crestPath} stroke="url(#outer)" strokeWidth="2.5" />
        {/* Subtle glow */}
        <path d={crestPath} fill="url(#glow)" />
        {/* Upward checkmark/arrow for verdict */}
        <path
          d={checkPath}
          stroke="#c89f4a"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{ filter: "drop-shadow(0 1px 2px #fff6)" }}
        />
      </svg>
    </div>,
    size,
  );
}
