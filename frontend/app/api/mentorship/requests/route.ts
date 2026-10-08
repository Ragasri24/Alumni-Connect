import pool from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    const session = await requireRole(["STUDENT"]);

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
      { error: "Failed to fetch mentorship requests" },
      { status: 500 }
    );
  }
}