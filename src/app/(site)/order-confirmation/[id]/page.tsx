import { database, formatNaira } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import OrderSuccessAnimation from "@/components/OrderSuccessAnimation";
import BankTransferDetails from "@/components/BankTransferDetails";
import Reveal from "@/components/motion/Reveal";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await database.getOrderById(id);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <OrderSuccessAnimation />
        <h1 className="font-display font-bold text-3xl">Order received!</h1>
        <p className="text-steel mt-2">
          Thank you, {order.customerName.split(" ")[0]}. Your order{" "}
          <span className="font-data text-ink">#{order.orderNumber}</span> has been placed.
        </p>
      </div>

      <Reveal delay={0.3} className="border border-line rounded-2xl p-6 space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-steel">Order ID</span>
          <span className="font-data font-medium">{order.orderNumber}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-steel">Payment method</span>
          <span className="font-data capitalize">{order.paymentMethod.replace(/-/g, " ")}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-steel">Payment status</span>
          <span className={`font-data capitalize ${order.paymentStatus === "paid" ? "text-mint" : "text-signal"}`}>
            {order.paymentStatus.replace(/_/g, " ")}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-steel">Order status</span>
          <span className="font-data capitalize">{order.status}</span>
        </div>
        <div className="border-t border-line pt-4 space-y-2">
          {order.items.map((i) => (
            <div key={i.productId} className="flex justify-between text-sm">
              <span>{i.name} × {i.qty}</span>
              <span className="font-data">{formatNaira(i.price * i.qty)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-line pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-steel">Subtotal</span>
            <span className="font-data">{formatNaira(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-steel">Delivery</span>
            <span className="font-data">{order.deliveryFee === 0 ? "Free" : formatNaira(order.deliveryFee)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span className="font-data">{formatNaira(order.total)}</span>
          </div>
        </div>
      </Reveal>

      {order.paymentMethod === "bank-transfer" && order.paymentStatus === "awaiting_confirmation" && (
        <div className="mt-6">
          <BankTransferDetails amount={formatNaira(order.total)} />
          <p className="text-xs text-steel mt-3 text-center">
            Already sent it? Send us your teller/reference on WhatsApp so we can confirm faster.
          </p>
        </div>
      )}

      {order.paymentMethod === "klump" && order.paymentStatus === "paid" && (
        <div className="mt-6 rounded-2xl bg-mint/10 border border-mint/20 p-5 text-sm text-steel text-center">
          Your Klump Buy Now, Pay Later payment was confirmed. We're preparing your order.
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <Link href="/products" className="inline-flex items-center gap-2 bg-ink text-paper px-6 py-3.5 rounded-full font-medium text-sm hover:bg-signal transition-colors">
          Continue Shopping
        </Link>
        <a
          href={`https://wa.me/2348034436491?text=${encodeURIComponent(`Hi SAMTOB P&C, I'd like to confirm my order ${order.orderNumber}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-ink/20 px-6 py-3.5 rounded-full font-medium text-sm hover:border-signal hover:text-signal transition-colors"
        >
          Confirm on WhatsApp
        </a>
      </div>
    </div>
  );
}
