import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { doc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { firestore } from '../firebase';

// Use a placeholder ID if environment variable is missing for dev
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || "test";

const PaymentCheckout = ({ amount, description, userId, onSuccess, onClose }) => {
    const initialOptions = {
        "client-id": PAYPAL_CLIENT_ID,
        currency: "USD",
        intent: "capture",
    };

    const handleApprove = async (data, actions) => {
        try {
            const order = await actions.order.capture();
            console.log("PayPal Order Captured:", order);

            // Record transaction in Firestore
            await addDoc(collection(firestore, "transactions"), {
                userId,
                amount,
                currency: "USD",
                paypalOrderId: order.id,
                description,
                status: "completed",
                createdAt: new Date()
            });

            // Run callback (e.g., enable permanent storage)
            await onSuccess();

        } catch (error) {
            console.error("Payment Error:", error);
            alert("Payment failed: " + error.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
                >
                    &times;
                </button>

                <h2 className="text-xl font-bold mb-4 text-gray-900">{description}</h2>
                <p className="text-2xl font-bold mb-6 text-blue-600">${amount}</p>

                <PayPalScriptProvider options={initialOptions}>
                    <PayPalButtons
                        style={{ layout: "vertical" }}
                        createOrder={(data, actions) => {
                            return actions.order.create({
                                purchase_units: [{
                                    amount: { value: amount.toString() },
                                    description: description
                                }]
                            });
                        }}
                        onApprove={handleApprove}
                        onError={(err) => {
                            console.error("PayPal Error:", err);
                            alert("PayPal Error: " + err);
                        }}
                    />
                </PayPalScriptProvider>
            </div>
        </div>
    );
};

export default PaymentCheckout;
