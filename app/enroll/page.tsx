"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Cursor from "../components/Cursor";
import SectionFrame from "../components/SectionFrame";

/* ─── Package definitions ─────────────────────────────────── */
const packages = [
  {
    id: "junior",
    badge: "Starter",
    name: "Junior Batch",
    subtitle: "Ages 8 – 14",
    price: 1500,
    period: "/ month",
    color: "#4a8fd4",
    features: [
      "3 sessions per week",
      "Basic batting & bowling drills",
      "Fielding fundamentals",
      "Monthly progress report",
      "Academy kit discount (10%)",
    ],
    cta: "Enroll in Junior",
  },
  {
    id: "senior",
    badge: "Popular",
    name: "Senior Batch",
    subtitle: "Ages 15 – 21",
    price: 2500,
    period: "/ month",
    color: "#C5A059",
    features: [
      "5 sessions per week",
      "Advanced batting & bowling",
      "Match simulations",
      "Video analysis (2/month)",
      "Fitness & conditioning",
      "Monthly progress report",
    ],
    cta: "Enroll in Senior",
    highlighted: true,
  },
  {
    id: "elite",
    badge: "Elite",
    name: "Elite Program",
    subtitle: "Ages 16+ · High Performance",
    price: 5000,
    period: "/ month",
    color: "#7B1C2A",
    features: [
      "6 sessions per week",
      "1-on-1 coaching sessions",
      "Full HD video analysis",
      "Strength & conditioning",
      "Nutrition & mindset coaching",
      "BCCI trial preparation",
      "Academy kit included",
    ],
    cta: "Enroll in Elite",
  },
  {
    id: "tournament",
    badge: "Season",
    name: "Tournament Package",
    subtitle: "Full seasonal program",
    price: 8000,
    period: "/ season",
    color: "#002D62",
    features: [
      "Everything in Elite",
      "Internal auction entry",
      "Inter-academy tournaments",
      "₹5,100 Best Batsman trophy",
      "₹3,100 Best Bowler trophy",
      "₹2,100 Best Fielder trophy",
      "Match Day food included",
      "Official kit provided",
    ],
    cta: "Enroll for Season",
  },
];

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-sdk")) return resolve(true);
    const script = document.createElement("script");
    script.id = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: string;
  packageId: string;
};
type FormErrors = Partial<Record<keyof FormData, string>>;

function validateForm(form: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!form.firstName.trim() || form.firstName.trim().length < 2)
    errors.firstName = "Enter a valid first name.";
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Enter a valid email address.";
  if (!form.phone.trim() || !/^\+?[\d\s\-()]{7,15}$/.test(form.phone))
    errors.phone = "Enter a valid phone number.";
  const ageNum = parseInt(form.age);
  if (!form.age || isNaN(ageNum) || ageNum < 6 || ageNum > 60)
    errors.age = "Enter a valid age (6–60).";
  if (!form.packageId)
    errors.packageId = "Please select a package.";
  return errors;
}

export default function EnrollPage() {
  const [selectedPkg, setSelectedPkg] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>({
    firstName: "", lastName: "", email: "", phone: "", age: "", packageId: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [payStatus, setPayStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [payError, setPayError] = useState("");

  // Auto-select package from ?package= query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pkgParam = params.get("package");
    if (pkgParam && packages.some((p) => p.id === pkgParam)) {
      setSelectedPkg(pkgParam);
      setTimeout(() => {
        document.getElementById("enroll-form-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  }, []);

  // Sync selected package to form
  useEffect(() => {
    if (selectedPkg) {
      const updated = { ...form, packageId: selectedPkg };
      setForm(updated);
      if (touched.packageId) {
        const e = validateForm(updated);
        setErrors(prev => ({ ...prev, packageId: e.packageId }));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPkg]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    setForm(updated);
    if (touched[name as keyof FormData]) {
      const e = validateForm(updated);
      setErrors(prev => ({ ...prev, [name]: e[name as keyof FormData] }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const e2 = validateForm(form);
    setErrors(prev => ({ ...prev, [name]: e2[name as keyof FormData] }));
  };

  const pkg = packages.find(p => p.id === form.packageId);

  const handlePay = async () => {
    const allTouched: Partial<Record<keyof FormData, boolean>> = {
      firstName: true, lastName: true, email: true, phone: true, age: true, packageId: true,
    };
    setTouched(allTouched);
    const errs = validateForm(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    if (!pkg) return;

    setPayStatus("loading");
    setPayError("");

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setPayStatus("error");
      setPayError("Failed to load payment gateway. Check your connection.");
      return;
    }

    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: pkg.price,
          receipt: `braj_${Date.now()}`,
          notes: {
            name: `${form.firstName} ${form.lastName}`,
            email: form.email,
            phone: form.phone,
            age: form.age,
            package: pkg.name,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order creation failed.");

      // Task 4: Button already set to "loading" — Razorpay modal opening prevents duplicate orders
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Braj Cricket Academy",
        description: `Enrollment — ${pkg.name}`,
        order_id: data.orderId,
        prefill: {
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#C5A059" },
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string }) => {
          // Task 6: Verify payment server-side before showing success
          try {
            const verifyRes = await fetch("/api/enroll/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                expectedAmount: pkg?.price,
                notes: {
                  name: `${form.firstName} ${form.lastName}`,
                  email: form.email,
                  phone: form.phone,
                  age: form.age,
                  package: pkg?.name,
                  packageId: pkg?.id,
                },
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.verified) {
              setPayStatus("error");
              setPayError("Payment could not be verified. Please contact support with your payment ID: " + response.razorpay_payment_id);
              return;
            }
          } catch {
            setPayStatus("error");
            setPayError("Verification failed. Please contact support.");
            return;
          }
          setPayStatus("success");
          setForm({ firstName: "", lastName: "", email: "", phone: "", age: "", packageId: "" });
          setSelectedPkg(null);
          setTouched({});
          setErrors({});
        },
        modal: {
          ondismiss: () => {
            // Task 4: Re-enable button when modal is dismissed without payment
            if (payStatus !== "success") setPayStatus("idle");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (resp: { error: { description: string } }) => {
        setPayStatus("error");
        setPayError(resp.error?.description || "Payment failed. Please try again.");
      });
      rzp.open();
      setPayStatus("idle");
    } catch (err: unknown) {
      setPayStatus("error");
      setPayError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <>
      <Cursor />
      <main style={{ minHeight: "100vh" }}>
        <Navbar />

        {/* Header */}
        <div className="enroll-header">
          <p className="enroll-eyebrow">Join the Academy</p>
          <h1 className="enroll-title">
            Choose Your<br />
            <em>Program</em>
          </h1>
          <p className="enroll-subtitle">
            Train under BCCI-certified coaches. Select the package that fits your ambition.
          </p>
        </div>

        {/* Packages */}
        <SectionFrame>
          <div className="enroll-packages">
            {packages.map((p, i) => (
              <motion.div
                key={p.id}
                className={`enroll-pkg-card ${p.highlighted ? "enroll-pkg-card--highlight" : ""} ${selectedPkg === p.id ? "enroll-pkg-card--selected" : ""}`}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                style={{ "--pkg-color": p.color } as React.CSSProperties}
                onClick={() => setSelectedPkg(p.id)}
              >
                <div className="enroll-pkg-top">
                  <span className="enroll-pkg-badge">{p.badge}</span>
                  {p.highlighted && <span className="enroll-pkg-popular">⭑ Most Popular</span>}
                </div>
                <h2 className="enroll-pkg-name">{p.name}</h2>
                <p className="enroll-pkg-sub">{p.subtitle}</p>
                <div className="enroll-pkg-price">
                  <span className="enroll-pkg-currency">₹</span>
                  <span className="enroll-pkg-amount">{p.price.toLocaleString("en-IN")}</span>
                  <span className="enroll-pkg-period">{p.period}</span>
                </div>
                <ul className="enroll-pkg-features">
                  {p.features.map((f, j) => (
                    <li key={j} className="enroll-pkg-feature">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="7" fill="var(--pkg-color)" fillOpacity="0.18" />
                        <path d="M4 7l2 2 4-4" stroke="var(--pkg-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`enroll-pkg-btn ${selectedPkg === p.id ? "enroll-pkg-btn--active" : ""}`}
                  onClick={(e) => { e.stopPropagation(); setSelectedPkg(p.id); }}
                >
                  {selectedPkg === p.id ? "✓ Selected" : p.cta}
                </button>
              </motion.div>
            ))}
          </div>
          {errors.packageId && (
            <p className="enroll-field-error" style={{ textAlign: "center", marginTop: 8 }}>{errors.packageId}</p>
          )}
        </SectionFrame>

        {/* Enrollment Form */}
        <SectionFrame>
          <div id="enroll-form-section" className="enroll-form-section">
            <div className="enroll-form-left">
              <h2 className="enroll-form-heading">Your Details</h2>
              <p className="enroll-form-desc">
                Fill in your information below. After clicking Pay &amp; Enroll, you&apos;ll be taken
                to our secure Razorpay checkout. Your spot is confirmed once payment is complete.
              </p>

              {/* Selected package summary */}
              <AnimatePresence mode="wait">
                {pkg && (
                  <motion.div
                    key={pkg.id}
                    className="enroll-selected-summary"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    style={{ "--pkg-color": pkg.color } as React.CSSProperties}
                  >
                    <div className="enroll-summary-row">
                      <span className="enroll-summary-label">Selected Package</span>
                      <span className="enroll-summary-pkg">{pkg.name}</span>
                    </div>
                    <div className="enroll-summary-row">
                      <span className="enroll-summary-label">Amount</span>
                      <span className="enroll-summary-price">
                        ₹{pkg.price.toLocaleString("en-IN")}<span>{pkg.period}</span>
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Form */}
            <div className="enroll-form-right">
              <AnimatePresence>
                {payStatus === "success" ? (
                  <motion.div
                    className="enroll-success"
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.45 }}
                  >
                    <div className="enroll-success-icon">
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#C5A059" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                    <h3 className="enroll-success-title">You&apos;re Enrolled!</h3>
                    <p className="enroll-success-msg">
                      Welcome to Braj Cricket Academy. Check your email for confirmation and batch timings.
                    </p>
                    <button className="enroll-success-reset" onClick={() => setPayStatus("idle")}>
                      Enroll Another →
                    </button>
                  </motion.div>
                ) : (
                  <motion.div className="enroll-form-card" key="form">
                    {/* Name row */}
                    <div className="enroll-form-row">
                      <div className="enroll-field">
                        <label className="enroll-label">First Name</label>
                        <input
                          className={`enroll-input${errors.firstName ? " enroll-input--err" : ""}`}
                          type="text" name="firstName" placeholder="Virat"
                          value={form.firstName} onChange={handleChange} onBlur={handleBlur}
                        />
                        {errors.firstName && <span className="enroll-field-error">{errors.firstName}</span>}
                      </div>
                      <div className="enroll-field">
                        <label className="enroll-label">Last Name</label>
                        <input
                          className="enroll-input"
                          type="text" name="lastName" placeholder="Kohli"
                          value={form.lastName} onChange={handleChange} onBlur={handleBlur}
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="enroll-field">
                      <label className="enroll-label">Email</label>
                      <input
                        className={`enroll-input${errors.email ? " enroll-input--err" : ""}`}
                        type="email" name="email" placeholder="you@example.com"
                        value={form.email} onChange={handleChange} onBlur={handleBlur}
                      />
                      {errors.email && <span className="enroll-field-error">{errors.email}</span>}
                    </div>

                    {/* Phone + Age row */}
                    <div className="enroll-form-row">
                      <div className="enroll-field">
                        <label className="enroll-label">Phone</label>
                        <input
                          className={`enroll-input${errors.phone ? " enroll-input--err" : ""}`}
                          type="tel" name="phone" placeholder="+91 98765 43210"
                          value={form.phone} onChange={handleChange} onBlur={handleBlur}
                        />
                        {errors.phone && <span className="enroll-field-error">{errors.phone}</span>}
                      </div>
                      <div className="enroll-field">
                        <label className="enroll-label">Age</label>
                        <input
                          className={`enroll-input${errors.age ? " enroll-input--err" : ""}`}
                          type="number" name="age" placeholder="17" min="6" max="60"
                          value={form.age} onChange={handleChange} onBlur={handleBlur}
                        />
                        {errors.age && <span className="enroll-field-error">{errors.age}</span>}
                      </div>
                    </div>

                    {/* Package select */}
                    <div className="enroll-field">
                      <label className="enroll-label">Package</label>
                      <select
                        className={`enroll-input enroll-select${errors.packageId ? " enroll-input--err" : ""}`}
                        name="packageId" value={form.packageId}
                        onChange={(e) => { handleChange(e); setSelectedPkg(e.target.value); }}
                        onBlur={handleBlur}
                      >
                        <option value="">Select a package…</option>
                        {packages.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} — ₹{p.price.toLocaleString("en-IN")}{p.period}
                          </option>
                        ))}
                      </select>
                      {errors.packageId && <span className="enroll-field-error">{errors.packageId}</span>}
                    </div>

                    {payStatus === "error" && (
                      <p className="enroll-pay-error">{payError}</p>
                    )}

                    <motion.button
                      className="enroll-pay-btn"
                      onClick={handlePay}
                      disabled={payStatus === "loading"}
                      whileTap={{ scale: 0.97 }}
                    >
                      {payStatus === "loading" ? (
                        <span className="enroll-spinner" />
                      ) : (
                        <>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="1" y="4" width="22" height="16" rx="3" />
                            <path d="M1 10h22" />
                          </svg>
                          Pay &amp; Enroll
                          {pkg && <span className="enroll-pay-amount"> — ₹{pkg.price.toLocaleString("en-IN")}</span>}
                        </>
                      )}
                    </motion.button>

                    <p className="enroll-secure-note">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0110 0v4" />
                      </svg>
                      Payments secured by Razorpay · 256-bit SSL
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </SectionFrame>

        {/* Razorpay badge */}
        <div className="enroll-footer">
          <p>
            Questions?{" "}
            <Link href="/contact" className="enroll-footer-link">Contact the academy →</Link>
          </p>
        </div>

        <style>{`
          @keyframes enrollFadeUp {
            from { opacity: 0; transform: translateY(22px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          /* ── Header ── */
          .enroll-header {
            padding: 130px 5% 52px;
          }
          .enroll-eyebrow {
            font-family: var(--font-fell), serif;
            font-size: 11px;
            color: var(--gold);
            letter-spacing: 0.22em;
            text-transform: uppercase;
            opacity: 0.85;
            margin-bottom: 14px;
            animation: enrollFadeUp 0.6s ease 0.1s both;
          }
          .enroll-title {
            font-family: var(--font-bebas), serif;
            font-size: clamp(52px, 8vw, 110px);
            color: var(--dark);
            line-height: 1;
            letter-spacing: 0.01em;
            margin: 0 0 20px;
            animation: enrollFadeUp 0.7s ease 0.18s both;
          }
          .enroll-title em { font-style: italic; color: var(--gold); }
          .enroll-subtitle {
            font-family: var(--font-dm), sans-serif;
            font-size: clamp(14px, 1.4vw, 17px);
            color: var(--dark);
            opacity: 0.6;
            max-width: 520px;
            line-height: 1.65;
            animation: enrollFadeUp 0.7s ease 0.25s both;
          }

          /* ── Package grid ── */
          .enroll-packages {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            padding: 48px calc(5% + 32px) 64px;
          }
          .enroll-pkg-card {
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(201,168,76,0.14);
            border-radius: 18px;
            padding: 28px 24px 24px;
            cursor: pointer;
            transition: border-color 0.25s, box-shadow 0.25s, transform 0.2s;
            display: flex;
            flex-direction: column;
            gap: 0;
          }
          .enroll-pkg-card:hover {
            border-color: rgba(201,168,76,0.35);
            transform: translateY(-3px);
            box-shadow: 0 12px 40px rgba(0,0,0,0.22);
          }
          .enroll-pkg-card--highlight {
            border-color: rgba(197,160,89,0.42);
            background: rgba(197,160,89,0.07);
            box-shadow: 0 0 0 1px rgba(197,160,89,0.22), 0 8px 32px rgba(197,160,89,0.12);
          }
          .enroll-pkg-card--selected {
            border-color: var(--pkg-color) !important;
            box-shadow: 0 0 0 2px var(--pkg-color), 0 12px 40px rgba(0,0,0,0.25) !important;
          }
          html:not(.dark) .enroll-pkg-card {
            background: rgba(255,255,255,0.7);
            border-color: rgba(201,168,76,0.2);
          }
          html:not(.dark) .enroll-pkg-card--highlight {
            background: rgba(197,160,89,0.08);
          }

          .enroll-pkg-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
          }
          .enroll-pkg-badge {
            font-family: var(--font-dm), sans-serif;
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: var(--pkg-color);
            background: rgba(from var(--pkg-color) r g b / 0.12);
            border: 1px solid rgba(from var(--pkg-color) r g b / 0.2);
            padding: 3px 9px;
            border-radius: 20px;
          }
          .enroll-pkg-popular {
            font-family: var(--font-dm), sans-serif;
            font-size: 9px;
            color: var(--gold);
            opacity: 0.75;
          }
          .enroll-pkg-name {
            font-family: var(--font-bebas), serif;
            font-size: 28px;
            color: var(--dark);
            letter-spacing: 0.02em;
            line-height: 1;
            margin: 0 0 4px;
          }
          .enroll-pkg-sub {
            font-family: var(--font-dm), sans-serif;
            font-size: 11px;
            color: var(--dark);
            opacity: 0.45;
            margin-bottom: 20px;
          }
          .enroll-pkg-price {
            display: flex;
            align-items: baseline;
            gap: 2px;
            margin-bottom: 22px;
          }
          .enroll-pkg-currency {
            font-family: var(--font-dm), sans-serif;
            font-size: 18px;
            color: var(--pkg-color);
            font-weight: 500;
          }
          .enroll-pkg-amount {
            font-family: var(--font-bebas), serif;
            font-size: 44px;
            color: var(--dark);
            line-height: 1;
            letter-spacing: 0.01em;
          }
          .enroll-pkg-period {
            font-family: var(--font-dm), sans-serif;
            font-size: 12px;
            color: var(--dark);
            opacity: 0.45;
            margin-left: 4px;
          }
          .enroll-pkg-features {
            list-style: none;
            margin: 0 0 24px;
            padding: 0;
            display: flex;
            flex-direction: column;
            gap: 10px;
            flex: 1;
          }
          .enroll-pkg-feature {
            font-family: var(--font-dm), sans-serif;
            font-size: 12.5px;
            color: var(--dark);
            opacity: 0.75;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .enroll-pkg-btn {
            width: 100%;
            padding: 11px 16px;
            border-radius: 12px;
            font-family: var(--font-dm), sans-serif;
            font-size: 13px;
            font-weight: 600;
            letter-spacing: 0.04em;
            cursor: pointer;
            transition: all 0.22s;
            border: 1px solid rgba(201,168,76,0.35);
            background: transparent;
            color: var(--gold);
            margin-top: auto;
          }
          .enroll-pkg-btn:hover {
            background: rgba(197,160,89,0.12);
            border-color: var(--gold);
          }
          .enroll-pkg-btn--active {
            background: var(--gold);
            color: #0D1117;
            border-color: var(--gold);
          }

          /* ── Form section ── */
          .enroll-form-section {
            display: grid;
            grid-template-columns: 1fr 1.5fr;
            gap: 64px;
            padding: 56px calc(5% + 32px) 80px;
            align-items: start;
          }
          .enroll-form-heading {
            font-family: var(--font-bebas), serif;
            font-size: clamp(32px, 4vw, 56px);
            color: var(--dark);
            margin: 0 0 14px;
            letter-spacing: 0.02em;
            line-height: 1;
          }
          .enroll-form-desc {
            font-family: var(--font-dm), sans-serif;
            font-size: 13.5px;
            color: var(--dark);
            opacity: 0.55;
            line-height: 1.7;
            max-width: 340px;
          }
          .enroll-selected-summary {
            margin-top: 28px;
            padding: 18px 20px;
            border-radius: 14px;
            border: 1px solid var(--pkg-color);
            background: rgba(from var(--pkg-color) r g b / 0.06);
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .enroll-summary-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .enroll-summary-label {
            font-family: var(--font-dm), sans-serif;
            font-size: 10px;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            color: var(--dark);
            opacity: 0.45;
          }
          .enroll-summary-pkg {
            font-family: var(--font-bebas), serif;
            font-size: 18px;
            color: var(--dark);
            letter-spacing: 0.04em;
          }
          .enroll-summary-price {
            font-family: var(--font-bebas), serif;
            font-size: 22px;
            color: var(--gold);
            letter-spacing: 0.02em;
          }
          .enroll-summary-price span {
            font-family: var(--font-dm), sans-serif;
            font-size: 11px;
            color: var(--dark);
            opacity: 0.45;
            margin-left: 3px;
          }

          /* ── Form card ── */
          .enroll-form-card {
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(201,168,76,0.16);
            border-radius: 20px;
            padding: 32px 28px;
            display: flex;
            flex-direction: column;
            gap: 18px;
          }
          html:not(.dark) .enroll-form-card {
            background: rgba(255,255,255,0.75);
            border-color: rgba(201,168,76,0.22);
            box-shadow: 0 4px 24px rgba(0,0,0,0.06);
          }

          .enroll-form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }
          .enroll-field {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }
          .enroll-label {
            font-family: var(--font-dm), sans-serif;
            font-size: 10px;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            color: var(--gold);
            opacity: 0.8;
          }
          .enroll-input {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(201,168,76,0.2);
            border-radius: 10px;
            padding: 11px 14px;
            font-family: var(--font-dm), sans-serif;
            font-size: 13.5px;
            color: var(--dark);
            outline: none;
            transition: border-color 0.2s, background 0.2s;
            width: 100%;
            box-sizing: border-box;
          }
          html:not(.dark) .enroll-input {
            background: #faf8f3;
            border-color: rgba(201,168,76,0.28);
            color: #1a1209;
          }
          .enroll-input:focus {
            border-color: rgba(197,160,89,0.55);
            background: rgba(255,255,255,0.08);
          }
          html:not(.dark) .enroll-input:focus {
            background: #fff;
            border-color: rgba(197,160,89,0.6);
          }
          .enroll-input--err { border-color: rgba(224,92,92,0.6) !important; }
          .enroll-field-error {
            font-family: var(--font-dm), sans-serif;
            font-size: 11px;
            color: #e05c5c;
          }
          .enroll-select {
            appearance: none;
            -webkit-appearance: none;
            cursor: pointer;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23C5A059' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 12px center;
            padding-right: 36px;
          }
          .enroll-select option {
            background: #161a22;
            color: #F2EFE4;
          }
          html:not(.dark) .enroll-select option {
            background: #f2efe4;
            color: #1a1209;
          }

          /* ── Pay button ── */
          .enroll-pay-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            width: 100%;
            padding: 14px 20px;
            border-radius: 14px;
            background: var(--gold);
            border: none;
            color: #0D1117;
            font-family: var(--font-dm), sans-serif;
            font-size: 14px;
            font-weight: 700;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            cursor: pointer;
            transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 4px 20px rgba(197,160,89,0.30);
            margin-top: 4px;
          }
          .enroll-pay-btn:hover { opacity: 0.88; box-shadow: 0 6px 28px rgba(197,160,89,0.4); }
          .enroll-pay-btn:disabled { opacity: 0.55; cursor: not-allowed; }
          .enroll-pay-amount { opacity: 0.75; font-weight: 500; }
          .enroll-spinner {
            width: 18px; height: 18px;
            border: 2px solid rgba(13,17,23,0.3);
            border-top-color: #0D1117;
            border-radius: 50%;
            animation: spin 0.7s linear infinite;
          }
          .enroll-pay-error {
            font-family: var(--font-dm), sans-serif;
            font-size: 12px;
            color: #e05c5c;
            text-align: center;
          }
          .enroll-secure-note {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            font-family: var(--font-dm), sans-serif;
            font-size: 11px;
            color: var(--dark);
            opacity: 0.35;
          }

          /* ── Success ── */
          .enroll-success {
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(201,168,76,0.2);
            border-radius: 20px;
            padding: 48px 32px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 14px;
          }
          .enroll-success-icon {
            width: 64px; height: 64px;
            border-radius: 50%;
            background: rgba(197,160,89,0.12);
            border: 1px solid rgba(197,160,89,0.3);
            display: flex; align-items: center; justify-content: center;
          }
          .enroll-success-title {
            font-family: var(--font-bebas), serif;
            font-size: 36px;
            color: var(--dark);
            margin: 0;
            letter-spacing: 0.04em;
          }
          .enroll-success-msg {
            font-family: var(--font-dm), sans-serif;
            font-size: 13.5px;
            color: var(--dark);
            opacity: 0.6;
            line-height: 1.65;
            max-width: 320px;
          }
          .enroll-success-reset {
            margin-top: 8px;
            background: none;
            border: 1px solid rgba(201,168,76,0.35);
            border-radius: 10px;
            padding: 9px 20px;
            font-family: var(--font-dm), sans-serif;
            font-size: 12px;
            color: var(--gold);
            cursor: pointer;
            transition: background 0.2s;
          }
          .enroll-success-reset:hover { background: rgba(197,160,89,0.1); }

          /* ── Footer ── */
          .enroll-footer {
            padding: 24px 5% 48px;
            font-family: var(--font-dm), sans-serif;
            font-size: 13px;
            color: var(--dark);
            opacity: 0.5;
            text-align: center;
          }
          .enroll-footer-link {
            color: var(--gold);
            text-decoration: none;
            opacity: 1;
          }
          .enroll-footer-link:hover { text-decoration: underline; }

          /* ── Responsive ── */
          @media (max-width: 1100px) {
            .enroll-packages { grid-template-columns: repeat(2, 1fr); }
          }
          @media (max-width: 768px) {
            .enroll-header { padding: 100px 20px 36px; }
            .enroll-packages { grid-template-columns: 1fr; padding: 32px 20px 48px; gap: 16px; }
            .enroll-form-section { grid-template-columns: 1fr; gap: 32px; padding: 32px 20px 56px; }
            .enroll-form-desc { max-width: 100%; }
            .enroll-form-card { padding: 24px 18px; }
            .enroll-form-row { grid-template-columns: 1fr; gap: 14px; }
          }
        `}</style>
      </main>
    </>
  );
}
