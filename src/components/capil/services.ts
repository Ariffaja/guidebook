export type CapilServiceKey = "kematian" | "kelahiran";

export type CapilService = {
  key: CapilServiceKey;
  icon: string;
  title: string;
  description: string;
};

export const capilServices: CapilService[] = [
  {
    key: "kematian",
    icon: "shield_moon",
    title: "Kematian",
    description: "Panduan pencatatan pelaporan kematian dan penerbitan akta kematian melalui SIAK.",
  },
  {
    key: "kelahiran",
    icon: "child_care",
    title: "Kelahiran",
    description: "Panduan pendaftaran bayi baru lahir dan pembuatan kutipan Akta Kelahiran resmi.",
  },
];
