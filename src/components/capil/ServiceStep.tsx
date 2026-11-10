import Breadcrumb from "@/components/ui/Breadcrumb";
import PageIntro from "@/components/ui/PageIntro";
import SelectableCard from "@/components/ui/SelectableCard";
import StepNavigation from "@/components/ui/StepNavigation";
import { capilServices, type CapilServiceKey } from "./services";

type ServiceStepProps = {
  onSelect: (key: CapilServiceKey) => void;
};

/** Tahap 1 Capil: pilih Kematian atau Kelahiran. */
export default function ServiceStep({ onSelect }: ServiceStepProps) {
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
            selected={false}
            onSelect={() => onSelect(service.key)}
            className="min-h-[280px] hover:-translate-y-1"
          />
        ))}
      </div>

      <StepNavigation back={{ label: "Kembali ke Beranda", href: "/" }} />
    </div>
  );
}
