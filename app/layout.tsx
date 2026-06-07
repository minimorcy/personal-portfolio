import './globals.css'
import type { ReactNode } from 'react'
import { ThemeProvider } from './components/ThemeProvider'
import ThemeToggle from './components/ThemeToggle'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        <ThemeProvider>
          <nav className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
            <span>My Portfolio</span>
            <ThemeToggle />
          </nav>
          <div className="max-w-4xl mx-auto p-4">{children}</div>
          <footer className="p-4 border-t dark:border-gray-700 text-center">© {new Date().getFullYear()}</footer>
        </ThemeProvider>
      </body>
    </html>
  );
}

