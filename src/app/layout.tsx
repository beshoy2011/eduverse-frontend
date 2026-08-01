import type { Metadata } from "next";
import { Sora, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "EduVerse - The Future Starts Here | Build Your AI Startup",
  description: "The world's most advanced AI innovation ecosystem where students become founders, engineers, researchers, and creators. Learn. Build. Launch. Win.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sora.variable} ${inter.variable} ${spaceGrotesk.variable} dark h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  document.documentElement.classList.add('dark');
                  localStorage.setItem('theme', 'dark');
                  var savedLang = localStorage.getItem('eduverse_lang');
                  if (savedLang === 'ar') {
                    document.documentElement.dir = 'rtl';
                    document.documentElement.lang = 'ar';
                  } else {
                    document.documentElement.dir = 'ltr';
                    document.documentElement.lang = 'en';
                  }
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#030712] text-slate-100 font-sans selection:bg-[#00E5FF]/30 selection:text-[#00E5FF]">
        {children}
      </body>
    </html>
  );
}

