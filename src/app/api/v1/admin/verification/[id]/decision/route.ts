import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { resolveVerificationTicket } from "@/lib/store";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const session = getSessionFromRequest(req);

    if (!session || session.role !== "PLATFORM_ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Platform Auditor access required." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { decision, adminNotes } = body;

    if (!decision || (decision !== "APPROVED" && decision !== "REJECTED")) {
      return NextResponse.json(
        { error: "Decision must be 'APPROVED' or 'REJECTED'." },
        { status: 400 }
      );
    }

    const ticket = await resolveVerificationTicket(
      id,
      decision,
      adminNotes,
      session.email
    );

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      ticket,
      message: `Ticket ${ticket.ticketNumber} marked as ${decision}`,
    });
  } catch (error: any) {
    console.error("Admin verification decision error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
