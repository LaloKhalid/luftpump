import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Om oss",
  description:
    "Luftpump AB – certifierade installatörer av luftvärmepumpar med över 10 års erfarenhet i Sverige.",
};

const STATS = [
  { label: "Installationer", value: "1 200+" },
  { label: "Nöjda kunder", value: "98%" },
  { label: "Års erfarenhet", value: "10+" },
  { label: "Certifierade tekniker", value: "12" },
];

const TEAM = [
  { name: "Johan Bergström", role: "VD & Grundare", emoji: "👨‍💼" },
  { name: "Lisa Holm", role: "Teknisk chef", emoji: "👩‍🔧" },
  { name: "Marcus Nilsson", role: "Ledande installatör", emoji: "👨‍🔧" },
  { name: "Sara Persson", role: "Kundansvarig", emoji: "👩‍💼" },
];

const CERTIFICATIONS = [
  "Auktoriserade installatörer",
  "F-gas certifikat",
  "Behörighet EL",
  "ROT-avdrag godkänt",
  "ISO 9001 certifierade",
  "Medlemmar i Svensk Energi",
];

export default function OmOssPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Om oss</h1>
            <p className="text-blue-200 text-lg">
              Luftpump AB grundades 2014 med ett mål: att göra professionell luftvärmepump-installation tillgänglig för alla svenska hushåll.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="text-4xl font-bold text-blue-600">{s.value}</div>
                <div className="text-sm text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Vår historia</h2>
          <div className="prose prose-slate max-w-none space-y-4 text-slate-700 leading-relaxed">
            <p>
              Luftpump AB startades av Johan Bergström 2014 efter att han insett hur mycket pengar svenska hushåll slösar på ineffektiv uppvärmning. Med bakgrund som elektriker och VVS-tekniker byggde han ett team av certifierade specialister.
            </p>
            <p>
              Idag är vi ett av Sveriges ledande företag inom installation av luftvärmepumpar med tekniker i Stockholm, Göteborg, Malmö och andra städer. Vi har installerat över 1 200 pumpar och vår kundnöjdhet är konsekvent över 98%.
            </p>
            <p>
              Vi samarbetar med världsledande varumärken som Daikin, Mitsubishi Electric, Panasonic och Fujitsu för att säkerställa att du alltid får den bästa produkten till rätt pris.
            </p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Möt teamet</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((m) => (
              <div key={m.name} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <div className="text-5xl mb-4">{m.emoji}</div>
                <h3 className="font-semibold text-slate-900">{m.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">Certifieringar & godkännanden</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {CERTIFICATIONS.map((c) => (
              <div key={c} className="flex items-center gap-3 bg-slate-50 rounded-xl p-4">
                <span className="text-green-500 text-lg">✓</span>
                <span className="text-sm font-medium text-slate-700">{c}</span>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/kontakt"><Button size="lg">Kontakta oss</Button></Link>
          </div>
        </div>
      </section>
    </>
  );
}
