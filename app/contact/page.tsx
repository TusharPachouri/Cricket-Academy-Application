"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Cursor from "../components/Cursor";
import SectionFrame from "../components/SectionFrame";

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="3" />
    <path d="M2 7l10 7 10-7" />
  </svg>
);
const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.04 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);
const LocationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);
const CheckIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C5A059" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

type FormFields = { firstName: string; lastName: string; email: string; phone: string; message: string };
type FormErrors = Partial<Record<keyof FormFields, string>>;

function validate(form: FormFields): FormErrors {
  const errors: FormErrors = {};

  if (!form.firstName.trim())
    errors.firstName = "First name is required.";
  else if (form.firstName.trim().length < 2)
    errors.firstName = "Must be at least 2 characters.";

  if (form.lastName.trim() && form.lastName.trim().length < 2)
    errors.lastName = "Must be at least 2 characters.";

  if (!form.email.trim())
    errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Enter a valid email address.";

  if (form.phone.trim()) {
    const digits = form.phone.replace(/\D/g, "");
    if (digits.length < 7 || digits.length > 15)
      errors.phone = "Enter a valid phone number (7–15 digits).";
  }

  if (!form.message.trim())
    errors.message = "Message is required.";
  else if (form.message.trim().length < 20)
    errors.message = `At least 20 characters required (${form.message.trim().length}/20).`;

  return errors;
}

export default function ContactPage() {
  const [form, setForm] = useState<FormFields>({ firstName: "", lastName: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormFields, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    setForm(updated);
    // Re-validate touched field live
    if (touched[name as keyof FormFields]) {
      const newErrors = validate(updated);
      setErrors(prev => ({ ...prev, [name]: newErrors[name as keyof FormFields] }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const newErrors = validate(form);
    setErrors(prev => ({ ...prev, [name]: newErrors[name as keyof FormFields] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Mark all fields touched and validate
    const allTouched = { firstName: true, lastName: true, email: true, phone: true, message: true };
    setTouched(allTouched);
    const newErrors = validate(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, _hp: "" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("success");
      setForm({ firstName: "", lastName: "", email: "", phone: "", message: "" });
      setErrors({});
      setTouched({});
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const contactDetails = [
    { icon: <MailIcon />, label: "Email", value: "brajcricketacademy@gmail.com", href: "mailto:brajcricketacademy@gmail.com" },
    { icon: <PhoneIcon />, label: "Phone", value: "+91 98765 43210", href: "tel:+919876543210" },
    { icon: <LocationIcon />, label: "Address", value: "Braj Sports Complex, Mathura, UP — 281001", href: "#" },
    { icon: <ClockIcon />, label: "Hours", value: "Mon – Sat, 6 AM – 8 PM", href: undefined },
  ];

  return (
    <>
      <Cursor />
      <main style={{ minHeight: "100vh" }}>
        <Navbar />

        {/* Page header */}
        <div className="contact-header">
          <p className="contact-eyebrow">Get in Touch</p>
          <h1 className="contact-title">
            Write to<br />
            <em>the Academy</em>
          </h1>
        </div>

        {/* Main two-column section */}
        <SectionFrame>
          <div className="contact-body">

            {/* LEFT — info */}
            <motion.div
              className="contact-info"
              initial={{ opacity: 0, x: -32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <p className="contact-info-desc">
                Whether you have a question about our programs, fees, or coaching staff —
                our team is ready to assist you. Reach out and we&apos;ll get back within 24 hours.
              </p>

              <div className="contact-details-list">
                {contactDetails.map((item, i) => (
                  <motion.div
                    key={i}
                    className="contact-detail-item"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                  >
                    <span className="contact-detail-icon">{item.icon}</span>
                    <div>
                      <span className="contact-detail-label">{item.label}</span>
                      {item.href && item.href !== "#" ? (
                        <a href={item.href} className="contact-detail-value contact-detail-link">{item.value}</a>
                      ) : (
                        <span className="contact-detail-value">{item.value}</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* RIGHT — form */}
            <motion.div
              className="contact-form-wrap"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    className="contact-success"
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="contact-success-icon"><CheckIcon /></div>
                    <h3 className="contact-success-title">Message Sent!</h3>
                    <p className="contact-success-sub">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                    <button className="contact-success-reset" onClick={() => setStatus("idle")}>
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    className="contact-form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Row: first + last name */}
                    <div className="contact-form-row">
                      <div className="contact-field">
                        <label className="contact-label">First Name</label>
                        <input
                          className={`contact-input${errors.firstName ? " contact-input--error" : ""}`}
                          type="text"
                          name="firstName"
                          placeholder="Virat"
                          value={form.firstName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.firstName && <span className="contact-field-error">{errors.firstName}</span>}
                      </div>
                      <div className="contact-field">
                        <label className="contact-label">Last Name</label>
                        <input
                          className={`contact-input${errors.lastName ? " contact-input--error" : ""}`}
                          type="text"
                          name="lastName"
                          placeholder="Kohli"
                          value={form.lastName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.lastName && <span className="contact-field-error">{errors.lastName}</span>}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="contact-field">
                      <label className="contact-label">Email</label>
                      <input
                        className={`contact-input${errors.email ? " contact-input--error" : ""}`}
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.email && <span className="contact-field-error">{errors.email}</span>}
                    </div>

                    {/* Phone */}
                    <div className="contact-field">
                      <label className="contact-label">
                        Phone <span className="contact-optional" style={{ opacity: 0.45, fontWeight: 400 }}>(optional)</span>
                      </label>
                      <input
                        className={`contact-input${errors.phone ? " contact-input--error" : ""}`}
                        type="tel"
                        name="phone"
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.phone && <span className="contact-field-error">{errors.phone}</span>}
                    </div>

                    {/* Message */}
                    <div className="contact-field">
                      <label className="contact-label" style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>How can we help you?</span>
                        <span style={{ opacity: 0.4, fontWeight: 400, letterSpacing: 0 }}>
                          {form.message.trim().length}/20 min
                        </span>
                      </label>
                      <textarea
                        className={`contact-input contact-textarea${errors.message ? " contact-input--error" : ""}`}
                        name="message"
                        placeholder="Tell us about your goals, questions or enquiry..."
                        value={form.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        rows={5}
                      />
                      {errors.message && <span className="contact-field-error">{errors.message}</span>}
                    </div>

                    {/* Task 5: Honeypot — hidden from humans, bots fill it, API silently rejects */}
                    <input
                      type="text"
                      name="_hp"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
                    />

                    {status === "error" && (
                      <p className="contact-error">{errorMsg}</p>
                    )}

                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <motion.button
                        type="submit"
                        className="contact-submit"
                        disabled={status === "loading"}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {status === "loading" ? (
                          <span className="contact-spinner" />
                        ) : (
                          <>Send Message <span style={{ marginLeft: 6 }}>→</span></>
                        )}
                      </motion.button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>

          </div>
        </SectionFrame>
      </main>

      <style jsx global>{`
        /* ── Contact page ── */
        @keyframes contactFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .contact-header {
          padding: 120px 5% 48px;
        }
        .contact-eyebrow {
          font-family: var(--font-fell), serif;
          font-size: 11px;
          color: var(--gold);
          letter-spacing: 0.22em;
          text-transform: uppercase;
          opacity: 0.85;
          margin-bottom: 14px;
          animation: contactFadeUp 0.6s ease 0.1s both;
        }
        html:not(.dark) .contact-eyebrow { color: #7a5c1e; opacity: 1; }
        .contact-title {
          font-family: var(--font-bebas), serif;
          font-size: clamp(52px, 8vw, 110px);
          color: var(--dark);
          line-height: 1;
          letter-spacing: 0.01em;
          margin: 0;
          animation: contactFadeUp 0.7s ease 0.2s both;
        }
        .contact-title em {
          font-style: italic;
          color: var(--gold);
        }

        /* Two-column layout — padded inside the SectionFrame rails (5% inset + 40px buffer) */
        .contact-body {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 64px;
          padding: 56px calc(5% + 40px) 80px;
          align-items: start;
        }

        /* Left info column */
        .contact-info-desc {
          font-family: var(--font-dm), sans-serif;
          font-size: 15px;
          color: var(--dark);
          opacity: 0.65;
          line-height: 1.75;
          margin-bottom: 40px;
          max-width: 380px;
        }
        .contact-details-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .contact-detail-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }
        .contact-detail-icon {
          color: var(--gold);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .contact-detail-label {
          display: block;
          font-family: var(--font-fell), serif;
          font-size: 10px;
          color: var(--gold);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-bottom: 3px;
          opacity: 0.75;
        }
        html:not(.dark) .contact-detail-label { color: #7a5c1e; opacity: 1; }
        .contact-detail-value {
          display: block;
          font-family: var(--font-dm), sans-serif;
          font-size: 14px;
          color: var(--dark);
          line-height: 1.5;
        }
        .contact-detail-link {
          text-decoration: none;
          transition: color 0.2s;
        }
        .contact-detail-link:hover { color: var(--gold); }

        /* Right form */
        .contact-form-wrap {
          background: rgba(28, 32, 38, 0.55);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          padding: 40px 36px;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        html:not(.dark) .contact-form-wrap {
          background: rgba(245, 241, 232, 0.75);
          border-color: rgba(201, 168, 76, 0.18);
        }
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .contact-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .contact-field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
        .contact-label {
          font-family: var(--font-fell), serif;
          font-size: 10px;
          color: var(--gold);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          opacity: 0.8;
        }
        html:not(.dark) .contact-label { color: #7a5c1e; opacity: 1; }
        .contact-input {
          font-family: var(--font-dm), sans-serif;
          font-size: 14px;
          color: var(--dark);
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 12px 16px;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          resize: none;
          width: 100%;
          box-sizing: border-box;
        }
        html:not(.dark) .contact-input {
          background: #fff;
          border-color: rgba(0,0,0,0.12);
          color: #1a1a1a;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        }
        .contact-input::placeholder { opacity: 0.35; }
        html:not(.dark) .contact-input::placeholder { color: #4a3a22; opacity: 0.55; }
        html:not(.dark) .contact-optional { color: #4a3a22; opacity: 0.6; }
        .contact-input:focus {
          border-color: rgba(197, 160, 89, 0.55);
          background: rgba(255,255,255,0.08);
        }
        html:not(.dark) .contact-input:focus {
          border-color: rgba(197,160,89,0.6);
          background: #fff;
        }
        .contact-input--error {
          border-color: rgba(224, 92, 92, 0.6) !important;
        }
        .contact-field-error {
          font-family: var(--font-dm), sans-serif;
          font-size: 11.5px;
          color: #e05c5c;
          margin-top: -2px;
        }
        .contact-textarea { min-height: 130px; }

        /* Submit button */
        .contact-submit {
          font-family: var(--font-barlow), sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #1a1000;
          background: linear-gradient(135deg, #e9c176, #C5A059);
          border: none;
          border-radius: 50px;
          padding: 14px 32px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: opacity 0.2s;
          min-width: 160px;
          justify-content: center;
        }
        .contact-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Spinner */
        .contact-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(30,20,0,0.25);
          border-top-color: #1a1000;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Error */
        .contact-error {
          font-family: var(--font-dm), sans-serif;
          font-size: 13px;
          color: #e05c5c;
          margin: 0;
        }

        /* Success state */
        .contact-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 48px 24px;
          gap: 12px;
          min-height: 340px;
        }
        .contact-success-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(197,160,89,0.12);
          border: 1.5px solid rgba(197,160,89,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
        }
        .contact-success-title {
          font-family: var(--font-playfair), serif;
          font-size: 26px;
          font-weight: 700;
          color: var(--dark);
          margin: 0;
        }
        .contact-success-sub {
          font-family: var(--font-dm), sans-serif;
          font-size: 14px;
          color: var(--dark);
          opacity: 0.55;
          max-width: 320px;
          line-height: 1.65;
          margin: 0;
        }
        .contact-success-reset {
          margin-top: 16px;
          font-family: var(--font-fell), serif;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--gold);
          background: none;
          border: none;
          cursor: pointer;
          opacity: 0.75;
          transition: opacity 0.2s;
        }
        .contact-success-reset:hover { opacity: 1; }

        /* Responsive */
        @media (max-width: 900px) {
          .contact-body {
            grid-template-columns: 1fr;
            gap: 40px;
            padding: 48px calc(5% + 24px) 64px;
          }
          .contact-info-desc { max-width: 100%; }
        }
        @media (max-width: 600px) {
          .contact-header { padding: 100px 16px 36px; }
          /* On mobile the rail is 16px, add 16px buffer inside = 32px total */
          .contact-body { padding: 32px 32px 60px; }
          .contact-form-wrap { padding: 28px 20px; }
          .contact-form-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
