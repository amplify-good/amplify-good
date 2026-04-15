import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getMusicians } from "@/lib/db/musicians";
import { getNonprofits } from "@/lib/db/nonprofits";
import { getEvents } from "@/lib/db/events";
import { getImpactPoolSummary, getImpactTransactions } from "@/lib/db/impact";
import { getServerSession } from "@/lib/supabase/server";
import { formatDate, formatMoney } from "@/lib/format";

// ─── Status text color ──────────────────────────────────────────────────────

function statusColor(status: string): string {
  switch (status) {
    case "confirmed":
      return "text-turquoise";
    case "pending":
      return "text-orange";
    case "completed":
      return "text-azure";
    case "cancelled":
      return "text-sienna";
    case "upcoming":
      return "text-turquoise";
    case "draft":
      return "text-gray-400";
    default:
      return "text-gray-500";
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }

  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  if (!adminEmails.includes(session.email.toLowerCase())) {
    redirect("/home");
  }

  const [musicians, nonprofits, allEvents, impactSummary, transactions] = await Promise.all([
    getMusicians(),
    getNonprofits(),
    getEvents(), // excludes drafts by default
    getImpactPoolSummary(),
    getImpactTransactions(20),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar initialSession={session} />

      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-parchment border-b-2 border-gold px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl uppercase tracking-wide text-azure">
              Admin Panel
            </h1>
            <p className="font-body text-gray-500 mt-1 text-sm">
              Live DB overview &mdash; read-only
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

          {/* ── Impact Pool ─────────────────────────────────────────────────── */}
          <section>
            <h2 className="font-heading text-xl font-bold text-azure uppercase tracking-wide mb-4 pb-2 border-b-2 border-sand-dark">
              Impact Pool
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="card text-left">
                <p className="text-sm font-heading font-semibold uppercase text-gray-500 mb-1">
                  Current Balance
                </p>
                <p className="impact-number text-gold text-3xl">
                  {formatMoney(impactSummary.balance)}
                </p>
              </div>
              <div className="card text-left">
                <p className="text-sm font-heading font-semibold uppercase text-gray-500 mb-1">
                  Total Inflows
                </p>
                <p className="impact-number text-turquoise text-3xl">
                  {formatMoney(impactSummary.totalInflows)}
                </p>
              </div>
              <div className="card text-left">
                <p className="text-sm font-heading font-semibold uppercase text-gray-500 mb-1">
                  Total Outflows
                </p>
                <p className="impact-number text-sienna text-3xl">
                  {formatMoney(impactSummary.totalOutflows)}
                </p>
              </div>
            </div>
          </section>

          {/* ── Users Summary ────────────────────────────────────────────────── */}
          <section>
            <h2 className="font-heading text-xl font-bold text-azure uppercase tracking-wide mb-4 pb-2 border-b-2 border-sand-dark">
              Users
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="card text-left">
                <p className="text-sm font-heading font-semibold uppercase text-gray-500 mb-1">
                  Musicians
                </p>
                <p className="impact-number text-azure text-4xl">
                  {musicians.length}
                </p>
                <ul className="mt-3 space-y-1">
                  {musicians.map((m) => (
                    <li key={m.id} className="font-body text-sm text-gray-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block shrink-0" />
                      {m.name}
                      <span className="text-gray-400 text-xs">&mdash; {m.genres.join(", ")}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card text-left">
                <p className="text-sm font-heading font-semibold uppercase text-gray-500 mb-1">
                  Non-Profits
                </p>
                <p className="impact-number text-azure text-4xl">
                  {nonprofits.length}
                </p>
                <ul className="mt-3 space-y-1">
                  {nonprofits.map((np) => (
                    <li key={np.id} className="font-body text-sm text-gray-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block shrink-0" />
                      {np.name}
                      <span className="text-gray-400 text-xs">&mdash; {np.cause}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ── Recent Impact Transactions ───────────────────────────────────── */}
          <section>
            <h2 className="font-heading text-xl font-bold text-azure uppercase tracking-wide mb-4 pb-2 border-b-2 border-sand-dark">
              Recent Impact Transactions
            </h2>
            {transactions.length === 0 ? (
              <p className="font-body text-sm text-gray-400 italic">No transactions yet.</p>
            ) : (
              <div className="card p-0 overflow-x-auto">
                <table className="w-full text-left text-sm font-body">
                  <thead>
                    <tr className="border-b border-sand-dark bg-parchment">
                      <th className="font-heading font-bold uppercase text-xs text-gray-500 tracking-wide px-5 py-3">
                        Description
                      </th>
                      <th className="font-heading font-bold uppercase text-xs text-gray-500 tracking-wide px-5 py-3">
                        Amount
                      </th>
                      <th className="font-heading font-bold uppercase text-xs text-gray-500 tracking-wide px-5 py-3">
                        Type
                      </th>
                      <th className="font-heading font-bold uppercase text-xs text-gray-500 tracking-wide px-5 py-3">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx, idx) => {
                      const isLast = idx === transactions.length - 1;
                      return (
                        <tr
                          key={tx.id}
                          className={`${!isLast ? "border-b border-sand-dark" : ""} hover:bg-sand transition-colors`}
                        >
                          <td className="px-5 py-3 text-gray-700">
                            {tx.description ?? <span className="text-gray-400 italic">—</span>}
                          </td>
                          <td className="px-5 py-3 font-bold text-gold">
                            {formatMoney(tx.amount)}
                          </td>
                          <td className="px-5 py-3">
                            <span className={`font-heading font-semibold uppercase text-xs tracking-wide ${tx.type === "inflow" ? "text-turquoise" : "text-sienna"}`}>
                              {tx.type}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-gray-500 text-xs">
                            {formatDate(tx.created_at)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* ── Events Overview ──────────────────────────────────────────────── */}
          <section>
            <h2 className="font-heading text-xl font-bold text-azure uppercase tracking-wide mb-4 pb-2 border-b-2 border-sand-dark">
              Events Overview
            </h2>
            <div className="space-y-3">
              {allEvents.map((ev) => {
                const musician = ev.musician_id
                  ? musicians.find((m) => m.id === ev.musician_id)
                  : null;
                return (
                  <div
                    key={ev.id}
                    className="card flex flex-wrap items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <h3 className="font-heading font-bold text-gray-800 text-base">
                        {ev.name}
                      </h3>
                      <p className="font-body text-sm text-gray-500">
                        {formatDate(ev.date_time)} &mdash; {ev.venue}
                      </p>
                    </div>
                    <div className="flex items-center gap-6 text-sm shrink-0">
                      <div className="text-right">
                        <p className="font-heading font-semibold text-gray-500 uppercase text-xs tracking-wide mb-0.5">
                          Musician
                        </p>
                        {musician ? (
                          <p className="font-body text-turquoise font-semibold">
                            {musician.name}
                          </p>
                        ) : (
                          <p className="font-body text-gray-400 italic">
                            Unassigned
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-heading font-semibold text-gray-500 uppercase text-xs tracking-wide mb-0.5">
                          Status
                        </p>
                        <span className={`font-heading font-semibold uppercase text-xs tracking-wide ${statusColor(ev.status)}`}>
                          {ev.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

        </div>
      </main>

      <Footer isLoggedIn={!!session} />
    </div>
  );
}
