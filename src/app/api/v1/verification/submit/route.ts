import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { findUserById, createVerificationTicket } from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await findUserById(session.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const formData = await req.json();

    // Basic role-specific validation
    if (user.role === "CREATOR" && (!formData.handle || !formData.primaryPlatform)) {
      return NextResponse.json(
        { error: "Handle and primary platform are required for creator verification." },
        { status: 400 }
      );
    }

    if (user.role === "TALENT_MANAGER" && !formData.agencyName) {
      return NextResponse.json(
        { error: "Agency name is required for manager verification." },
        { status: 400 }
      );
    }

    if (user.role === "SALES_REP" && !formData.companyName) {
      return NextResponse.json(
        { error: "Company name is required for brand verification." },
        { status: 400 }
      );
    }

    const ticket = await createVerificationTicket({
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      role: user.role,
      formData,
    });

    return NextResponse.json({
      success: true,
      ticket: {
        id: ticket.id,
        ticketNumber: ticket.ticketNumber,
        status: ticket.status,
        createdAt: ticket.createdAt,
      },
      redirect: "/onboarding/pending",
    });
  } catch (error: any) {
    console.error("Verification submit error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
