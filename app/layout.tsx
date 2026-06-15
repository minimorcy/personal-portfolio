import './globals.css'
import type { ReactNode } from 'react'
import Script from 'next/script'
import { ThemeProvider } from '@/components/shared/theme-provider'
import Navigation from '@/components/layout/navigation'
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://javiermorcillonuevo.com'),
  title: {
    default: 'Portfolio | minimorcy',
    template: '%s | minimorcy',
  },
  description: 'Full-stack developer portfolio showcasing GitHub projects, open source contributions, and technical skills.',
  keywords: ['portfolio', 'developer', 'full-stack', 'GitHub', 'projects', 'software engineer'],
  authors: [{ name: 'minimorcy' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'minimorcy Portfolio',
    title: 'minimorcy | Developer Portfolio',
    description: 'Full-stack developer portfolio showcasing GitHub projects and technical skills.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'minimorcy | Developer Portfolio',
    description: 'Full-stack developer portfolio showcasing GitHub projects and technical skills.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="font-sans">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors`}>
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <Script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        )}
        <ThemeProvider>
          <Navigation />

          <div className="max-w-5xl mx-auto px-4 py-8">{children}</div>

          {/* Footer */}
          <footer className="border-t border-gray-200 dark:border-gray-800 mt-16">
            <div className="max-w-5xl mx-auto px-4 py-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Navigation</h3>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li><a href="#about" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">About</a></li>
                    <li><a href="#projects" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Projects</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Connect</h3>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li><a href="https://github.com/minimorcy" target="_blank" rel="noreferrer" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">GitHub</a></li>
                    <li><a href="https://linkedin.com/in/minimorcy" target="_blank" rel="noreferrer" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">LinkedIn</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Built With</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Next.js 14 · Tailwind CSS · GitHub API</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">© {new Date().getFullYear()} minimorcy</p>
                </div>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}

