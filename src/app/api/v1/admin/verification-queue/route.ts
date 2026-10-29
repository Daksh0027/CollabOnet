import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { listVerificationTickets } from "@/lib/store";

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    // Allow PLATFORM_ADMIN
    if (!session || session.role !== "PLATFORM_ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Platform Auditor access required." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get("status") as any;

    const tickets = await listVerificationTickets(statusParam || undefined);

    return NextResponse.json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error: any) {
    console.error("Admin verification queue error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
