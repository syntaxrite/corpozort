export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-2xl font-bold text-gray-900 tracking-tight">
            Corpo<span className="text-indigo-600">zort</span>
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
