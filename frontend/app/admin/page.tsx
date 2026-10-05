"use client";

import { useEffect, useState } from "react";

type DashboardStats = {
  total_students: number;
  total_alumni: number;
  total_faculty: number;
  total_jobs: number;
  total_events: number;
  total_mentorship_requests: number;
  total_job_applications: number;
  total_event_registrations: number;
};

type UpcomingEvent = {
  event_id: number;
  title: string;
  event_type: string;
  start_time: string;
  location: string;
  faculty_name: string;
};

type RecentJob = {
  job_id: number;
  title: string;
  company: string;
  type: string;
  location: string;
  deadline: string;
  alumni_name: string;
};

type DashboardData = {
  stats: DashboardStats;
  upcomingEvents: UpcomingEvent[];
  recentJobs: RecentJob[];
};

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await fetch("/api/admin/dashboard");

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard");
        }

        const result = await response.json();

        setData(result);
      } catch (error) {
        console.error(error);
        setError("Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <main className="ml-64 min-h-screen bg-gray-50 p-8">
        <p className="text-gray-600">Loading dashboard...</p>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="ml-64 min-h-screen bg-gray-50 p-8">
        <p className="text-red-600">
          {error || "Failed to load dashboard."}
        </p>
      </main>
    );
  }

  const stats = [
    {
      title: "Students",
      value: data.stats.total_students,
    },
    {
      title: "Alumni",
      value: data.stats.total_alumni,
    },
    {
      title: "Faculty",
      value: data.stats.total_faculty,
    },
    {
      title: "Jobs & Internships",
      value: data.stats.total_jobs,
    },
    {
      title: "Events",
      value: data.stats.total_events,
    },
    {
      title: "Mentorship Requests",
      value: data.stats.total_mentorship_requests,
    },
    {
      title: "Job Applications",
      value: data.stats.total_job_applications,
    },
    {
      title: "Event Registrations",
      value: data.stats.total_event_registrations,
    },
  ];

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatTime(date: string) {
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <main className="ml-64 min-h-screen bg-gray-50 p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Admin Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-600">
          Overview of the Alumni Connect platform.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-lg bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-gray-600">
              {stat.title}
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Upcoming Events */}
      <section className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Upcoming Events
        </h2>

        {data.upcomingEvents.length === 0 ? (
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-600">
              No upcoming events.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.upcomingEvents.map((event) => (
              <div
                key={event.event_id}
                className="rounded-lg bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {event.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-600">
                      {event.event_type} · {event.location}
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      Organized by {event.faculty_name}
                    </p>
                  </div>

                  <div className="text-sm text-gray-700 sm:text-right">
                    <p>{formatDate(event.start_time)}</p>
                    <p>{formatTime(event.start_time)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent Jobs */}
      <section className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Recent Jobs & Internships
        </h2>

        {data.recentJobs.length === 0 ? (
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-600">
              No jobs or internships available.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.recentJobs.map((job) => (
              <div
                key={job.job_id}
                className="rounded-lg bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {job.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-600">
                      {job.company} · {job.type}
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      {job.location} · Posted by {job.alumni_name}
                    </p>
                  </div>

                  <div className="text-sm text-gray-700 sm:text-right">
                    <p className="text-gray-500">
                      Deadline
                    </p>
                    <p>{formatDate(job.deadline)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}