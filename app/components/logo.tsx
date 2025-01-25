interface LogoProps {
  width?: string;
  height?: string;
  className?: String;
}

export default function Logo({ width, height, className }: LogoProps) {
  return (
    <svg
      width={width ?? "20"}
      height={height ?? "20"}
      className={`fill-yellow-1050/90 dark:fill-yellow-50 transition-colors ${className}`}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.375 0H1C0.447715 0 0 0.447715 0 1V13.2812H13.375C17.0313 13.2812 20 10.3125 20 6.65625C20 3 17.0313 0 13.375 0Z"
        fill="inherit"
        fillOpacity="0.5"
      />
      <path
        d="M0 1.42862V19C0 19.5523 0.447715 20 1 20H18.1893C18.8575 20 19.1921 19.1922 18.7197 18.7197L10 10L0.29 0.295044C0.104673 0.473952 0 0.720489 0 0.978082V1.42862Z"
        fill="inherit"
        fillOpacity="0.5"
      />
    </svg>
  );
}
