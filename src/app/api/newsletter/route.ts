import { NextResponse } from "next/server";
import { z } from "zod";

const NewsletterPayload = z.object({
  email: z.string().email().max(254),
  source: z.string().max(60).optional(),
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

  const parsed = NewsletterPayload.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed" },
      { status: 400 },
    );
  }

  // TODO: integrate ESP (Mailchimp / Resend Audiences / Loops). For now, log.
  console.info("[newsletter-signup]", {
    ...parsed.data,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
