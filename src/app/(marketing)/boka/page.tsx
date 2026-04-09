import type { Metadata } from "next";
import { BookingForm } from "@/components/forms/BookingForm";

export const metadata: Metadata = {
  title: "Boka besök",
  description:
    "Boka en kostnadsfri konsultation eller installationsdag med Luftpump AB.",
};

export default function BokaPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-slate-900 to-blue-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Boka besök
            </h1>
            <p className="text-blue-200 text-lg">
              Välj datum och tid för ett besök. Vi erbjuder kostnadsfria konsultationer.
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
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Boka tid</h2>
                <BookingForm />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-2xl p-6">
                <h3 className="font-semibold text-slate-900 mb-3">Konsultation</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2"><span className="text-blue-600">✓</span>Kostnadsfri</li>
                  <li className="flex items-start gap-2"><span className="text-blue-600">✓</span>Ca 45–60 minuter</li>
                  <li className="flex items-start gap-2"><span className="text-blue-600">✓</span>Behovsanalys</li>
                  <li className="flex items-start gap-2"><span className="text-blue-600">✓</span>Personlig offert</li>
                </ul>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6">
                <h3 className="font-semibold text-slate-900 mb-3">Installation</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2"><span className="text-green-600">✓</span>1–2 dagar</li>
                  <li className="flex items-start gap-2"><span className="text-green-600">✓</span>Certifierade tekniker</li>
                  <li className="flex items-start gap-2"><span className="text-green-600">✓</span>ROT-avdrag</li>
                  <li className="flex items-start gap-2"><span className="text-green-600">✓</span>Garanti ingår</li>
                </ul>
              </div>

              <div className="bg-amber-50 rounded-2xl p-6">
                <h3 className="font-semibold text-slate-900 mb-2">⏰ Öppettider</h3>
                <div className="text-sm text-slate-700 space-y-1">
                  <p>Mån–Fre: 08:00–17:00</p>
                  <p>Lördag: 09:00–13:00</p>
                  <p className="text-slate-500 text-xs mt-2">Jour tillgängligt för befintliga kunder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
