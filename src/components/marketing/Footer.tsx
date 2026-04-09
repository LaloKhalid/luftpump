import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-white">Luftpump AB</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Din pålitliga partner för installation och service av luftvärmepumpar i Sverige. Certifierade tekniker, snabb service.
            </p>
            <div className="mt-4 space-y-1 text-sm">
              <a href="tel:+46701234567" className="block hover:text-white transition-colors">
                📞 +46 70 123 45 67
              </a>
              <a href="mailto:info@luftpump.se" className="block hover:text-white transition-colors">
                ✉️ info@luftpump.se
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Tjänster</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/tjanster" className="hover:text-white transition-colors">Installation</Link></li>
              <li><Link href="/tjanster" className="hover:text-white transition-colors">Service & underhåll</Link></li>
              <li><Link href="/tjanster" className="hover:text-white transition-colors">Rådgivning</Link></li>
              <li><Link href="/priser" className="hover:text-white transition-colors">Priser</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Företag</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/om-oss" className="hover:text-white transition-colors">Om oss</Link></li>
              <li><Link href="/kontakt" className="hover:text-white transition-colors">Kontakt</Link></li>
              <li><Link href="/offert" className="hover:text-white transition-colors">Få offert</Link></li>
              <li><Link href="/boka" className="hover:text-white transition-colors">Boka besök</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Luftpump AB. Alla rättigheter förbehållna.
          </p>
          <div className="flex gap-4 text-xs text-slate-500">
            <span>ROT-avdrag godkänt</span>
            <span>•</span>
            <span>F-skattsedel</span>
            <span>•</span>
            <span>Certifierade installatörer</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
