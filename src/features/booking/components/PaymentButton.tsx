
import React, { useState } from 'react';
import { createPaymentPage } from '../../../services/paytabs';
import { Loader2 } from 'lucide-react';

interface PaymentButtonProps {
    amount: number;
    currency?: string;
    description: string;
    customer: {
        name: string;
        email: string;
        phone: string;
        street1: string;
        city: string;
        state: string;
        country: string;
        zip: string;
    };
    onSuccess?: () => void;
    onError?: (error: any) => void;
    bookingId?: string;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
    amount,
    currency = 'SAR',
    description,
    customer,
    onError,
    bookingId
}) => {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);
        // Use actual booking ID if provided, otherwise fallback (which will fail backend validation)
        const cartId = bookingId || `cart_${Date.now()}`;
        const callbackUrl = `${window.location.origin}/payment/callback`;
        const returnUrl = `${window.location.origin}/payment/callback`;

        try {
            const redirectUrl = await createPaymentPage({
                cart_id: cartId,
                cart_description: description,
                cart_currency: currency,
                cart_amount: amount,
                customer_details: { ...customer, ip: '127.0.0.1' },
                callback: callbackUrl,
                return: returnUrl,
            });

            // Redirect to PayTabs
            window.location.href = redirectUrl;
        } catch (error) {
            console.error('Payment Error:', error);
            if (onError) onError(error);
            alert('Failed to initiate payment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
        >
            {loading ? (
                <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                </>
            ) : (
                `Pay ${amount} ${currency}`
            )}
        </button>
    );
};

    export default PaymentButton;
