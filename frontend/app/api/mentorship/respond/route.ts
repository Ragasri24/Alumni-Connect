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

    const result = await pool.query(
      `
      UPDATE mentorship_requests
      SET
        status = $1,
        responded_at = CURRENT_TIMESTAMP
      WHERE request_id = $2
        AND status = 'PENDING'
      RETURNING *
      `,
      [status, request_id]
    );

    if (result.rows.length === 0) {
      return Response.json(
        { error: "Request not found or already responded to" },
        { status: 404 }
      );
    }

    return Response.json({
      message: `Mentorship request ${status.toLowerCase()} successfully`,
      request: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to respond to mentorship request" },
      { status: 500 }
    );
  }
}