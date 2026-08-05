type SectionHeadingProps = {
  index: string;
  label: string;
  title: string;
  link?: { label: string; href: string };
  align?: "left" | "center";
  tone?: "dark" | "light";
};

export default function SectionHeading({
  index,
  label,
  title,
  link,
  align = "left",
  tone = "dark",
}: SectionHeadingProps) {
  const titleColor = tone === "dark" ? "text-forest" : "text-cream";

  return (
    <div
      className={`mb-10 flex flex-wrap items-end gap-4 ${
        align === "center" ? "justify-center text-center" : "justify-between"
      }`}
    >
      <div className={align === "center" ? "w-full" : ""}>
        <p className="eyebrow mb-3">
          {index} / {label}
        </p>
        <h2
          className={`font-display text-3xl sm:text-4xl lg:text-5xl ${titleColor}`}
        >
          {title}
        </h2>
      </div>
      {link && (
        <a
          href={link.href}
          className="font-semibold text-clay transition-colors hover:text-clay-deep"
        >
          {link.label} &rarr;
        </a>
      )}
    </div>
  );
}
