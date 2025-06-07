import axios from "axios";
import { useAuthStore } from "./store/useAuthStore";
import { axiosInstance } from "./lib/axios";

const RazorpayButton = ({ sheetId, sheetTitle, amount }) => {
  const { authUser } = useAuthStore();

  const handlePayment = async () => {
    try {
      const res = await axiosInstance.post(
        `/payments/create-order`,
        {
          amount: amount,   
          currency: "INR",
          receipt: `receipt_${sheetId}`,
        },
        
      );

      console.log("res = ", res);
      const order = res.data.data;

      console.log("order", order);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "CodeGod",
        description: `Purchase ${sheetTitle}`,
        order_id: order.id,
        handler: async function (response) {
          console.log("Payment successful", response);

          // Optional: store transaction in DB via another API
          await axiosInstance.post("/payments/save-payment", {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            sheetId,
            userId: "current-user-id", // get from auth context
          });
        },
        prefill: {
          name: authUser.name,
          email: authUser.email,
        },
        theme: {
          color: "#2c94f5",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error", err);
    }
  };

  return (
    <button
      onClick={handlePayment}
      className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 
           bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 shadow-md hover:shadow-lg"
      `}
    >
      Start Now
    </button>
  );
};

export default RazorpayButton;
