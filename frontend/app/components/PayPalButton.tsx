'use client';
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useState } from "react";

export default function PayPalButton({ 
  amount, 
  credits, 
  userId 
}: { 
  amount: string; 
  credits: number; 
  userId: string 
}) {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  // ⚠️ MUAB TUS CLIENT ID TSHIAB NTSAWS RAU HAUV NO
  const CLIENT_ID = "AffKT-fMoNCQNNNKlPCRpXOsShpO1JDPYwWbqXKZXspQCqisQTpQUNuUu1NV39GgFI44cILROnhJbgKF";

  const handlePaymentSuccess = async (details: any) => {
    setStatus('processing');
    try {
      const res = await fetch('/api/pay-success', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          creditsToAdd: credits,
          orderId: details.id
        }),
      });

      if (res.ok) {
        setStatus('success');
        alert(`Ua tsaug Bro! Koj tau txais ${credits} Credits lawm.`);
        window.location.reload(); // Refresh kom pom credit tshiab
      } else {
        throw new Error("Failed to add credits");
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      alert("Them nyiaj tau tab sis ntxiv Credit tsis tau. Thov hu rau support!");
    }
  };

  return (
    <div className="w-full">
      <PayPalScriptProvider options={{ 
        "client-id": CLIENT_ID,
        currency: "USD",
        intent: "capture"
      }}>
        <PayPalButtons
          style={{ layout: "vertical", shape: "rect", color: "gold" }}
          disabled={status === 'processing'}
          createOrder={(data, actions) => {
            return actions.order.create({
              intent: "CAPTURE",
              purchase_units: [{
                amount: {
                  currency_code: "USD",
                  value: amount
                }
              }]
            });
          }}
          onApprove={async (data, actions) => {
            if (actions.order) {
              const details = await actions.order.capture();
              await handlePaymentSuccess(details);
            }
          }}
          onError={(err) => {
            console.error("PayPal Error:", err);
            alert("PayPal Error: Sim qhib Incognito lossis xyuas koj lub Client ID dua.");
          }}
        />
      </PayPalScriptProvider>
      
      {status === 'processing' && <p className="text-blue-500 mt-2">Processing your credits...</p>}
    </div>
  );
}