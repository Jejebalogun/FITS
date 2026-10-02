"use client";

import { useId, useState, type InputHTMLAttributes, type ReactNode } from "react";

type FieldProps = {
  label: string;
  /** Rendered opposite the label, e.g. the "Forgot password?" link. */
  action?: ReactNode;
  error?: string | null;
  /**
   * Marks the field as wrong without printing a message — for when the
   * explanation already sits elsewhere on screen, as the sign-up conflict does.
   */
  invalid?: boolean;
  /** Shown under the field while there is no error. */
  hint?: string;
  /** Rendered under the field, below any error or hint. */
  children?: ReactNode;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "children">;

export function Field({
  label,
  action,
  error,
  invalid,
  hint,
  children,
  className,
  ...input
}: FieldProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const wrong = Boolean(error) || Boolean(invalid);

  return (
    <div className={className}>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label
          htmlFor={id}
          className={`font-mono text-[11px] uppercase tracking-[0.2em] ${
            wrong ? "text-clay-deep" : "text-forest/50"
          }`}
        >
          {label}
        </label>
        {action}
      </div>

      <input
        id={id}
        aria-invalid={wrong ? true : undefined}
        aria-describedby={error || hint ? messageId : undefined}
        className={`w-full rounded-xl border-2 bg-white px-4 py-3.5 text-forest outline-none transition-colors placeholder:text-forest/35 disabled:bg-white/60 disabled:text-forest/50 ${
          wrong ? "border-clay-deep" : "border-forest/15 focus:border-forest"
        }`}
        {...input}
      />

      {error ? (
        <p id={messageId} role="alert" className="mt-2 text-sm text-clay-deep">
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className="mt-2 text-sm text-forest/55">
          {hint}
        </p>
      ) : null}

      {children}
    </div>
  );
}

type PasswordFieldProps = Omit<FieldProps, "type" | "label"> & {
  label?: string;
};

/** A Field with a show/hide toggle sitting inside the input. */
export function PasswordField({
  label = "Password",
  action,
  error,
  invalid,
  hint,
  children,
  className,
  ...input
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const id = useId();
  const messageId = `${id}-message`;
  const wrong = Boolean(error) || Boolean(invalid);

  return (
    <div className={className}>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label
          htmlFor={id}
          className={`font-mono text-[11px] uppercase tracking-[0.2em] ${
            wrong ? "text-clay-deep" : "text-forest/50"
          }`}
        >
          {label}
        </label>
        {action}
      </div>

      <div
        className={`flex items-center rounded-xl border-2 bg-white transition-colors focus-within:border-forest ${
          wrong ? "border-clay-deep" : "border-forest/15"
        }`}
      >
        <input
          id={id}
          type={visible ? "text" : "password"}
          aria-invalid={wrong ? true : undefined}
          aria-describedby={error || hint ? messageId : undefined}
          className="w-full flex-1 rounded-xl bg-transparent px-4 py-3.5 text-forest outline-none placeholder:text-forest/35 disabled:text-forest/50"
          {...input}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          disabled={input.disabled}
          className="shrink-0 px-4 text-sm text-forest/70 transition-colors hover:text-forest disabled:text-forest/35"
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>

      {error ? (
        <p id={messageId} role="alert" className="mt-2 text-sm text-clay-deep">
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className="mt-2 text-sm text-forest/55">
          {hint}
        </p>
      ) : null}

      {children}
    </div>
  );
}
