import { ProfileCard } from '@/features/profile/profile-card';

export default function DashboardPage() {
  return (
    <main className="page-shell narrow">
      <header className="section-heading">
        <p className="eyebrow">Foundation & identity</p>
        <h1>Your Lingora profile</h1>
        <p>Profile details are attached to your Lingora learner identity—not your authentication provider ID.</p>
      </header>
      <ProfileCard />
    </main>
  );
}
