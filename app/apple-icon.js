import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

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
            <stop offset="0%" stopColor="#F6DB96" />
            <stop offset="58%" stopColor="#BC8F42" />
            <stop offset="100%" stopColor="#6E471C" />
          </linearGradient>
          <linearGradient id="inner" x1="14" y1="10" x2="40" y2="45">
            <stop offset="0%" stopColor="#8B1933" />
            <stop offset="100%" stopColor="#2E0812" />
          </linearGradient>
          <radialGradient
            id="glow"
            cx="0"
            cy="0"
            r="1"
            gradientTransform="translate(22 16) rotate(39) scale(22)"
          >
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="trend" x1="15" y1="33" x2="38" y2="20">
            <stop offset="0%" stopColor="#F2D28A" />
            <stop offset="100%" stopColor="#FFDFA0" />
          </linearGradient>
        </defs>
        <path
          d="M27 5.5C38.6 5.5 47.7 12.8 47.7 24.4C47.7 37.4 37.9 46.4 27 49C16.1 46.4 6.3 37.4 6.3 24.4C6.3 12.8 15.4 5.5 27 5.5Z"
          fill="url(#inner)"
        />
        <path
          d="M27 5.5C38.6 5.5 47.7 12.8 47.7 24.4C47.7 37.4 37.9 46.4 27 49C16.1 46.4 6.3 37.4 6.3 24.4C6.3 12.8 15.4 5.5 27 5.5Z"
          stroke="url(#outer)"
          strokeWidth="2.2"
        />
        <path
          d="M27 5.5C38.6 5.5 47.7 12.8 47.7 24.4C47.7 37.4 37.9 46.4 27 49C16.1 46.4 6.3 37.4 6.3 24.4C6.3 12.8 15.4 5.5 27 5.5Z"
          fill="url(#glow)"
        />
        <path
          d="M17.4 34.2V29.4"
          stroke="url(#outer)"
          strokeWidth="2.3"
          strokeLinecap="round"
        />
        <path
          d="M23 34.2V25.7"
          stroke="url(#outer)"
          strokeWidth="2.3"
          strokeLinecap="round"
        />
        <path
          d="M28.6 34.2V22.9"
          stroke="url(#outer)"
          strokeWidth="2.3"
          strokeLinecap="round"
        />
        <path
          d="M34.2 34.2V19.9"
          stroke="url(#outer)"
          strokeWidth="2.3"
          strokeLinecap="round"
        />
        <path
          d="M14.8 30.4L20.4 27.2L25.2 28.8L32.1 21.4L38.1 23.3"
          stroke="url(#trend)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M37.8 19.8L39.3 23.9L35.1 25.2"
          stroke="url(#trend)"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>,
    size,
  );
}
