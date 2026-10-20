
import pool from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await requireRole(["STUDENT"]);
    const body = await request.json();

    const { alumni_id, message } = body;

    if (!alumni_id || !message) {
      return Response.json(
        { error: "Alumni and message are required" },
        { status: 400 }
      );
    }

    const existingRequest = await pool.query(
      `
      SELECT request_id
      FROM mentorship_requests
      WHERE student_id = $1
        AND alumni_id = $2
        AND status = 'PENDING'
      `,
      [session.user_id, alumni_id]
    );

    if (existingRequest.rows.length > 0) {
      return Response.json(
        {
          error:
            "You already have a pending mentorship request with this alumni",
        },
        { status: 409 }
      );
    }

    const result = await pool.query(
      `
      INSERT INTO mentorship_requests
        (student_id, alumni_id, message)
      VALUES
        ($1, $2, $3)
      RETURNING *
      `,
      [session.user_id, alumni_id, message]
    );

    return Response.json(
      {
        message: "Mentorship request sent successfully",
        request: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return Response.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    if (error instanceof Error && error.message === "FORBIDDEN") {
      return Response.json({ error: "Access denied" }, { status: 403 });
    }

    return Response.json(
      { error: "Failed to send mentorship request" },
      { status: 500 }
    );
  }
}
