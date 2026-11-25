import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBars,
  FaTimes,
  FaLinkedin,
  FaEnvelope,
  FaSpotify,
  FaPinterest,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiBinance } from "react-icons/si";

export const Navbar = ({ profile }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: "About", path: "/about" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Certificates", path: "/certificates" },
    { name: "Thoughts", path: "/thoughts" },
  ];

  const socialLinks = [
    {
      name: "LinkedIn",
      href: profile?.linkedin || "https://www.linkedin.com/in/chimwemwe-kamanga-8b939b3ba/",
      icon: FaLinkedin,
    },
    {
      name: "X (Twitter)",
      href: profile?.twitter || "https://x.com/creamiechim?s=11",
      icon: FaXTwitter,
    },
    {
      name: "Spotify",
      href: profile?.spotify || "https://open.spotify.com/user/w1nyotsp3z06zxuh1dzpj6s0x?si=5665490e41f146a9",
      icon: FaSpotify,
    },
    {
      name: "Binance",
      href: profile?.binance || "https://account.binance.com/register?registerChannel=user_center&ref=1028236664",
      icon: SiBinance,
    },
    {
      name: "Pinterest",
      href: profile?.pinterest || "https://pin.it/4cjnBygR8",
      icon: FaPinterest,
    },
    {
      name: "Email",
      href: `mailto:${profile?.email || "chimwemwe.kamanga01@gmail.com"}`,
      icon: FaEnvelope,
      isMail: true,
    },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white text-neutral-dark shadow-md py-4"
          : "bg-transparent text-neutral-dark py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-black tracking-tighter uppercase relative group"
        >
          {profile?.name?.split(" ")[0]}
          <span className="text-caa-red">.</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-bold tracking-widest uppercase hover:text-caa-red transition-colors relative group ${
                location.pathname === link.path ? "text-caa-red" : ""
              }`}
            >
              {link.name}
              <span
                className={`absolute -bottom-2 left-0 w-0 h-0.5 bg-caa-red transition-all duration-300 group-hover:w-full ${
                  location.pathname === link.path ? "w-full" : ""
                }`}
              />
            </Link>
          ))}

          {/* Social Icons */}
          <div className="flex items-center gap-4 pl-4 border-l border-neutral-300">
            {socialLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  target={item.isMail ? undefined : "_blank"}
                  rel={item.isMail ? undefined : "noopener noreferrer"}
                  className="text-neutral-500 hover:text-caa-red transition-colors text-base"
                  aria-label={item.name}
                  title={item.name}
                >
                  <Icon />
                </a>
              );
            })}
          </div>
        </nav>

        {/* Mobile menu button and quick icons */}
        <div className="flex items-center gap-3 lg:hidden">
          <a
            href={profile?.twitter || "https://x.com/creamiechim?s=11"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-700 hover:text-caa-red transition-colors text-lg"
            aria-label="X (Twitter)"
          >
            <FaXTwitter />
          </a>
          <a
            href={`mailto:${profile?.email || "chimwemwe.kamanga01@gmail.com"}`}
            className="text-neutral-700 hover:text-caa-red transition-colors text-lg"
            aria-label="Email"
          >
            <FaEnvelope />
          </a>
          <button
            className="text-2xl ml-2"
            onClick={() => setIsOpen(true)}
            aria-label="Open Menu"
          >
            <FaBars />
          </button>
        </div>

        {/* Mobile slide-over navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.4 }}
              className="fixed inset-0 bg-neutral-dark text-white z-50 flex flex-col items-center justify-center p-6"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-8 right-8 text-3xl hover:text-caa-red transition-colors"
                aria-label="Close Menu"
              >
                <FaTimes />
              </button>
              <nav className="flex flex-col gap-8 text-center">
                <Link
                  to="/"
                  className="text-3xl font-black tracking-tighter hover:text-caa-red transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  HOME
                </Link>
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="text-3xl font-black tracking-tighter uppercase hover:text-caa-red transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="flex flex-wrap justify-center gap-6 mt-8 pt-6 border-t border-neutral-700 max-w-xs">
                  {socialLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        target={item.isMail ? undefined : "_blank"}
                        rel={item.isMail ? undefined : "noopener noreferrer"}
                        className="text-neutral-400 hover:text-caa-red transition-colors text-2xl"
                        aria-label={item.name}
                        title={item.name}
                      >
                        <Icon />
                      </a>
                    );
                  })}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;
