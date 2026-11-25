import { motion } from "framer-motion";
import { FaExternalLinkAlt } from "react-icons/fa";

export const Certificates = ({ certificates }) => {
  return (
    <div className="min-h-screen bg-white text-neutral-dark pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-5xl font-black tracking-tighter mb-4">
            CERTIFICATIONS
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {certificates?.list?.map((cert, idx) => {
            const isObj = typeof cert === "object" && cert !== null;
            const certName = isObj ? cert.name : cert;
            const certIssuer = isObj ? cert.issuer : "Professional Certification";
            const certLink = isObj ? cert.link : null;

            return (
              <motion.div
                key={idx}
                initial={{
                  opacity: 0,
                  x: idx % 2 === 0 ? -20 : 20,
                }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="group p-8 md:p-10 bg-neutral-50 border border-neutral-100 hover:border-caa-red hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-caa-red transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />

                <h3 className="text-2xl font-black mb-3 group-hover:text-caa-red transition-colors">
                  {certName}
                </h3>
                <p className="text-sm text-neutral-500 uppercase tracking-wider font-medium">
                  {certIssuer}
                </p>

                {certLink && (
                  <div className="mt-4">
                    <a
                      href={certLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-caa-red hover:underline"
                    >
                      Verify Credential <FaExternalLinkAlt size={11} />
                    </a>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Global verification buttons */}
        <div className="mt-16 flex flex-wrap justify-center gap-6">
          {certificates?.links?.INE && (
            <a
              href={certificates.links.INE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-caa-red bg-caa-red text-white px-8 py-3.5 font-bold tracking-widest hover:bg-neutral-dark hover:border-neutral-dark transition-all duration-300 uppercase text-sm"
            >
              Verify INE Certificate <FaExternalLinkAlt size={12} />
            </a>
          )}
          {certificates?.links?.Credly && (
            <a
              href={certificates.links.Credly}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-neutral-dark text-neutral-dark px-8 py-3.5 font-bold tracking-widest hover:bg-neutral-dark hover:text-white transition-all duration-300 uppercase text-sm"
            >
              View on Credly <FaExternalLinkAlt size={12} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Certificates;
