import '@/app/globals.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="relative flex min-h-screen flex-col overflow-x-hidden">
        {children}
      </div>
    </>
  );
}
