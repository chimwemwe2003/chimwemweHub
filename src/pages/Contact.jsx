import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

export const Contact = ({ profile }) => {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setErrorMessage("");

    emailjs
      .sendForm(
        "service_hmexla8",
        "template_er8txnm",
        formRef.current,
        {
          publicKey: "CuI85ypEPoKsbvRYC",
        }
      )
      .then(
        () => {
          setStatus("success");
          setLoading(false);
          formRef.current.reset();
        },
        (error) => {
          console.error("FAILED...", error);
          setStatus("error");
          setErrorMessage(error.text || JSON.stringify(error));
          setLoading(false);
        }
      );
  };

  return (
    <div className="min-h-screen bg-white text-neutral-dark pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-20">
          <div>
            <h1 className="text-6xl font-black tracking-tighter mb-8 text-caa-red">
              GET IN TOUCH
            </h1>
            <p className="text-xl text-neutral-600 mb-12">
              Interested in collaborating? Fill out the form or reach out directly
              via email.
            </p>
            <div className="space-y-6 mb-12">
              <div>
                <h3 className="text-sm font-bold tracking-widest uppercase mb-1">
                  Email
                </h3>
                <p className="text-lg">
                  {profile?.email || "hello@example.com"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-widest uppercase mb-1">
                  Location
                </h3>
                <p className="text-lg">
                  {profile?.location || "Lusaka, Zambia"}
                </p>
              </div>
            </div>
            <div className="w-full h-64 bg-neutral-100 grayscale">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
                src="https://maps.google.com/maps?width=100%25&height=600&hl=en&q=Lusaka,%20Zambia+(Location)&t=&z=14&ie=UTF8&iwloc=B&output=embed"
                className="mix-blend-multiply opacity-80"
                title="Map"
              />
            </div>
          </div>
          <div className="bg-neutral-50 p-10 md:p-16">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold tracking-widest uppercase mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="user_name"
                  required
                  className="w-full bg-white border-0 border-b-2 border-neutral-200 p-3 focus:ring-0 focus:border-caa-red transition-colors"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-bold tracking-widest uppercase mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="user_email"
                  required
                  className="w-full bg-white border-0 border-b-2 border-neutral-200 p-3 focus:ring-0 focus:border-caa-red transition-colors"
                  placeholder="jane@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold tracking-widest uppercase mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  className="w-full bg-white border-0 border-b-2 border-neutral-200 p-3 focus:ring-0 focus:border-caa-red transition-colors"
                  placeholder="Project Inquiry"
                />
              </div>
              <div>
                <label className="block text-sm font-bold tracking-widest uppercase mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  rows="4"
                  className="w-full bg-white border-0 border-b-2 border-neutral-200 p-3 focus:ring-0 focus:border-caa-red transition-colors"
                  placeholder="Tell me about your project..."
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full font-bold tracking-widest py-4 transition-colors duration-300 ${
                  loading
                    ? "bg-neutral-400 cursor-not-allowed"
                    : "bg-neutral-dark text-white hover:bg-caa-red"
                }`}
              >
                {loading ? "SENDING..." : "SEND MESSAGE"}
              </button>
              {status === "config_error" && (
                <div className="text-amber-600 bg-amber-50 p-4 rounded mt-4 text-sm font-bold text-center border border-amber-200">
                  ⚠️ Setup Required: Please update <code>src/pages/Contact.jsx</code>{" "}
                  with your EmailJS credentials to enable email sending.
                </div>
              )}
              {status === "success" && (
                <p className="text-green-600 font-bold text-center mt-4 animate-pulse">
                  Message sent successfully!
                </p>
              )}
              {status === "error" && (
                <div className="text-red-600 font-bold text-center mt-4">
                  <p>Failed to send.</p>
                  <p className="text-sm font-normal mt-1 text-neutral-500">
                    Error: {errorMessage}
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
