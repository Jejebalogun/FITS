// Validation rules for the auth screens. Sign-up asks for an email and a password
// and nothing else — everything else is collected later, at checkout or through
// profile-completion prompts.

/** Catches the common slip the designs call out: a missing top-level domain. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function emailError(email: string): string | null {
  const value = email.trim();
  if (!value) return "Enter your email.";
  if (!value.includes("@")) return "Add an @ to your email.";
  if (!EMAIL_PATTERN.test(value)) return "Add the end of your email — like .com";
  return null;
}

export const passwordRules = [
  { label: "8+ characters", test: (value: string) => value.length >= 8 },
  { label: "a number", test: (value: string) => /\d/.test(value) },
  { label: "a capital is stronger", test: (value: string) => /[A-Z]/.test(value) },
] as const;

/** The first two rules are required; the capital only strengthens the password. */
export function passwordError(password: string): string | null {
  if (!password) return "Choose a password.";
  const [length, number] = passwordRules;
  if (!length.test(password) || !number.test(password)) {
    return "Use at least 8 characters, including a number.";
  }
  return null;
}

/**
 * Filled segments out of 4. Meeting any rule lights an extra segment, so a
 * password that satisfies the two required rules reads as strong-but-improvable.
 */
export function passwordStrength(password: string): number {
  if (!password) return 0;
  const met = passwordRules.filter((rule) => rule.test(password)).length;
  return Math.min(met + 1, 4);
}
