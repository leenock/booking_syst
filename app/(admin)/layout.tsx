import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin-layout">
      <nav>Admin Navigation</nav>
      <main>{children}</main>
    </div>
  );
}
