// This layout wraps all (admin) routes.
// Auth protection is applied at the dashboard level — see admin/dashboard/layout.tsx
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
