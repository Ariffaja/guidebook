import Breadcrumb from "@/components/ui/Breadcrumb";
import PageIntro from "@/components/ui/PageIntro";
import SelectableCard from "@/components/ui/SelectableCard";
import StepNavigation from "@/components/ui/StepNavigation";
import { capilServices, type CapilServiceKey } from "./services";

type ServiceStepProps = {
  selected: CapilServiceKey;
  onSelect: (key: CapilServiceKey) => void;
  onContinue: () => void;
};

/** Tahap 1 Capil: pilih Kematian atau Kelahiran. */
export default function ServiceStep({ selected, onSelect, onContinue }: ServiceStepProps) {
  return (
    <div className="flex w-full flex-col">
      <Breadcrumb items={[{ label: "Pencatatan Sipil" }, { label: "Pilih Layanan" }]} />

      <PageIntro
        icon="assignment"
        pill="Modul Pencatatan Sipil"
        title="Pilih Layanan Pencatatan Sipil"
        description="Tentukan alur pencatatan sipil yang ingin Anda pelajari atau integrasikan ke SIAK Terpusat."
      />

      <div className="mb-10 grid w-full grid-cols-1 gap-6 md:grid-cols-2">
        {capilServices.map((service) => (
          <SelectableCard
            key={service.key}
            icon={service.icon}
            title={service.title}
            description={service.description}
            idleLabel="Pilih Kategori"
            selected={selected === service.key}
            onSelect={() => onSelect(service.key)}
            className="min-h-[280px]"
          />
        ))}
      </div>

      <StepNavigation
        back={{ label: "Kembali ke Beranda", href: "/" }}
        next={{ label: "Lanjutkan", onClick: onContinue }}
      />
    </div>
  );
}
