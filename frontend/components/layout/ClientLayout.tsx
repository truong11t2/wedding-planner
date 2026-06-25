'use client';

import { useState } from 'react';
import Header from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";
import Sidebar from "@/components/navigation/Sidebar";
import { useAuth } from "@/context/AuthContext";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isLoggedIn } = useAuth();

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
