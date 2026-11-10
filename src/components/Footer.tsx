export function Footer() {
  return (
    <footer
      className="h-10 flex items-center justify-between px-6 flex-shrink-0 text-xs"
      style={{
        backgroundColor: 'var(--bg-topbar)',
        borderTop: '1px solid var(--border)',
        color: 'var(--text-muted)',
      }}
    >
      <span>&copy; {new Date().getFullYear()} G-AMS &mdash; Asset Management System</span>
      <span>v1.0.0</span>
    </footer>
  );
}
