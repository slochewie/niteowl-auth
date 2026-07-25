import { Link } from "react-router";

export function meta() {
  return [
    { title: "NiteOwl Auth" },
    { name: "description", content: "NiteOwl identity and access management" },
  ];
}

export default function Home() {
  return (
    <main className="min-h-screen grid place-items-center p-6">
      <section className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
        <p className="font-semibold text-indigo-300">NiteOwl.dev</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">NiteOwl Auth</h1>
        <p className="mt-4 text-white/70">
          BTST full-stack application with Better Auth, organizations, Drizzle, and PostgreSQL.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="rounded-xl bg-indigo-500 px-5 py-3 font-semibold hover:bg-indigo-400" to="/p/auth/sign-in">
            Sign in
          </Link>
          <Link className="rounded-xl border border-white/15 px-5 py-3 font-semibold hover:bg-white/10" to="/p/auth/sign-up">
            Create account
          </Link>
        </div>
      </section>
    </main>
  );
}
