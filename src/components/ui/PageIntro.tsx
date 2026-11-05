import Icon from "./Icon";

type PageIntroProps = {
  icon: string;
  pill: string;
  title: string;
  description?: string;
};

/** Blok judul tengah: pill kecil, judul halaman, dan deskripsi opsional. */
export default function PageIntro({ icon, pill, title, description }: PageIntroProps) {
  return (
    <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center text-center">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#d7e2ff] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#001a40]">
        <Icon name={icon} className="text-[14px]" />
        {pill}
      </div>
      <h1 className="mb-3 text-2xl font-bold tracking-tight text-[#191c1e] sm:text-[32px]">{title}</h1>
      {description && (
        <p className="text-[15px] leading-relaxed text-[#424752]">{description}</p>
      )}
    </div>
  );
}
