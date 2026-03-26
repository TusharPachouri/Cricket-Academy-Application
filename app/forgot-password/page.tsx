"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address."); return;
    }
    setLoading(true); setError("");
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    if (!res.ok) { const d = await res.json(); setError(d.error); return; }
    setStep("otp");
  };

  const verifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) { setError("Enter the 6-digit OTP."); return; }
    setError(""); setStep("reset");
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8 || !/\d/.test(password)) {
      setError("Min 8 characters with at least one number."); return;
    }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true); setError("");
    const res = await fetch("/api/auth/reset-password", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, password }),
    });
    setLoading(false);
    if (!res.ok) { const d = await res.json(); setError(d.error); return; }
    setSuccess(true);
    setTimeout(() => router.push("/login"), 2500);
  };

  return (
    <div className="auth-page">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link href="/" className="auth-logo">
          <div className="auth-logo-mark">B</div>
          <div><div className="auth-logo-name">BRAJ.</div><div className="auth-logo-sub">Cricket Academy</div></div>
        </Link>

        {success ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
            <h2 className="auth-heading" style={{ fontSize: 28 }}>Password Reset!</h2>
            <p className="auth-subheading">Redirecting you to login…</p>
          </div>
        ) : (
          <>
            <h1 className="auth-heading">
              {step === "email" ? "Forgot Password" : step === "otp" ? "Enter OTP" : "New Password"}
            </h1>
            <p className="auth-subheading">
              {step === "email" && "Enter your email and we'll send a 6-digit OTP."}
              {step === "otp" && `OTP sent to ${email}. Check your inbox.`}
              {step === "reset" && "Choose a strong new password."}
            </p>

            {error && <p className="auth-error-banner" style={{ marginBottom: 16 }}>{error}</p>}

            {step === "email" && (
              <form onSubmit={sendOtp} className="auth-form">
                <div className="auth-field">
                  <label className="auth-label">Email</label>
                  <input className="auth-input" type="email" placeholder="you@example.com"
                    value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <motion.button type="submit" className="auth-submit-btn" disabled={loading} whileTap={{ scale: 0.97 }}>
                  {loading ? <span className="auth-spinner" /> : "Send OTP →"}
                </motion.button>
              </form>
            )}

            {step === "otp" && (
              <form onSubmit={verifyOtp} className="auth-form">
                <div className="auth-field">
                  <label className="auth-label">6-Digit OTP</label>
                  <input className="auth-input" type="text" inputMode="numeric"
                    maxLength={6} placeholder="______"
                    value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                    style={{ letterSpacing: "0.3em", fontSize: 22, textAlign: "center" }} />
                </div>
                <motion.button type="submit" className="auth-submit-btn" whileTap={{ scale: 0.97 }}>
                  Verify OTP →
                </motion.button>
                <button type="button" className="auth-back"
                  onClick={() => { setStep("email"); setError(""); }}
                  style={{ background: "none", border: "none", cursor: "pointer" }}>
                  ← Use a different email
                </button>
              </form>
            )}

            {step === "reset" && (
              <form onSubmit={resetPassword} className="auth-form">
                <div className="auth-field">
                  <label className="auth-label">New Password</label>
                  <input className="auth-input" type="password" placeholder="Min 8 chars + number"
                    value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <div className="auth-field">
                  <label className="auth-label">Confirm Password</label>
                  <input className="auth-input" type="password" placeholder="••••••••"
                    value={confirm} onChange={e => setConfirm(e.target.value)} />
                </div>
                <motion.button type="submit" className="auth-submit-btn" disabled={loading} whileTap={{ scale: 0.97 }}>
                  {loading ? <span className="auth-spinner" /> : "Reset Password →"}
                </motion.button>
              </form>
            )}
          </>
        )}

        <Link href="/login" className="auth-back" style={{ marginTop: 20 }}>← Back to login</Link>
      </motion.div>

      <style>{`
        .auth-page{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px 16px;background:var(--page-bg);}
        .auth-card{width:100%;max-width:420px;background:rgba(255,255,255,0.04);border:1px solid rgba(201,168,76,0.18);border-radius:24px;padding:40px 36px;display:flex;flex-direction:column;gap:0;}
        html:not(.dark) .auth-card{background:rgba(255,255,255,0.8);border-color:rgba(201,168,76,0.25);box-shadow:0 8px 40px rgba(0,0,0,0.08);}
        .auth-logo{display:flex;align-items:center;gap:10px;text-decoration:none;margin-bottom:24px;}
        .auth-logo-mark{width:38px;height:38px;background:var(--gold);border-radius:10px;display:flex;align-items:center;justify-content:center;font-family:var(--font-bebas),serif;font-size:22px;color:#0D1117;}
        .auth-logo-name{font-family:var(--font-bebas),serif;font-size:18px;color:var(--dark);letter-spacing:0.05em;line-height:1;}
        .auth-logo-sub{font-family:var(--font-dm),sans-serif;font-size:10px;color:var(--gold);opacity:0.75;letter-spacing:0.08em;}
        .auth-heading{font-family:var(--font-bebas),serif;font-size:34px;color:var(--dark);margin:0 0 6px;letter-spacing:0.02em;line-height:1;}
        .auth-subheading{font-family:var(--font-dm),sans-serif;font-size:13px;color:var(--dark);opacity:0.5;margin-bottom:22px;}
        .auth-error-banner{background:rgba(224,92,92,0.1);border:1px solid rgba(224,92,92,0.3);border-radius:10px;padding:10px 14px;font-family:var(--font-dm),sans-serif;font-size:13px;color:#e05c5c;margin:0;}
        .auth-form{display:flex;flex-direction:column;gap:16px;}
        .auth-field{display:flex;flex-direction:column;gap:6px;}
        .auth-label{font-family:var(--font-dm),sans-serif;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:var(--gold);opacity:0.8;}
        .auth-input{background:rgba(255,255,255,0.05);border:1px solid rgba(201,168,76,0.2);border-radius:10px;padding:11px 14px;font-family:var(--font-dm),sans-serif;font-size:13.5px;color:var(--dark);outline:none;transition:border-color 0.2s;width:100%;box-sizing:border-box;}
        html:not(.dark) .auth-input{background:#faf8f3;border-color:rgba(201,168,76,0.28);color:#1a1209;}
        .auth-input:focus{border-color:rgba(197,160,89,0.55);}
        .auth-submit-btn{width:100%;padding:13px;border-radius:12px;background:var(--gold);border:none;color:#0D1117;font-family:var(--font-dm),sans-serif;font-size:14px;font-weight:700;letter-spacing:0.05em;cursor:pointer;transition:opacity 0.2s;display:flex;align-items:center;justify-content:center;}
        .auth-submit-btn:hover{opacity:0.88;}
        .auth-submit-btn:disabled{opacity:0.55;cursor:not-allowed;}
        .auth-spinner{width:18px;height:18px;border:2px solid rgba(13,17,23,0.3);border-top-color:#0D1117;border-radius:50%;animation:spin 0.7s linear infinite;}
        @keyframes spin{to{transform:rotate(360deg);}}
        .auth-back{font-family:var(--font-dm),sans-serif;font-size:12px;color:var(--dark);opacity:0.35;text-decoration:none;text-align:center;display:block;transition:opacity 0.2s;}
        .auth-back:hover{opacity:0.7;}
      `}</style>
    </div>
  );
}
