import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Rocket  } from "lucide-react";
import useThemeStore from "../store/useThemeStore";

const getRandomInt = (max) => Math.floor(Math.random() * max);

const DEFAULT_CHARACTER_SET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");
const NUMBER_CHARACTER_SET = "0123456789".split("");

const ScrambleText = ({
  text,
  duration = 800,
  delay = 0,
  characterSet = DEFAULT_CHARACTER_SET,
  monospace = false,
  animate = true,
}) => {
  const [displayText, setDisplayText] = useState(() => text.split(""));
  const iterationCount = useRef(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!animate) {
      setDisplayText(text.split(""));
      return;
    }

    const startTimeout = setTimeout(() => {
      setIsAnimating(true);
    }, delay);
    return () => clearTimeout(startTimeout);
  }, [delay, animate, text]);

  useEffect(() => {
    if (!isAnimating || !animate) return;

    const maxIterations = text.length;
    const startTime = performance.now();
    let animationFrameId;

    const animateFrame = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = Math.pow(progress, 1.5);

      iterationCount.current = easedProgress * maxIterations;

      setDisplayText((currentText) =>
        currentText.map((letter, index) =>
          letter === " "
            ? letter
            : index <= iterationCount.current
            ? text[index]
            : characterSet[getRandomInt(characterSet.length)]
        )
      );

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateFrame);
      }
    };

    animationFrameId = requestAnimationFrame(animateFrame);

    return () => cancelAnimationFrame(animationFrameId);
  }, [text, duration, isAnimating, characterSet, animate]);

  return (
    <span className={`inline-block ${monospace ? "font-mono" : ""}`}>
      {displayText.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: animate ? 0 : 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1, delay: index * 0.02 }}
          style={{ display: "inline-block" }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </span>
  );
};

const ScrambleNumber = ({ number, duration = 1000, delay = 100 }) => {
  return (
    <ScrambleText
      text={number.toString()}
      duration={duration}
      delay={delay}
      characterSet={NUMBER_CHARACTER_SET}
      monospace={true}
    />
  );
};

const NotFound = () => {
  const navigate = useNavigate();
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 12,
        duration: 0.6,
      },
    },
  };

  const planeVariants = {
    hidden: { y: -10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
    animate: {
      y: [-3, 3, -3],
      rotate: [-2, 2, -2],
      scale: [1, 1.02, 1],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className={`min-h-screen flex justify-center items-center text-center px-4 ${isDark ? "bg-gray-900" : "bg-white"}`}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-2xl flex flex-col items-center"
      >
        <motion.div
          variants={planeVariants}
          initial="hidden"
          animate={["visible", "animate"]}
        >
          <Rocket 
            size={100}
            className={isDark ? "text-white" : "text-black"}
          />
        </motion.div>

        {/* 404 Heading */}
        <motion.div variants={itemVariants}>
          <h1 className={`text-5xl sm:text-6xl font-extrabold mb-2 ${isDark ? "text-white" : "text-black"} font-mono`}>
            <ScrambleNumber number={404} />
          </h1>
        </motion.div>

        {/* Subheading */}
        <motion.div variants={itemVariants}>
          <h2 className={`text-xl font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"} h-6 flex justify-center`}>
            Oops! Page took flight!
          </h2>
        </motion.div>

        {/* Description */}
        <motion.div variants={itemVariants}>
          <p className={`mb-8 ${isDark ? "text-gray-400" : "text-gray-600"} max-w-md mx-auto`}>
            Looks like this page decided to go on vacation. Maybe try our
            homepage instead?
          </p>
        </motion.div>

        {/* Action buttons */}
        <motion.div variants={itemVariants}>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate("/")}
              className={`btn px-6 py-2 rounded-md font-medium normal-case ${isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"} transition-all duration-300 hover:-translate-y-0.5`}
            >
              Return Home
            </button>

            <button
              onClick={() => navigate(-1)}
              className={`btn btn-outline px-6 py-2 rounded-md font-medium normal-case ${isDark ? "text-white border-white hover:border-gray-200" : "text-black border-black hover:border-gray-800"} transition-all duration-300 hover:-translate-y-0.5`}
            >
              Go Back
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;