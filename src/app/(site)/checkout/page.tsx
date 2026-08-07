import { getSession } from "@/lib/auth";
import CheckoutForm from "./CheckoutForm";

export default async function CheckoutPage() {
  const session = await getSession();

  return <CheckoutForm isLoggedIn={!!session} />;
}