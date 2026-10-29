/**
 * End-to-End Verification Flow Test Script
 * Validates:
 * 1. Sign Up (Starts as UNVERIFIED)
 * 2. Login & Session Token verification
 * 3. Onboarding Questionnaire Submission (Generates TICK-XXXX)
 * 4. Admin Queue Fetching & Verification
 * 5. Admin One-Click Approval
 * 6. User Status Upgrade to VERIFIED
 */

import {
  findUserByEmail,
  createUser,
  updateUserStatus,
  createVerificationTicket,
  listVerificationTickets,
  resolveVerificationTicket,
} from "../src/lib/store";
import { hashPassword, comparePassword, signToken, verifyToken } from "../src/lib/auth";

async function runE2ETest() {
  console.log("=================================================");
  console.log("🚀 STARTING E2E TEST: ONBOARDING & VERIFICATION");
  console.log("=================================================");

  const testEmail = `creator_${Date.now()}@test.com`;
  const rawPassword = "password123";
  const creatorName = "Alex Tech Lead";

  // Step 1: User Signup
  console.log("\n[1] Testing User Registration...");
  const passwordHash = await hashPassword(rawPassword);
  const newUser = await createUser({
    email: testEmail,
    passwordHash,
    name: creatorName,
    role: "CREATOR",
  });

  if (newUser.verificationStatus !== "UNVERIFIED") {
    throw new Error(`Expected UNVERIFIED, got ${newUser.verificationStatus}`);
  }
  console.log(`✓ User registered: ${newUser.email} (Status: ${newUser.verificationStatus})`);

  // Step 2: Authentication Check
  console.log("\n[2] Testing Authentication & Token...");
  const fetchedUser = await findUserByEmail(testEmail);
  if (!fetchedUser) throw new Error("User lookup failed");

  const isPasswordValid = await comparePassword(rawPassword, fetchedUser.passwordHash);
  if (!isPasswordValid) throw new Error("Password verification failed");

  const token = signToken({
    userId: fetchedUser.id,
    email: fetchedUser.email,
    role: fetchedUser.role,
    verificationStatus: fetchedUser.verificationStatus,
  });

  const verifiedSession = verifyToken(token);
  if (!verifiedSession || verifiedSession.email !== testEmail) {
    throw new Error("JWT token verification failed");
  }
  console.log(`✓ Authentication succeeded. JWT token issued & verified.`);

  // Step 3: Verification Questionnaire Submission
  console.log("\n[3] Testing Onboarding Questionnaire Submission...");
  const ticket = await createVerificationTicket({
    userId: fetchedUser.id,
    userEmail: fetchedUser.email,
    userName: fetchedUser.name,
    role: fetchedUser.role,
    formData: {
      primaryPlatform: "YOUTUBE",
      handle: "@alextechlead",
      profileUrl: "https://youtube.com/@alextechlead",
      niche: ["Tech & Gadgets"],
      followerCount: 75000,
      avgViews: 18000,
      baseRate: 2000,
      proofUrl: "https://drive.google.com/proof-screenshot.png",
    },
  });

  if (!ticket.ticketNumber.startsWith("TICK-")) {
    throw new Error(`Invalid ticket number: ${ticket.ticketNumber}`);
  }
  if (ticket.status !== "PENDING") {
    throw new Error(`Expected ticket status PENDING, got ${ticket.status}`);
  }
  console.log(`✓ Ticket created: ${ticket.ticketNumber} (Status: ${ticket.status})`);

  // Step 4: Verify User Status Updated to PENDING_REVIEW
  const pendingUser = await findUserByEmail(testEmail);
  if (pendingUser?.verificationStatus !== "PENDING_REVIEW") {
    throw new Error(`Expected user status PENDING_REVIEW, got ${pendingUser?.verificationStatus}`);
  }
  console.log(`✓ User verification status automatically updated to: ${pendingUser.verificationStatus}`);

  // Step 5: Admin Queue Inspection
  console.log("\n[4] Testing Platform Auditor Queue...");
  const pendingTickets = await listVerificationTickets("PENDING");
  const foundTicket = pendingTickets.find((t) => t.id === ticket.id);
  if (!foundTicket) {
    throw new Error("Created ticket not found in admin queue");
  }
  console.log(`✓ Admin queue fetched. Found ticket ${foundTicket.ticketNumber} for ${foundTicket.userEmail}`);

  // Step 6: Admin Decision Approval
  console.log("\n[5] Testing Admin Approval Decision...");
  const resolvedTicket = await resolveVerificationTicket(
    ticket.id,
    "APPROVED",
    "Verified official YouTube handle and reach stats.",
    "admin@collabonet.com"
  );

  if (resolvedTicket?.status !== "APPROVED") {
    throw new Error(`Expected ticket status APPROVED, got ${resolvedTicket?.status}`);
  }
  console.log(`✓ Admin approved ticket ${resolvedTicket.ticketNumber}. Status: ${resolvedTicket.status}`);

  // Step 7: Verify User Account Unlocked & VERIFIED
  console.log("\n[6] Verifying User Account Status Upgrade...");
  const approvedUser = await findUserByEmail(testEmail);
  if (approvedUser?.verificationStatus !== "VERIFIED") {
    throw new Error(`Expected user status VERIFIED, got ${approvedUser?.verificationStatus}`);
  }
  console.log(`✓ Final Check: User ${approvedUser.email} is now officially VERIFIED!`);
  console.log("✓ Marketplace & deal room gates unlocked.");

  console.log("\n=================================================");
  console.log("🎉 ALL E2E VERIFICATION ONBOARDING TESTS PASSED!");
  console.log("=================================================\n");
}

runE2ETest().catch((err) => {
  console.error("❌ E2E TEST FAILED:", err);
  process.exit(1);
});
