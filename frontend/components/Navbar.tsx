export default function Navbar() {
  return (
    <nav className="fixed left-0 top-0 flex h-screen w-64 flex-col bg-gray-900 p-6 text-white">
      <h1 className="text-2xl font-bold">
        Alumni Connect
      </h1>

      <p className="mt-1 text-sm text-gray-400">
        College Alumni Network
      </p>

      <div className="mt-10 flex flex-col gap-3">
        <a
          href="/"
          className="rounded-lg px-4 py-3 hover:bg-gray-800"
        >
          Home
        </a>

        <a
          href="/alumni"
          className="rounded-lg px-4 py-3 hover:bg-gray-800"
        >
          Alumni
        </a>

        <a
          href="/mentorship"
          className="rounded-lg px-4 py-3 hover:bg-gray-800"
        >
          Mentorship
        </a>

        <a
          href="/jobs"
          className="rounded-lg px-4 py-3 hover:bg-gray-800"
        >
          Jobs & Internships
        </a>

        <a
          href="/events"
          className="rounded-lg px-4 py-3 hover:bg-gray-800"
        >
          Events
        </a>
      </div>

      <div className="mt-auto">
        <a
          href="/login"
          className="block rounded-lg px-4 py-3 hover:bg-gray-800"
        >
          Login
        </a>
      </div>
    </nav>
  );
}