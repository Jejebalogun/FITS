import Link from "next/link";

/**
 * The white card every empty result uses: a quiet illustration on the left,
 * what happened and what to do next on the right.
 */
export default function EmptyPanel({
  icon,
  title,
  children,
  className = "mt-7",
}: {
  icon: "search" | "cart" | "heart";
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`flex flex-col items-center gap-8 rounded-3xl bg-white px-6 py-12 sm:flex-row sm:items-center sm:gap-12 sm:px-14 ${className}`}
    >
      <Illustration icon={icon} />
      <div className="min-w-0 flex-1 text-center sm:text-left">
        <h2 className="font-display text-2xl text-forest sm:text-3xl">{title}</h2>
        {children}
      </div>
    </section>
  );
}

function Illustration({ icon }: { icon: "search" | "cart" | "heart" }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 200"
      className="h-36 w-36 shrink-0 sm:h-48 sm:w-48"
    >
      <circle cx="100" cy="100" r="100" fill="#EFE5D6" />
      {icon === "heart" ? (
        <path
          d="M100 140 C 60 112, 66 70, 86 70 C 95 70, 100 78, 100 84 C 100 78, 105 70, 114 70 C 134 70, 140 112, 100 140 Z"
          fill="none"
          stroke="#BDBEAD"
          strokeWidth="6"
          strokeLinejoin="round"
        />
      ) : icon === "search" ? (
        <>
          <circle
            cx="100"
            cy="100"
            r="35"
            fill="none"
            stroke="#BDBEAD"
            strokeWidth="6"
          />
          <rect x="128" y="134" width="26" height="26" rx="3" fill="#BDBEAD" />
        </>
      ) : (
        <path
          d="M65 72 v42 a14 14 0 0 0 14 14 h42 a14 14 0 0 0 14 -14 v-42"
          fill="none"
          stroke="#BDBEAD"
          strokeWidth="7"
        />
      )}
    </svg>
  );
}

export function PanelBody({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 max-w-2xl text-forest/65">{children}</p>;
}

export function PanelEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-7 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-forest/55">
      {children}
    </p>
  );
}

const primary =
  "rounded-full bg-clay px-7 py-3.5 font-semibold text-cream transition-colors hover:bg-clay-deep";
const secondary =
  "rounded-full border border-forest/20 px-7 py-3.5 font-semibold text-forest transition-colors hover:border-forest/50";

/** A button or a link, in either weight. */
export function PanelAction({
  href,
  onClick,
  variant = "primary",
  children,
}: {
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}) {
  const className = variant === "primary" ? primary : secondary;
  return href ? (
    <Link href={href} className={className}>
      {children}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
}

export function SuggestionChip({
  href,
  onClick,
  children,
}: {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const className =
    "inline-block rounded-full border border-forest/20 px-5 py-2.5 text-sm font-medium text-forest transition-colors hover:border-forest/50";
  return (
    <li>
      {href ? (
        <Link href={href} className={className}>
          {children}
        </Link>
      ) : (
        <button type="button" onClick={onClick} className={className}>
          {children}
        </button>
      )}
    </li>
  );
}
