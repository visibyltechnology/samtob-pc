import { getSession } from "@/lib/auth";
import { database, formatNaira } from "@/lib/db";
import { notFound } from "next/navigation";
import ContributionForm from "@/components/ContributionForm";

export default async function SaveToBuyPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) return null;

  const { id } = await params;
  const plans = await database.getPlansForUser(session.id);
  const plan = plans.find((p) => p.id === id);
  if (!plan) notFound();

  const contributions = await database.getContributionsForPlan(id);
  const pct = Math.min(100, Math.round((plan.savedAmount / plan.targetAmount) * 100));
  const remaining = Math.max(0, plan.targetAmount - plan.savedAmount);

  return (
    <div>
      <span className="text-xs font-data uppercase tracking-widest text-signal">Save-to-Buy</span>
      <h1 className="font-display font-bold text-2xl mt-1 mb-6">{plan.productName}</h1>

      <div className="border border-line rounded-2xl p-6 mb-8">
        <div className="h-3 rounded-full bg-ink/5 overflow-hidden mb-3">
          <div className="h-full bg-signal rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-steel">Saved</span>
          <span className="font-data font-semibold">{formatNaira(plan.savedAmount)} of {formatNaira(plan.targetAmount)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-steel">Remaining</span>
          <span className="font-data">{formatNaira(remaining)}</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-steel">Plan</span>
          <span className="font-data capitalize">{formatNaira(plan.installmentAmount)} / {plan.frequency === "weekly" ? "week" : "month"}</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-steel">Status</span>
          <span className={`font-data capitalize ${plan.status === "completed" ? "text-mint" : plan.status === "cancelled" ? "text-steel" : "text-signal"}`}>{plan.status}</span>
        </div>
      </div>

      {plan.status === "active" && (
        <div className="mb-8">
          <ContributionForm planId={plan.id} suggestedAmount={plan.installmentAmount} />
        </div>
      )}

      {plan.status === "completed" && (
        <div className="mb-8 rounded-2xl bg-mint/10 border border-mint/20 p-5 text-sm text-steel text-center">
          🎉 Fully paid! Visit any of our stores or chat us on WhatsApp to arrange collection or delivery.
        </div>
      )}

      <h2 className="font-display font-semibold text-lg mb-3">Contribution History</h2>
      {contributions.length === 0 ? (
        <p className="text-steel text-sm">No contributions logged yet.</p>
      ) : (
        <div className="space-y-2">
          {contributions.map((c) => (
            <div key={c.id} className="flex justify-between items-center border border-line rounded-xl px-4 py-3 text-sm">
              <div>
                <p className="font-data font-medium">{formatNaira(c.amount)}</p>
                <p className="text-xs text-steel">{new Date(c.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</p>
              </div>
              <span
                className={`text-[10px] font-data uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  c.status === "confirmed" ? "bg-mint/10 text-mint" : c.status === "rejected" ? "bg-signal/10 text-signal" : "bg-ink/5 text-steel"
                }`}
              >
                {c.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
