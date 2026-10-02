import Link from "next/link";

type SectionHeaderProps = {
  title: string;
  sub?: string;
  action?: { label: string; href: string };
  /** Set on the dark feed band, where the default forest text would disappear. */
  onDark?: boolean;
};

export default function SectionHeader({
  title,
  sub,
  action,
  onDark = false,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
      <div>
        <h2
          className={`font-display text-2xl sm:text-3xl ${
            onDark ? "text-cream" : "text-forest"
          }`}
        >
          {title}
        </h2>
        {sub && (
          <p className={`mt-1.5 ${onDark ? "text-cream/70" : "text-forest/65"}`}>
            {sub}
          </p>
        )}
      </div>

      {action && (
        <Link
          href={action.href}
          className="whitespace-nowrap text-sm font-medium text-clay transition-colors hover:text-clay-deep"
        >
          {action.label} <span aria-hidden>→</span>
        </Link>
      )}
    </div>
  );
}
