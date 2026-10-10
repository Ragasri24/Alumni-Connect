
import pool from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    const session = await requireRole(["ALUMNI"]);

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
      [session.user_id]
    );

    return Response.json(result.rows);
  } catch (error) {
    console.error(error);

    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return Response.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    if (error instanceof Error && error.message === "FORBIDDEN") {
      return Response.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    return Response.json(
      { error: "Failed to fetch incoming mentorship requests" },
      { status: 500 }
    );
  }
}
