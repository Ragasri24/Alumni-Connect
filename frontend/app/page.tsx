export default function Home() {
  return (
    <main className="ml-64 min-h-screen bg-gray-100 p-10">
      
      {/* Welcome Section */}
      <section>
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome to Alumni Connect
        </h1>

        <p className="mt-2 text-gray-600">
          Connect with alumni, find mentors, explore opportunities,
          and participate in college events.
        </p>
      </section>

      {/* Quick Stats */}
      <section className="mt-10 grid grid-cols-3 gap-6">
        
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-3xl font-bold">1,200+</h2>
          <p className="mt-2 text-gray-500">Alumni</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-3xl font-bold">350+</h2>
          <p className="mt-2 text-gray-500">Mentorships</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-3xl font-bold">80+</h2>
          <p className="mt-2 text-gray-500">Opportunities</p>
        </div>

      </section>

      {/* Quick Actions */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-gray-900">
          Quick Actions
        </h2>

        <div className="mt-5 grid grid-cols-3 gap-6">

          <a
            href="/alumni"
            className="rounded-xl bg-white p-6 shadow hover:shadow-lg"
          >
            <h3 className="text-xl font-semibold">
              Find Alumni
            </h3>
            <p className="mt-2 text-gray-500">
              Search and connect with alumni.
            </p>
          </a>

          <a
            href="/mentorship"
            className="rounded-xl bg-white p-6 shadow hover:shadow-lg"
          >
            <h3 className="text-xl font-semibold">
              Find a Mentor
            </h3>
            <p className="mt-2 text-gray-500">
              Get guidance from experienced alumni.
            </p>
          </a>

          <a
            href="/jobs"
            className="rounded-xl bg-white p-6 shadow hover:shadow-lg"
          >
            <h3 className="text-xl font-semibold">
              Explore Opportunities
            </h3>
            <p className="mt-2 text-gray-500">
              Find jobs and internships shared by alumni.
            </p>
          </a>

        </div>
      </section>

      {/* Upcoming Events */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-gray-900">
          Upcoming Events
        </h2>

        <div className="mt-5 rounded-xl bg-white p-6 shadow">
          <h3 className="text-xl font-semibold">
            Career Guidance Session
          </h3>

          <p className="mt-2 text-gray-500">
            October 20, 2026 · CBIT Seminar Hall
          </p>

          <p className="mt-3 text-gray-600">
            Meet alumni and learn about careers, placements,
            and industry opportunities.
          </p>
        </div>
      </section>

    </main>
  );
}