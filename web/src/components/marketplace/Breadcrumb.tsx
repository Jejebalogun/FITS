import Link from "next/link";
import { Fragment } from "react";

export type Crumb = { label: string; href?: string };

/** The last crumb is the current page and is never a link. */
export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-forest/60">
      <ol className="flex flex-wrap items-center">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <Fragment key={`${item.label}-${index}`}>
              {index > 0 && (
                <li aria-hidden className="px-2">
                  /
                </li>
              )}
              <li>
                {item.href && !last ? (
                  <Link href={item.href} className="hover:text-forest">
                    {item.label}
                  </Link>
                ) : (
                  <span
                    aria-current={last ? "page" : undefined}
                    className={last ? "text-forest" : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
