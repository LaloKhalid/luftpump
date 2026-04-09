import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Priser",
  description:
    "Transparenta priser på installation av luftvärmepumpar. ROT-avdrag ingår. Få offert idag.",
};

const PACKAGES = [
  {
    name: "Bas",
    price: "Från 9 900 kr",
    priceAfterRot: "Från 7 430 kr efter ROT",
    description: "Enklare installation, 1 inneenhet",
    popular: false,
    features: [
      "En inneenhet",
      "Standardinstallation",
      "5 m rörledning",
      "1 år garanti på installation",
      "Driftsättning",
    ],
  },
  {
    name: "Standard",
    price: "Från 16 900 kr",
    priceAfterRot: "Från 12 675 kr efter ROT",
    description: "Populäraste valet för villa",
    popular: true,
    features: [
      "En inneenhet",
      "Premium installation",
      "10 m rörledning",
      "2 år garanti på installation",
      "Driftsättning + instruktion",
      "Första service ingår",
      "Prioriterad support",
    ],
  },
  {
    name: "Multi-split",
    price: "Från 29 900 kr",
    priceAfterRot: "Från 22 425 kr efter ROT",
    description: "Flera rum, en uteenhet",
    popular: false,
    features: [
      "2–4 inneenheter",
      "En gemensam uteenhet",
      "15 m rörledning",
      "3 år garanti på installation",
      "Driftsättning + instruktion",
      "2 servicebesök ingår",
      "VIP support",
    ],
  },
];

const SERVICE_PRICES = [
  { name: "Årsservice", price: "Från 1 295 kr" },
  { name: "Felsökning (1 h)", price: "895 kr" },
  { name: "Reparation (per timme)", price: "895 kr/h" },
  { name: "Påfyllning köldmedium", price: "Från 1 495 kr" },
  { name: "Serviceabonnemang/år", price: "Från 1 895 kr" },
];

export default function PriserPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Priser</h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Transparenta priser utan dolda avgifter. ROT-avdrag sänker din kostnad med 30%.
          </p>
        </div>
      </section>

      {/* Packages */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900">Installationspaket</h2>
            <p className="mt-3 text-slate-600">Alla priser exklusive moms. ROT-avdrag 30% på arbetskostnad.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.name}
                className={`rounded-2xl p-8 relative ${
                  pkg.popular
                    ? "bg-blue-600 text-white shadow-xl ring-4 ring-blue-200"
                    : "bg-slate-50 text-slate-900"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-xs font-bold px-4 py-1 rounded-full">
                    Populärast
                  </div>
                )}
                <h3 className={`text-xl font-bold mb-1 ${pkg.popular ? "text-white" : "text-slate-900"}`}>
                  {pkg.name}
                </h3>
                <p className={`text-sm mb-4 ${pkg.popular ? "text-blue-100" : "text-slate-500"}`}>
                  {pkg.description}
                </p>
                <div className="mb-1">
                  <span className={`text-3xl font-bold ${pkg.popular ? "text-white" : "text-blue-600"}`}>
                    {pkg.price}
                  </span>
                </div>
                <p className={`text-xs mb-6 ${pkg.popular ? "text-blue-200" : "text-slate-500"}`}>
                  {pkg.priceAfterRot}
                </p>
                <ul className="space-y-2 mb-8">
                  {pkg.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2 text-sm ${pkg.popular ? "text-blue-100" : "text-slate-700"}`}>
                      <span className={pkg.popular ? "text-white" : "text-blue-600"}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/offert">
                  <Button
                    variant={pkg.popular ? "secondary" : "primary"}
                    className="w-full"
                  >
                    Välj detta paket
                  </Button>
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-slate-500 mt-8">
            * Priser varierar beroende på val av pump, installationssvårigheter och avstånd. Kontakta oss för exakt offert.
          </p>
        </div>
      </section>

      {/* Service prices */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">Servicepriser</h2>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            {SERVICE_PRICES.map((item, i) => (
              <div
                key={item.name}
                className={`flex justify-between items-center px-6 py-4 ${
                  i !== SERVICE_PRICES.length - 1 ? "border-b border-slate-100" : ""
                }`}
              >
                <span className="text-slate-700 font-medium">{item.name}</span>
                <span className="text-slate-900 font-bold">{item.price}</span>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/offert"><Button size="lg">Få personlig offert</Button></Link>
          </div>
        </div>
      </section>

      {/* ROT info */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">💳 ROT-avdrag</h2>
          <p className="text-blue-100 text-lg">
            Du kan dra av 30% av arbetskostnaden via ROT-avdraget, upp till 50 000 kr per person och år.
            Vi hanterar ROT-avdraget direkt mot Skatteverket – du betalar bara din del.
          </p>
        </div>
      </section>
    </>
  );
}
