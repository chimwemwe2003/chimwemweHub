import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaArrowRight, FaPen } from "react-icons/fa";
import { Link } from "react-router-dom";
import { portfolioData } from "../data";
import { fetchLiveThoughts } from "../services/firebase";

export const Thoughts = () => {
  const [allThoughts, setAllThoughts] = useState(portfolioData.thoughts || []);
  const [selectedThought, setSelectedThought] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadLive() {
      try {
        const livePosts = await fetchLiveThoughts();
        if (isMounted && livePosts && livePosts.length > 0) {
          // Merge dynamic live thoughts with built-in thoughts
          const combined = [
            ...livePosts,
            ...(portfolioData.thoughts || []).filter(
              (bt) => !livePosts.some((lp) => lp.id === bt.id)
            ),
          ];
          setAllThoughts(combined);
        }
      } catch (err) {
        console.warn("Using offline thoughts:", err);
      }
    }
    loadLive();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-neutral-dark pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">
            THOUGHTS
          </h1>
        </div>

        {/* Thought list */}
        <div className="space-y-8">
          {allThoughts.map((item, idx) => (
            <motion.article
              key={item.id || idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              onClick={() => setSelectedThought(item)}
              className="group p-8 md:p-10 bg-neutral-50 border border-neutral-100 hover:border-caa-red hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-caa-red transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4 text-xs font-mono text-neutral-400">
                <span className="text-caa-red font-bold uppercase tracking-wider">
                  {item.category}
                </span>
                <span>
                  {item.date} • {item.readTime}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-4 group-hover:text-caa-red transition-colors">
                {item.title}
              </h2>
              <p className="text-neutral-600 leading-relaxed text-base md:text-lg mb-6">
                {item.summary}
              </p>
              <div className="inline-flex items-center gap-2 text-sm font-bold tracking-widest text-caa-red uppercase group-hover:gap-4 transition-all">
                Read Thought <FaArrowRight size={12} />
              </div>
            </motion.article>
          ))}
        </div>

        {/* Reading Modal */}
        <AnimatePresence>
          {selectedThought && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-neutral-dark/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white text-neutral-dark max-w-3xl w-full max-h-[85vh] overflow-y-auto rounded-none shadow-2xl p-8 md:p-12 relative border-t-4 border-caa-red"
              >
                <button
                  onClick={() => setSelectedThought(null)}
                  className="absolute top-6 right-6 text-neutral-400 hover:text-caa-red transition-colors text-xl p-2"
                  aria-label="Close"
                >
                  <FaTimes />
                </button>

                <div className="text-xs font-mono text-neutral-400 mb-4 flex items-center gap-4">
                  <span className="text-caa-red font-bold uppercase tracking-wider">
                    {selectedThought.category}
                  </span>
                  <span>•</span>
                  <span>{selectedThought.date}</span>
                  <span>•</span>
                  <span>{selectedThought.readTime}</span>
                </div>

                <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-8 leading-tight">
                  {selectedThought.title}
                </h1>

                <div className="prose prose-lg text-neutral-700 leading-relaxed space-y-6 border-t border-neutral-100 pt-6">
                  {selectedThought.content.split("\n\n").map((para, i) => (
                    <p key={i} className="text-base md:text-lg whitespace-pre-line">
                      {para}
                    </p>
                  ))}
                </div>

                <div className="mt-12 pt-6 border-t border-neutral-200 flex justify-between items-center">
                  <span className="text-xs font-mono text-neutral-400">
                    By Chimwemwe Kamanga
                  </span>
                  <button
                    onClick={() => setSelectedThought(null)}
                    className="border border-neutral-dark text-neutral-dark px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-neutral-dark hover:text-white transition-all"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Thoughts;
