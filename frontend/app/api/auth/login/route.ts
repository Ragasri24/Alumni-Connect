import pool from "@/lib/db";
import { comparePassword } from "@/lib/password";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { role, identifier, password } = body;

    // Validate input
    if (!role || !identifier || !password) {
      return Response.json(
        { error: "Role, identifier and password are required" },
        { status: 400 }
      );
    }

    let userId: number;
    let passwordHash: string | null = null;

    // Find user based on role
    if (role === "STUDENT") {
      const result = await pool.query(
        `
        SELECT student_id, password_hash
        FROM students
        WHERE email = $1
        `,
        [identifier]
      );

      if (result.rows.length === 0) {
        return Response.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      userId = result.rows[0].student_id;
      passwordHash = result.rows[0].password_hash;
    } else if (role === "ALUMNI") {
      const result = await pool.query(
        `
        SELECT alumni_id, password_hash
        FROM alumni
        WHERE email = $1
        `,
        [identifier]
      );

      if (result.rows.length === 0) {
        return Response.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      userId = result.rows[0].alumni_id;
      passwordHash = result.rows[0].password_hash;
    } else if (role === "FACULTY") {
      const result = await pool.query(
        `
        SELECT faculty_id, password_hash
        FROM faculty
        WHERE email = $1
        `,
        [identifier]
      );

      if (result.rows.length === 0) {
        return Response.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      userId = result.rows[0].faculty_id;
      passwordHash = result.rows[0].password_hash;
    } else if (role === "ADMIN") {
      const adminId = Number(identifier);

      if (!Number.isInteger(adminId)) {
        return Response.json(
          { error: "Invalid admin ID" },
          { status: 400 }
        );
      }

      const result = await pool.query(
        `
        SELECT admin_id, password_hash
        FROM admin
        WHERE admin_id = $1
        `,
        [adminId]
      );

      if (result.rows.length === 0) {
        return Response.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      userId = result.rows[0].admin_id;
      passwordHash = result.rows[0].password_hash;
    } else {
      return Response.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    // Make sure a password hash exists
    if (!passwordHash) {
      return Response.json(
        { error: "Account password is not configured" },
        { status: 500 }
      );
    }

    // Compare entered password with bcrypt hash
    const passwordValid = await comparePassword(
      password,
      passwordHash
    );

    if (!passwordValid) {
      return Response.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create login session
    await createSession(
      userId,
      role as "STUDENT" | "ALUMNI" | "FACULTY" | "ADMIN"
    );

    return Response.json({
      message: "Login successful",
      role,
      userId,
    });
  } catch (error) {
    console.error("Login error:", error);

    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}