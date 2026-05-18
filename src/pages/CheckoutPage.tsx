import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../lib/utils";
import { CheckCircle, ShieldCheck, Lock } from "lucide-react";
import { motion } from "motion/react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

export function CheckoutPage() {
  const { total, items } = useCart();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch this from your backend
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setLoading(false);
      });
  }, [total]);

  if (!clientSecret || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-bold">Initializing secure checkout...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-black text-gray-900 mb-2">Checkout</h1>
        <p className="text-gray-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-5 h-5 text-green-500" /> Secure SSL Encryption
        </p>
      </header>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden">
        <div className="p-8 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Amount</p>
            <p className="text-3xl font-black text-gray-900">{formatCurrency(total)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Quantity</p>
            <p className="text-xl font-bold text-gray-900">{items.length} Items</p>
          </div>
        </div>

        <div className="p-8">
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm clientSecret={clientSecret} />
          </Elements>
        </div>
      </div>
    </div>
  );
}

function CheckoutForm({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const { items, total, clearCart } = useCart();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !profile) return;

    setProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message || "An error occurred.");
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      // Create order in Firestore
      try {
        // Group items by seller for multi-seller orders in a real system, 
        // but here we just simplify to one order per seller for demo.
        const sellerIds = Array.from(new Set(items.map(i => (i as any).sellerId || 'default-seller')));
        
        for (const sellerId of sellerIds) {
          const sellerItems = items.filter(i => (i as any).sellerId === sellerId);
          await addDoc(collection(db, "orders"), {
            buyerId: profile.id,
            sellerId: sellerId,
            items: sellerItems,
            totalAmount: sellerItems.reduce((acc, i) => acc + (i.price * i.quantity), 0),
            status: "paid",
            createdAt: new Date().toISOString(),
            paymentIntentId: paymentIntent.id
          });
        }
        
        clearCart();
        navigate("/dashboard");
      } catch (err) {
        console.error("Order creation failed", err);
      }
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {message && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold">{message}</div>}
      
      <button
        disabled={!stripe || processing}
        className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {processing ? (
          <RefreshCw className="w-6 h-6 animate-spin" />
        ) : (
          <>
            <Lock className="w-5 h-5" /> Pay {formatCurrency(total)}
          </>
        )}
      </button>

      <p className="text-center text-xs text-gray-400 font-medium">
        Payments processed by Stripe. All transactions are secure and encrypted.
      </p>
    </form>
  );
}

function RefreshCw(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></svg>
  );
}
