"use client";

import { useEffect, useState } from "react";

type Alumni = {
  alumni_id: number;
  name: string;
  batch: number;
  rollno: string;
  section: string;
  email: string;
  gender: string;
  location: string;
  company: string;
  job_role: string;
  skills: string;
  mentorships_done: number;
  linkedin: string;
  past_job_roles: string;
  events_attended: number;
  dept_id: number;
  dept_name: string;
};

export default function AlumniProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [alumni, setAlumni] = useState<Alumni | null>(null);
  const [loading, setLoading] = useState(true);

  const [showMentorshipForm, setShowMentorshipForm] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function fetchAlumni() {
      const { id } = await params;

      const response = await fetch(`/api/alumni/${id}`);
      const data = await response.json();

      setAlumni(data);
      setLoading(false);
    }

    fetchAlumni();
  }, [params]);

  async function sendMentorshipRequest() {
  if (!message.trim() || !alumni) {
    return;
  }

  setSending(true);
  setSuccessMessage("");

  try {
    const response = await fetch("/api/mentorship", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        student_id: 1,
        alumni_id: alumni.alumni_id,
        message: message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Failed to send request");
      return;
    }

    setSuccessMessage("Mentorship request sent successfully!");
    setMessage("");
    setShowMentorshipForm(false);
  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  } finally {
    setSending(false);
  }
}

  if (loading) {
    return (
      <main className="ml-64 min-h-screen bg-gray-100 p-10">
        <p className="text-gray-600">
          Loading profile...
        </p>
      </main>
    );
  }

if (!alumni) {
  return (
    <main className="ml-64 min-h-screen bg-gray-100 p-10">
      <p className="text-gray-600">
        Alumni profile not found.
      </p>
    </main>
  );
}

  const skills = alumni.skills
    .split(",")
    .map((skill) => skill.trim());

  return (
    <main className="ml-64 min-h-screen bg-gray-100 p-10">

      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        className="mb-6 text-gray-600 hover:text-gray-900"
      >
        ← Back to Alumni
      </button>

      {/* Profile Header */}
      <div className="rounded-xl bg-white p-8 shadow">

        <div className="flex items-start justify-between">

          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              {alumni.name}
            </h1>

            <p className="mt-2 text-xl text-gray-600">
              {alumni.job_role}
            </p>

            <p className="mt-1 text-gray-500">
              {alumni.company}
            </p>
          </div>

          <div className="text-right text-gray-500">
            <p>📍 {alumni.location}</p>
            <p className="mt-1">
              Batch: {alumni.batch}
            </p>
          </div>

        </div>

      </div>

      {/* Main Content */}
      <div className="mt-6 grid grid-cols-3 gap-6">

        {/* About */}
        <div className="col-span-2 rounded-xl bg-white p-6 shadow">

          <h2 className="text-2xl font-bold">
            About
          </h2>

          <div className="mt-5 grid grid-cols-2 gap-5">

            <div>
              <p className="text-sm text-gray-500">
                Department
              </p>

              <p className="mt-1 font-medium">
                {alumni.dept_name}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Roll Number
              </p>

              <p className="mt-1 font-medium">
                {alumni.rollno}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Section
              </p>

              <p className="mt-1 font-medium">
                {alumni.section}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Gender
              </p>

              <p className="mt-1 font-medium">
                {alumni.gender}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="mt-1 font-medium">
                {alumni.email}
              </p>
            </div>

          </div>

        </div>

        {/* Career */}
        <div className="rounded-xl bg-white p-6 shadow">

          <h2 className="text-2xl font-bold">
            Career
          </h2>

          <p className="mt-5 text-sm text-gray-500">
            Current Role
          </p>

          <p className="mt-1 font-medium">
            {alumni.job_role}
          </p>

          <p className="mt-5 text-sm text-gray-500">
            Company
          </p>

          <p className="mt-1 font-medium">
            {alumni.company}
          </p>

          <p className="mt-5 text-sm text-gray-500">
            Previous Roles
          </p>

          <p className="mt-1 font-medium">
            {alumni.past_job_roles}
          </p>

        </div>

      </div>

      {/* Skills */}
      <div className="mt-6 rounded-xl bg-white p-6 shadow">

        <h2 className="text-2xl font-bold">
          Skills
        </h2>

        <div className="mt-4 flex flex-wrap gap-2">

          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-gray-100 px-4 py-2 text-sm"
            >
              {skill}
            </span>
          ))}

        </div>

      </div>

      {/* Activity */}
      <div className="mt-6 grid grid-cols-2 gap-6">

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">
            Mentorships Completed
          </p>

          <p className="mt-2 text-3xl font-bold">
            {alumni.mentorships_done}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">
            Events Attended
          </p>

          <p className="mt-2 text-3xl font-bold">
            {alumni.events_attended}
          </p>
        </div>

      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-4">

      {successMessage && (
  <p className="mb-4 text-green-600">
    {successMessage}
  </p>
)}

{!showMentorshipForm ? (
  <button
    onClick={() => setShowMentorshipForm(true)}
    className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
  >
    Request Mentorship
  </button>
) : (
  <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow">

    <h2 className="text-xl font-bold">
      Request Mentorship
    </h2>

    <p className="mt-2 text-sm text-gray-500">
      Send a message to {alumni.name}.
    </p>

    <textarea
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Write your message..."
      rows={4}
      className="mt-4 w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
    />

    <div className="mt-4 flex gap-3">

      <button
        onClick={sendMentorshipRequest}
        disabled={sending || !message.trim()}
        className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {sending ? "Sending..." : "Send Request"}
      </button>

      <button
        onClick={() => {
          setShowMentorshipForm(false);
          setMessage("");
        }}
        className="rounded-lg border border-gray-300 px-5 py-2 font-medium hover:bg-gray-100"
      >
        Cancel
      </button>

    </div>

  </div>
)}

        <a
          href={`https://${alumni.linkedin}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium hover:bg-gray-100"
        >
          View LinkedIn
        </a>

      </div>

    </main>
  );
}