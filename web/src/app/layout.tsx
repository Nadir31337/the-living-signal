import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#05100F",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://nadirsaidi.dev"),
  title: "Nadir Saidi | Backend & Software Engineering Portfolio",
  description:
    "Fourth-year Software Engineering student at BAU focused on backend development, API reliability, automated testing, and practical AI application integration.",
  keywords: [
    "Nadir Saidi",
    "Software Engineer",
    "Backend Developer",
    "FastAPI",
    "Python",
    "Spring Boot",
    "API Reliability",
    "Istanbul",
    "Internship",
  ],
  authors: [{ name: "Nadir Saidi" }],
  creator: "Nadir Saidi",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nadirsaidi.dev",
    siteName: "Nadir Saidi Portfolio",
    title: "Nadir Saidi | Backend & Software Engineering",
    description: "I build backends that stay awake so others can sleep.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nadir Saidi - The Living Signal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nadir Saidi | Backend & Software Engineering",
    description: "I build backends that stay awake so others can sleep.",
    creator: "@Nadir31337",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-signal-bg text-signal-mist antialiased selection:bg-signal-teal/20 selection:text-signal-lime">
        {children}
      </body>
    </html>
  );
}
