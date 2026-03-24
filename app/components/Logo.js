const crestPath =
  "M27 5.5C38.6 5.5 47.7 12.8 47.7 24.4C47.7 37.4 37.9 46.4 27 49C16.1 46.4 6.3 37.4 6.3 24.4C6.3 12.8 15.4 5.5 27 5.5Z";

export const Logo = ({ className = "", variant = "default" }) => {
  const prefix = variant === "compact" ? "compact" : "default";
  const outerId = `${prefix}-crestOuter`;
  const innerId = `${prefix}-crestInner`;
  const glowId = `${prefix}-crestGlow`;
  const trendId = `${prefix}-trendGradient`;

  return (
    <svg
      width={variant === "compact" ? "44" : "54"}
      height={variant === "compact" ? "44" : "54"}
      viewBox="0 0 54 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={outerId} x1="8" y1="6" x2="46" y2="49">
          <stop offset="0%" stopColor="#F6DB96" />
          <stop offset="58%" stopColor="#BC8F42" />
          <stop offset="100%" stopColor="#6E471C" />
        </linearGradient>
        <linearGradient id={innerId} x1="14" y1="10" x2="40" y2="45">
          <stop offset="0%" stopColor="#8B1933" />
          <stop offset="100%" stopColor="#2E0812" />
        </linearGradient>
        <radialGradient
          id={glowId}
          cx="0"
          cy="0"
          r="1"
          gradientTransform="translate(22 16) rotate(39) scale(22)"
        >
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={trendId} x1="15" y1="33" x2="38" y2="20">
          <stop offset="0%" stopColor="#F2D28A" />
          <stop offset="100%" stopColor="#FFDFA0" />
        </linearGradient>
      </defs>

      <path d={crestPath} fill={`url(#${innerId})`} />
      <path d={crestPath} stroke={`url(#${outerId})`} strokeWidth="2.2" />
      <path d={crestPath} fill={`url(#${glowId})`} />

      <path
        d="M17.4 34.2V29.4"
        stroke={`url(#${outerId})`}
        strokeWidth="2.3"
        strokeLinecap="round"
      />
      <path
        d="M23 34.2V25.7"
        stroke={`url(#${outerId})`}
        strokeWidth="2.3"
        strokeLinecap="round"
      />
      <path
        d="M28.6 34.2V22.9"
        stroke={`url(#${outerId})`}
        strokeWidth="2.3"
        strokeLinecap="round"
      />
      <path
        d="M34.2 34.2V19.9"
        stroke={`url(#${outerId})`}
        strokeWidth="2.3"
        strokeLinecap="round"
      />

      <path
        d="M14.8 30.4L20.4 27.2L25.2 28.8L32.1 21.4L38.1 23.3"
        stroke={`url(#${trendId})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M37.8 19.8L39.3 23.9L35.1 25.2"
        stroke={`url(#${trendId})`}
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
