import { motion } from "framer-motion";

export const About = ({ profile }) => {
  return (
    <div className="min-h-screen bg-white text-neutral-dark pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid md:grid-cols-2 gap-12 md:gap-16 items-start"
        >
          <div className="relative md:sticky md:top-32 mb-8 md:mb-0 max-w-sm mx-auto md:max-w-none w-full">
            <div className="aspect-[4/5] bg-neutral-100 overflow-hidden shadow-2xl relative group">
              {profile?.image ? (
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-300 font-bold text-4xl">
                  IMG
                </div>
              )}
              <div className="absolute inset-0 border-2 border-neutral-dark/10 pointer-events-none" />
            </div>
            <div className="mt-6 flex flex-col gap-1">
              <span className="text-sm font-bold tracking-widest uppercase text-neutral-400">
                Location & Base
              </span>
              <span className="text-lg font-bold text-neutral-dark">
                {profile?.location || "Lusaka, Zambia"}
              </span>
            </div>
          </div>

          <div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-8 leading-none">
              WHO I AM
            </h1>

            <div className="prose prose-lg text-neutral-600 mb-12 space-y-6">
              {profile?.summary ? (
                profile.summary
                  .split("\n\n")
                  .map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-lg md:text-xl leading-relaxed text-neutral-700 font-normal"
                    >
                      {paragraph}
                    </p>
                  ))
              ) : (
                <p className="text-xl leading-relaxed">
                  A dedicated technologist focused on delivering high-impact
                  solutions across agentic systems, forward deployment, and
                  offensive cybersecurity.
                </p>
              )}
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-bold tracking-widest uppercase mb-6 border-b border-neutral-200 pb-3 flex justify-between items-center">
                <span>Core Expertise & Focus Areas</span>
                <span className="text-caa-red font-mono text-xs">
                  0{profile?.tags?.length || 5} DISCIPLINES
                </span>
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {profile?.tags?.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-3 p-3 bg-neutral-50 border border-neutral-100 hover:border-caa-red transition-colors group"
                  >
                    <div className="w-2 h-2 bg-caa-red rounded-full group-hover:scale-125 transition-transform" />
                    <span className="font-bold text-sm tracking-wide text-neutral-800">
                      {tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
