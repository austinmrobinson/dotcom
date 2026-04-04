export function PaperTexture() {
  return (
    <>
      {/* Coarse paper grain */}
      <svg
        className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.06] sm:opacity-[0.04] dark:opacity-[0.05] dark:sm:opacity-[0.035]"
        aria-hidden="true"
      >
        <filter id="paper-grain" colorInterpolationFilters="sRGB">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04"
            numOctaves="5"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="linear" slope="1.12" />
            <feFuncG type="linear" slope="1.04" />
            <feFuncB type="linear" slope="0.88" />
          </feComponentTransfer>
        </filter>
        <rect width="100%" height="100%" filter="url(#paper-grain)" />
      </svg>
      {/* Fine noise */}
      <svg
        className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.05] sm:opacity-[0.035] dark:opacity-[0.04] dark:sm:opacity-[0.03]"
        aria-hidden="true"
      >
        <filter id="paper-noise" colorInterpolationFilters="sRGB">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.5"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="linear" slope="1.12" />
            <feFuncG type="linear" slope="1.04" />
            <feFuncB type="linear" slope="0.88" />
          </feComponentTransfer>
        </filter>
        <rect width="100%" height="100%" filter="url(#paper-noise)" />
      </svg>
    </>
  );
}
