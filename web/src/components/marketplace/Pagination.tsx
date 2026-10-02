type PaginationProps = {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
};

/** Page numbers to show, with nulls standing in for the gaps. */
function pageItems(page: number, pageCount: number): (number | null)[] {
  if (pageCount <= 5) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const items: (number | null)[] = [1];
  const start = Math.max(2, Math.min(page - 1, pageCount - 3));
  const end = Math.min(pageCount - 1, Math.max(page + 1, 4));

  if (start > 2) items.push(null);
  for (let n = start; n <= end; n += 1) items.push(n);
  if (end < pageCount - 1) items.push(null);
  items.push(pageCount);

  return items;
}

export default function Pagination({
  page,
  pageCount,
  onChange,
}: PaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex items-center justify-center gap-2"
    >
      <Step
        label="← Prev"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      />

      {pageItems(page, pageCount).map((item, index) =>
        item === null ? (
          <span
            key={`gap-${index}`}
            aria-hidden
            className="px-1 text-forest/40"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-current={item === page ? "page" : undefined}
            className={`h-11 min-w-11 rounded-xl border px-3 text-sm font-medium transition-colors ${
              item === page
                ? "border-forest bg-forest text-cream"
                : "border-forest/20 text-forest hover:border-forest/50"
            }`}
          >
            {item}
          </button>
        ),
      )}

      <Step
        label="Next →"
        disabled={page === pageCount}
        onClick={() => onChange(page + 1)}
      />
    </nav>
  );
}

function Step({
  label,
  disabled,
  onClick,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="h-11 rounded-xl border border-forest/20 px-4 text-sm font-medium text-forest transition-colors hover:border-forest/50 disabled:cursor-not-allowed disabled:border-forest/10 disabled:text-forest/30"
    >
      {label}
    </button>
  );
}
