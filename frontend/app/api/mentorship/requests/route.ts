import pool from "@/lib/db";

export async function GET() {
  try {
    const studentId = 1;

    const result = await pool.query(
      `
      SELECT
        mr.request_id,
        mr.message,
        mr.status,
        mr.created_at,
        mr.responded_at,
        a.alumni_id,
        a.name AS alumni_name,
        a.company,
        a.job_role
      FROM mentorship_requests mr
      JOIN alumni a
        ON mr.alumni_id = a.alumni_id
      WHERE mr.student_id = $1
      ORDER BY mr.created_at DESC
      `,
      [studentId]
    );

    return Response.json(result.rows);
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to fetch mentorship requests" },
      { status: 500 }
    );
  }
}