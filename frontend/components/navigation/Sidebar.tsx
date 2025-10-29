'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  X,
  LayoutDashboard,
  Clock,
  CircleCheckBig,
  Users,
  MapPinned,
  Camera,
  CircleDollarSign,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const navigationItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Timeline', href: '/timeline', icon: Clock },
  { name: 'Checklist', href: '/checklist', icon: CircleCheckBig },
  { name: 'Guests', href: '/guests', icon: Users },
  { name: 'Venues', href: '/venues', icon: MapPinned },
  { name: 'Photos', href: '/photos', icon: Camera },
  { name: 'Budget', href: '/budget', icon: CircleDollarSign },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();
  const { user, isLoggedIn } = useAuth();

  // Don't render sidebar if user is not authenticated
  if (!isLoggedIn || !user) {
    return null;
  }

  const SidebarContent = () => (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      {/* Sidebar header */}
      <div className="flex-shrink-0 px-4 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">
          Welcome back {user.fullName}
        </h2>
      </div>
      
      {/* Navigation menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const isCurrentPage = pathname === item.href;
          const IconComponent = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setSidebarOpen(false)} // Close sidebar on mobile when link is clicked
              className={`
                group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                ${
                  isCurrentPage
                    ? 'bg-pink-50 text-pink-700 border-l-4 border-pink-500'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <IconComponent
                className={`
                  mr-3 flex-shrink-0 h-5 w-5 transition-colors
                  ${isCurrentPage ? 'text-pink-500' : 'text-gray-400 group-hover:text-gray-500'}
                `}
              />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      {/* User profile section */}
      <div className="flex-shrink-0 border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center">
              <span className="text-sm font-semibold text-white">
                {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.fullName}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <X className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <SidebarContent />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:pt-16 lg:z-30">
        <div className="border-r border-gray-200 shadow-sm">
          <SidebarContent />
        </div>
      </aside>
    </>
  );
}