import type { Metadata } from "next";
import { QuoteForm } from "@/components/forms/QuoteForm";

export const metadata: Metadata = {
  title: "Gratis offert",
  description:
    "Fyll i formuläret och få en kostnadsfri offert på luftvärmepump-installation inom 24 timmar.",
};

export default function OffertPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Få gratis offert
            </h1>
            <p className="text-blue-200 text-lg">
              Fyll i formuläret nedan och vi återkommer med en personlig offert inom 24 timmar. Helt kostnadsfritt och utan förpliktelse.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Offertförfrågan</h2>
                <QuoteForm />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-2xl p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Vad händer sen?</h3>
                <ol className="space-y-3 text-sm text-slate-700">
                  {[
                    "Vi läser din förfrågan",
                    "Vi ringer eller mailar dig",
                    "Du får en personlig offert",
                    "Vi bokar tid för installation",
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-green-50 rounded-2xl p-6">
                <h3 className="font-semibold text-slate-900 mb-3">💰 ROT-avdrag</h3>
                <p className="text-sm text-slate-700">
                  Du kan dra av 30% av arbetskostnaden. Vi hanterar ROT-ansökan åt dig.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6">
                <h3 className="font-semibold text-slate-900 mb-3">Kontakt</h3>
                <div className="space-y-2 text-sm text-slate-700">
                  <a href="tel:+46701234567" className="flex items-center gap-2 hover:text-blue-600">
                    📞 +46 70 123 45 67
                  </a>
                  <a href="mailto:info@luftpump.se" className="flex items-center gap-2 hover:text-blue-600">
                    ✉️ info@luftpump.se
                  </a>
                  <p className="text-slate-500 text-xs mt-2">Mån–Fre 08:00–17:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
