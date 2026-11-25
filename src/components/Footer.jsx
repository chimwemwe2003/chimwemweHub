import {
  FaLinkedin,
  FaGithub,
  FaEnvelope,
  FaSpotify,
  FaPinterest,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiBinance } from "react-icons/si";

export const Footer = ({ profile }) => {
  const socialLinks = [
    {
      name: "LinkedIn",
      href: profile?.linkedin || "https://www.linkedin.com/in/chimwemwe-kamanga-8b939b3ba/",
      icon: FaLinkedin,
    },
    {
      name: "GitHub",
      href: profile?.github || "https://github.com/chimwemwe2003",
      icon: FaGithub,
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
    <footer className="bg-neutral-dark text-white py-16 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-black tracking-tighter mb-2">
              {profile?.name}
              <span className="text-caa-red">.</span>
            </h2>
            <p className="text-neutral-500 text-sm">
              © {new Date().getFullYear()} All Rights Reserved.
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6">
            {socialLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  target={item.isMail ? undefined : "_blank"}
                  rel={item.isMail ? undefined : "noopener noreferrer"}
                  className="text-neutral-400 hover:text-white transition-colors"
                  aria-label={item.name}
                  title={item.name}
                >
                  <Icon size={20} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
