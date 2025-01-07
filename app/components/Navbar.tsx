'use client';
import { UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Layers } from 'lucide-react';
import React, { useEffect } from 'react';
import { checkAndAddUser } from '../actions';

const Navbar = () => {
  const pathname = usePathname();
  const { user } = useUser();

  const navLinks = [
    {
      href: '/',
      label: 'Factures',
    },
  ];

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress && user.fullName) {
      checkAndAddUser(user?.primaryEmailAddress?.emailAddress, user.fullName);
    }
  }, [user]);

  const isActiveLink = (href: string) =>
    pathname.replace(/\/$/, '') === href.replace(/\/$/, '');

  const renderLinks = (classNames: string) =>
    navLinks.map(({ href, label }) => {
      return (
        <Link
          href={href}
          key={href}
          className={`btn-sm ${classNames} ${isActiveLink(href) ? 'btn-accent' : ''}`}
        >
          {label}
        </Link>
      );
    });

  return (
    <div className="border-b border-base-300 px-5 py-4 md:px-[10%]">
      <div className="flex items-center justify-between">
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

        <div className="flex items-center space-x-4">
          {renderLinks('btn')}
          <UserButton />
        </div>
      </div>

      <div></div>
    </div>
  );
};

export default Navbar;
