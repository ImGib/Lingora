'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';

export function HeaderNav() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/dashboard', label: 'Bàn học (Today)', icon: '📖' },
    { href: '/roadmap', label: 'Lộ trình 4 Mốc', icon: '🗺️' },
    { href: '/lab/ipa', label: 'Lab 44 Âm IPA', icon: '👄' },
    { href: '/lab/grammar', label: 'Masterclass Ngữ pháp', icon: '⚡' },
    { href: '/prototype', label: 'Bản Prototype', icon: '🚀' },
  ];

  return (
    <nav className="unified-nav" aria-label="Primary navigation">
      {/* Brand */}
      <Link href="/" className="unified-nav-brand" aria-label="Lingora trang chủ">
        <span className="brand-sparkle" aria-hidden="true">✦</span>
        <span>Lingora<span className="brand-period">.</span></span>
      </Link>

      {/* Center Unified Links (Desktop / Tablet) */}
      <div className="unified-nav-center" role="navigation">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`unified-nav-link ${isActive ? 'is-active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span aria-hidden="true">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Right Actions / Auth */}
      <div className="unified-nav-right">
        <Show when="signed-out">
          <SignInButton>
            <button className="button secondary text-xs px-3.5 py-2">Đăng nhập</button>
          </SignInButton>
          <SignUpButton>
            <button className="button primary text-xs px-4 py-2">Bắt đầu ngay</button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <Link className="button secondary text-xs px-3 py-1.5 hidden sm:inline-flex" href="/dashboard">
            Bàn học
          </Link>
          <UserButton />
        </Show>
      </div>
    </nav>
  );
}
