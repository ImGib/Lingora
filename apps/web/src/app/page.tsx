import { Show, SignUpButton } from '@clerk/nextjs';
import Link from 'next/link';
import { HeaderNav } from '@/components/common/header-nav';

export default function HomePage() {
  return (
    <main className="page-shell">
      <HeaderNav />
      <section className="hero">
        <p className="eyebrow">Your soft study companion</p>
        <h1>Build English steadily, with a clear next step.</h1>
        <p className="lede">
          Lingora keeps your learning identity stable and your profile private while you move from foundations toward IELTS and study-abroad readiness.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Show when="signed-out">
            <SignUpButton><button className="button primary large">Start gently</button></SignUpButton>
          </Show>
          <Show when="signed-in">
            <Link className="button primary large" href="/dashboard">Continue</Link>
          </Show>
          <a className="button secondary large" href="/prototype/index.html">
            🚀 Trải nghiệm ngay Prototype (Không cần đăng nhập)
          </a>
        </div>
      </section>
    </main>
  );
}
