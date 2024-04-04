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
      className="rounded-xl aspect=[16/9] w-full h-auto bg-neutral-900/10 dark:bg-neutral-100/10"
      loop
      muted
      playsInline
    >
      <source src={src} type="video/mp4"></source>
    </video>
  );
}
