import Link from "next/link";
import Icon from "@/components/ui/Icon";

type ServiceCardProps = {
  href: string;
  icon: string;
  /** Warna aksen ikon & label: biru untuk Dafduk, teal untuk Capil. */
  tone: "blue" | "teal";
  badge: string;
  label: string;
  title: string;
  description?: string;
  features: string[];
};

const toneStyles = {
  blue: { iconBox: "border-blue-100 bg-blue-50 text-[#003F87]", label: "text-[#0056B3]" },
  teal: { iconBox: "border-teal-100 bg-teal-50 text-[#006A6A]", label: "text-[#006A6A]" },
} as const;

export default function ServiceCard({
  href,
  icon,
  tone,
  badge,
  label,
  title,
  description,
  features,
}: ServiceCardProps) {
  const styles = toneStyles[tone];

  return (
    <Link
      href={href}
      className="group relative flex flex-col justify-between rounded-xl border-2 border-slate-200/90 bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0056B3] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056B3] sm:p-8"
    >
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-xl border transition-colors duration-200 group-hover:bg-[#003F87] group-hover:text-white ${styles.iconBox}`}
          >
            <Icon name={icon} className="text-[28px]" />
          </div>
          <span className="rounded bg-slate-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600 transition-colors group-hover:bg-blue-50 group-hover:text-[#0056B3]">
            {badge}
          </span>
        </div>

        <div className="mb-3 space-y-1">
          <span className={`text-xs font-bold uppercase tracking-wide ${styles.label}`}>{label}</span>
          <h2 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-[#003F87] sm:text-2xl">
            {title}
          </h2>
        </div>

        <p className="mb-6 text-sm leading-relaxed text-slate-600">{description}</p>

        <ul className="mb-6 space-y-2 border-t border-slate-100 pt-4">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2.5 text-xs text-slate-600">
              <Icon name="check_circle" className="text-[18px] text-[#006A6A]" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="inline-flex items-center text-sm font-semibold text-[#0056B3] transition-all group-hover:translate-x-1 group-hover:text-[#003F87]">
          Buka Panduan
          <Icon name="arrow_forward" className="ml-1.5 text-[18px]" />
        </span>
        <span className="text-xs font-medium text-slate-400">Masuk Modul →</span>
      </div>
    </Link>
  );
}
