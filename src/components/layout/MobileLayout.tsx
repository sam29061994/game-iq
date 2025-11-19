import { ReactNode } from "react";

interface MobileLayoutProps {
  children: ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Safe area for mobile devices */}
      <div className="pb-safe">
        {children}
      </div>
    </div>
  );
}
