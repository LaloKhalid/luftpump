import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Luftpump AB – Installation av luftvärmepumpar",
    template: "%s | Luftpump AB",
  },
  description:
    "Professionell installation, service och underhåll av luftvärmepumpar. Certifierade tekniker i hela Sverige. Få en kostnadsfri offert idag!",
  keywords: [
    "luftvärmepump",
    "installation luftvärmepump",
    "luftvärmepump Stockholm",
    "värmepump",
    "energibesparning",
    "ROT-avdrag",
  ],
  openGraph: {
    title: "Luftpump AB – Installation av luftvärmepumpar",
    description:
      "Professionell installation och service av luftvärmepumpar. Certifierade tekniker. ROT-avdrag.",
    type: "website",
    locale: "sv_SE",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" className="h-full">
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
