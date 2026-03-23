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
          <linearGradient id="inner" x1="14" y1="12" x2="40" y2="44">
            <stop offset="0%" stopColor="#8B1933" />
            <stop offset="100%" stopColor="#3A0A15" />
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
          d="M16.3 35V16.5H21.4L27.2 27.2L33 16.5H38.1V35"
          stroke="url(#outer)"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>,
    size,
  );
}
