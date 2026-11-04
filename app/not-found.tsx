import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-4 py-12 text-center text-ink">
      <h1 className="font-serif text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-sm text-ink-soft">The page you asked for does not exist or has moved.</p>
      <Link href="/" className="btn-primary">
        Back to Today
      </Link>
    </div>
  );
}
