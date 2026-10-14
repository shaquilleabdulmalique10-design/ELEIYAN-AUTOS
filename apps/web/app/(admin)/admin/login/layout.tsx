// Login page uses the root layout directly — no auth guard, no sidebar
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
