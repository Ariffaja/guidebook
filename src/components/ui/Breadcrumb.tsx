import Icon from "./Icon";

export type BreadcrumbItem = {
  label: string;
  /** Jika diisi, item dapat diklik. Item terakhir selalu berupa teks halaman aktif. */
  onClick?: () => void;
};

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8 py-2">
      <ol className="flex flex-wrap items-center gap-2 text-[13px] text-[#424752]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              {index > 0 && <Icon name="chevron_right" className="text-[16px] text-[#727784]" />}
              {isLast ? (
                <span aria-current="page" className="font-medium text-[#191c1e]">
                  {item.label}
                </span>
              ) : item.onClick ? (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="cursor-pointer transition-colors hover:text-[#003F87]"
                >
                  {item.label}
                </button>
              ) : (
                <span>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
