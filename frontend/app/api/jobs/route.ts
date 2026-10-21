
import pool from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        j.job_id,
        j.title,
        j.company,
        j.type,
        j.location,
        j.work_mode,
        j.description,
        j.application_link,
        j.deadline,
        a.alumni_id,
        a.name AS alumni_name,
        d.dept_name
      FROM jobs j
      JOIN alumni a ON j.alumni_id = a.alumni_id
      JOIN departments d ON a.dept_id = d.dept_id
      ORDER BY j.deadline ASC
    `);

    return Response.json(result.rows);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireRole(["ALUMNI"]);
    const body = await request.json();

    const {
      title,
      company,
      type,
      location,
      work_mode,
      description,
      application_link,
      deadline,
    } = body;

    if (
      !title ||
      !company ||
      !type ||
      !location ||
      !work_mode ||
      !description ||
      !deadline
    ) {
      return Response.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    if (type !== "JOB" && type !== "INTERNSHIP") {
      return Response.json(
        { error: "Invalid job type" },
        { status: 400 }
      );
    }

    if (
      work_mode !== "REMOTE" &&
      work_mode !== "HYBRID" &&
      work_mode !== "ONSITE"
    ) {
      return Response.json(
        { error: "Invalid work mode" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `
      INSERT INTO jobs (
        alumni_id,
        title,
        company,
        type,
        location,
        work_mode,
        description,
        application_link,
        deadline
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
      `,
      [
        session.user_id,
        title,
        company,
        type,
        location,
        work_mode,
        description,
        application_link || null,
        deadline,
      ]
    );

    return Response.json(
      {
        message: "Job/internship posted successfully",
        job: result.rows[0],
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
      { error: "Failed to create job/internship" },
      { status: 500 }
    );
  }
}
