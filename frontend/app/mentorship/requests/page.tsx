"use client";

import { useEffect, useState } from "react";

type MentorshipRequest = {
  request_id: number;
  message: string;
  status: string;
  created_at: string;
  responded_at: string | null;
  alumni_id: number;
  alumni_name: string;
  company: string;
  job_role: string;
};

export default function MentorshipRequestsPage() {
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRequests() {
      try {
        const response = await fetch("/api/mentorship/requests");
        const data = await response.json();

        setRequests(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchRequests();
  }, []);

  return (
    <main className="ml-64 min-h-screen bg-gray-50 p-10">

      {/* Page Header */}

      <h1 className="text-3xl font-bold">
        My Mentorship Requests
      </h1>

      <p className="mt-2 text-gray-600">
        Track the mentorship requests you have sent to alumni.
      </p>

      {loading ? (
        <p className="mt-8 text-gray-500">
          Loading requests...
        </p>
      ) : requests.length === 0 ? (
        <p className="mt-8 text-gray-500">
          You have not sent any mentorship requests yet.
        </p>
      ) : (
        <div className="mt-8 space-y-4">

          {requests.map((request) => (
            <div
              key={request.request_id}
              className="rounded-xl bg-white p-6 shadow"
            >

              <div className="flex items-start justify-between">

                <div>

                  <h2 className="text-xl font-bold">
                    {request.alumni_name}
                  </h2>

                  <p className="mt-1 text-gray-600">
                    {request.job_role} at {request.company}
                  </p>

                </div>

                <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                  {request.status}
                </span>

              </div>

              <p className="mt-4 text-gray-700">
                {request.message}
              </p>

              <p className="mt-3 text-sm text-gray-500">
                Requested on{" "}
                {new Date(request.created_at).toLocaleDateString()}
              </p>

            </div>
          ))}

        </div>
      )}

    </main>
  );
}