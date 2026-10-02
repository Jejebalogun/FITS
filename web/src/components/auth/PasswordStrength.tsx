import { passwordRules, passwordStrength } from "@/lib/auth-validation";

const SEGMENTS = [0, 1, 2, 3];

export default function PasswordStrength({ password }: { password: string }) {
  const filled = passwordStrength(password);

  return (
    <div className="mt-3">
      <div className="flex gap-1.5" aria-hidden>
        {SEGMENTS.map((segment) => (
          <span
            key={segment}
            className={`h-1 flex-1 rounded-full transition-colors ${
              segment < filled ? "bg-moss" : "bg-forest/12"
            }`}
          />
        ))}
      </div>

      <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
        {passwordRules.map((rule) => {
          const met = rule.test(password);
          return (
            <li
              key={rule.label}
              className={`flex items-center gap-1.5 text-sm ${
                met ? "text-forest" : "text-forest/45"
              }`}
            >
              <span aria-hidden>{met ? "✓" : "○"}</span>
              {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
