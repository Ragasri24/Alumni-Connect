import pool from "@/lib/db";

export async function GET() {
  try {
    const statsResult = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM students)::int AS total_students,
        (SELECT COUNT(*) FROM alumni)::int AS total_alumni,
        (SELECT COUNT(*) FROM faculty)::int AS total_faculty,
        (SELECT COUNT(*) FROM jobs)::int AS total_jobs,
        (SELECT COUNT(*) FROM events)::int AS total_events,
        (SELECT COUNT(*) FROM mentorship_requests)::int AS total_mentorship_requests,
        (SELECT COUNT(*) FROM job_applications)::int AS total_job_applications,
        (SELECT COUNT(*) FROM event_registrations)::int AS total_event_registrations
    `);

    const upcomingEventsResult = await pool.query(`
      SELECT
        e.event_id,
        e.title,
        e.event_type,
        e.start_time,
        e.location,
        f.name AS faculty_name
      FROM events e
      JOIN faculty f
        ON e.created_by = f.faculty_id
      WHERE e.start_time >= NOW()
      ORDER BY e.start_time ASC
      LIMIT 5
    `);

    const recentJobsResult = await pool.query(`
      SELECT
        j.job_id,
        j.title,
        j.company,
        j.type,
        j.location,
        j.deadline,
        a.name AS alumni_name
      FROM jobs j
      JOIN alumni a
        ON j.alumni_id = a.alumni_id
      ORDER BY j.job_id DESC
      LIMIT 5
    `);

    return Response.json({
      stats: statsResult.rows[0],
      upcomingEvents: upcomingEventsResult.rows,
      recentJobs: recentJobsResult.rows,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}