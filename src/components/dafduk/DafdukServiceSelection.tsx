"use client";

import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PageIntro from "@/components/ui/PageIntro";
import SelectableCard from "@/components/ui/SelectableCard";
import StepNavigation from "@/components/ui/StepNavigation";
import { dafdukServices, type DafdukServiceKey } from "./services";

export default function DafdukServiceSelection() {
  const router = useRouter();
  function selectService(service: DafdukServiceKey) {
    router.push(`/dafduk/${service}`);
  }

  return (
    <div className="mx-auto flex w-full max-w-[1080px] flex-col pb-12">
      <Breadcrumb items={[{ label: "Pendaftaran Kependudukan" }, { label: "Pilih Layanan" }]} />

      <PageIntro
        icon="move_up"
        pill="Layanan Mutasi Penduduk"
        title="Pilih Layanan Pendaftaran Penduduk"
      />

      <div className="mb-10 grid w-full grid-cols-1 gap-6 md:grid-cols-2">
        {dafdukServices.map((service) => (
          <SelectableCard
            key={service.key}
            routeHref={`/dafduk/${service.key}`}
            icon={service.icon}
            title={service.title}
            tag={service.tag}
            description={service.description}
            footer={service.footer}
            idleLabel="Pilih Layanan"
            selected={false}
            onSelect={() => selectService(service.key)}
            className="min-h-[300px]"
          />
        ))}
      </div>

      <StepNavigation
        back={{ label: "Kembali ke Beranda", href: "/" }}
      />
    </div>
  );
}
