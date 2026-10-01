"use client";

import { useEffect, useState } from "react";

type IncomingRequest = {
  request_id: number;
  message: string;
  status: string;
  created_at: string;
  responded_at: string | null;

  student_id: number;
  student_name: string;
  rollno: string;
  current_year: number;
  batch: number;
  section: string;
  email: string;
  dept_name: string;
};

export default function IncomingMentorshipPage() {
  const [requests, setRequests] = useState<IncomingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRequests() {
      try {
        const response = await fetch("/api/mentorship/incoming");
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
        Mentorship Requests
      </h1>

      <p className="mt-2 text-gray-600">
        View mentorship requests sent to you by students.
      </p>

      {/* Requests */}

      {loading ? (
        <p className="mt-8 text-gray-500">
          Loading requests...
        </p>
      ) : requests.length === 0 ? (
        <p className="mt-8 text-gray-500">
          You have no incoming mentorship requests.
        </p>
      ) : (
        <div className="mt-8 space-y-6">

          {requests.map((request) => (
            <div
              key={request.request_id}
              className="rounded-xl bg-white p-6 shadow"
            >

              {/* Student Information */}

              <div className="flex items-start justify-between">

                <div>

                  <h2 className="text-xl font-bold">
                    {request.student_name}
                  </h2>

                  <p className="mt-1 text-gray-600">
                    {request.dept_name} • Year {request.current_year}
                  </p>

                </div>

                <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                  {request.status}
                </span>

              </div>

              {/* Student Details */}

              <div className="mt-4 grid gap-2 text-sm text-gray-600 md:grid-cols-2">

                <p>
                  <span className="font-medium text-gray-800">
                    Roll No:
                  </span>{" "}
                  {request.rollno}
                </p>

                <p>
                  <span className="font-medium text-gray-800">
                    Batch:
                  </span>{" "}
                  {request.batch}
                </p>

                <p>
                  <span className="font-medium text-gray-800">
                    Section:
                  </span>{" "}
                  {request.section}
                </p>

                <p>
                  <span className="font-medium text-gray-800">
                    Email:
                  </span>{" "}
                  {request.email}
                </p>

              </div>

              {/* Message */}

              <div className="mt-5 rounded-lg bg-gray-50 p-4">

                <p className="text-sm font-medium text-gray-800">
                  Message
                </p>

                <p className="mt-2 text-gray-700">
                  {request.message}
                </p>

              </div>

              {/* Request Date */}

              <p className="mt-4 text-sm text-gray-500">
                Requested on{" "}
                {new Date(request.created_at).toLocaleDateString()}
              </p>

              {/* Buttons will be added next */}

            </div>
          ))}

        </div>
      )}

    </main>
  );
}