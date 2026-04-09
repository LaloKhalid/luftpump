import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Kontakta Luftpump AB. Ring oss, skicka e-post eller fyll i formuläret. Vi svarar inom 24 timmar.",
};

const CONTACT_ITEMS = [
  {
    icon: "📞",
    title: "Telefon",
    value: "+46 70 123 45 67",
    href: "tel:+46701234567",
    sub: "Mån–Fre 08:00–17:00",
  },
  {
    icon: "✉️",
    title: "E-post",
    value: "info@luftpump.se",
    href: "mailto:info@luftpump.se",
    sub: "Svar inom 24 timmar",
  },
  {
    icon: "📍",
    title: "Adress",
    value: "Storgatan 12, 111 51 Stockholm",
    href: "#",
    sub: "Besök ej utan avtalad tid",
  },
  {
    icon: "🕐",
    title: "Öppettider",
    value: "Mån–Fre: 08:00–17:00",
    href: "#",
    sub: "Lör: 09:00–13:00",
  },
];

export default function KontaktPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Kontakta oss</h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Vi svarar på alla förfrågningar inom 24 timmar. Tveka inte att höra av dig!
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact info */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Kontaktuppgifter</h2>
              <div className="space-y-4">
                {CONTACT_ITEMS.map((item) => (
                  <a
                    key={item.title}
                    href={item.href}
                    className="flex items-start gap-4 bg-slate-50 rounded-2xl p-5 hover:bg-slate-100 transition-colors"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">
                        {item.title}
                      </div>
                      <div className="font-semibold text-slate-900">{item.value}</div>
                      <div className="text-sm text-slate-500 mt-0.5">{item.sub}</div>
                    </div>
                  </a>
                ))}
              </div>

              <div className="mt-10 bg-blue-50 rounded-2xl p-6">
                <h3 className="font-semibold text-slate-900 mb-2">Vill du ha offert?</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Det snabbaste sättet att få ett pris är via vårt offertformulär.
                </p>
                <Link href="/offert">
                  <Button size="sm">Gå till offertformulär →</Button>
                </Link>
              </div>
            </div>

            {/* Quick form placeholder */}
            <div className="bg-slate-50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Skicka ett meddelande</h2>
              <p className="text-slate-600 text-sm mb-6">
                Har du en specifik fråga? Fyll i formuläret nedan och vi återkommer inom 24 timmar.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Namn</label>
                  <input
                    type="text"
                    placeholder="Ditt namn"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">E-post</label>
                  <input
                    type="email"
                    placeholder="din@email.se"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Meddelande</label>
                  <textarea
                    rows={4}
                    placeholder="Hur kan vi hjälpa dig?"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 resize-none"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  För en offert, använd vårt{" "}
                  <Link href="/offert" className="text-blue-600 hover:underline">
                    offertformulär
                  </Link>{" "}
                  med fler detaljer.
                </p>
                <Button className="w-full">Skicka meddelande</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
