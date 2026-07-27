import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function createSupabaseAdmin(): SupabaseClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function GET() {
  return NextResponse.json({
    message: "Create worker API is working.",
  });
}

export async function POST(req: Request) {
  const supabaseAdmin = createSupabaseAdmin();

  if (!supabaseAdmin) {
    console.error("Missing Supabase environment variables.");

    return NextResponse.json(
      {
        error:
          "Server configuration error. Supabase environment variables are missing.",
      },
      { status: 500 }
    );
  }

  let createdUserId: string | null = null;
  let createdWorkerId: string | null = null;

  try {
    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          error: "Invalid request body.",
        },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          error: "Invalid request body.",
        },
        { status: 400 }
      );
    }

    const requestBody = body as Record<string, unknown>;

    const name =
      typeof requestBody.name === "string"
        ? requestBody.name.trim()
        : "";

    const email =
      typeof requestBody.email === "string"
        ? requestBody.email.trim().toLowerCase()
        : "";

    const password =
      typeof requestBody.password === "string"
        ? requestBody.password
        : "";

    const phone =
      typeof requestBody.phone === "string" &&
      requestBody.phone.trim()
        ? requestBody.phone.trim()
        : null;

    const position =
      typeof requestBody.position === "string" &&
      requestBody.position.trim()
        ? requestBody.position.trim()
        : null;

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          error: "Name, login ID, and password are required.",
        },
        { status: 400 }
      );
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        {
          error: "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          error: "Password must be at least 6 characters.",
        },
        { status: 400 }
      );
    }

    let hourlyWage: number | null = null;

    const rawHourlyWage = requestBody.hourlyWage;

    if (
      rawHourlyWage !== "" &&
      rawHourlyWage !== null &&
      rawHourlyWage !== undefined
    ) {
      hourlyWage = Number(rawHourlyWage);

      if (!Number.isFinite(hourlyWage) || hourlyWage < 0) {
        return NextResponse.json(
          {
            error: "Hourly wage must be a valid positive number.",
          },
          { status: 400 }
        );
      }
    }

    /*
     * 1. Create the Supabase Auth user.
     */
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: name,
          role: "worker",
        },
      });

    if (authError || !authData.user) {
      console.error("Auth user creation failed:", authError);

      return NextResponse.json(
        {
          error:
            authError?.message ??
            "Failed to create the authentication account.",
        },
        { status: 400 }
      );
    }

    createdUserId = authData.user.id;

    /*
     * 2. Create the worker record.
     * Never store the worker's plaintext password here.
     */
    const { data: worker, error: workerError } =
      await supabaseAdmin
        .from("workers")
        .insert({
          auth_user_id: createdUserId,
          name,
          email,
          login_id: email,
          phone,
          position,
          hourly_wage: hourlyWage,
          status: "active",
          role: "worker",
        })
        .select("id")
        .single();

    if (workerError || !worker) {
      console.error("Worker record creation failed:", workerError);

      await supabaseAdmin.auth.admin.deleteUser(createdUserId);
      createdUserId = null;

      return NextResponse.json(
        {
          error:
            workerError?.message ??
            "Failed to create the worker record.",
        },
        { status: 400 }
      );
    }

    createdWorkerId = worker.id;

    /*
     * 3. Create or update the matching profile.
     * Upsert is safer if a database trigger already created the profile.
     */
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert(
        {
          id: createdUserId,
          role: "worker",
          worker_id: createdWorkerId,
          full_name: name,
        },
        {
          onConflict: "id",
        }
      );

    if (profileError) {
      console.error("Profile creation failed:", profileError);

      await supabaseAdmin
        .from("workers")
        .delete()
        .eq("id", createdWorkerId);

      await supabaseAdmin.auth.admin.deleteUser(createdUserId);

      createdWorkerId = null;
      createdUserId = null;

      return NextResponse.json(
        {
          error: profileError.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Worker account created successfully.",
        workerId: createdWorkerId,
        userId: createdUserId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create worker API error:", error);

    /*
     * Best-effort rollback.
     */
    if (createdWorkerId) {
      const { error: workerCleanupError } = await supabaseAdmin
        .from("workers")
        .delete()
        .eq("id", createdWorkerId);

      if (workerCleanupError) {
        console.error(
          "Worker cleanup failed:",
          workerCleanupError
        );
      }
    }

    if (createdUserId) {
      const { error: authCleanupError } =
        await supabaseAdmin.auth.admin.deleteUser(
          createdUserId
        );

      if (authCleanupError) {
        console.error(
          "Auth cleanup failed:",
          authCleanupError
        );
      }
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected server error.",
      },
      { status: 500 }
    );
  }
}