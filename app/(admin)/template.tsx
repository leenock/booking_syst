import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Vicarage Resorts',
  description: 'Admin dashboard for managing Vicarage Resorts',
};

export default function AdminTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 