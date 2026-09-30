"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Mentor = {
  alumni_id: number;
  name: string;
  batch: number;
  company: string;
  job_role: string;
  location: string;
  skills: string;
  linkedin: string;
  dept_id: number;
  dept_name: string;
};

export default function MentorshipPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMentors() {
      try {
        const response = await fetch("/api/mentorship/available");
        const data = await response.json();

        setMentors(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchMentors();
  }, []);

  return (
    <main className="ml-64 min-h-screen bg-gray-50 p-10">

      {/* Page Header */}

      <h1 className="text-3xl font-bold">
        Find a Mentor
      </h1>

      <p className="mt-2 text-gray-600">
        Connect with alumni who are willing to guide and mentor students.
      </p>

      {/* Alumni Willing to Mentor */}

      <section className="mt-10">

        <h2 className="text-2xl font-bold">
          Alumni Willing to Mentor
        </h2>

        {loading ? (
          <p className="mt-5 text-gray-500">
            Loading mentors...
          </p>
        ) : mentors.length === 0 ? (
          <p className="mt-5 text-gray-500">
            No alumni are currently available for mentorship.
          </p>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {mentors.map((mentor) => (
              <div
                key={mentor.alumni_id}
                className="rounded-xl bg-white p-6 shadow"
              >

                <h3 className="text-xl font-bold">
                  {mentor.name}
                </h3>

                <p className="mt-1 text-gray-600">
                  {mentor.job_role} at {mentor.company}
                </p>

                <p className="mt-3 text-sm text-gray-500">
                  {mentor.dept_name} • Batch {mentor.batch}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  {mentor.location}
                </p>

                {/* Skills */}

                <div className="mt-4 flex flex-wrap gap-2">

                  {mentor.skills
                    .split(",")
                    .map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                      >
                        {skill.trim()}
                      </span>
                    ))}

                </div>

                {/* Buttons */}

                <div className="mt-6 flex gap-3">

                  <Link
                    href={`/alumni/${mentor.alumni_id}`}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100"
                  >
                    View Profile
                  </Link>

                  <Link
                    href={`/alumni/${mentor.alumni_id}`}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Request Mentorship
                  </Link>

                </div>

              </div>
            ))}

          </div>
        )}

      </section>

    </main>
  );
}