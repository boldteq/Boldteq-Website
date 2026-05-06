import { NextResponse } from "next/server";
import { z } from "zod";

const ContactPayload = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().max(254),
  phone: z.string().max(40).optional(),
  inquiryType: z.string().min(1).max(60),
  message: z.string().max(5000).optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON" },
      { status: 400 },
    );
  }

  const parsed = ContactPayload.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  // TODO: integrate Resend or CRM webhook here. For now, server log captures
  // submissions in production logs (Railway/Sentry).
  console.info("[contact-form]", {
    ...parsed.data,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
