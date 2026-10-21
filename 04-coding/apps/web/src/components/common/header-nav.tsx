'use client';

import React from 'react';
import Link from 'next/link';
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';

export function HeaderNav() {
  return (
    <nav className="nav" aria-label="Primary navigation">
      <Link href="/" className="brand flex items-center gap-2">
        <span className="text-indigo-600">✦</span>
        <span>Lingora</span>
      </Link>
      <div className="nav-actions">
        <a
          className="button secondary"
          href="/prototype/index.html"
          target="_blank"
          rel="noopener noreferrer"
          title="Xem bản demo HTML Prototype 7 Ngày"
        >
          Bản Prototype 7 Ngày
        </a>
        <a
          className="button secondary"
          href="https://lingora-prototype.vercel.app/stakeholder-hub.html#ai-ops"
          target="_blank"
          rel="noopener noreferrer"
          title="Mở cổng giám sát tiến độ AI Mission Control"
        >
          🤖 AI Control
        </a>
        <Show when="signed-out">
          <SignInButton>
            <button className="button secondary">Sign in</button>
          </SignInButton>
          <SignUpButton>
            <button className="button primary">Get started</button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <Link className="button primary" href="/dashboard">
            Open profile
          </Link>
          <UserButton />
        </Show>
      </div>
    </nav>
  );
}
