import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Prototype MVP — Lingora',
  description: 'Interactive prototype for Week 1 (Me & My English): explore daily learning flow, Starting Point Check, and evidence-driven signals.',
};

export default function PrototypePage() {
  return (
    <main className="prototype-host-page" id="main-content">
      <header className="prototype-host-bar">
        <div className="prototype-host-left">
          <Link className="prototype-back-link" href="/dashboard" aria-label="Back to Lingora Dashboard">
            <span aria-hidden="true">←</span> Back to Dashboard
          </Link>
          <span className="prototype-badge" role="status">Prototype MVP</span>
          <span className="prototype-title">Week 1: Me &amp; My English</span>
        </div>
        <div className="prototype-host-actions">
          <a
            className="prototype-external-link"
            href="/prototype/index.html"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open prototype in full window (opens in new tab)"
          >
            Open in new window <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      <section className="prototype-frame-container" aria-label="Interactive Prototype Simulation">
        <iframe
          className="prototype-frame"
          src="/prototype/index.html"
          title="Lingora Week 1 Interactive Prototype"
          allow="microphone"
        />
      </section>
    </main>
  );
}
