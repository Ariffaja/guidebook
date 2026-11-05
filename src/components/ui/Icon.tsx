type IconProps = {
  name: string;
  className?: string;
};

/**
 * Ikon Material Symbols (font dimuat di app/layout.tsx).
 * Ukuran & warna diatur lewat className, contoh: "text-[20px] text-slate-500".
 */
export default function Icon({ name, className = "" }: IconProps) {
  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
      {name}
    </span>
  );
}
