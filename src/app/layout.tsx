import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const interSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduVerse - Experimental Developer Learning Laboratory",
  description: "An interactive coding laboratory where students learn programming by breaking, debugging, and understanding code. Python, C++, Web, and AST debugging.",
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
      className={`${interSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
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
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-black text-white">
        {children}
      </body>
    </html>
  );
}
