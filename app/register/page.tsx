"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

type FormData = { firstName: string; lastName: string; email: string; phone: string; password: string; confirm: string };
type FormErrors = Partial<Record<keyof FormData, string>>;

function validate(f: FormData): FormErrors {
  const e: FormErrors = {};
  if (!f.firstName.trim() || f.firstName.trim().length < 2) e.firstName = "Min 2 characters.";
  if (!f.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Enter a valid email.";
  if (f.phone && !/^\+?[\d\s\-()]{7,15}$/.test(f.phone)) e.phone = "Enter a valid phone number.";
  if (!f.password || f.password.length < 8 || !/\d/.test(f.password))
    e.password = "Min 8 characters with at least one number.";
  if (f.password !== f.confirm) e.confirm = "Passwords do not match.";
  return e;
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({ firstName: "", lastName: "", email: "", phone: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    setForm(updated);
    if (touched[name as keyof FormData]) {
      const errs = validate(updated);
      setErrors(prev => ({ ...prev, [name]: errs[name as keyof FormData] }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const errs = validate(form);
    setErrors(prev => ({ ...prev, [name]: errs[name as keyof FormData] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = { firstName: true, lastName: true, email: true, phone: true, password: true, confirm: true };
    setTouched(allTouched);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    setGeneralError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setGeneralError(data.error); setLoading(false); return; }

      // Auto sign-in after register
      await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      router.push("/profile");
    } catch {
      setGeneralError("Registration failed. Please try again.");
      setLoading(false);
    }
  };

  const Field = ({ name, label, type = "text", placeholder }: { name: keyof FormData; label: string; type?: string; placeholder?: string }) => (
    <div className="auth-field">
      <label className="auth-label">{label}</label>
      <input
        className={`auth-input${errors[name] ? " auth-input--err" : ""}`}
        type={type} name={name} placeholder={placeholder}
        value={form[name]} onChange={handleChange} onBlur={handleBlur}
      />
      {errors[name] && <span className="auth-field-error">{errors[name]}</span>}
    </div>
  );

  return (
    <div className="auth-page">
      <motion.div
        className="auth-card"
        style={{ maxWidth: 480 }}
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link href="/" className="auth-logo">
          <div className="auth-logo-mark">B</div>
          <div>
            <div className="auth-logo-name">BRAJ.</div>
            <div className="auth-logo-sub">Cricket Academy</div>
          </div>
        </Link>

        <h1 className="auth-heading">Create Account</h1>
        <p className="auth-subheading">Join Braj Cricket Academy</p>

        <motion.button
          className="auth-google-btn"
          onClick={() => { setGoogleLoading(true); signIn("google", { callbackUrl: "/profile" }); }}
          disabled={googleLoading}
          whileTap={{ scale: 0.97 }}
        >
          {googleLoading ? <span className="auth-spinner" /> : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </>
          )}
        </motion.button>

        <div className="auth-divider"><span>or register with email</span></div>

        <form onSubmit={handleSubmit} className="auth-form">
          {generalError && <p className="auth-error-banner">{generalError}</p>}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field name="firstName" label="First Name" placeholder="Virat" />
            <Field name="lastName" label="Last Name" placeholder="Kohli" />
          </div>
          <Field name="email" label="Email" type="email" placeholder="you@example.com" />
          <Field name="phone" label="Phone (optional)" type="tel" placeholder="+91 98765 43210" />
          <Field name="password" label="Password" type="password" placeholder="Min 8 chars + number" />
          <Field name="confirm" label="Confirm Password" type="password" placeholder="••••••••" />

          <motion.button type="submit" className="auth-submit-btn" disabled={loading} whileTap={{ scale: 0.97 }}>
            {loading ? <span className="auth-spinner" /> : "Create Account →"}
          </motion.button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link href="/login" className="auth-switch-link">Sign in →</Link>
        </p>
        <Link href="/" className="auth-back">← Back to home</Link>
      </motion.div>

      <style>{`
        .auth-page { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px 16px; background:var(--page-bg); }
        .auth-card { width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(201,168,76,0.18); border-radius:24px; padding:40px 36px; display:flex; flex-direction:column; gap:0; }
        html:not(.dark) .auth-card { background:rgba(255,255,255,0.8); border-color:rgba(201,168,76,0.25); box-shadow:0 8px 40px rgba(0,0,0,0.08); }
        .auth-logo { display:flex; align-items:center; gap:10px; text-decoration:none; margin-bottom:24px; }
        .auth-logo-mark { width:38px; height:38px; background:var(--gold); border-radius:10px; display:flex; align-items:center; justify-content:center; font-family:var(--font-bebas),serif; font-size:22px; color:#0D1117; }
        .auth-logo-name { font-family:var(--font-bebas),serif; font-size:18px; color:var(--dark); letter-spacing:0.05em; line-height:1; }
        .auth-logo-sub { font-family:var(--font-dm),sans-serif; font-size:10px; color:var(--gold); opacity:0.75; letter-spacing:0.08em; }
        .auth-heading { font-family:var(--font-bebas),serif; font-size:34px; color:var(--dark); margin:0 0 6px; letter-spacing:0.02em; line-height:1; }
        .auth-subheading { font-family:var(--font-dm),sans-serif; font-size:13px; color:var(--dark); opacity:0.5; margin-bottom:22px; }
        .auth-google-btn { display:flex; align-items:center; justify-content:center; gap:10px; width:100%; padding:11px 16px; border-radius:12px; background:rgba(255,255,255,0.06); border:1px solid rgba(201,168,76,0.2); color:var(--dark); font-family:var(--font-dm),sans-serif; font-size:13.5px; font-weight:500; cursor:pointer; transition:background 0.2s,border-color 0.2s; }
        html:not(.dark) .auth-google-btn { background:#fff; border-color:#e0d8c8; }
        .auth-google-btn:hover { background:rgba(255,255,255,0.1); border-color:rgba(201,168,76,0.4); }
        html:not(.dark) .auth-google-btn:hover { background:#f9f7f2; }
        .auth-google-btn:disabled { opacity:0.6; cursor:not-allowed; }
        .auth-divider { position:relative; text-align:center; margin:18px 0; }
        .auth-divider::before { content:""; position:absolute; top:50%; left:0; right:0; height:1px; background:rgba(201,168,76,0.15); }
        .auth-divider span { position:relative; background:var(--page-bg); padding:0 12px; font-family:var(--font-dm),sans-serif; font-size:11px; color:var(--dark); opacity:0.4; }
        html:not(.dark) .auth-divider span { background:rgba(255,255,255,0.8); }
        .auth-form { display:flex; flex-direction:column; gap:14px; }
        .auth-error-banner { background:rgba(224,92,92,0.1); border:1px solid rgba(224,92,92,0.3); border-radius:10px; padding:10px 14px; font-family:var(--font-dm),sans-serif; font-size:13px; color:#e05c5c; margin:0; }
        .auth-field { display:flex; flex-direction:column; gap:6px; }
        .auth-label { font-family:var(--font-dm),sans-serif; font-size:10px; letter-spacing:0.16em; text-transform:uppercase; color:var(--gold); opacity:0.8; }
        .auth-input { background:rgba(255,255,255,0.05); border:1px solid rgba(201,168,76,0.2); border-radius:10px; padding:10px 13px; font-family:var(--font-dm),sans-serif; font-size:13px; color:var(--dark); outline:none; transition:border-color 0.2s; width:100%; box-sizing:border-box; }
        html:not(.dark) .auth-input { background:#faf8f3; border-color:rgba(201,168,76,0.28); color:#1a1209; }
        .auth-input:focus { border-color:rgba(197,160,89,0.55); }
        html:not(.dark) .auth-input:focus { background:#fff; }
        .auth-input--err { border-color:rgba(224,92,92,0.6) !important; }
        .auth-field-error { font-family:var(--font-dm),sans-serif; font-size:11px; color:#e05c5c; }
        .auth-submit-btn { width:100%; padding:13px; border-radius:12px; background:var(--gold); border:none; color:#0D1117; font-family:var(--font-dm),sans-serif; font-size:14px; font-weight:700; letter-spacing:0.05em; cursor:pointer; transition:opacity 0.2s; margin-top:4px; display:flex; align-items:center; justify-content:center; }
        .auth-submit-btn:hover { opacity:0.88; }
        .auth-submit-btn:disabled { opacity:0.55; cursor:not-allowed; }
        .auth-spinner { width:18px; height:18px; border:2px solid rgba(13,17,23,0.3); border-top-color:#0D1117; border-radius:50%; animation:spin 0.7s linear infinite; }
        @keyframes spin { to { transform:rotate(360deg); } }
        .auth-switch { font-family:var(--font-dm),sans-serif; font-size:13px; color:var(--dark); opacity:0.55; text-align:center; margin:18px 0 0; }
        .auth-switch-link { color:var(--gold); text-decoration:none; opacity:1; }
        .auth-switch-link:hover { text-decoration:underline; }
        .auth-back { font-family:var(--font-dm),sans-serif; font-size:12px; color:var(--dark); opacity:0.35; text-decoration:none; text-align:center; margin-top:12px; display:block; transition:opacity 0.2s; }
        .auth-back:hover { opacity:0.7; }
        @media (max-width:480px) { .auth-card { padding:24px 18px; } }
      `}</style>
    </div>
  );
}
