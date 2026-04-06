export function PaperTexture() {
  return (
    <>
      {/* Fine grain — tiling noise PNG with blend mode */}
      <div
        className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.09] mix-blend-multiply dark:opacity-[0.10] dark:mix-blend-soft-light"
        aria-hidden="true"
        style={{
          backgroundImage: "url(/noise-grain.png)",
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      />
      {/* Coarse variation — low-frequency SVG turbulence for large-scale organic texture */}
      <svg
        className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.03] mix-blend-multiply dark:opacity-[0.04] dark:mix-blend-soft-light"
        aria-hidden="true"
      >
        <filter id="paper-coarse" colorInterpolationFilters="sRGB">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#paper-coarse)" />
      </svg>
    </>
  );
}
