import Image from "next/image";
import Link from "next/link";

const columns = [
  {
    heading: "Shop",
    links: [
      { label: "Categories", href: "/category/new-in" },
      { label: "The feed", href: "/feed" },
      { label: "Shop by country", href: "/regions" },
      { label: "Gift cards", href: "/gift-cards" },
    ],
  },
  {
    heading: "Sell",
    links: [
      { label: "Become a Creator", href: "/creators" },
      { label: "Verification", href: "/creators/verification" },
      { label: "Fees", href: "/creators/fees" },
    ],
  },
  {
    heading: "Help",
    links: [
      { label: "How escrow works", href: "/help/escrow" },
      { label: "Returns and disputes", href: "/help/returns" },
      { label: "Contact us", href: "/help/contact" },
    ],
  },
];

export default function MarketplaceFooter() {
  return (
    <footer className="bg-forest-deep">
      <div className="mx-auto w-full max-w-[90rem] px-6 py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Link href="/" aria-label="FITS — home">
              <Image
                src="/logo.png"
                alt="FITS"
                width={85}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm text-cream/65">
              Handmade across Africa, shipped worldwide, paid for safely.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.heading}>
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream/45">
                {column.heading}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-cream/85 transition-colors hover:text-clay"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto flex w-full max-w-[90rem] flex-wrap items-center justify-between gap-3 px-6 py-5 text-sm text-cream/55">
          <p>© {new Date().getFullYear()} FITS</p>
          <p className="flex flex-wrap gap-x-2">
            <Link href="/terms" className="hover:text-cream">
              Terms
            </Link>
            <span aria-hidden>·</span>
            <Link href="/privacy" className="hover:text-cream">
              Privacy (NDPR)
            </Link>
            <span aria-hidden>·</span>
            <Link href="/cookies" className="hover:text-cream">
              Cookies
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
