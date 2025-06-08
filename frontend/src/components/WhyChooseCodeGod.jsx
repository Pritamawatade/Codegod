import { motion } from "framer-motion";
import {
  CheckCircle,
  Target,
  Trophy,
  Calendar,
  Flame,
  Star,
  Code,
} from "lucide-react";

export default function WhyChooseCodeGod({ isVisible }) {
  return (
    <section id="why-us" className="py-20 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black dark:text-white">
            Why Choose CodeGod?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join the pantheon of coding legends. Here's why thousands of
            developers worship at the altar of CodeGod.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isVisible["why-us-content"] ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {[
              {
                icon: (
                  <CheckCircle className="w-6 h-6 text-black dark:text-white" />
                ),
                title: "Comprehensive Learning Path",
                desc: "From basic concepts to advanced algorithms, our structured curriculum guides you through every step of your coding journey.",
              },
              {
                icon: <Target className="w-6 h-6 text-black dark:text-white" />,
                title: "Personalized Experience",
                desc: "AI-powered recommendations adapt to your learning style and pace, ensuring maximum efficiency in your coding evolution.",
              },
              {
                icon: <Trophy className="w-6 h-6 text-black dark:text-white" />,
                title: "Proven Results",
                desc: "95% of our users land their dream job within 6 months. Join the ranks of coding gods who've transformed their careers.",
              },
            ].map(({ icon, title, desc }, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                key={idx}
                className="flex items-start space-x-4 group"
              >
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  {icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-black dark:text-white">
                    {title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isVisible["why-us-visual"] ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative rounded-3xl p-8 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    icon: <Calendar className="w-8 h-8 text-blue-600 mb-2" />,
                    stat: "365",
                    label: "Days of Coding",
                  },
                  {
                    icon: <Flame className="w-8 h-8 text-orange-500 mb-2" />,
                    stat: "🔥 99",
                    label: "Day Streak",
                  },
                  {
                    icon: <Star className="w-8 h-8 text-yellow-500 mb-2" />,
                    stat: "4.9",
                    label: "Rating",
                  },
                  {
                    icon: <Code className="w-8 h-8 text-green-500 mb-2" />,
                    stat: "50+",
                    label: "Problems Solved",
                  },
                ].map(({ icon, stat, label }, idx) => (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    key={idx}
                    className="rounded-xl p-4 hover:scale-105 transition-transform duration-300 bg-gray-50 dark:bg-gray-800"
                  >
                    {icon}
                    <div className="text-2xl font-bold text-black dark:text-white">
                      {stat}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
