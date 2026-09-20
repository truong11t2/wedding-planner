'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";
import Sidebar from "@/components/navigation/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { rememberReturnTo } from '@/lib/authRedirect';

/** Routes that must never be stored as a post-login destination. */
const NON_RETURNABLE_PREFIXES = ['/login', '/auth'];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();

  // Remember where the user currently is so that signing in — by password or
  // OAuth — brings them back to the same page *and* anchor (for example
  // `/invitation#preview`). Login and OAuth callback routes are skipped so they
  // never overwrite the destination they were reached from.
  useEffect(() => {
    const record = () => {
      const { pathname: currentPath, search, hash } = window.location;
      if (NON_RETURNABLE_PREFIXES.some((prefix) => currentPath.startsWith(prefix))) return;
      rememberReturnTo(`${currentPath}${search}${hash}`);
    };

    record();
    // The invitation builder switches steps through the URL hash, which does not
    // re-render this layout — so listen for it explicitly.
    window.addEventListener('hashchange', record);
    return () => window.removeEventListener('hashchange', record);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSidebarToggle={() => setSidebarOpen(true)} />
      {isLoggedIn && (
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      )}
      
      {/* Main content area with conditional margin */}
      <div className={isLoggedIn ? "lg:ml-64" : ""}>
        <main className="min-h-screen pt-18">
          {/* <div className="max-w-7xl mx-auto"> */}
            {children}
          {/* </div> */}
        </main>
      </div>
      
      {/* Footer with conditional margin */}
      <div className={isLoggedIn ? "lg:ml-64" : ""}>
        <Footer />
      </div>
    </div>
  );
}
