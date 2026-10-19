import type { SortKey } from "@/lib/marketplace-filters";
import type { Layout } from "@/lib/use-product-results";

type ResultsToolbarProps = {
  sort: SortKey;
  options: { key: SortKey; label: string }[];
  onSort: (sort: SortKey) => void;
  layout: Layout;
  onLayout: (layout: Layout) => void;
};

export default function ResultsToolbar({
  sort,
  options,
  onSort,
  layout,
  onLayout,
}: ResultsToolbarProps) {
  return (
    <div className="flex items-center gap-3">
      <label className="flex items-center gap-2 text-sm text-forest/70">
        Sort by
        <select
          value={sort}
          onChange={(event) => onSort(event.target.value as SortKey)}
          className="rounded-xl border border-forest/15 bg-white px-4 py-2.5 text-sm font-medium text-forest outline-none focus:border-forest"
        >
          {options.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <div className="flex overflow-hidden rounded-xl border border-forest/15">
        <LayoutButton
          active={layout === "grid"}
          onClick={() => onLayout("grid")}
          label="Grid view"
        >
          ▦
        </LayoutButton>
        <LayoutButton
          active={layout === "list"}
          onClick={() => onLayout("list")}
          label="List view"
        >
          ☰
        </LayoutButton>
      </div>
    </div>
  );
}

function LayoutButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={`px-3.5 py-2.5 transition-colors ${
        active ? "bg-forest text-cream" : "bg-white text-forest/60 hover:text-forest"
      }`}
    >
      {children}
    </button>
  );
}
