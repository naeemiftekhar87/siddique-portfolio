import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata } from "next";
import {
  DM_Serif_Display,
  Inter,
  JetBrains_Mono,
  Plus_Jakarta_Sans,
} from "next/font/google";
import "./globals.css";

// Font system from docs/design.md: display (headings), sans (body), mono (data).
const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

// Site-wide defaults. The owner's name and per-page SEO come from the
// Profile and SEO data once those exist (Phases 1 and 6).
export const metadata: Metadata = {
  title: {
    default: "Academic & Professional Portfolio",
    template: "%s | Portfolio",
  },
  description:
    "Research, publications, experience, certificates, eBooks, and resume.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${dmSerif.variable} ${plusJakarta.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
