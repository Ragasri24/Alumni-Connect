"use client";

import { useEffect, useState } from "react";

type DashboardStats = {
  total_students: string;
  total_alumni: string;
  total_faculty: string;
  total_jobs: string;
  total_events: string;
  total_mentorship_requests: string;
  total_job_applications: string;
  total_event_registrations: string;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/admin/dashboard");
        const data = await response.json();

        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <main className="ml-64 min-h-screen bg-gray-50 p-8">
        <p className="text-gray-600">
          Loading dashboard...
        </p>
      </main>
    );
  }

  if (!stats) {
    return (
      <main className="ml-64 min-h-screen bg-gray-50 p-8">
        <p className="text-red-600">
          Failed to load dashboard.
        </p>
      </main>
    );
  }

  const cards = [
    {
      title: "Students",
      value: stats.total_students,
    },
    {
      title: "Alumni",
      value: stats.total_alumni,
    },
    {
      title: "Faculty",
      value: stats.total_faculty,
    },
    {
      title: "Jobs & Internships",
      value: stats.total_jobs,
    },
    {
      title: "Events",
      value: stats.total_events,
    },
    {
      title: "Mentorship Requests",
      value: stats.total_mentorship_requests,
    },
    {
      title: "Job Applications",
      value: stats.total_job_applications,
    },
    {
      title: "Event Registrations",
      value: stats.total_event_registrations,
    },
  ];

  return (
    <main className="ml-64 min-h-screen bg-gray-50 p-8">
      {/* Header */}
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
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-lg bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-gray-600">
              {card.title}
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}