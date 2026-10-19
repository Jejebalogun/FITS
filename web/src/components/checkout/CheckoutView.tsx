"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useSession } from "@/components/auth/SessionProvider";
import CheckoutShell from "@/components/checkout/CheckoutShell";
import DeliveryStep, { type Recipient } from "@/components/checkout/DeliveryStep";
import OrderSummary from "@/components/checkout/OrderSummary";
import PaymentStep, { type Payment } from "@/components/checkout/PaymentStep";
import EmptyPanel, { PanelAction, PanelBody } from "@/components/marketplace/EmptyPanel";
import { useMarket } from "@/components/marketplace/MarketProvider";
import { useShopper } from "@/components/marketplace/ShopperProvider";
import { getMarket } from "@/data/markets";
import { priceCart } from "@/lib/cart";
import { addressLine, newOrderId } from "@/lib/checkout";

export default function CheckoutView() {
  const router = useRouter();
  const shopper = useShopper();
  const { market, ready: marketReady } = useMarket();
  const { user, ready: sessionReady } = useSession();

  const [step, setStep] = useState<"delivery" | "payment">("delivery");
  const [recipient, setRecipient] = useState<Recipient | null>(null);
  const [paysInNaira, setPaysInNaira] = useState(false);
  // Made once per visit, so a retried payment keeps the same order number.
  const [orderId] = useState(newOrderId);
  const placed = useRef(false);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [step]);

  const ready = marketReady && shopper.ready && sessionReady;
  const summary = priceCart(shopper.cart, market);

  if (!ready) {
    return (
      <CheckoutShell step="delivery" summary={<div className="h-[34rem] rounded-3xl bg-white/60" />}>
        <div aria-hidden className="space-y-4 motion-safe:animate-pulse">
          <div className="h-10 w-80 rounded-full bg-sand/70" />
          <div className="h-24 rounded-2xl bg-sand/60" />
          <div className="h-24 rounded-2xl bg-sand/60" />
        </div>
      </CheckoutShell>
    );
  }

  // Just paid: the cart is empty because the order took it, and we are on our way out.
  if (placed.current) return null;

  if (summary.pieceCount === 0) {
    return (
      <CheckoutShell step="delivery" summary={null}>
        <EmptyPanel icon="cart" title="Nothing to check out" className="">
          <PanelBody>
            {shopper.cart.length > 0
              ? "The pieces in your cart can't be ordered right now. Your cart says why."
              : "Your cart is empty, so there's nothing to pay for yet."}
          </PanelBody>
          <div className="mt-7">
            <PanelAction href="/cart">Back to cart</PanelAction>
          </div>
        </EmptyPanel>
      </CheckoutShell>
    );
  }

  function paid(payment: Payment) {
    if (!recipient) return;
    placed.current = true;
    shopper.placeOrder({
      id: orderId,
      placedAt: new Date().toISOString(),
      email: recipient.email,
      name: recipient.address.name,
      address: addressLine(recipient.address),
      market: market.code,
      paidWith: payment.paidWith,
      paid: payment.paid,
      lines: summary.parcels.flatMap((parcel) =>
        parcel.lines.filter((item) => !item.blocker).map((item) => item.line),
      ),
      createAccount: recipient.createAccount,
    });
    router.push(`/checkout/done?order=${orderId}`);
  }

  const naira = getMarket("NG");

  return (
    <CheckoutShell
      step={step}
      summary={
        <OrderSummary
          summary={summary}
          market={market}
          payingIn={
            step === "payment" && paysInNaira
              ? { amount: Math.round((summary.total / market.rate) * naira.rate), market: naira }
              : undefined
          }
        />
      }
    >
      {step === "delivery" || !recipient ? (
        <DeliveryStep
          summary={summary}
          accountEmail={user?.email ?? null}
          initial={recipient}
          onContinue={(next) => {
            setRecipient(next);
            setStep("payment");
          }}
        />
      ) : (
        <PaymentStep
          market={market}
          total={summary.total}
          recipient={recipient}
          orderId={orderId}
          onChangeAddress={() => {
            setPaysInNaira(false);
            setStep("delivery");
          }}
          onMethodChange={setPaysInNaira}
          onPaid={paid}
        />
      )}
    </CheckoutShell>
  );
}
