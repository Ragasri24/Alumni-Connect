"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Job = {
  job_id: number;
  title: string;
  company: string;
  type: string;
  location: string;
  work_mode: string;
  description: string;
  application_link: string | null;
  deadline: string;

  alumni_id: number;
  alumni_name: string;
  dept_name: string;
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingJob, setUpdatingJob] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [jobsResponse, applicationsResponse] =
          await Promise.all([
            fetch("/api/jobs"),
            fetch("/api/jobs/applications"),
          ]);

        const jobsData = await jobsResponse.json();
        const applicationsData = await applicationsResponse.json();

        setJobs(jobsData);

        const appliedJobIds = applicationsData.map(
          (application: { job_id: number }) => application.job_id
        );

        setAppliedJobs(appliedJobIds);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  async function toggleApplication(jobId: number) {
    const isApplied = appliedJobs.includes(jobId);

    setUpdatingJob(jobId);

    try {
      const response = await fetch("/api/jobs/applications", {
        method: isApplied ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job_id: jobId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to update application status");
        return;
      }

      if (isApplied) {
        setAppliedJobs((currentJobs) =>
          currentJobs.filter((id) => id !== jobId)
        );
      } else {
        setAppliedJobs((currentJobs) => [
          ...currentJobs,
          jobId,
        ]);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setUpdatingJob(null);
    }
  }

  return (
    <main className="ml-64 min-h-screen bg-gray-50 p-10">

      {/* Page Header */}

      <h1 className="text-3xl font-bold">
        Jobs & Internships
      </h1>

      <p className="mt-2 text-gray-600">
        Explore job and internship opportunities posted by alumni.
      </p>

      {/* Loading */}

      {loading ? (
        <p className="mt-8 text-gray-500">
          Loading opportunities...
        </p>
      ) : jobs.length === 0 ? (
        <p className="mt-8 text-gray-500">
          No jobs or internships are currently available.
        </p>
      ) : (

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {jobs.map((job) => {

            const isApplied = appliedJobs.includes(job.job_id);

            return (
              <div
                key={job.job_id}
                className="rounded-xl bg-white p-6 shadow"
              >

                {/* Job Type */}

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    job.type === "INTERNSHIP"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {job.type}
                </span>

                {/* Title */}

                <h2 className="mt-4 text-xl font-bold">
                  {job.title}
                </h2>

                {/* Company */}

                <p className="mt-1 text-gray-600">
                  {job.company}
                </p>

                {/* Details */}

                <div className="mt-4 space-y-2 text-sm text-gray-600">

                  <p>
                    <span className="font-medium text-gray-800">
                      Location:
                    </span>{" "}
                    {job.location}
                  </p>

                  <p>
                    <span className="font-medium text-gray-800">
                      Work Mode:
                    </span>{" "}
                    {job.work_mode}
                  </p>

                  <p>
                    <span className="font-medium text-gray-800">
                      Deadline:
                    </span>{" "}
                    {new Date(job.deadline).toLocaleDateString()}
                  </p>

                </div>

                {/* Posted By */}

                <div className="mt-4 border-t pt-4">

                  <p className="text-sm text-gray-500">
                    Posted by
                  </p>

                  <Link
                    href={`/alumni/${job.alumni_id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {job.alumni_name}
                  </Link>

                </div>

                {/* Actions */}

                <div className="mt-6 flex flex-wrap gap-3">

                  {job.application_link && (
                    <a
                      href={job.application_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100"
                    >
                      View Opportunity ↗
                    </a>
                  )}

                  <button
                    onClick={() =>
                      toggleApplication(job.job_id)
                    }
                    disabled={updatingJob === job.job_id}
                    className={`rounded-lg px-4 py-2 text-sm font-medium ${
                      isApplied
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "border border-gray-300 hover:bg-gray-100"
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    {updatingJob === job.job_id
                      ? "Updating..."
                      : isApplied
                      ? "● Applied"
                      : "○ Not Applied"}
                  </button>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </main>
  );
}