export const BANK_DETAILS = {
  accountName: "Samtob P&C Ltd",
  accountNumber: "0127186331",
  bankName: "Wema Bank",
};

export const KLUMP_PUBLIC_KEY = process.env.NEXT_PUBLIC_KLUMP_PUBLIC_KEY || "";
export const KLUMP_ENABLED = Boolean(KLUMP_PUBLIC_KEY);
