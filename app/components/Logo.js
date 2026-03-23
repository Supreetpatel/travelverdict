const crestPath =
  "M27 5.5C38.6 5.5 47.7 12.8 47.7 24.4C47.7 37.4 37.9 46.4 27 49C16.1 46.4 6.3 37.4 6.3 24.4C6.3 12.8 15.4 5.5 27 5.5Z";

export const Logo = ({ className = "", variant = "default" }) => {
  const prefix = variant === "compact" ? "compact" : "default";
  const outerId = `${prefix}-crestOuter`;
  const innerId = `${prefix}-crestInner`;
  const highlightId = `${prefix}-crestHighlight`;

  if (variant === "compact") {
    return (
      <svg
        width="44"
        height="44"
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
          <linearGradient id={innerId} x1="14" y1="12" x2="40" y2="44">
            <stop offset="0%" stopColor="#8B1933" />
            <stop offset="100%" stopColor="#3A0A15" />
          </linearGradient>
        </defs>

        <path d={crestPath} fill={`url(#${innerId})`} />
        <path d={crestPath} stroke={`url(#${outerId})`} strokeWidth="2.2" />
        <path
          d="M18.3 34.2V18.3H22.4L27 26.8L31.6 18.3H35.7V34.2"
          stroke={`url(#${outerId})`}
          strokeWidth="2.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      width="54"
      height="54"
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
        <linearGradient id={innerId} x1="14" y1="12" x2="40" y2="44">
          <stop offset="0%" stopColor="#8B1933" />
          <stop offset="100%" stopColor="#3A0A15" />
        </linearGradient>
        <linearGradient id={highlightId} x1="16" y1="13" x2="35" y2="33">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path d={crestPath} fill={`url(#${innerId})`} />
      <path d={crestPath} stroke={`url(#${outerId})`} strokeWidth="2.2" />
      <path
        d="M27 9.2C36.1 9.2 43.9 15 43.9 24.3C43.9 35.4 35.6 43.1 27 45.5C18.4 43.1 10.1 35.4 10.1 24.3C10.1 15 17.9 9.2 27 9.2Z"
        stroke={`url(#${outerId})`}
        strokeOpacity="0.5"
      />
      <path
        d="M16.3 35V16.5H21.4L27.2 27.2L33 16.5H38.1V35"
        stroke={`url(#${outerId})`}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 12.7C18.9 10.7 22.5 9.6 27 9.6C31.5 9.6 35.1 10.7 38 12.7"
        stroke={`url(#${highlightId})`}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
