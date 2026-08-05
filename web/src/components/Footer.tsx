import Image from "next/image";

const columns = [
  {
    heading: "Shop",
    links: ["Categories", "Trending", "Collections", "Explore by region"],
  },
  {
    heading: "Creators",
    links: ["Become a creator", "Creator spotlight", "Seller guide", "Payouts"],
  },
  {
    heading: "Company",
    links: ["About", "Editorial", "Help centre", "Contact"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-forest-deep">
      <div className="container-page py-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr,2fr]">
          <div>
            <Image
              src="/logo.png"
              alt="FITS — Fashion Indigenous Trends & Styles"
              width={85}
              height={40}
              className="h-10 w-auto"
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/60">
              Fashion Indigenous Trends &amp; Styles. African excellence, made
              visible to the world.
            </p>
            <div className="mt-6 flex gap-3">
              {["Instagram", "Twitter", "TikTok"].map((network) => (
                <a
                  key={network}
                  href="#"
                  aria-label={network}
                  className="h-10 w-10 rounded-full bg-forest-card transition-colors hover:bg-clay"
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.heading}>
                <h3 className="font-semibold text-cream">{column.heading}</h3>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-cream/60 transition-colors hover:text-cream"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-8 sm:flex-row">
          <p className="text-sm text-cream/50">
            © 2026 FITS. All rights reserved.
          </p>
          <p className="text-sm text-cream/50">
            Privacy · Terms · NDPR &amp; GDPR compliant
          </p>
        </div>
      </div>
    </footer>
  );
}
