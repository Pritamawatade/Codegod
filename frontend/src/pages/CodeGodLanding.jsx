import React, { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Code,
  Zap,
  Target,
  Users,
  Trophy,
  Star,
  Menu,
  X,
  ArrowRight,
  CheckCircle,
  Flame,
  Calendar,
  Globe,
  BookOpen,
  TrendingUp,
  Github,
  Twitter,
  Linkedin,
  Mail,
} from "lucide-react";
import BannerText from "../components/BannerText";
import { motion } from "framer-motion";
import WhyChooseCodeGod from "../components/WhyChooseCodeGod";

const CodeGodLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
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
      number: "10K+",
      label: "Active Users",
      icon: <Users className="w-6 h-6" />,
    },
    {
      number: "500+",
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
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDark ? "dark" : ""
      }`}
    >
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-[#0e0e0e] text-slate-900 dark:dark:text-white">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-[#0e0e0e]  border-b border-slate-200/20 dark:border-gray-700/20 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-300">
                    <Code className="w-6 h-6 dark:text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">
                  CodeGod
                </span>
              </div>

              <div className="hidden md:flex items-center space-x-8">
                <a
                  href="#features"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                >
                  Features
                </a>
                <a
                  href="#why-us"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                >
                  Why Us
                </a>
                <a
                  href="#stats"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                >
                  Stats
                </a>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {isDark ? "🌞" : "🌙"}
                </button>
                <button className="bg-gradient-to-r from-blue-600 to-purple-700 dark:text-white px-6 py-2 rounded-full hover:from-blue-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Start Coding
                </button>
              </div>

              <button
                className="md:hidden p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden transition-all duration-300 ${
              isMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
            } overflow-hidden bg-white dark:bg-gray-900 border-t border-slate-200 dark:border-gray-700`}
          >
            <div className="px-4 py-4 space-y-3">
              <a
                href="#features"
                className="block py-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Features
              </a>
              <a
                href="#why-us"
                className="block py-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Why Us
              </a>
              <a
                href="#stats"
                className="block py-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Stats
              </a>
              <button
                onClick={toggleTheme}
                className="block py-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {isDark ? "Light Mode" : "Dark Mode"}
              </button>
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-700 dark:text-white py-2 rounded-full">
                Start Coding
              </button>
            </div>
          </div>
        </nav>

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
          className="py-20 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              data-animate
              id="features-header"
              className={`text-center mb-16 transition-all duration-1000 ${
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
                className="text-4xl md:text-5xl font-bold mb4 text-black dark:text-white -bg-clip-text"
              >
                Godlike Features
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
              >
                Unleash your coding potential with features designed by the
                gods, for the gods
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 1 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  key={index}
                  data-animate
                  id={`feature-${index}`}
                  className={`group relative bg-blue-700 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 hover:bg-blue-800 dark:hover:bg-gray-800/80 transition-all  ease-in-out duration-500 hover:shadow-2xl hover:shadow-green-500/10 hover:-translate-y-2 border border-slate-200/20 dark:border-gray-700/20 ${
                    isVisible[`feature-${index}`]
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-200/5 to-green-200/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative">
                    <div className="text-blue-600 dark:text-blue-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300 mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-4 dark:text-white dark:dark:text-white group-hover:text-gray-50 dark:group-hover:text-blue-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="dark:text-white font-medium  leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Hover Effect Gradient Border */}
                  {/* <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div> */}
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
        <footer className="bg-slate-900 dark:bg-black dark:text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl flex items-center justify-center transform rotate-12">
                    <Code className="w-6 h-6 dark:text-white" />
                  </div>
                  <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    CodeGod
                  </span>
                </div>
                <p className="text-slate-300 mb-6 max-w-md">
                  Elevate your coding skills to divine levels. Master Data
                  Structures & Algorithms with the platform trusted by coding
                  legends worldwide.
                </p>
                <div className="flex space-x-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                    <Twitter className="w-5 h-5" />
                  </div>
                  <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors cursor-pointer">
                    <Github className="w-5 h-5" />
                  </div>
                  <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors cursor-pointer">
                    <Linkedin className="w-5 h-5" />
                  </div>
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors cursor-pointer">
                    <Mail className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-blue-400">
                  Platform
                </h3>
                <ul className="space-y-2 text-slate-300">
                  <li>
                    <a
                      href="#"
                      className="hover:dark:text-white transition-colors"
                    >
                      Problems
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:dark:text-white transition-colors"
                    >
                      Contests
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:dark:text-white transition-colors"
                    >
                      Learning Paths
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:dark:text-white transition-colors"
                    >
                      Discussion
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-purple-400">
                  Company
                </h3>
                <ul className="space-y-2 text-slate-300">
                  <li>
                    <a
                      href="#"
                      className="hover:dark:text-white transition-colors"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:dark:text-white transition-colors"
                    >
                      Careers
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:dark:text-white transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:dark:text-white transition-colors"
                    >
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-700 mt-12 pt-8 text-center text-slate-400">
              <p>
                &copy; 2025 CodeGod. All rights reserved. Ascend to coding
                divinity.
              </p>
            </div>
          </div>
        </footer>
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
