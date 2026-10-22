
import pool from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await requireRole(["FACULTY"]);
    const body = await request.json();

    const { event_id, alumni_id } = body;

    if (!event_id || !alumni_id) {
      return Response.json(
        { error: "Event ID and alumni ID are required" },
        { status: 400 }
      );
    }

    // Verify that this event belongs to the logged-in faculty member
    const eventResult = await pool.query(
      `
      SELECT event_id
      FROM events
      WHERE event_id = $1
        AND created_by = $2
      `,
      [event_id, session.user_id]
    );

    if (eventResult.rows.length === 0) {
      return Response.json(
        { error: "Event not found or not created by this faculty member" },
        { status: 404 }
      );
    }

    // Verify that the selected alumni exists
    const alumniResult = await pool.query(
      `
      SELECT alumni_id
      FROM alumni
      WHERE alumni_id = $1
      `,
      [alumni_id]
    );

    if (alumniResult.rows.length === 0) {
      return Response.json(
        { error: "Alumni not found" },
        { status: 404 }
      );
    }

    // Prevent duplicate invitations
    const existingRequest = await pool.query(
      `
      SELECT request_id
      FROM event_alumni_requests
      WHERE event_id = $1
        AND alumni_id = $2
      `,
      [event_id, alumni_id]
    );

    if (existingRequest.rows.length > 0) {
      return Response.json(
        { error: "This alumni has already been invited to the event" },
        { status: 409 }
      );
    }

    const result = await pool.query(
      `
      INSERT INTO event_alumni_requests
        (event_id, alumni_id, status)
      VALUES
        ($1, $2, 'PENDING')
      RETURNING *
      `,
      [event_id, alumni_id]
    );

    return Response.json(
      {
        message: "Speaker invitation sent successfully",
        invitation: result.rows[0],
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
      return Response.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    return Response.json(
      { error: "Failed to send speaker invitation" },
      { status: 500 }
    );
  }
}
