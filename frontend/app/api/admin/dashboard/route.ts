import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM students) AS total_students,
        (SELECT COUNT(*) FROM alumni) AS total_alumni,
        (SELECT COUNT(*) FROM faculty) AS total_faculty,
        (SELECT COUNT(*) FROM jobs) AS total_jobs,
        (SELECT COUNT(*) FROM events) AS total_events,
        (SELECT COUNT(*) FROM mentorship_requests) AS total_mentorship_requests,
        (SELECT COUNT(*) FROM job_applications) AS total_job_applications,
        (SELECT COUNT(*) FROM event_registrations) AS total_event_registrations
    `);

    return Response.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}