export function PaperTexture() {
  return (
    <>
      {/* Coarse paper grain */}
      <svg
        className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-[0.12] sm:opacity-[0.07] dark:opacity-[0.10] dark:sm:opacity-[0.06]"
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
        className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-[0.10] sm:opacity-[0.06] dark:opacity-[0.08] dark:sm:opacity-[0.05]"
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
