import React, { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Zap,
  Target,
  Users,
  Star,
  ArrowRight,
  Flame,
  Globe,
  BookOpen,
  TrendingUp,

} from "lucide-react";
import BannerText from "../components/BannerText";
import { motion } from "framer-motion";
import WhyChooseCodeGod from "../components/WhyChooseCodeGod";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CodeGodLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState({});
  const observerRef = useRef();

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1, rootMargin: "-50px" }
    );

    document.querySelectorAll("[data-animate]").forEach((el) => {
      observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const features = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: "5 Programming Languages",
      description:
        "Master DSA in Python, Java, C++, JavaScript, and Go with comprehensive support for all major languages.",
    },
    {
      icon: <Flame className="w-8 h-8" />,
      title: "Streak Tracking",
      description:
        "Build discipline with our advanced streak system that motivates you to code consistently every day.",
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Unique Questions",
      description:
        "Access thousands of handcrafted problems designed to challenge your thinking and improve your skills.",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Discipline Builder",
      description:
        "Structured learning paths and daily challenges that transform you into a disciplined problem solver.",
    },
  ];

  const stats = [
    {
      number: "10+",
      label: "Active Users",
      icon: <Users className="w-6 h-6" />,
    },
    {
      number: "50+",
      label: "Unique Problems",
      icon: <BookOpen className="w-6 h-6" />,
    },
    {
      number: "95%",
      label: "Success Rate",
      icon: <TrendingUp className="w-6 h-6" />,
    },
    { number: "24/7", label: "Support", icon: <Zap className="w-6 h-6" /> },
  ];

  const isVisible1 = {
    "why-us-header": true,
    "why-us-content": true,
    "why-us-visual": true,
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 `}>
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-[#0e0e0e] text-slate-900 dark:dark:text-white">
        {/* Navigation */}

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden dark:bg-[#0e0e0e]">
          <div className="absolute inset-0 "></div>

          {/* Animated Background Elements */}
          {/* <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full animate-bounce delay-100"></div>
            <div className="absolute top-40 right-20 w-16 h-16 bg-purple-500/20 rounded-full animate-bounce delay-300"></div>
            <div className="absolute bottom-20 left-20 w-12 h-12 bg-pink-500/20 rounded-full animate-bounce delay-500"></div>
            <div className="absolute top-60 left-1/2 w-8 h-8 bg-yellow-500/20 rounded-full animate-bounce delay-700"></div> */}

          {/* Floating Code Elements */}
          {/* <div className="absolute top-32 right-10 opacity-20 animate-pulse">
              <div className="text-4xl font-mono text-blue-600 dark:text-blue-400">
                {"<>"}
              </div>
            </div>
            <div className="absolute bottom-32 left-16 opacity-20 animate-pulse delay-1000">
              <div className="text-3xl font-mono text-purple-600 dark:text-purple-400">
                {"{ }"}
              </div>
            </div>
          </div> */}

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-fade-in-up">
              <h1 className="text-5xl md:text-7xl font-bold dark:text-white mb-6 leading-tight">
                Master{" "}
                <span className="dark:text-white animate-gradient">DSA</span>{" "}
                Like a
                <br />
                <span className="dark:text-white animate-gradient">
                  CodeGod
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Transform from a coding novice to a problem-solving deity.
                Master Data Structures & Algorithms with our revolutionary
                platform designed for the gods of code.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <button className="group bg-black text-white dark:bg-white dark:hover:bg-blue-600 cursor-pointer  dark:text-black px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-purple-800 transition-all duration-300 transform shadow-2xl hover:shadow-blue-500/25 flex items-center space-x-2">
                  <span>Start Your Journey</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 cursor-pointer py-4 rounded-full text-lg font-semibold border-2 border-slate-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-lg">
                  Watch Demo
                </button>
              </div>

              {/* Hero Stats */}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
                {stats.map((stat, index) => (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    key={index}
                    className="text-center group hover:scale-105 transition-transform duration-300"
                  >
                    <div className="flex justify-center mb-2 text-blue-600 dark:text-blue-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:dark:text-white">
                      {stat.number}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-slate-400" />
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="py-16 md:py-20 lg:py-24 bg-gray-50 dark:bg-[#0e0e0e] transition-colors duration-300"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div
              data-animate
              id="features-header"
              className={`text-center mb-12 md:mb-16 lg:mb-20 transition-all duration-1000 ${
                isVisible["features-header"]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <motion.h2
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-gray-900 dark:text-white"
              >
                Godlike Features
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
              >
                Unleash your coding potential with features designed by the
                gods, for the gods
              </motion.p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {features.map((feature, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 1 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  key={index}
                  data-animate
                  id={`feature-${index}`}
                  className={`group relative bg-white dark:bg-gray-900 rounded-xl md:rounded-2xl p-6 md:p-8 
            hover:bg-gray-50 dark:hover:bg-gray-800 
            transition-all duration-300 ease-out
            hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50
            cursor-pointer 
            border border-gray-200 dark:border-gray-700
            hover:border-gray-300 dark:hover:border-gray-600
            ${
              isVisible[`feature-${index}`]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300 mb-4 md:mb-6">
                      {feature.icon}
                    </div>

                    {/* Title */}
                    <h3
                      className="text-lg md:text-xl font-semibold mb-3 md:mb-4 
              text-gray-900 dark:text-white 
              group-hover:text-gray-900 dark:group-hover:text-white 
              transition-colors duration-300"
                    >
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p
                      className="text-sm md:text-base text-gray-600 dark:text-gray-400 
              group-hover:text-gray-700 dark:group-hover:text-gray-300
              leading-relaxed transition-colors duration-300"
                    >
                      {feature.description}
                    </p>
                  </div>

                  {/* Subtle hover background */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-gray-100/50 to-gray-200/30 
            dark:from-gray-800/30 dark:to-gray-700/20 
            rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 
            transition-opacity duration-300 pointer-events-none"
                  ></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <BannerText
          title="Level up from mortal to CodeGod—one problem at a time."
          description="Level up from mortal to CodeGod—one problem at a time."
          buttonText="Try for free"
        />

        <WhyChooseCodeGod isVisible={isVisible1} />

        {/* CTA Section */}
        <section className="py-20 bg-white dark:bg-black relative overflow-hidden">
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              id="cta-section"
            >
              <h2 className="text-4xl md:text-6xl font-bold text-black dark:text-white mb-6">
                Ready to Become a
                <span className="block text-yellow-500">CodeGod?</span>
              </h2>
              <p className="text-xl text-slate-700 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
                Join thousands of developers who've transcended their limits.
                Your journey to coding divinity starts with a single click.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="group bg-black dark:bg-white text-white dark:text-blue-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-blue-600  hover:text-black cursor-pointer transition-all duration-300 shadow-2xl flex items-center justify-center space-x-2"
                >
                  <span>Start Your Divine Journey</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="px-8 py-4 rounded-full text-lg font-semibold border-2 border-black dark:border-white text-black dark:text-white hover:bg-white dark:hover:text-black hover:text-blue-600 transition-all duration-300"
                >
                  Learn More
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Minimal Animated Background Elements */}
          {/* <div className="absolute top-10 left-10 w-16 h-16 bg-black/10 dark:bg-white/10 rounded-full animate-bounce delay-100"></div>
          <div className="absolute bottom-10 right-10 w-12 h-12 bg-yellow-400/20 rounded-full animate-bounce delay-300"></div>
          <div className="absolute top-1/2 left-20 w-8 h-8 bg-black/20 dark:bg-white/20 rounded-full animate-pulse"></div> */}
        </section>

        {/* Footer */}
        <Footer />
      </div>

      <style jsx global>{`
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        html.dark {
          color-scheme: dark;
        }

        * {
          transition-property: background-color, border-color, color, fill,
            stroke;
          transition-duration: 200ms;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default CodeGodLanding;
