import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Tjänster",
  description:
    "Installation, service och underhåll av luftvärmepumpar. Certifierade tekniker i hela Sverige.",
};

const SERVICES = [
  {
    icon: "🔧",
    title: "Installation",
    desc: "Professionell installation av luftvärmepumpar. Vi hanterar hela processen från planering till driftsättning.",
    points: [
      "Gratis besiktning och rådgivning",
      "Installation på 1–2 dagar",
      "Alla ledningsdragningar ingår",
      "Driftsättning och instruktion",
      "ROT-avdrag gäller",
    ],
  },
  {
    icon: "🛠️",
    title: "Service & Underhåll",
    desc: "Regelbunden service förlänger livslängden och håller effektiviteten hög.",
    points: [
      "Rengöring av filter och komponenter",
      "Kontroll av köldmedium",
      "Effektivitetstest",
      "Rapport och rekommendationer",
      "Serviceabonnemang tillgängligt",
    ],
  },
  {
    icon: "🔍",
    title: "Felsökning & Reparation",
    desc: "Snabb felsökning och reparation om din pump slutat fungera.",
    points: [
      "Jouravtal tillgängligt",
      "Snabb respons – ofta samma dag",
      "Reservdelar på lager",
      "Garantiarbeten",
      "Byte av komponenter",
    ],
  },
  {
    icon: "💡",
    title: "Rådgivning",
    desc: "Inte säker på vilken pump som passar? Vi hjälper dig välja rätt.",
    points: [
      "Behovsanalys av din bostad",
      "Jämförelse av modeller",
      "Energikalkyl",
      "Kostnadsfri konsultation",
      "Oberoende råd",
    ],
  },
];

export default function TjansterPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Våra tjänster
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Allt du behöver för din luftvärmepump – från installation till löpande service.
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SERVICES.map((s) => (
              <div key={s.title} className="border border-slate-100 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{s.icon}</div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">{s.title}</h2>
                <p className="text-slate-600 mb-6">{s.desc}</p>
                <ul className="space-y-2">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="text-blue-600 mt-0.5">✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Redo att komma igång?
          </h2>
          <p className="text-slate-600 mb-8">
            Kontakta oss idag för en kostnadsfri offert eller boka en konsultation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/offert"><Button size="lg">Få gratis offert</Button></Link>
            <Link href="/boka"><Button size="lg" variant="outline">Boka besök</Button></Link>
          </div>
        </div>
      </section>
    </>
  );
}
