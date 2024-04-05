interface IconProps {
  size?: number;
  className?: string;
}

export default function IconPaperCrowns({ size, className }: IconProps) {
  return (
    <svg
      width={size ?? "24"}
      height={size ?? "24"}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.4878 21.5H6.15543L17.2729 19.9634L19.8173 11.0879L16.1497 15.4224L13.4449 4.13877L8.53939 16.1563L4.25285 12.7162L6.91188 19.2295L5.28437 19.4359L2.07519 11.5695C1.89181 11.1108 2.05227 10.5833 2.46488 10.3081C2.87749 10.0099 3.42763 10.0329 3.81731 10.354L7.87463 13.6106L12.5279 2.18936C12.7113 1.75361 13.1698 1.4784 13.6511 1.50133C14.1325 1.5472 14.5451 1.86828 14.6598 2.32696L16.952 11.9823L20.0237 8.3816C20.3675 7.99172 20.9177 7.87705 21.399 8.10639C21.8804 8.33573 22.1096 8.86322 21.9492 9.34482L18.4878 21.5Z"
        fill="currentColor"
      />
    </svg>
  );
}
