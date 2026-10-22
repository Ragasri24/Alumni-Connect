
import pool from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function PATCH(request: Request) {
  try {
    const session = await requireRole(["ALUMNI"]);
    const body = await request.json();

    const { request_id, status } = body;

    if (!request_id || !status) {
      return Response.json(
        { error: "Request ID and status are required" },
        { status: 400 }
      );
    }

    if (status !== "ACCEPTED" && status !== "REJECTED") {
      return Response.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `
      UPDATE event_alumni_requests
      SET
        status = $1,
        responded_at = CURRENT_TIMESTAMP
      WHERE request_id = $2
        AND alumni_id = $3
        AND status = 'PENDING'
      RETURNING *
      `,
      [status, request_id, session.user_id]
    );

    if (result.rows.length === 0) {
      return Response.json(
        { error: "Invitation not found or already responded to" },
        { status: 404 }
      );
    }

    return Response.json({
      message: `Speaker invitation ${status.toLowerCase()} successfully`,
      invitation: result.rows[0],
    });
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
      { error: "Failed to respond to speaker invitation" },
      { status: 500 }
    );
  }
}
