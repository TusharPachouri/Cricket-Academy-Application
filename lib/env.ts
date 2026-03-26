/**
 * Task 8: Validate all required environment variables at startup.
 * Import this in any server-side code that needs env vars.
 * Throws a clear error at build/boot time if anything is missing.
 */

const required = [
  "MONGODB_URI",
  "RESEND_API_KEY",
  "CONTACT_RECEIVER_EMAIL",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "NEXT_PUBLIC_RAZORPAY_KEY_ID",
] as const;

function validateEnv() {
  const missing: string[] = [];

  for (const key of required) {
    const val = process.env[key];
    if (!val || val.trim() === "" || val.includes("xxxxxxxxxxxx")) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `\n\n🚨 Missing or placeholder environment variables:\n${missing.map((k) => `  ❌ ${k}`).join("\n")}\n\nAdd them to your .env.local file and restart the server.\n`
    );
  }
}

// Only validate on the server side
if (typeof window === "undefined") {
  validateEnv();
}

export const env = {
  MONGODB_URI: process.env.MONGODB_URI!,
  RESEND_API_KEY: process.env.RESEND_API_KEY!,
  CONTACT_RECEIVER_EMAIL: process.env.CONTACT_RECEIVER_EMAIL!,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID!,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET!,
  NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
};
