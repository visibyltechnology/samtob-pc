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
                <p className="text-xs text-steel mt-1">
                  {formatNaira(c.amount)} · {new Date(c.createdAt).toLocaleDateString("en-NG")}
                  {c.bankReference && <> · ref: <span className="font-data">{c.bankReference}</span></>}
                </p>
                {c.receiptUrl && (
                  <div className="mt-2">
                    <a href={c.receiptUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-signal hover:underline">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                      View Uploaded Receipt
                    </a>
                  </div>
                )}
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
