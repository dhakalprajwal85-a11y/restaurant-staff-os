import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, password, phone, position, hourlyWage } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, login ID, and password are required." },
        { status: 400 }
      );
    }

    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: authError?.message || "Failed to create auth user." },
        { status: 400 }
      );
    }

    const userId = authData.user.id;

    const { data: worker, error: workerError } = await supabaseAdmin
      .from("workers")
      .insert({
        name,
        email,
        login_id: email,
        password,
        phone,
        position,
        hourly_wage: hourlyWage ? Number(hourlyWage) : null,
        status: "active",
        role: "worker",
      })
      .select("id")
      .single();

    if (workerError || !worker) {
      return NextResponse.json(
        { error: workerError?.message || "Failed to create worker." },
        { status: 400 }
      );
    }

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: userId,
        role: "worker",
        worker_id: worker.id,
        full_name: name,
      });

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Worker account created successfully.",
      workerId: worker.id,
      userId,
    });
  } catch {
    return NextResponse.json(
      { error: "Server error." },
      { status: 500 }
    );
  }
}