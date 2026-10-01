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
  const [responding, setResponding] = useState<number | null>(null);

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

  async function respondToRequest(
    requestId: number,
    status: "ACCEPTED" | "REJECTED"
  ) {
    setResponding(requestId);

    try {
      const response = await fetch("/api/mentorship/respond", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          request_id: requestId,
          status: status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to respond to request");
        return;
      }

      setRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.request_id === requestId
            ? {
                ...request,
                status: status,
                responded_at: data.request.responded_at,
              }
            : request
        )
      );
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setResponding(null);
    }
  }

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

                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${
                    request.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : request.status === "ACCEPTED"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
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

              {/* Response Date */}

              {request.responded_at && (
                <p className="mt-2 text-sm text-gray-500">
                  Responded on{" "}
                  {new Date(request.responded_at).toLocaleDateString()}
                </p>
              )}

              {/* Accept / Reject Buttons */}

              {request.status === "PENDING" && (
                <div className="mt-6 flex gap-3">

                  <button
                    onClick={() =>
                      respondToRequest(
                        request.request_id,
                        "ACCEPTED"
                      )
                    }
                    disabled={responding === request.request_id}
                    className="rounded-lg bg-green-600 px-5 py-2 font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {responding === request.request_id
                      ? "Processing..."
                      : "Accept"}
                  </button>

                  <button
                    onClick={() =>
                      respondToRequest(
                        request.request_id,
                        "REJECTED"
                      )
                    }
                    disabled={responding === request.request_id}
                    className="rounded-lg bg-red-600 px-5 py-2 font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {responding === request.request_id
                      ? "Processing..."
                      : "Reject"}
                  </button>

                </div>
              )}

            </div>
          ))}

        </div>
      )}

    </main>
  );
}