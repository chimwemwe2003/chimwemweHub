import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import { useSite } from "../context/SiteContext";

export const ProjectDetail = () => {
  const { id } = useParams();
  const { data } = useSite();
  const project = data?.projects?.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-slate-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
          <Link
            to="/portfolio"
            className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-neutral-300 text-neutral-600 hover:border-caa-red hover:text-caa-red transition-all"
            aria-label="Back to Portfolio"
          >
            <FaArrowLeft />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 pt-24 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Back Arrow Only */}
        <Link
          to="/portfolio"
          className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-neutral-300 text-neutral-600 hover:border-caa-red hover:text-caa-red hover:-translate-x-1 transition-all mb-8 shadow-sm group"
          aria-label="Back to Portfolio"
          title="Back to Portfolio"
        >
          <FaArrowLeft className="group-hover:-translate-x-0.5 transition-transform" />
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-5xl font-black mb-4">
            {project.title}
          </h1>
          <p className="text-xl text-slate-500 font-medium mb-6">
            {project.focus}
          </p>

          {/* Action Links (Live Demo, GitHub Repo, Report) */}
          {project.links && (
            <div className="flex flex-wrap gap-4 mb-8">
              {project.links.demo && project.links.demo !== "#" && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-caa-red text-white px-6 py-2.5 font-bold tracking-widest text-xs uppercase hover:bg-neutral-dark transition-all"
                >
                  Live Demo <FaExternalLinkAlt size={11} />
                </a>
              )}
              {project.links.repo && (
                <a
                  href={project.links.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border-2 border-neutral-dark text-neutral-dark px-6 py-2.5 font-bold tracking-widest text-xs uppercase hover:bg-neutral-dark hover:text-white transition-all"
                >
                  GitHub Repository <FaGithub size={13} />
                </a>
              )}
              {project.links.report && (
                <a
                  href={project.links.report}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border-2 border-neutral-dark text-neutral-dark px-6 py-2.5 font-bold tracking-widest text-xs uppercase hover:bg-neutral-dark hover:text-white transition-all"
                >
                  View Report <FaExternalLinkAlt size={11} />
                </a>
              )}
            </div>
          )}

          <div className="aspect-video w-full overflow-hidden rounded-2xl shadow-lg mb-12">
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              decoding="async"
              className={`w-full h-full ${
                project.containThumbnail
                  ? "object-contain p-12 bg-neutral-950"
                  : "object-cover"
              }`}
            />
          </div>

          <div className="grid gap-12">
            <section>
              <h2 className="text-2xl font-bold mb-4 border-b border-slate-200 pb-2">
                Program Overview
              </h2>
              <p className="text-lg leading-relaxed text-slate-700">
                {project.programOverview || project.description}
              </p>
            </section>
            {project.roleDescription && (
              <section>
                <h2 className="text-2xl font-bold mb-4 border-b border-slate-200 pb-2">
                  Role Description
                </h2>
                <p className="text-lg leading-relaxed text-slate-700">
                  {project.roleDescription}
                </p>
              </section>
            )}
            {project.professionalInsights && (
              <section>
                <h2 className="text-2xl font-bold mb-4 border-b border-slate-200 pb-2">
                  Professional Insights
                </h2>
                <p className="text-lg leading-relaxed text-slate-700">
                  {project.professionalInsights}
                </p>
              </section>
            )}
            {project.gallery && project.gallery.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6 border-b border-slate-200 pb-2">
                  Gallery
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {project.gallery.map((item, idx) => (
                    <div
                      key={idx}
                      className="group relative overflow-hidden rounded-xl shadow-md"
                    >
                      {item.type === "video" ? (
                        <div className="w-full h-64 bg-black">
                          <video
                            controls
                            className="w-full h-full object-cover"
                            poster={project.image}
                          >
                            <source src={item.src} type="video/mp4" />
                            <source src={item.src} type="video/quicktime" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      ) : (
                        <img
                          src={item.src}
                          alt={item.caption}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <p className="text-white text-sm font-medium">
                          {item.caption}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            <div className="flex flex-wrap gap-2 mt-8">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectDetail;
