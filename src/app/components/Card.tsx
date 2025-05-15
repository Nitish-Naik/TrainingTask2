
export function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl shadow-md p-6 bg-white">{children}</div>;
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
