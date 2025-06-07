import { Check, Star, Zap, Crown, Infinity } from "lucide-react";
import RazorpayButton from "../RazorpayButton";
import { useNavigate } from "react-router-dom";

const PricingCards = () => {
  const navigate = useNavigate();
  const plans = [
    {
      name: "Basic",
      price: 0,
      period: "/month",
      icon: <Star className="h-6 w-6" />,
      description: "Perfect for beginners starting their DSA journey",
      features: [
        "Access to 100+ DSA problems",
        "Basic difficulty levels",
        "Progress tracking",
      ],
      buttonText: "Get Started",
      popular: false,
    },
    {
      name: "God Level",
      price: 199,
      period: "/month",
      icon: <Crown className="h-6 w-6" />,
      description: "For serious coders aiming for top-tier companies",
      features: [
        "Access to 50+ premium problems",
        "Company-specific question sets",
        "Resource of Video explanations & tutorials",
        "Advanced analytics dashboard",
        "One FAANG DSA sheet",
        "Priority support",
      ],
      buttonText: "Unlock God Mode",
      popular: true,
    },
    {
      name: "Beyond God",
      price: 599,
      period: "/month",
      icon: <Infinity className="h-6 w-6" />,
      description: "Ultimate package for competitive programming masters",
      features: [
        "Unlimited access to all problems",
        "All DSA Sheets",
        "1-on-1 mentorship sessions",
        "Custom problem generator",
        "Advanced code review",
        "Interview preparation resources",
        "Lifetime updates",
        "badge of codegod",
        "1-on-1 customer support",
      ],
      buttonText: "Buy Now",
      popular: false,
    },
  ];

return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Choose Your{" "}
                    <span className="text-blue-600 dark:text-blue-400">
                        Coding Journey
                    </span>
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Master Data Structures & Algorithms with our comprehensive problem
                    sets and expert guidance
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6">
                {plans.map((plan, index) => (
                    <div
                        key={index}
                        className={`relative rounded-2xl p-8 hover:scale-105 transition-all ease-in-out duration-500 ${
                            plan.popular
                                ? "bg-gradient-to-br from-blue-600 to-purple-700 text-white shadow-2xl border-2 border-blue-500 transform "
                                : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl"
                        }`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                    <Zap className="h-4 w-4" />
                                    Most Popular
                                </div>
                            </div>
                        )}

                        <div className="text-center mb-6">
                            <div className="flex justify-center mb-4">
                                <div
                                    className={`p-3 rounded-full ${
                                        plan.popular
                                            ? "bg-white/20"
                                            : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                    }`}
                                >
                                    {plan.icon}
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                            <p
                                className={`text-sm mb-4 ${
                                    plan.popular
                                        ? "text-blue-100"
                                        : "text-gray-600 dark:text-gray-400"
                                }`}
                            >
                                {plan.description}
                            </p>
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-4xl font-bold">
                                    {plan.price > 0 && <span>&#8377;</span>}
                                    {plan.price}
                                </span>
                                <span
                                    className={`text-lg ${
                                        plan.popular
                                            ? "text-blue-200"
                                            : "text-gray-500 dark:text-gray-400"
                                    }`}
                                >
                                    {plan.period}
                                </span>
                            </div>
                        </div>

                        <ul className="space-y-3 mb-8">
                            {plan.features.map((feature, featureIndex) => (
                                <li key={featureIndex} className="flex items-start gap-3">
                                    <div
                                        className={`p-1 rounded-full mt-0.5 ${
                                            plan.popular
                                                ? "bg-white/20"
                                                : "bg-green-100 dark:bg-green-900/30"
                                        }`}
                                    >
                                        <Check
                                            className={`h-3 w-3 ${
                                                plan.popular
                                                    ? "text-white"
                                                    : "text-green-600 dark:text-green-400"
                                            }`}
                                        />
                                    </div>
                                    <span
                                        className={`text-sm ${
                                            plan.popular
                                                ? "text-blue-50"
                                                : "text-gray-700 dark:text-gray-300"
                                        }`}
                                    >
                                        {feature}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        {plan.name !== "Basic" ? (
                            <RazorpayButton
                                sheetId={"godlevel"}
                                sheetTitle={"codegod"}
                                amount={plan.price}
                                plan={plan}
                            />
                        ) : (
                            <button
                                onClick={() => navigate("/login")}
                                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                                    plan.popular
                                        ? "bg-white text-blue-600 hover:bg-gray-100 shadow-lg"
                                        : "bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 shadow-md hover:shadow-lg"
                                }`}
                            >
                                Start Now 
                            </button>
                        )}

                        {plan.popular && (
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-700/20 pointer-events-none" />
                        )}
                    </div>
                ))}
            </div>

            <div className="text-center mt-12">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                    All plans include a 7-day free trial • Cancel anytime • No hidden
                    fees
                </p>
            </div>
        </div>
    </div>
);
};

export default PricingCards;
