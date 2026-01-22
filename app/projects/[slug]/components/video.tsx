interface VideoProps {
  src: string;
  width: number;
  height: number;
  className?: string;
}

export default function Video({ src, width, height, className }: VideoProps) {
  return (
    <video
      width={width ?? 480}
      height={height ?? 270}
      className="rounded-xl aspect=[16/9] w-full h-auto bg-overlay-light border border-border-hairline"
      loop
      muted
      playsInline
      autoPlay
      controls
      src={src}
    />
  );
}
