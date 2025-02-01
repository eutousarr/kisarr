'use client';
import Link from 'next/link';
import { useState } from 'react';
import { UserButton, useUser } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';
import { checkAndAddUser } from '../actions/actions';
import { Layers } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Navigation items array
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: 'Catégories', href: '/blog/categories' },
    { name: 'Contact', href: '/blog/contact' },
    { name: 'Tâches', href: '/taches' },
    { name: 'Factures', href: '/invoice' },
  ];

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress && user.fullName) {
      checkAndAddUser(user?.primaryEmailAddress?.emailAddress, user.fullName);
    }
  }, [user]);

  const isActiveLink = (href: string) =>
    pathname.replace(/\/$/, '') === href.replace(/\/$/, '');
  const renderLinks = (classNames: string) =>
    navItems.map(({ href, name }) => {
      return (
        <Link
          href={href}
          key={href}
          className={`btn-sm ${classNames} ${isActiveLink(href) ? 'btn-accent' : ''}`}
        >
          {name}
        </Link>
      );
    });
  return (
    <div>
      <nav className="max-w-screen sticky top-3 z-[9999] mx-auto block w-full bg-white bg-opacity-90 px-4 py-4 shadow backdrop-blur-lg backdrop-saturate-150 lg:px-8">
        <div className="container mx-auto flex flex-wrap items-center justify-between text-slate-800">
          <div className="flex items-center">
            <div className="rounded-full bg-accent-content p-2 text-accent">
              <Layers className="h-6 w-6" />
            </div>
            <span className="z-50 ml-3 text-2xl font-bold italic">
              Kis@rr<span className="text-orange-500">Web</span>
            </span>
            <Image
              src="/taureau1.png"
              width={56}
              height={56}
              alt="Logo Kis@rrw3b"
              className="z-0 ml-[-10] rounded-3xl"
            />
          </div>

          <div className="lg:hidden">
            <button
              className="relative ml-auto h-6 max-h-[40px] w-6 max-w-[40px] select-none rounded-lg text-center align-middle text-xs font-medium uppercase text-inherit transition-all hover:bg-transparent focus:bg-transparent active:bg-transparent disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              onClick={toggleMobileMenu}
              type="button"
            >
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </span>
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`fixed left-0 top-0 min-h-screen w-64 transform bg-slate-100 shadow-lg transition-transform duration-300 ease-in-out ${
              isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            } z-50 lg:hidden`}
          >
            <div className="flex flex-row items-center border-b pb-4">
              <div className="flex items-center mt-4">
                <div className="rounded-full bg-accent-content p-2 text-accent">
                  <Layers className="h-6 w-6" />
                </div>
                <span className="z-50 ml-3 text-2xl font-bold italic">
                  Kis@rr<span className="text-orange-500">Web</span>
                </span>
                {/* <Image
                  src="/taureau1.png"
                  width={56}
                  height={56}
                  alt="Logo Kis@rrw3b"
                  className="z-0 ml-[-10] rounded-3xl"
                /> */}
              </div>
              <button
                onClick={toggleMobileMenu}
                className="absolute right-4 top-4 text-slate-600 hover:text-red-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex flex-col items-start space-y-4 p-4">
              {renderLinks('btn  w-full')}
              <UserButton />
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:block">
            <div className="flex items-center space-x-4">
              {renderLinks('btn')}
              <UserButton />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
