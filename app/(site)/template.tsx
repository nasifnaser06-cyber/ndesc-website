// A template remounts on every navigation, so each page's arrival animation plays again,
// including between two pages of the same kind (one event page to another).
export default function Template({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
