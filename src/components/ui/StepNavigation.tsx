import Link from "next/link";
import Icon from "./Icon";

type StepNavigationProps = {
  back: { label: string; href?: string; onClick?: () => void };
  next?: { label: string; onClick: () => void };
};

const backClass =
  "flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-[14px] font-semibold text-[#424752] transition-colors hover:bg-[#e6e8ea] sm:w-auto";

/** Garis pemisah + tombol kembali (kiri) dan tombol Lanjutkan (kanan, opsional). */
export default function StepNavigation({ back, next }: StepNavigationProps) {
  const backContent = (
    <>
      <Icon name="arrow_back" className="text-[18px]" />
      <span>{back.label}</span>
    </>
  );

  return (
    <>
      <div className="mb-8 h-px w-full bg-[#e0e3e5]" />
      <div className="flex w-full flex-col-reverse items-center justify-between gap-4 sm:flex-row">
        {back.href ? (
          <Link href={back.href} className={backClass}>
            {backContent}
          </Link>
        ) : (
          <button type="button" onClick={back.onClick} className={backClass}>
            {backContent}
          </button>
        )}

        {next && (
          <button
            type="button"
            onClick={next.onClick}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#003F87] px-8 py-3.5 text-[14px] font-semibold text-white shadow-sm transition-all hover:bg-[#0056B3] hover:shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0056B3] active:scale-[0.99] sm:w-auto"
          >
            <span>{next.label}</span>
            <Icon name="arrow_forward" className="text-[18px]" />
          </button>
        )}
      </div>
    </>
  );
}
