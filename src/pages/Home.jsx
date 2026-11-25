import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div className="min-h-screen bg-white text-neutral-dark">
      <section className="h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-neutral-100 -z-10">
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-90" />
        </div>
        <div className="container mx-auto px-6 text-center z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-tight"
          >
            INNOVATE.
            <br />
            CREATE.
            <br />
            <span className="text-caa-red">INSPIRE.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl md:text-2xl font-light text-neutral-600 mb-12 max-w-2xl mx-auto"
          >
            Crafting digital experiences that bridge the gap between imagination
            and reality.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Link
              to="/portfolio"
              className="inline-block border-2 border-neutral-dark text-neutral-dark px-10 py-4 font-bold tracking-widest hover:bg-neutral-dark hover:text-white transition-all duration-300"
            >
              VIEW WORK
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
