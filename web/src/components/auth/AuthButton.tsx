import type { ButtonHTMLAttributes, ReactNode } from "react";

type AuthButtonProps = {
  variant?: "primary" | "outline";
  /** Swaps in the forest treatment with a spinner and locks the button. */
  loading?: boolean;
  loadingLabel?: string;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const base =
  "flex w-full items-center justify-center gap-2.5 rounded-full px-6 py-4 font-semibold transition-colors";

export default function AuthButton({
  variant = "primary",
  loading = false,
  loadingLabel,
  children,
  className = "",
  disabled,
  ...button
}: AuthButtonProps) {
  if (loading) {
    return (
      <button
        type="button"
        disabled
        aria-live="polite"
        className={`${base} bg-forest-deep text-cream ${className}`}
        {...button}
      >
        <Spinner />
        {loadingLabel ?? children}
      </button>
    );
  }

  const tone =
    variant === "outline"
      ? "border-2 border-forest text-forest hover:bg-forest hover:text-cream"
      : "bg-clay text-cream hover:bg-clay-deep disabled:bg-clay-soft/55 disabled:text-cream/90 disabled:hover:bg-clay-soft/55";

  return (
    <button
      disabled={disabled}
      className={`${base} ${tone} ${
        disabled ? "cursor-not-allowed" : ""
      } ${className}`}
      {...button}
    >
      {children}
    </button>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden
      className="h-[18px] w-[18px] animate-spin rounded-full border-2 border-cream/35 border-t-cream"
    />
  );
}
