export function PaperTexture() {
  return (
    <svg
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-[0.035] dark:opacity-[0.03]"
      aria-hidden="true"
    >
      <filter id="paper-texture">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.04"
          numOctaves="5"
          stitchTiles="stitch"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#paper-texture)" />
    </svg>
  );
}
