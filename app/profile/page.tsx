"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type Enrollment = {
  _id: string;
  package: string;
  packageId: string;
  amount: number;
  status: string;
  razorpayPaymentId?: string;
  razorpayOrderId: string;
  createdAt: string;
};

type Batch = {
  _id: string;
  name: string;
  days: string[];
  timeStart: string;
  timeEnd: string;
  coachName: string;
  capacity: number;
  enrolled: number;
};

const statusColor: Record<string, { bg: string; text: string }> = {
  paid: { bg: "rgba(34,197,94,0.12)", text: "#22c55e" },
  pending: { bg: "rgba(245,158,11,0.12)", text: "#f59e0b" },
  failed: { bg: "rgba(239,68,68,0.12)", text: "#ef4444" },
  refunded: { bg: "rgba(107,114,128,0.12)", text: "#6b7280" },
};

const statusLabel: Record<string, string> = {
  paid: "Confirmed",
  pending: "Awaiting Payment",
  failed: "Payment Failed",
  refunded: "Refunded",
};

export default function ProfilePage() {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [activePlan, setActivePlan] = useState<{ enrollment: Enrollment; batch: Batch | null } | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit profile state
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = useCallback(async () => {
    const [enrollRes, batchRes] = await Promise.all([
      fetch("/api/profile/enrollments"),
      fetch("/api/profile/batch"),
    ]);
    const [enrollData, batchData] = await Promise.all([
      enrollRes.json(),
      batchRes.json(),
    ]);
    setEnrollments(enrollData.enrollments ?? []);
    if (batchData.enrollment) {
      setActivePlan({ enrollment: batchData.enrollment, batch: batchData.batch });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) { router.replace("/login"); return; }
    setEditName(session.user.name ?? "");
    loadData();
  }, [session, status, router, loadData]);

  const handleSaveProfile = async () => {
    setEditLoading(true);
    const res = await fetch("/api/profile/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName, phone: editPhone }),
    });
    const data = await res.json();
    setEditLoading(false);
    if (!res.ok) { showToast(data.error ?? "Update failed.", "error"); return; }
    await updateSession({ name: editName });
    setEditOpen(false);
    showToast("Profile updated successfully!");
  };

  if (status === "loading" || loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--page-bg)" }}>
        <div className="prof-spinner" />
      </div>
    );
  }

  if (!session) return null;

  const user = session.user;
  const initials = (user.name ?? user.email ?? "U")
    .split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase();

  const paidEnrollments = enrollments.filter(e => e.status === "paid");
  const totalSpent = paidEnrollments.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="prof-root">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`prof-toast prof-toast--${toast.type}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top bar */}
      <header className="prof-topbar">
        <Link href="/" className="prof-logo">
          <div className="prof-logo-mark">B</div>
          <div>
            <div className="prof-logo-name">BRAJ.</div>
            <div className="prof-logo-sub">Cricket Academy</div>
          </div>
        </Link>
        <div className="prof-topbar-right">
          <Link href="/enroll" className="prof-enroll-btn">Enroll Now</Link>
          <button className="prof-signout" onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</button>
        </div>
      </header>

      <div className="prof-body">
        {/* Profile card */}
        <motion.div
          className="prof-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="prof-card-top">
            <div className="prof-avatar">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt={user.name ?? ""} className="prof-avatar-img" />
              ) : (
                <span className="prof-avatar-initials">{initials}</span>
              )}
            </div>
            <div className="prof-info">
              <h1 className="prof-name">{user.name ?? "Academy Student"}</h1>
              <p className="prof-email">{user.email}</p>
            </div>
            <button className="prof-edit-btn" onClick={() => {
              setEditName(user.name ?? "");
              setEditOpen(o => !o);
            }}>
              {editOpen ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {/* Edit form */}
          <AnimatePresence>
            {editOpen && (
              <motion.div
                className="prof-edit-form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="prof-edit-fields">
                  <div className="prof-field">
                    <label className="prof-label">Full Name</label>
                    <input
                      className="prof-input"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="prof-field">
                    <label className="prof-label">Phone</label>
                    <input
                      className="prof-input"
                      value={editPhone}
                      onChange={e => setEditPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div className="prof-field">
                    <label className="prof-label">Email (read-only)</label>
                    <input className="prof-input prof-input--readonly" value={user.email ?? ""} readOnly />
                  </div>
                </div>
                <button
                  className="prof-save-btn"
                  onClick={handleSaveProfile}
                  disabled={editLoading || editName.trim().length < 2}
                >
                  {editLoading ? <span className="prof-btn-spinner" /> : "Save Changes"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick stats */}
          <div className="prof-quick-stats">
            <div className="prof-qs-item">
              <span className="prof-qs-val">{paidEnrollments.length}</span>
              <span className="prof-qs-label">Active Plans</span>
            </div>
            <div className="prof-qs-divider" />
            <div className="prof-qs-item">
              <span className="prof-qs-val">₹{totalSpent.toLocaleString("en-IN")}</span>
              <span className="prof-qs-label">Total Paid</span>
            </div>
            <div className="prof-qs-divider" />
            <div className="prof-qs-item">
              <span className="prof-qs-val">{enrollments.length}</span>
              <span className="prof-qs-label">All Orders</span>
            </div>
          </div>
        </motion.div>

        {/* My Plan */}
        {activePlan && (
          <motion.div
            className="prof-plan-section"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.45 }}
          >
            <h2 className="prof-section-title">My Active Plan</h2>
            <div className="prof-plan-card">
              <div className="prof-plan-header">
                <div>
                  <h3 className="prof-plan-name">{activePlan.enrollment.package}</h3>
                  <p className="prof-plan-since">
                    Enrolled {new Date(activePlan.enrollment.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit", month: "long", year: "numeric",
                    })}
                  </p>
                </div>
                <span className="prof-plan-badge">Active</span>
              </div>

              {activePlan.batch ? (
                <div className="prof-plan-details">
                  <div className="prof-plan-row">
                    <span className="prof-plan-key">Schedule</span>
                    <span className="prof-plan-val">
                      {activePlan.batch.days.join(", ")} · {activePlan.batch.timeStart}–{activePlan.batch.timeEnd}
                    </span>
                  </div>
                  <div className="prof-plan-row">
                    <span className="prof-plan-key">Coach</span>
                    <span className="prof-plan-val">{activePlan.batch.coachName}</span>
                  </div>
                  <div className="prof-plan-row">
                    <span className="prof-plan-key">Batch</span>
                    <span className="prof-plan-val">{activePlan.batch.name} ({activePlan.batch.enrolled}/{activePlan.batch.capacity} students)</span>
                  </div>
                  <div className="prof-plan-row">
                    <span className="prof-plan-key">Amount</span>
                    <span className="prof-plan-val" style={{ color: "var(--gold)", fontWeight: 700 }}>
                      ₹{activePlan.enrollment.amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="prof-plan-no-batch">Batch details will be shared shortly by the academy.</p>
              )}

              <Link
                href={`/enroll?package=${activePlan.enrollment.packageId}`}
                className="prof-renew-btn"
              >
                Renew / Upgrade Plan →
              </Link>
            </div>
          </motion.div>
        )}

        {/* Enrollment history */}
        <motion.div
          className="prof-section"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: activePlan ? 0.25 : 0.15, duration: 0.45 }}
        >
          <h2 className="prof-section-title">Payment History</h2>

          {enrollments.length === 0 ? (
            <div className="prof-empty">
              <div className="prof-empty-icon">🏏</div>
              <p className="prof-empty-text">No enrollments yet.</p>
              <Link href="/enroll" className="prof-empty-cta">Browse Programs →</Link>
            </div>
          ) : (
            <div className="prof-enrollment-list">
              {enrollments.map((e, i) => {
                const sc = statusColor[e.status] ?? statusColor.pending;
                return (
                  <motion.div
                    key={e._id}
                    className="prof-enrollment-card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 + 0.3, duration: 0.4 }}
                  >
                    <div className="prof-enr-top">
                      <div>
                        <h3 className="prof-enr-pkg">{e.package}</h3>
                        <p className="prof-enr-date">
                          {new Date(e.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit", month: "long", year: "numeric",
                          })}
                        </p>
                      </div>
                      <span className="prof-enr-status" style={{ background: sc.bg, color: sc.text }}>
                        {statusLabel[e.status] ?? e.status}
                      </span>
                    </div>

                    <div className="prof-enr-bottom">
                      <span className="prof-enr-amount">₹{e.amount.toLocaleString("en-IN")}</span>
                      {e.razorpayPaymentId && (
                        <span className="prof-enr-pid">{e.razorpayPaymentId}</span>
                      )}
                    </div>

                    {e.status === "failed" && (
                      <div className="prof-enr-retry">
                        <Link href={`/enroll?package=${e.packageId}`} className="prof-retry-btn">
                          Try Again →
                        </Link>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      <style>{`
        .prof-root {
          min-height: 100vh;
          background: var(--page-bg);
          font-family: var(--font-dm), sans-serif;
        }

        /* Toast */
        .prof-toast {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          padding: 12px 24px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          pointer-events: none;
          white-space: nowrap;
        }
        .prof-toast--success {
          background: rgba(34,197,94,0.15);
          border: 1px solid rgba(34,197,94,0.4);
          color: #22c55e;
        }
        .prof-toast--error {
          background: rgba(239,68,68,0.15);
          border: 1px solid rgba(239,68,68,0.4);
          color: #ef4444;
        }

        /* Top bar */
        .prof-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 36px;
          border-bottom: 1px solid rgba(201,168,76,0.12);
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(12px);
          position: sticky;
          top: 0;
          z-index: 10;
        }
        html:not(.dark) .prof-topbar { background: rgba(255,255,255,0.7); }
        .prof-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .prof-logo-mark {
          width: 34px; height: 34px;
          background: var(--gold);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-bebas), serif;
          font-size: 18px; color: #0D1117;
        }
        .prof-logo-name { font-family: var(--font-bebas), serif; font-size: 15px; color: var(--dark); letter-spacing: 0.05em; line-height: 1; }
        .prof-logo-sub { font-size: 9px; color: var(--gold); opacity: 0.7; letter-spacing: 0.08em; }
        .prof-topbar-right { display: flex; align-items: center; gap: 10px; }
        .prof-enroll-btn {
          padding: 8px 18px;
          background: var(--gold); border-radius: 9px;
          color: #0D1117; font-size: 13px; font-weight: 700;
          text-decoration: none; transition: opacity 0.2s;
        }
        .prof-enroll-btn:hover { opacity: 0.85; }
        .prof-signout {
          padding: 8px 14px;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 9px; color: #ef4444;
          font-family: var(--font-dm), sans-serif;
          font-size: 13px; cursor: pointer; transition: background 0.2s;
        }
        .prof-signout:hover { background: rgba(239,68,68,0.18); }

        /* Body */
        .prof-body {
          max-width: 720px;
          margin: 0 auto;
          padding: 36px 20px 60px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        /* Profile card */
        .prof-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(201,168,76,0.18);
          border-radius: 20px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        html:not(.dark) .prof-card { background: rgba(255,255,255,0.8); box-shadow: 0 4px 24px rgba(0,0,0,0.06); }

        .prof-card-top {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .prof-avatar {
          width: 64px; height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--gold), #8B6914);
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
          border: 2px solid rgba(201,168,76,0.3);
          flex-shrink: 0;
        }
        .prof-avatar-img { width: 100%; height: 100%; object-fit: cover; }
        .prof-avatar-initials { font-family: var(--font-bebas), serif; font-size: 26px; color: #0D1117; }
        .prof-info { flex: 1; min-width: 0; }
        .prof-name { font-family: var(--font-bebas), serif; font-size: 24px; color: var(--dark); margin: 0 0 3px; letter-spacing: 0.02em; }
        .prof-email { font-size: 13px; color: var(--dark); opacity: 0.45; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .prof-edit-btn {
          padding: 7px 14px;
          background: rgba(201,168,76,0.1);
          border: 1px solid rgba(201,168,76,0.25);
          border-radius: 9px;
          color: var(--gold);
          font-family: var(--font-dm), sans-serif;
          font-size: 12px; font-weight: 600;
          cursor: pointer; transition: background 0.2s;
          white-space: nowrap; flex-shrink: 0;
        }
        .prof-edit-btn:hover { background: rgba(201,168,76,0.18); }

        /* Edit form */
        .prof-edit-form { overflow: hidden; }
        .prof-edit-fields {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 14px;
        }
        .prof-edit-fields .prof-field:last-child { grid-column: 1 / -1; }
        .prof-field { display: flex; flex-direction: column; gap: 5px; }
        .prof-label { font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gold); opacity: 0.8; }
        .prof-input {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(201,168,76,0.2);
          border-radius: 9px;
          padding: 9px 12px;
          font-family: var(--font-dm), sans-serif;
          font-size: 13px; color: var(--dark); outline: none;
          transition: border-color 0.2s;
        }
        html:not(.dark) .prof-input { background: #faf8f3; color: #1a1209; }
        .prof-input:focus { border-color: rgba(201,168,76,0.5); }
        .prof-input--readonly { opacity: 0.45; cursor: not-allowed; }
        .prof-save-btn {
          padding: 10px 24px;
          background: var(--gold);
          border: none; border-radius: 9px;
          color: #0D1117;
          font-family: var(--font-dm), sans-serif;
          font-size: 13px; font-weight: 700;
          cursor: pointer; transition: opacity 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .prof-save-btn:hover:not(:disabled) { opacity: 0.85; }
        .prof-save-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .prof-btn-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(13,17,23,0.3);
          border-top-color: #0D1117;
          border-radius: 50%;
          animation: prof-spin 0.7s linear infinite;
        }

        /* Quick stats */
        .prof-quick-stats {
          display: flex;
          align-items: center;
          background: rgba(201,168,76,0.06);
          border: 1px solid rgba(201,168,76,0.14);
          border-radius: 12px;
          overflow: hidden;
        }
        .prof-qs-item {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; padding: 14px 10px; gap: 4px;
        }
        .prof-qs-val { font-family: var(--font-bebas), serif; font-size: 22px; color: var(--gold); line-height: 1; }
        .prof-qs-label { font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--dark); opacity: 0.45; }
        .prof-qs-divider { width: 1px; height: 36px; background: rgba(201,168,76,0.2); flex-shrink: 0; }

        /* Active plan */
        .prof-plan-section { display: flex; flex-direction: column; gap: 14px; }
        .prof-plan-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(201,168,76,0.18);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        html:not(.dark) .prof-plan-card { background: rgba(255,255,255,0.8); }
        .prof-plan-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .prof-plan-name { font-size: 17px; font-weight: 700; color: var(--dark); margin: 0 0 4px; }
        .prof-plan-since { font-size: 12px; color: var(--dark); opacity: 0.4; margin: 0; }
        .prof-plan-badge {
          padding: 4px 12px;
          background: rgba(34,197,94,0.12);
          border: 1px solid rgba(34,197,94,0.3);
          border-radius: 20px;
          color: #22c55e;
          font-size: 11px;
          font-weight: 700;
        }
        .prof-plan-details { display: flex; flex-direction: column; gap: 8px; }
        .prof-plan-row {
          display: flex;
          gap: 12px;
          font-size: 13px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(201,168,76,0.08);
        }
        .prof-plan-row:last-child { border-bottom: none; padding-bottom: 0; }
        .prof-plan-key { width: 90px; flex-shrink: 0; color: var(--gold); opacity: 0.8; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; padding-top: 1px; }
        .prof-plan-val { color: var(--dark); flex: 1; }
        .prof-plan-no-batch { font-size: 13px; color: var(--dark); opacity: 0.45; margin: 0; }
        .prof-renew-btn {
          display: inline-block;
          padding: 9px 20px;
          background: rgba(201,168,76,0.1);
          border: 1px solid rgba(201,168,76,0.25);
          border-radius: 9px;
          color: var(--gold);
          font-size: 13px; font-weight: 600;
          text-decoration: none;
          align-self: flex-start;
          transition: background 0.2s;
        }
        .prof-renew-btn:hover { background: rgba(201,168,76,0.18); }

        /* Section */
        .prof-section { display: flex; flex-direction: column; gap: 14px; }
        .prof-section-title {
          font-family: var(--font-bebas), serif;
          font-size: 22px; color: var(--dark);
          letter-spacing: 0.04em; margin: 0;
        }

        /* Empty state */
        .prof-empty {
          background: rgba(255,255,255,0.03);
          border: 1px dashed rgba(201,168,76,0.2);
          border-radius: 16px;
          padding: 48px 20px;
          display: flex; flex-direction: column;
          align-items: center; gap: 10px; text-align: center;
        }
        html:not(.dark) .prof-empty { background: rgba(255,255,255,0.5); }
        .prof-empty-icon { font-size: 36px; }
        .prof-empty-text { font-size: 14px; color: var(--dark); opacity: 0.45; margin: 0; }
        .prof-empty-cta {
          padding: 9px 20px; background: var(--gold);
          border-radius: 9px; color: #0D1117;
          font-size: 13px; font-weight: 700;
          text-decoration: none; margin-top: 4px; transition: opacity 0.2s;
        }
        .prof-empty-cta:hover { opacity: 0.85; }

        /* Enrollment list */
        .prof-enrollment-list { display: flex; flex-direction: column; gap: 10px; }
        .prof-enrollment-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(201,168,76,0.13);
          border-radius: 13px;
          padding: 16px 18px;
          display: flex; flex-direction: column; gap: 10px;
        }
        html:not(.dark) .prof-enrollment-card { background: rgba(255,255,255,0.8); }
        .prof-enr-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
        .prof-enr-pkg { font-size: 14px; font-weight: 600; color: var(--dark); margin: 0 0 3px; }
        .prof-enr-date { font-size: 12px; color: var(--dark); opacity: 0.4; margin: 0; }
        .prof-enr-status {
          display: inline-block; padding: 3px 10px;
          border-radius: 7px; font-size: 11px; font-weight: 600;
          white-space: nowrap; flex-shrink: 0;
        }
        .prof-enr-bottom { display: flex; justify-content: space-between; align-items: center; }
        .prof-enr-amount { font-family: var(--font-bebas), serif; font-size: 20px; color: var(--gold); }
        .prof-enr-pid { font-size: 11px; color: var(--dark); opacity: 0.35; font-family: monospace; }
        .prof-enr-retry { border-top: 1px solid rgba(201,168,76,0.12); padding-top: 8px; }
        .prof-retry-btn { font-size: 13px; color: var(--gold); text-decoration: none; font-weight: 600; }
        .prof-retry-btn:hover { text-decoration: underline; }

        /* Spinner */
        .prof-spinner {
          width: 28px; height: 28px;
          border: 3px solid rgba(201,168,76,0.2);
          border-top-color: var(--gold);
          border-radius: 50%;
          animation: prof-spin 0.7s linear infinite;
          margin: 0 auto;
        }
        @keyframes prof-spin { to { transform: rotate(360deg); } }

        @media (max-width: 480px) {
          .prof-topbar { padding: 14px 16px; }
          .prof-body { padding: 20px 14px 48px; }
          .prof-edit-fields { grid-template-columns: 1fr; }
          .prof-edit-fields .prof-field:last-child { grid-column: auto; }
          .prof-enr-pid { display: none; }
          .prof-card-top { flex-wrap: wrap; }
        }
      `}</style>
    </div>
  );
}
