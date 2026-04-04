export function PaperTexture() {
  return (
    <>
      {/* Coarse paper grain */}
      <svg
        className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-[0.07] sm:opacity-[0.04] dark:opacity-[0.06] dark:sm:opacity-[0.035]"
        aria-hidden="true"
      >
        <filter id="paper-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04"
            numOctaves="5"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#paper-grain)" />
      </svg>
      {/* Fine noise */}
      <svg
        className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-[0.08] sm:opacity-[0.05] dark:opacity-[0.07] dark:sm:opacity-[0.04]"
        aria-hidden="true"
      >
        <filter id="paper-noise">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.5"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#paper-noise)" />
      </svg>
    </>
  );
}
