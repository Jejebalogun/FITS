type SocialAuthProps = {
  disabled?: boolean;
  onSelect?: (provider: "google" | "facebook") => void;
};

/**
 * Google and Facebook sign-in. The designs place these on the login screen only —
 * sign-up is email and password alone.
 */
export default function SocialAuth({ disabled, onSelect }: SocialAuthProps) {
  return (
    <div className="space-y-3">
      <SocialButton
        label="Continue with Google"
        icon={<GoogleMark />}
        disabled={disabled}
        onClick={() => onSelect?.("google")}
      />
      <SocialButton
        label="Continue with Facebook"
        icon={<FacebookMark />}
        disabled={disabled}
        onClick={() => onSelect?.("facebook")}
      />
    </div>
  );
}

function SocialButton({
  label,
  icon,
  disabled,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex w-full items-center justify-center gap-3 rounded-full border-2 border-forest/12 bg-white px-6 py-3.5 font-medium text-forest transition-colors hover:border-forest/30 disabled:opacity-55"
    >
      {icon}
      {label}
    </button>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.93v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.93a9 9 0 0 0 0 8.1l3.04-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .93 4.95l3.04 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  );
}

function FacebookMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#1877F2"
        d="M18 9a9 9 0 1 0-10.4 8.89v-6.29H5.3V9h2.3V7.01c0-2.26 1.35-3.51 3.41-3.51.99 0 2.02.17 2.02.17v2.22h-1.14c-1.12 0-1.47.7-1.47 1.41V9h2.5l-.4 2.6h-2.1v6.29A9 9 0 0 0 18 9Z"
      />
      <path
        fill="#fff"
        d="m12.52 11.6.4-2.6h-2.5V7.3c0-.71.35-1.41 1.47-1.41h1.14V3.67s-1.03-.17-2.02-.17c-2.06 0-3.41 1.25-3.41 3.51V9H5.3v2.6h2.3v6.29a9.1 9.1 0 0 0 2.82 0V11.6h2.1Z"
      />
    </svg>
  );
}
