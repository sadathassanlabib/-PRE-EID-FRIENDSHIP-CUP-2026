import Navbar from './components/navber'
import './globals.css'
 // Make sure this path is correct

export const metadata = {
  title: 'Pre-Eid Friendship Cup 2026',
  description: 'Tournament management system for Friendship Cup 2026',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <footer className="text-center py-6 text-gray-500 text-sm border-t border-white/10">
          <p>© 2026 Pre-Eid Friendship Cup. All rights reserved.</p>
        </footer>
      </body>
    </html>
  )
}