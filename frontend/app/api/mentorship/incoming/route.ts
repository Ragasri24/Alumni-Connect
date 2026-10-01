import pool from "@/lib/db";

export async function GET() {
  try {
    // Temporary alumni ID until authentication is implemented
    const alumniId = 1;

    const result = await pool.query(
      `
      SELECT
        mr.request_id,
        mr.message,
        mr.status,
        mr.created_at,
        mr.responded_at,

        s.student_id,
        s.name AS student_name,
        s.rollno,
        s.current_year,
        s.batch,
        s.section,
        s.email,

        d.dept_name

      FROM mentorship_requests mr

      JOIN students s
        ON mr.student_id = s.student_id

      JOIN departments d
        ON s.dept_id = d.dept_id

      WHERE mr.alumni_id = $1

      ORDER BY mr.created_at DESC
      `,
      [alumniId]
    );

    return Response.json(result.rows);
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to fetch incoming mentorship requests" },
      { status: 500 }
    );
  }
}