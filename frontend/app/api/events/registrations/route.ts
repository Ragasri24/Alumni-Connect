
import pool from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    const session = await requireRole(["STUDENT"]);
    const studentId = session.user_id;

    const result = await pool.query(
      `
      SELECT
        er.registration_id,
        er.event_id,
        er.student_id,
        er.registered_at,
        er.attendance_status,
        e.title,
        e.start_time,
        e.end_time,
        e.location
      FROM event_registrations er
      JOIN events e
        ON er.event_id = e.event_id
      WHERE er.student_id = $1
      ORDER BY er.registered_at DESC
      `,
      [studentId]
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
      { error: "Failed to fetch event registrations" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireRole(["STUDENT"]);
    const studentId = session.user_id;

    const body = await request.json();
    const { event_id } = body;

    if (!event_id) {
      return Response.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    const eventResult = await pool.query(
      `
      SELECT
        event_id,
        max_capacity,
        registration_deadline
      FROM events
      WHERE event_id = $1
      `,
      [event_id]
    );

    if (eventResult.rows.length === 0) {
      return Response.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    const event = eventResult.rows[0];

    const today = new Date();
    const deadline = new Date(event.registration_deadline);

    if (today > deadline) {
      return Response.json(
        { error: "Registration deadline has passed" },
        { status: 400 }
      );
    }

    const existingRegistration = await pool.query(
      `
      SELECT registration_id
      FROM event_registrations
      WHERE event_id = $1
        AND student_id = $2
      `,
      [event_id, studentId]
    );

    if (existingRegistration.rows.length > 0) {
      return Response.json(
        { error: "You are already registered for this event" },
        { status: 409 }
      );
    }

    const countResult = await pool.query(
      `
      SELECT COUNT(*) AS registration_count
      FROM event_registrations
      WHERE event_id = $1
      `,
      [event_id]
    );

    const registrationCount = Number(
      countResult.rows[0].registration_count
    );

    if (registrationCount >= event.max_capacity) {
      return Response.json(
        { error: "Event is already full" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `
      INSERT INTO event_registrations
        (event_id, student_id, attendance_status)
      VALUES
        ($1, $2, 'REGISTERED')
      RETURNING *
      `,
      [event_id, studentId]
    );

    return Response.json(
      {
        message: "Event registration successful",
        registration: result.rows[0],
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
      { error: "Failed to register for event" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await requireRole(["STUDENT"]);
    const studentId = session.user_id;

    const body = await request.json();
    const { event_id } = body;

    if (!event_id) {
      return Response.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `
      DELETE FROM event_registrations
      WHERE event_id = $1
        AND student_id = $2
      RETURNING *
      `,
      [event_id, studentId]
    );

    if (result.rows.length === 0) {
      return Response.json(
        { error: "Registration not found" },
        { status: 404 }
      );
    }

    return Response.json({
      message: "Event registration cancelled",
      registration: result.rows[0],
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
      { error: "Failed to cancel event registration" },
      { status: 500 }
    );
  }
}
