"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

/* ─── Types ────────────────────────────────────────────────── */
type Enrollment = {
  _id: string; name: string; email: string; phone?: string; age?: number;
  package: string; amount: number; status: string;
  razorpayPaymentId?: string; razorpayOrderId: string; createdAt: string;
};
type Stats = {
  totalEnrollments: number; paidEnrollments: number;
  pendingEnrollments: number; failedEnrollments: number;
  totalUsers: number; totalRevenue: number;
};
type PkgBreakdown = { _id: string; count: number; revenue: number };
type RevenuePoint = { label: string; revenue: number; count: number };
type Student = {
  _id: string; name: string; email: string; phone?: string;
  isActive: boolean; createdAt: string;
  activePackage: string | null; enrolledAt: string | null;
};
type Batch = {
  _id: string; name: string; packageId: string; packageName: string;
  days: string[]; timeStart: string; timeEnd: string;
  coachName: string; capacity: number; enrolled: number; isActive: boolean;
};

const statusColor: Record<string, string> = {
  paid: "#22c55e", pending: "#f59e0b", failed: "#ef4444", refunded: "#6b7280",
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const PACKAGES = [
  { id: "junior", name: "Junior Batch" },
  { id: "senior", name: "Senior Batch" },
  { id: "elite", name: "Elite Program" },
  { id: "tournament", name: "Tournament Package" },
];

/* ─── CSV export helper ─────────────────────────────────────── */
function exportCSV(enrollments: Enrollment[]) {
  const headers = ["Name","Email","Phone","Age","Package","Amount (₹)","Payment ID","Order ID","Date","Status"];
  const rows = enrollments.map(e => [
    e.name, e.email, e.phone ?? "", e.age ?? "", e.package, e.amount,
    e.razorpayPaymentId ?? "", e.razorpayOrderId,
    new Date(e.createdAt).toLocaleDateString("en-IN"),
    e.status,
  ]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url;
  a.download = `enrollments_${Date.now()}.csv`; a.click();
  URL.revokeObjectURL(url);
}

/* ─── Batch modal ───────────────────────────────────────────── */
type BatchForm = {
  name: string; packageId: string; packageName: string;
  days: string[]; timeStart: string; timeEnd: string;
  coachName: string; capacity: string;
};
const defaultBatchForm: BatchForm = {
  name: "", packageId: "", packageName: "", days: [],
  timeStart: "", timeEnd: "", coachName: "", capacity: "20",
};

function BatchModal({ batch, onClose, onSave }: {
  batch: Batch | null;
  onClose: () => void;
  onSave: (data: BatchForm) => Promise<void>;
}) {
  const [form, setForm] = useState<BatchForm>(batch ? {
    name: batch.name, packageId: batch.packageId, packageName: batch.packageName,
    days: batch.days, timeStart: batch.timeStart, timeEnd: batch.timeEnd,
    coachName: batch.coachName, capacity: String(batch.capacity),
  } : defaultBatchForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const toggleDay = (d: string) =>
    setForm(f => ({ ...f, days: f.days.includes(d) ? f.days.filter(x => x !== d) : [...f.days, d] }));

  const handleSave = async () => {
    if (!form.name || !form.packageId || !form.days.length || !form.timeStart || !form.timeEnd || !form.coachName) {
      setError("All fields are required."); return;
    }
    setSaving(true);
    try { await onSave(form); onClose(); }
    catch { setError("Save failed."); }
    finally { setSaving(false); }
  };

  return (
    <div className="dash-modal-overlay" onClick={onClose}>
      <div className="dash-modal" onClick={e => e.stopPropagation()}>
        <div className="dash-modal-header">
          <h3 className="dash-modal-title">{batch ? "Edit Batch" : "Create Batch"}</h3>
          <button className="dash-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="dash-modal-body">
          {error && <p className="dash-modal-error">{error}</p>}
          <div className="dash-modal-grid">
            <div className="dash-mf-group">
              <label className="dash-mf-label">Batch Name</label>
              <input className="dash-mf-input" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="e.g. Morning Juniors" />
            </div>
            <div className="dash-mf-group">
              <label className="dash-mf-label">Package</label>
              <select className="dash-mf-input" value={form.packageId} onChange={e => {
                const pkg = PACKAGES.find(p => p.id === e.target.value);
                setForm(f => ({...f, packageId: e.target.value, packageName: pkg?.name ?? ""}));
              }}>
                <option value="">Select package</option>
                {PACKAGES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="dash-mf-group">
              <label className="dash-mf-label">Coach Name</label>
              <input className="dash-mf-input" value={form.coachName} onChange={e => setForm(f => ({...f, coachName: e.target.value}))} placeholder="e.g. Ravi Kumar" />
            </div>
            <div className="dash-mf-group">
              <label className="dash-mf-label">Capacity</label>
              <input className="dash-mf-input" type="number" min="1" max="50" value={form.capacity} onChange={e => setForm(f => ({...f, capacity: e.target.value}))} />
            </div>
            <div className="dash-mf-group">
              <label className="dash-mf-label">Start Time</label>
              <input className="dash-mf-input" type="time" value={form.timeStart} onChange={e => setForm(f => ({...f, timeStart: e.target.value}))} />
            </div>
            <div className="dash-mf-group">
              <label className="dash-mf-label">End Time</label>
              <input className="dash-mf-input" type="time" value={form.timeEnd} onChange={e => setForm(f => ({...f, timeEnd: e.target.value}))} />
            </div>
          </div>

          <div className="dash-mf-group" style={{marginTop: "4px"}}>
            <label className="dash-mf-label">Training Days</label>
            <div className="dash-days-grid">
              {DAYS.map(d => (
                <button
                  key={d}
                  className={`dash-day-btn${form.days.includes(d) ? " dash-day-btn--on" : ""}`}
                  onClick={() => toggleDay(d)}
                  type="button"
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="dash-modal-footer">
          <button className="dash-modal-cancel" onClick={onClose}>Cancel</button>
          <button className="dash-modal-save" onClick={handleSave} disabled={saving}>
            {saving ? <span className="dash-spinner-sm" /> : (batch ? "Save Changes" : "Create Batch")}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Dashboard ─────────────────────────────────────────── */
export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"overview" | "enrollments" | "students" | "batches">("overview");

  // Overview
  const [stats, setStats] = useState<Stats | null>(null);
  const [packages, setPackages] = useState<PkgBreakdown[]>([]);
  const [revenue, setRevenue] = useState<RevenuePoint[]>([]);
  const [overviewLoading, setOverviewLoading] = useState(true);

  // Enrollments
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [enrollTotal, setEnrollTotal] = useState(0);
  const [enrollPages, setEnrollPages] = useState(1);
  const [enrollPage, setEnrollPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [enrollLoading, setEnrollLoading] = useState(false);

  // Students
  const [students, setStudents] = useState<Student[]>([]);
  const [stuTotal, setStuTotal] = useState(0);
  const [stuPages, setStuPages] = useState(1);
  const [stuPage, setStuPage] = useState(1);
  const [stuSearch, setStuSearch] = useState("");
  const [stuLoading, setStuLoading] = useState(false);

  // Batches
  const [batches, setBatches] = useState<Batch[]>([]);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchModal, setBatchModal] = useState<{ open: boolean; batch: Batch | null }>({ open: false, batch: null });

  // Auth guard
  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") router.replace("/login?from=dashboard");
  }, [session, status, router]);

  // Load overview
  useEffect(() => {
    if (session?.user.role !== "admin") return;
    Promise.all([
      fetch("/api/dashboard/stats").then(r => r.json()),
      fetch("/api/dashboard/revenue").then(r => r.json()),
    ]).then(([statsData, revData]) => {
      setStats(statsData.stats);
      setPackages(statsData.packageBreakdown ?? []);
      setRevenue(revData.data ?? []);
    }).finally(() => setOverviewLoading(false));
  }, [session]);

  // Load enrollments
  const loadEnrollments = useCallback(async () => {
    setEnrollLoading(true);
    const params = new URLSearchParams({ page: String(enrollPage), search, status: statusFilter });
    const res = await fetch(`/api/dashboard/enrollments?${params}`);
    const data = await res.json();
    setEnrollments(data.enrollments ?? []);
    setEnrollTotal(data.total ?? 0);
    setEnrollPages(data.pages ?? 1);
    setEnrollLoading(false);
  }, [enrollPage, search, statusFilter]);

  useEffect(() => {
    if (session?.user.role === "admin" && activeTab === "enrollments") loadEnrollments();
  }, [session, activeTab, loadEnrollments]);

  // Load students
  const loadStudents = useCallback(async () => {
    setStuLoading(true);
    const params = new URLSearchParams({ page: String(stuPage), search: stuSearch });
    const res = await fetch(`/api/dashboard/students?${params}`);
    const data = await res.json();
    setStudents(data.students ?? []);
    setStuTotal(data.total ?? 0);
    setStuPages(data.pages ?? 1);
    setStuLoading(false);
  }, [stuPage, stuSearch]);

  useEffect(() => {
    if (session?.user.role === "admin" && activeTab === "students") loadStudents();
  }, [session, activeTab, loadStudents]);

  // Load batches
  const loadBatches = useCallback(async () => {
    setBatchLoading(true);
    const res = await fetch("/api/dashboard/batches");
    const data = await res.json();
    setBatches(data.batches ?? []);
    setBatchLoading(false);
  }, []);

  useEffect(() => {
    if (session?.user.role === "admin" && activeTab === "batches") loadBatches();
  }, [session, activeTab, loadBatches]);

  // Suspend toggle
  const toggleSuspend = async (id: string, isActive: boolean) => {
    await fetch(`/api/dashboard/students/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    setStudents(s => s.map(stu => stu._id === id ? { ...stu, isActive: !stu.isActive } : stu));
  };

  // Batch deactivate
  const deactivateBatch = async (id: string) => {
    await fetch(`/api/dashboard/batches/${id}`, { method: "DELETE" });
    setBatches(b => b.map(bt => bt._id === id ? { ...bt, isActive: false } : bt));
  };

  // Batch save
  const saveBatch = async (form: BatchForm) => {
    if (batchModal.batch) {
      await fetch(`/api/dashboard/batches/${batchModal.batch._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/dashboard/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    loadBatches();
  };

  // Export all enrolled (fetch all pages)
  const handleExportCSV = async () => {
    const params = new URLSearchParams({ page: "1", search, status: statusFilter, limit: "1000" } as Record<string, string>);
    const res = await fetch(`/api/dashboard/enrollments?${params}`);
    const data = await res.json();
    exportCSV(data.enrollments ?? []);
  };

  if (status === "loading" || overviewLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--page-bg)" }}>
        <div className="dash-spinner" />
      </div>
    );
  }
  if (!session || session.user.role !== "admin") return null;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "enrollments", label: "Enrollments" },
    { id: "students", label: "Students" },
    { id: "batches", label: "Batches" },
  ] as const;

  return (
    <div className="dash-root">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <Link href="/" className="dash-logo">
          <div className="dash-logo-mark">B</div>
          <div>
            <div className="dash-logo-name">BRAJ.</div>
            <div className="dash-logo-sub">Admin Panel</div>
          </div>
        </Link>

        <nav className="dash-nav">
          {tabs.map(t => (
            <button
              key={t.id}
              className={`dash-nav-item${activeTab === t.id ? " dash-nav-active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
          <Link href="/profile" className="dash-nav-item" style={{ textDecoration: "none", textAlign: "center" }}>My Profile</Link>
          <button className="dash-signout" onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</button>
        </div>
      </aside>

      {/* Main */}
      <main className="dash-main">
        <header className="dash-header">
          <div>
            <h1 className="dash-title">{tabs.find(t => t.id === activeTab)?.label}</h1>
            <p className="dash-subtitle">Welcome back, {session.user.name ?? "Admin"}</p>
          </div>
          <Link href="/" className="dash-view-site">← View Site</Link>
        </header>

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && stats && (
          <>
            <div className="dash-stats-grid">
              <div className="dash-stat-card">
                <span className="dash-stat-label">Total Revenue</span>
                <span className="dash-stat-value dash-stat-gold">₹{stats.totalRevenue.toLocaleString("en-IN")}</span>
              </div>
              <div className="dash-stat-card">
                <span className="dash-stat-label">Paid Enrollments</span>
                <span className="dash-stat-value" style={{ color: "#22c55e" }}>{stats.paidEnrollments}</span>
              </div>
              <div className="dash-stat-card">
                <span className="dash-stat-label">Registered Users</span>
                <span className="dash-stat-value">{stats.totalUsers}</span>
              </div>
              <div className="dash-stat-card">
                <span className="dash-stat-label">Pending / Failed</span>
                <span className="dash-stat-value">
                  <span style={{ color: "#f59e0b" }}>{stats.pendingEnrollments}</span>
                  {" / "}
                  <span style={{ color: "#ef4444" }}>{stats.failedEnrollments}</span>
                </span>
              </div>
            </div>

            {/* Revenue chart */}
            {revenue.length > 0 && (
              <div className="dash-section">
                <h2 className="dash-section-title">Monthly Revenue (Last 12 Months)</h2>
                <div className="dash-chart-wrap">
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={revenue} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.1)" />
                      <XAxis dataKey="label" tick={{ fontSize: 11, fill: "rgba(201,168,76,0.6)" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "rgba(201,168,76,0.6)" }} axisLine={false} tickLine={false}
                        tickFormatter={v => v >= 1000 ? `₹${(v/1000).toFixed(0)}k` : `₹${v}`} />
                      <Tooltip
                        contentStyle={{ background: "rgba(13,17,23,0.95)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: "10px", fontSize: "13px" }}
                        labelStyle={{ color: "var(--gold)" }}
                        formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]}
                      />
                      <Bar dataKey="revenue" fill="#C9A84C" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Package breakdown */}
            {packages.length > 0 && (
              <div className="dash-section">
                <h2 className="dash-section-title">Package Breakdown</h2>
                <div className="dash-pkg-grid">
                  {packages.map(p => (
                    <div key={p._id} className="dash-pkg-card">
                      <span className="dash-pkg-name">{p._id}</span>
                      <span className="dash-pkg-count">{p.count} enrolled</span>
                      <span className="dash-pkg-rev">₹{p.revenue.toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ── ENROLLMENTS ── */}
        {activeTab === "enrollments" && (
          <div className="dash-section">
            <div className="dash-table-header">
              <div className="dash-filters">
                <input
                  className="dash-search"
                  placeholder="Search name, email, phone…"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setEnrollPage(1); }}
                />
                <select className="dash-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setEnrollPage(1); }}>
                  <option value="all">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
              <button className="dash-csv-btn" onClick={handleExportCSV}>↓ Export CSV</button>
            </div>

            <div className="dash-table-wrap">
              {enrollLoading ? (
                <div style={{ padding: "40px", textAlign: "center" }}><div className="dash-spinner" /></div>
              ) : enrollments.length === 0 ? (
                <p className="dash-empty">No enrollments found.</p>
              ) : (
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Name</th><th>Email</th><th>Phone</th><th>Age</th>
                      <th>Package</th><th>Amount</th><th>Status</th><th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollments.map(e => (
                      <tr key={e._id}>
                        <td>{e.name}</td>
                        <td style={{ fontSize: "12px", opacity: 0.6 }}>{e.email}</td>
                        <td>{e.phone || "—"}</td>
                        <td>{e.age ?? "—"}</td>
                        <td>{e.package}</td>
                        <td>₹{e.amount.toLocaleString("en-IN")}</td>
                        <td>
                          <span className="dash-status-badge" style={{ background: statusColor[e.status] + "20", color: statusColor[e.status] }}>
                            {e.status}
                          </span>
                        </td>
                        <td style={{ fontSize: "12px", opacity: 0.5 }}>
                          {new Date(e.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {enrollPages > 1 && (
              <div className="dash-pagination">
                <span className="dash-page-info">Showing {enrollments.length} of {enrollTotal}</span>
                <div className="dash-page-btns">
                  <button className="dash-page-btn" disabled={enrollPage <= 1} onClick={() => setEnrollPage(p => p - 1)}>← Prev</button>
                  <span className="dash-page-cur">{enrollPage} / {enrollPages}</span>
                  <button className="dash-page-btn" disabled={enrollPage >= enrollPages} onClick={() => setEnrollPage(p => p + 1)}>Next →</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── STUDENTS ── */}
        {activeTab === "students" && (
          <div className="dash-section">
            <div className="dash-table-header">
              <div className="dash-filters">
                <input
                  className="dash-search"
                  placeholder="Search name, email, phone…"
                  value={stuSearch}
                  onChange={e => { setStuSearch(e.target.value); setStuPage(1); }}
                />
              </div>
              <span className="dash-page-info">{stuTotal} students total</span>
            </div>

            <div className="dash-table-wrap">
              {stuLoading ? (
                <div style={{ padding: "40px", textAlign: "center" }}><div className="dash-spinner" /></div>
              ) : students.length === 0 ? (
                <p className="dash-empty">No students found.</p>
              ) : (
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Name</th><th>Email</th><th>Phone</th>
                      <th>Active Package</th><th>Joined</th><th>Status</th><th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(s => (
                      <tr key={s._id}>
                        <td>{s.name}</td>
                        <td style={{ fontSize: "12px", opacity: 0.6 }}>{s.email}</td>
                        <td>{s.phone || "—"}</td>
                        <td>{s.activePackage ?? <span style={{ opacity: 0.35 }}>None</span>}</td>
                        <td style={{ fontSize: "12px", opacity: 0.5 }}>
                          {new Date(s.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </td>
                        <td>
                          <span className="dash-status-badge" style={{ background: s.isActive ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)", color: s.isActive ? "#22c55e" : "#ef4444" }}>
                            {s.isActive ? "Active" : "Suspended"}
                          </span>
                        </td>
                        <td>
                          <button
                            className={`dash-toggle-btn${s.isActive ? " dash-toggle-btn--suspend" : " dash-toggle-btn--activate"}`}
                            onClick={() => toggleSuspend(s._id, s.isActive)}
                          >
                            {s.isActive ? "Suspend" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {stuPages > 1 && (
              <div className="dash-pagination">
                <span className="dash-page-info">Showing {students.length} of {stuTotal}</span>
                <div className="dash-page-btns">
                  <button className="dash-page-btn" disabled={stuPage <= 1} onClick={() => setStuPage(p => p - 1)}>← Prev</button>
                  <span className="dash-page-cur">{stuPage} / {stuPages}</span>
                  <button className="dash-page-btn" disabled={stuPage >= stuPages} onClick={() => setStuPage(p => p + 1)}>Next →</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── BATCHES ── */}
        {activeTab === "batches" && (
          <div className="dash-section">
            <div className="dash-table-header">
              <h2 className="dash-section-title" style={{ margin: 0 }}>All Batches</h2>
              <button className="dash-csv-btn" onClick={() => setBatchModal({ open: true, batch: null })}>+ Create Batch</button>
            </div>

            {batchLoading ? (
              <div style={{ padding: "40px", textAlign: "center" }}><div className="dash-spinner" /></div>
            ) : batches.length === 0 ? (
              <p className="dash-empty">No batches yet. Create your first batch above.</p>
            ) : (
              <div className="dash-batch-grid">
                {batches.map(b => (
                  <div key={b._id} className={`dash-batch-card${!b.isActive ? " dash-batch-card--inactive" : ""}`}>
                    <div className="dash-batch-header">
                      <div>
                        <h3 className="dash-batch-name">{b.name}</h3>
                        <p className="dash-batch-pkg">{b.packageName}</p>
                      </div>
                      <span className="dash-status-badge" style={{ background: b.isActive ? "rgba(34,197,94,0.12)" : "rgba(107,114,128,0.12)", color: b.isActive ? "#22c55e" : "#6b7280" }}>
                        {b.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="dash-batch-info">
                      <span>📅 {b.days.join(", ")}</span>
                      <span>🕐 {b.timeStart}–{b.timeEnd}</span>
                      <span>👤 {b.coachName}</span>
                      <span>👥 {b.enrolled}/{b.capacity} students</span>
                    </div>
                    <div className="dash-batch-actions">
                      <button className="dash-batch-edit" onClick={() => setBatchModal({ open: true, batch: b })}>Edit</button>
                      {b.isActive && (
                        <button className="dash-batch-deact" onClick={() => deactivateBatch(b._id)}>Deactivate</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Batch modal */}
      {batchModal.open && (
        <BatchModal
          batch={batchModal.batch}
          onClose={() => setBatchModal({ open: false, batch: null })}
          onSave={saveBatch}
        />
      )}

      <style>{`
        .dash-root { display:flex; min-height:100vh; background:var(--page-bg); font-family:var(--font-dm),sans-serif; }

        /* Sidebar */
        .dash-sidebar {
          width:200px; flex-shrink:0;
          background:rgba(255,255,255,0.03);
          border-right:1px solid rgba(201,168,76,0.15);
          display:flex; flex-direction:column;
          padding:24px 16px; gap:0;
          position:sticky; top:0; height:100vh;
        }
        html:not(.dark) .dash-sidebar { background:rgba(255,255,255,0.6); }
        .dash-logo { display:flex; align-items:center; gap:10px; text-decoration:none; margin-bottom:28px; }
        .dash-logo-mark { width:34px; height:34px; background:var(--gold); border-radius:8px; display:flex; align-items:center; justify-content:center; font-family:var(--font-bebas),serif; font-size:19px; color:#0D1117; }
        .dash-logo-name { font-family:var(--font-bebas),serif; font-size:15px; color:var(--dark); letter-spacing:0.05em; line-height:1; }
        .dash-logo-sub { font-size:9px; color:var(--gold); opacity:0.7; letter-spacing:0.06em; }
        .dash-nav { display:flex; flex-direction:column; gap:3px; margin-bottom:16px; }
        .dash-nav-item {
          padding:9px 11px; border-radius:9px; font-size:13px;
          color:var(--dark); opacity:0.5; cursor:pointer;
          transition:all 0.2s; background:none; border:none;
          text-align:left; font-family:var(--font-dm),sans-serif;
          display:block;
        }
        .dash-nav-item:hover { opacity:0.85; background:rgba(201,168,76,0.08); }
        .dash-nav-active { opacity:1 !important; background:rgba(201,168,76,0.12) !important; color:var(--gold) !important; font-weight:600; }
        .dash-signout { padding:9px 11px; border-radius:9px; background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.2); color:#ef4444; font-family:var(--font-dm),sans-serif; font-size:13px; cursor:pointer; transition:background 0.2s; }
        .dash-signout:hover { background:rgba(239,68,68,0.18); }

        /* Main */
        .dash-main { flex:1; overflow-x:hidden; padding:28px 32px; display:flex; flex-direction:column; gap:24px; min-width:0; }
        .dash-header { display:flex; justify-content:space-between; align-items:flex-start; }
        .dash-title { font-family:var(--font-bebas),serif; font-size:36px; color:var(--dark); letter-spacing:0.02em; margin:0 0 3px; line-height:1; }
        .dash-subtitle { font-size:13px; color:var(--dark); opacity:0.4; margin:0; }
        .dash-view-site { font-size:12px; color:var(--gold); text-decoration:none; opacity:0.7; padding-top:4px; }
        .dash-view-site:hover { opacity:1; }

        /* Stats */
        .dash-stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
        .dash-stat-card { background:rgba(255,255,255,0.04); border:1px solid rgba(201,168,76,0.15); border-radius:13px; padding:18px; display:flex; flex-direction:column; gap:7px; }
        html:not(.dark) .dash-stat-card { background:rgba(255,255,255,0.8); }
        .dash-stat-label { font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:var(--dark); opacity:0.4; }
        .dash-stat-value { font-family:var(--font-bebas),serif; font-size:30px; color:var(--dark); line-height:1; }
        .dash-stat-gold { color:var(--gold) !important; }

        /* Chart */
        .dash-chart-wrap { background:rgba(255,255,255,0.03); border:1px solid rgba(201,168,76,0.12); border-radius:14px; padding:20px 12px 12px; }
        html:not(.dark) .dash-chart-wrap { background:rgba(255,255,255,0.75); }

        /* Section */
        .dash-section { display:flex; flex-direction:column; gap:12px; }
        .dash-section-title { font-family:var(--font-bebas),serif; font-size:19px; color:var(--dark); letter-spacing:0.04em; margin:0; }

        /* Package breakdown */
        .dash-pkg-grid { display:flex; gap:10px; flex-wrap:wrap; }
        .dash-pkg-card { background:rgba(255,255,255,0.04); border:1px solid rgba(201,168,76,0.15); border-radius:10px; padding:12px 16px; display:flex; flex-direction:column; gap:4px; min-width:140px; }
        html:not(.dark) .dash-pkg-card { background:rgba(255,255,255,0.8); }
        .dash-pkg-name { font-size:13px; font-weight:600; color:var(--dark); }
        .dash-pkg-count { font-size:11px; color:var(--dark); opacity:0.5; }
        .dash-pkg-rev { font-size:14px; font-weight:700; color:var(--gold); }

        /* Table */
        .dash-table-header { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; }
        .dash-filters { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
        .dash-search, .dash-select { background:rgba(255,255,255,0.05); border:1px solid rgba(201,168,76,0.2); border-radius:9px; padding:8px 12px; font-family:var(--font-dm),sans-serif; font-size:13px; color:var(--dark); outline:none; }
        html:not(.dark) .dash-search, html:not(.dark) .dash-select { background:#fff; color:#1a1209; }
        .dash-search { width:200px; }
        .dash-select { cursor:pointer; }
        .dash-csv-btn { padding:8px 16px; background:rgba(201,168,76,0.12); border:1px solid rgba(201,168,76,0.25); border-radius:9px; color:var(--gold); font-family:var(--font-dm),sans-serif; font-size:13px; font-weight:600; cursor:pointer; transition:background 0.2s; white-space:nowrap; }
        .dash-csv-btn:hover { background:rgba(201,168,76,0.2); }

        .dash-table-wrap { background:rgba(255,255,255,0.03); border:1px solid rgba(201,168,76,0.12); border-radius:13px; overflow-x:auto; }
        html:not(.dark) .dash-table-wrap { background:rgba(255,255,255,0.75); }
        .dash-table { width:100%; border-collapse:collapse; font-size:13px; }
        .dash-table th { padding:11px 13px; text-align:left; font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:var(--gold); opacity:0.75; border-bottom:1px solid rgba(201,168,76,0.12); white-space:nowrap; }
        .dash-table td { padding:11px 13px; color:var(--dark); border-bottom:1px solid rgba(201,168,76,0.07); white-space:nowrap; }
        .dash-table tr:last-child td { border-bottom:none; }
        .dash-table tbody tr:hover { background:rgba(201,168,76,0.04); }
        .dash-status-badge { display:inline-block; padding:2px 8px; border-radius:6px; font-size:11px; font-weight:600; text-transform:capitalize; }
        .dash-empty { text-align:center; padding:40px; color:var(--dark); opacity:0.4; font-size:14px; }

        /* Pagination */
        .dash-pagination { display:flex; justify-content:space-between; align-items:center; padding-top:4px; }
        .dash-page-info { font-size:12px; color:var(--dark); opacity:0.4; }
        .dash-page-btns { display:flex; gap:8px; align-items:center; }
        .dash-page-btn { padding:6px 14px; border-radius:8px; background:rgba(201,168,76,0.1); border:1px solid rgba(201,168,76,0.2); color:var(--gold); font-family:var(--font-dm),sans-serif; font-size:12px; cursor:pointer; transition:background 0.2s; }
        .dash-page-btn:hover:not(:disabled) { background:rgba(201,168,76,0.2); }
        .dash-page-btn:disabled { opacity:0.35; cursor:not-allowed; }
        .dash-page-cur { font-size:12px; color:var(--dark); opacity:0.5; padding:0 4px; }

        /* Student actions */
        .dash-toggle-btn { padding:4px 10px; border-radius:6px; font-family:var(--font-dm),sans-serif; font-size:11px; font-weight:600; cursor:pointer; border:1px solid; transition:all 0.2s; }
        .dash-toggle-btn--suspend { background:rgba(239,68,68,0.08); border-color:rgba(239,68,68,0.25); color:#ef4444; }
        .dash-toggle-btn--suspend:hover { background:rgba(239,68,68,0.15); }
        .dash-toggle-btn--activate { background:rgba(34,197,94,0.08); border-color:rgba(34,197,94,0.25); color:#22c55e; }
        .dash-toggle-btn--activate:hover { background:rgba(34,197,94,0.15); }

        /* Batch cards */
        .dash-batch-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:14px; }
        .dash-batch-card { background:rgba(255,255,255,0.04); border:1px solid rgba(201,168,76,0.15); border-radius:14px; padding:18px; display:flex; flex-direction:column; gap:12px; }
        html:not(.dark) .dash-batch-card { background:rgba(255,255,255,0.8); }
        .dash-batch-card--inactive { opacity:0.55; }
        .dash-batch-header { display:flex; justify-content:space-between; align-items:flex-start; gap:10px; }
        .dash-batch-name { font-size:15px; font-weight:700; color:var(--dark); margin:0 0 3px; }
        .dash-batch-pkg { font-size:11px; color:var(--gold); opacity:0.75; margin:0; }
        .dash-batch-info { display:flex; flex-direction:column; gap:5px; font-size:12px; color:var(--dark); opacity:0.65; }
        .dash-batch-actions { display:flex; gap:8px; margin-top:4px; }
        .dash-batch-edit { padding:6px 14px; background:rgba(201,168,76,0.1); border:1px solid rgba(201,168,76,0.2); border-radius:8px; color:var(--gold); font-family:var(--font-dm),sans-serif; font-size:12px; font-weight:600; cursor:pointer; transition:background 0.2s; }
        .dash-batch-edit:hover { background:rgba(201,168,76,0.2); }
        .dash-batch-deact { padding:6px 14px; background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.2); border-radius:8px; color:#ef4444; font-family:var(--font-dm),sans-serif; font-size:12px; cursor:pointer; transition:background 0.2s; }
        .dash-batch-deact:hover { background:rgba(239,68,68,0.15); }

        /* Batch modal */
        .dash-modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.6); backdrop-filter:blur(4px); z-index:100; display:flex; align-items:center; justify-content:center; padding:20px; }
        .dash-modal { background:var(--page-bg); border:1px solid rgba(201,168,76,0.25); border-radius:20px; width:100%; max-width:540px; max-height:90vh; overflow-y:auto; display:flex; flex-direction:column; }
        html:not(.dark) .dash-modal { background:#fff; }
        .dash-modal-header { display:flex; justify-content:space-between; align-items:center; padding:20px 24px 16px; border-bottom:1px solid rgba(201,168,76,0.12); }
        .dash-modal-title { font-family:var(--font-bebas),serif; font-size:22px; color:var(--dark); margin:0; letter-spacing:0.04em; }
        .dash-modal-close { background:none; border:none; color:var(--dark); opacity:0.4; font-size:16px; cursor:pointer; transition:opacity 0.2s; }
        .dash-modal-close:hover { opacity:0.8; }
        .dash-modal-body { padding:20px 24px; display:flex; flex-direction:column; gap:14px; }
        .dash-modal-error { background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.25); border-radius:8px; padding:10px 14px; color:#ef4444; font-size:13px; margin:0; }
        .dash-modal-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .dash-mf-group { display:flex; flex-direction:column; gap:5px; }
        .dash-mf-label { font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:var(--gold); opacity:0.8; }
        .dash-mf-input { background:rgba(255,255,255,0.05); border:1px solid rgba(201,168,76,0.2); border-radius:9px; padding:9px 12px; font-family:var(--font-dm),sans-serif; font-size:13px; color:var(--dark); outline:none; transition:border-color 0.2s; width:100%; box-sizing:border-box; }
        html:not(.dark) .dash-mf-input { background:#faf8f3; color:#1a1209; }
        .dash-mf-input:focus { border-color:rgba(201,168,76,0.5); }
        .dash-days-grid { display:flex; gap:6px; flex-wrap:wrap; }
        .dash-day-btn { padding:5px 10px; border-radius:7px; border:1px solid rgba(201,168,76,0.2); background:rgba(255,255,255,0.04); color:var(--dark); font-family:var(--font-dm),sans-serif; font-size:12px; cursor:pointer; transition:all 0.2s; opacity:0.55; }
        .dash-day-btn:hover { opacity:0.85; }
        .dash-day-btn--on { background:rgba(201,168,76,0.15); border-color:rgba(201,168,76,0.5); color:var(--gold); opacity:1; font-weight:600; }
        .dash-modal-footer { display:flex; justify-content:flex-end; gap:10px; padding:16px 24px 20px; border-top:1px solid rgba(201,168,76,0.1); }
        .dash-modal-cancel { padding:9px 20px; background:rgba(255,255,255,0.05); border:1px solid rgba(201,168,76,0.15); border-radius:9px; color:var(--dark); opacity:0.6; font-family:var(--font-dm),sans-serif; font-size:13px; cursor:pointer; }
        .dash-modal-save { padding:9px 24px; background:var(--gold); border:none; border-radius:9px; color:#0D1117; font-family:var(--font-dm),sans-serif; font-size:13px; font-weight:700; cursor:pointer; transition:opacity 0.2s; display:flex; align-items:center; gap:8px; }
        .dash-modal-save:hover:not(:disabled) { opacity:0.85; }
        .dash-modal-save:disabled { opacity:0.45; cursor:not-allowed; }

        /* Spinners */
        .dash-spinner { width:28px; height:28px; border:3px solid rgba(201,168,76,0.2); border-top-color:var(--gold); border-radius:50%; animation:dash-spin 0.7s linear infinite; margin:0 auto; }
        .dash-spinner-sm { width:14px; height:14px; border:2px solid rgba(13,17,23,0.3); border-top-color:#0D1117; border-radius:50%; animation:dash-spin 0.7s linear infinite; }
        @keyframes dash-spin { to { transform:rotate(360deg); } }

        /* Responsive */
        @media (max-width:900px) {
          .dash-sidebar { display:none; }
          .dash-main { padding:18px 14px; }
          .dash-stats-grid { grid-template-columns:repeat(2,1fr); }
        }
        @media (max-width:500px) {
          .dash-stats-grid { grid-template-columns:1fr 1fr; gap:10px; }
          .dash-modal-grid { grid-template-columns:1fr; }
          .dash-search { width:140px; }
        }
      `}</style>
    </div>
  );
}
