const dividerIcons = [
  "/images/icons/longhorn_skull_icon.png",
  "/images/icons/cactus_small_icon.png",
  "/images/icons/armadillo_icon.png",
  "/images/icons/bluebonnet_star_icon.png",
  "/images/icons/desert_cactus_stars_icon.png",
  "/images/icons/capitol_sunburst_icon.png",
];

export default function SectionDivider({
  icon,
  className = "",
}: {
  icon?: string;
  className?: string;
}) {
  const fallbackIndex = className.length % dividerIcons.length;
  const src = icon || dividerIcons[fallbackIndex];

  return (
    <div className={`flex items-center justify-center gap-4 my-6 ${className}`}>
      <div className="h-px flex-1 max-w-24 bg-gold/40" />
      <img src={src} alt="" className="h-8 w-auto" aria-hidden="true" />
      <div className="h-px flex-1 max-w-24 bg-gold/40" />
    </div>
  );
}
