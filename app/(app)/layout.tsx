import BottomNav from '@/components/BottomNav';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mobile-frame pb-24">
      {children}
      <BottomNav />
    </div>
  );
}
