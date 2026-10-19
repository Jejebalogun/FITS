import Image from "next/image";
import Link from "next/link";

export type CheckoutStep = "delivery" | "payment" | "done";

const STEPS: { key: CheckoutStep; label: string }[] = [
  { key: "delivery", label: "Delivery" },
  { key: "payment", label: "Payment" },
  { key: "done", label: "Done" },
];

/**
 * Checkout drops the shop's navigation: one way forward, one way back to the
 * cart, and nothing else to wander off to mid-payment.
 */
export default function CheckoutShell({
  step,
  summary,
  children,
}: {
  step: CheckoutStep;
  summary: React.ReactNode;
  children: React.ReactNode;
}) {
  const current = STEPS.findIndex((item) => item.key === step);

  return (
    <div className="min-h-screen bg-cream pb-24">
      <header className="bg-forest-deep">
        <div className="mx-auto flex w-full max-w-[90rem] flex-wrap items-center gap-x-6 gap-y-3 px-6 py-5">
          <Link href="/shop" aria-label="FITS — back to the shop" className="shrink-0">
            <Image src="/logo.png" alt="FITS" width={85} height={40} className="h-8 w-auto" />
          </Link>
          <span aria-hidden className="hidden h-6 w-px bg-cream/20 sm:block" />
          <span className="hidden text-sm text-cream/75 sm:inline">
            <span aria-hidden>🔒 </span>Secure checkout
          </span>

          <ol aria-label="Checkout steps" className="mx-auto flex items-center gap-3">
            {STEPS.map((item, index) => {
              const done = index < current;
              const active = index === current;
              return (
                <li key={item.key} className="flex items-center gap-3">
                  {index > 0 && <span aria-hidden className="hidden h-px w-10 bg-cream/20 sm:block" />}
                  <span
                    aria-current={active ? "step" : undefined}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span
                      aria-hidden
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                        done
                          ? "bg-moss text-cream"
                          : active
                            ? "bg-clay text-cream"
                            : "bg-forest text-cream/50"
                      }`}
                    >
                      {done ? "✓" : index + 1}
                    </span>
                    <span className={active ? "font-semibold text-cream" : "text-cream/60"}>
                      {item.label}
                    </span>
                    {done && <span className="sr-only">, done</span>}
                  </span>
                </li>
              );
            })}
          </ol>

          {step === "done" ? (
            <Link href="/help/contact" className="text-sm font-medium text-cream hover:text-clay-soft">
              Help with this order
            </Link>
          ) : (
            <Link href="/cart" className="text-sm font-medium text-cream hover:text-clay-soft">
              ← Back to cart
            </Link>
          )}
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[90rem] gap-10 px-6 pt-9 lg:grid-cols-[minmax(0,1fr)_27rem] lg:gap-12">
        <main className="min-w-0">{children}</main>
        <div>{summary}</div>
      </div>
    </div>
  );
}
