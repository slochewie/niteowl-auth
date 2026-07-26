import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 p-8">
      <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">NiteOwl</p>
      <h1 className="text-5xl font-semibold">Authentication administration</h1>
      <p className="max-w-xl text-lg text-zinc-300">
        BTST provides the application UI. Better Auth runs as a separate service.
      </p>
      <div className="flex gap-3">
        <Link className="rounded-md bg-white px-4 py-2 text-black" href="/p/auth/sign-in">
          Sign in
        </Link>
        <Link className="rounded-md border border-zinc-700 px-4 py-2" href="/p/auth/sign-up">
          Create account
        </Link>
      </div>
    </main>
  );
}
