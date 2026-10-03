import pool from "@/lib/db";

export async function PATCH(request: Request) {
  try {
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

    // Temporary alumni ID until authentication is implemented
    const alumniId = 1;

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
      [status, request_id, alumniId]
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

    return Response.json(
      { error: "Failed to respond to speaker invitation" },
      { status: 500 }
    );
  }
}