import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const Portfolio = ({ projects }) => {
  return (
    <div className="min-h-screen bg-white text-neutral-dark pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">
            SELECTED WORK
          </h1>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
          {projects?.map((project, idx) => (
            <Link
              key={project.id}
              to={`/portfolio/${project.id}`}
              className="group cursor-pointer block"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
              >
                <div className="aspect-[4/3] bg-neutral-100 mb-6 overflow-hidden relative shadow-md">
                  <div className="absolute inset-0 bg-caa-red/0 group-hover:bg-caa-red/90 transition-colors duration-300 flex items-center justify-center z-10">
                    <span className="text-white font-bold tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      VIEW DETAILS
                    </span>
                  </div>
                  {project.thumbnail || project.image ? (
                    <img
                      src={project.thumbnail || project.image}
                      alt={project.title}
                      loading="lazy"
                      className={`w-full h-full ${
                        project.containThumbnail
                          ? "object-contain p-8 bg-neutral-950"
                          : "object-cover"
                      } group-hover:scale-105 transition-transform duration-700`}
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-neutral-300 font-bold text-lg">
                      {project.title.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <h3 className="text-xl font-bold mb-1 group-hover:text-caa-red transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-neutral-500 uppercase tracking-wider mb-2">
                      {project.focus}
                    </p>
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] font-mono font-medium px-2 py-0.5 bg-neutral-100 text-neutral-600 border border-neutral-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-neutral-300 group-hover:text-caa-red transition-colors font-mono font-bold">
                    0{idx + 1}
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
