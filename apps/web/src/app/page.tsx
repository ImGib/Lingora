import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="page-shell">
      <nav className="nav" aria-label="Primary navigation">
        <span className="brand">Lingora</span>
        <div className="nav-actions">
          <Show when="signed-out">
            <SignInButton><button className="button secondary">Sign in</button></SignInButton>
            <SignUpButton><button className="button primary">Get started</button></SignUpButton>
          </Show>
          <Show when="signed-in">
            <Link className="button primary" href="/dashboard">Open profile</Link>
            <UserButton />
          </Show>
        </div>
      </nav>
      <section className="hero">
        <p className="eyebrow">Your soft study companion</p>
        <h1>Build English steadily, with a clear next step.</h1>
        <p className="lede">
          Lingora keeps your learning identity stable and your profile private while you move from foundations toward IELTS and study-abroad readiness.
        </p>
        <Show when="signed-out">
          <SignUpButton><button className="button primary large">Start gently</button></SignUpButton>
        </Show>
        <Show when="signed-in">
          <Link className="button primary large" href="/dashboard">Continue</Link>
        </Show>
      </section>
    </main>
  );
}
