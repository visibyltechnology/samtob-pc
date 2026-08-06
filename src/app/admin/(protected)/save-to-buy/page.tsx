import { database, formatNaira } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import ContributionReviewControl from "@/components/ContributionReviewControl";

export default async function AdminSaveToBuyPage() {
  const supabase = await createClient();
  const [contributions, plans] = await Promise.all([
    database.getAllPendingContributions(supabase),
    database.getAllPlans(supabase),
  ]);

  const pending = contributions.filter((c) => c.status === "pending");

  return (
    <div>
      <h1 className="font-display font-bold text-3xl mb-6">Save-to-Buy</h1>

      <h2 className="font-display font-semibold text-lg mb-3">Pending Contributions</h2>
      {pending.length === 0 ? (
        <p className="text-steel text-sm mb-10">Nothing awaiting confirmation.</p>
      ) : (
        <div className="space-y-3 mb-10">
          {pending.map((c) => (
            <div key={c.id} className="flex flex-wrap justify-between items-center gap-3 border border-line rounded-2xl p-4">
              <div>
                <p className="font-data font-medium text-sm">{c.plan.productName}</p>
                <p className="text-xs text-steel">
                  {formatNaira(c.amount)} · {new Date(c.createdAt).toLocaleDateString("en-NG")}
                  {c.bankReference && <> · ref: <span className="font-data">{c.bankReference}</span></>}
                </p>
              </div>
              <ContributionReviewControl contributionId={c.id} />
            </div>
          ))}
        </div>
      )}

      <h2 className="font-display font-semibold text-lg mb-3">All Plans</h2>
      {plans.length === 0 ? (
        <p className="text-steel text-sm">No Save-to-Buy plans yet.</p>
      ) : (
        <div className="border border-line rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ink/5 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Progress</th>
                <th className="px-4 py-3 font-medium">Plan</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {plans.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-medium max-w-[200px] truncate">{p.productName}</td>
                  <td className="px-4 py-3 font-data">{formatNaira(p.savedAmount)} / {formatNaira(p.targetAmount)}</td>
                  <td className="px-4 py-3 font-data capitalize">{formatNaira(p.installmentAmount)} / {p.frequency === "weekly" ? "wk" : "mo"}</td>
                  <td className="px-4 py-3 capitalize">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
