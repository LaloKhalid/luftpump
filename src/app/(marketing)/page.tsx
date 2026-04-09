import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Luftpump AB – Professionell installation av luftvärmepumpar",
  description:
    "Spara upp till 70% på din uppvärmning med en luftvärmepump. Certifierade installatörer, ROT-avdrag, gratis offert.",
};

const BENEFITS = [
  {
    icon: "💰",
    title: "Spara upp till 70%",
    desc: "Dramatiskt lägre energikostnader jämfört med direktverkande el.",
  },
  {
    icon: "🌿",
    title: "Miljövänligt",
    desc: "Minska ditt koldioxidavtryck med förnybar värme från luften.",
  },
  {
    icon: "🛡️",
    title: "10 års garanti",
    desc: "Vi erbjuder utökad garanti på installation och delar.",
  },
  {
    icon: "⚡",
    title: "Snabb installation",
    desc: "Professionell installation på 1–2 dagar. Minimal störning.",
  },
  {
    icon: "🔧",
    title: "Certifierade tekniker",
    desc: "Alla tekniker är certifierade och auktoriserade.",
  },
  {
    icon: "💳",
    title: "ROT-avdrag",
    desc: "Dra av 30% av arbetskostnaden via ROT-avdraget.",
  },
];

const BRANDS = ["Daikin", "Mitsubishi", "Panasonic", "Fujitsu", "LG", "Samsung"];

const TESTIMONIALS = [
  {
    name: "Anna Karlsson",
    location: "Stockholm",
    text: "Fantastisk service! Installatörerna var professionella och snabba. Min elräkning har halverats.",
    rating: 5,
  },
  {
    name: "Erik Lindqvist",
    location: "Göteborg",
    text: "Mycket nöjd med installation av Mitsubishi-pumpen. Jobbet gjordes på en dag. Rekommenderas!",
    rating: 5,
  },
  {
    name: "Maria Svensson",
    location: "Malmö",
    text: "Bra priser och kompetent personal. Fick offert inom 24 timmar och installation på 3 dagar.",
    rating: 5,
  },
];

export default async function HomePage() {
  const products = await prisma.product.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-slate-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              Gratis offert inom 24 timmar
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
              Luftvärmepump –{" "}
              <span className="text-blue-600">spara upp till 70%</span> på
              uppvärmningen
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl">
              Professionell installation av luftvärmepumpar i hela Sverige.
              Certifierade tekniker, ROT-avdrag och 10 års garanti. Få en
              kostnadsfri offert idag.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/offert">
                <Button size="lg" className="w-full sm:w-auto">
                  Få gratis offert →
                </Button>
              </Link>
              <Link href="/boka">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Boka konsultation
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">✓ Ingen kostnad</span>
              <span className="flex items-center gap-1.5">✓ Svar inom 24h</span>
              <span className="flex items-center gap-1.5">✓ Certifierade installatörer</span>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      {products.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Våra produkter</h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                Vi installerar marknadens ledande luftvärmepumpar från de bästa varumärkena.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  <div className="relative h-52 bg-slate-100">
                    {p.imageUrl ? (
                      <Image
                        src={p.imageUrl}
                        alt={p.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-300 text-5xl">🌡️</div>
                    )}
                    {p.featured && (
                      <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                        Populär
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    {p.brand && (
                      <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">{p.brand}</span>
                    )}
                    <h3 className="font-semibold text-slate-900 mb-2">{p.name}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed flex-1 line-clamp-3">{p.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xl font-bold text-slate-900">
                        {p.price.toLocaleString("sv-SE")} kr
                      </span>
                      <Link href="/offert">
                        <Button size="sm">Få offert</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trust bar */}
      <section className="border-y border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-center gap-8 text-slate-400 text-sm font-medium">
            <span className="text-slate-600 font-semibold">Godkända varumärken:</span>
            {BRANDS.map((b) => (
              <span key={b} className="text-slate-500 font-semibold text-base">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Varför välja oss?
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Vi har installerat över 1 000 pumpar i Sverige med högsta kundnöjdhet.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="bg-slate-50 rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-4">{b.icon}</div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {b.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Hur det fungerar
            </h2>
            <p className="mt-4 text-lg text-slate-600">Enkelt och smidigt från start till mål</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Skicka offert", desc: "Fyll i ditt formulär. Det tar 2 minuter." },
              { step: "2", title: "Vi kontaktar dig", desc: "Svar och offert inom 24 timmar." },
              { step: "3", title: "Boka installation", desc: "Välj ett datum som passar dig." },
              { step: "4", title: "Njut av besparingen", desc: "Vi installerar. Du sparar direkt." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Vad våra kunder säger
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-slate-50 rounded-2xl p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="text-amber-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-4">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="text-sm font-semibold text-slate-900">
                  {t.name} <span className="font-normal text-slate-500">– {t.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Redo att börja spara?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Fyll i vårt formulär och få en kostnadsfri offert inom 24 timmar. Ingen bindningstid.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/offert">
              <Button size="lg" variant="secondary">
                Få gratis offert →
              </Button>
            </Link>
            <Link href="/boka">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-blue-700"
              >
                Boka konsultation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
