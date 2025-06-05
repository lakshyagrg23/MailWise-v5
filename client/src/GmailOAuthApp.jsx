import React, { useState, useRef } from "react";
import { motion } from "framer-motion";

const MailWiseLogin = () => {
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(null);
  const featuresRef = useRef(null);

  const startOAuthFlow = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/auth/url");
      console.log(response);
      const { authUrl} = await response.json();
      window.location.href = authUrl;
      const urlParams = new URLSearchParams(window.location.search);
    } catch (error) {
      console.error("OAuth Flow Error:", error);
      setLoading(false);
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0 0 15px #10b981" },
    tap: { scale: 0.95 },
  };

  const slideInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const features = [
    {
      icon: "📊",
      title: "Email Analytics",
      desc: "Visualize inbox activity with rich charts and email trends.",
      color: "#4f46e5",
    },
    {
      icon: "🤖",
      title: "Smart Classification",
      desc: "Auto-sort emails into meaningful categories using AI.",
      color: "#10b981",
    },
    {
      icon: "🧠",
      title: "AI Composition",
      desc: "Effortlessly generate professional emails with AI-powered drafting.",
      color: "#4f46e5",
    },
    {
      icon: "🔒",
      title: "OAuth + Gmail API",
      desc: "Secure Gmail login and real-time sync with your inbox.",
      color: "#4f46e5",
    },
  ];

  return (
    <div
      className="min-h-screen bg-[#fefefe] text-[#222] font-[DM Sans, Work Sans] flex flex-col"
      style={{ fontFamily: "'DM Sans', 'Work Sans', sans-serif" }}
    >
      {/* Navbar */}
      <header className="container mx-auto px-6 py-6 flex justify-between items-center border-b border-gray-300">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl font-bold text-[#4f46e5] cursor-default"
        >
          MailWise
        </motion.h1>
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-700 font-semibold">
          {["Home", "Features", "Docs", "GitHub"].map((item) => (
            <button
              key={item}
              onClick={() => {
                if (item === "Home") window.scrollTo({ top: 0, behavior: "smooth" });
                else if (item === "Features" && featuresRef.current)
                  featuresRef.current.scrollIntoView({ behavior: "smooth" });
                else setOpenDialog(item.toLowerCase());
              }}
              className="hover:text-[#4f46e5] transition duration-300"
            >
              {item}
            </button>
          ))}
        </nav>
        <motion.button
          onClick={startOAuthFlow}
          whileHover={{ scale: 1.05, boxShadow: "0 0 10px #10b981" }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#10b981] hover:bg-[#0f9f6e] text-white px-5 py-2 rounded-lg font-semibold shadow-md transition duration-300"
        >
          Sign In
        </motion.button>
      </header>

      {/* Hero */}
      <section className="text-center mt-24 px-6 max-w-3xl mx-auto">
        <motion.h2
          {...slideInUp}
          className="text-5xl font-extrabold text-[#4f46e5] mb-4"
        >
          Welcome to MailWise
        </motion.h2>
        <motion.p
          {...slideInUp}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-gray-700"
        >
          Smarter email management with insights, AI classification, and real-time access.
        </motion.p>
        <motion.button
          onClick={startOAuthFlow}
          whileHover="hover"
          whileTap="tap"
          variants={buttonVariants}
          className="mt-12 bg-blue-700 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-semibold shadow-lg transition"
        >
          Get Started
        </motion.button>
      </section>

      {/* Features */}
      <section
        ref={featuresRef}
        className="container mx-auto px-6 py-24 max-w-6xl"
      >
        <h3 className="text-4xl font-bold text-center mb-12 text-[#4f46e5]">
          Features
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * idx + 0.3, duration: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-6 cursor-default hover:shadow-2xl transition-shadow"
            >
              <div
                className="text-5xl mb-5"
                style={{ color: feature.color, userSelect: "none" }}
              >
                {feature.icon}
              </div>
              <h4 className="text-xl font-semibold mb-3 text-[#222]">
                {feature.title}
              </h4>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
      
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-[#4f46e5] text-white text-center py-20">
        <motion.h4
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-4"
        >
          Start Your Email Transformation
        </motion.h4>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 max-w-xl mx-auto text-sm"
        >
          Unlock organized, insightful, and productive emailing — with just one sign in.
        </motion.p>
        <motion.div
          className="flex justify-center"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <button
            onClick={startOAuthFlow}
            disabled={loading}
            className="bg-[#10b981] text-white font-semibold px-7 py-3 rounded-lg shadow-md hover:shadow-xl transition disabled:opacity-50"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-6 h-6 border-2 border-white border-t-transparent rounded-full inline-block"
              />
            ) : (
              "Start Now"
            )}
          </button>
        </motion.div>
      </section>

      {/* Dialogs */}
      {openDialog && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <h5 className="text-xl font-semibold mb-4 capitalize text-[#4f46e5]">
              {openDialog}
            </h5>
            <p className="text-sm text-gray-700">
              {openDialog === "docs" &&
                "Documentation is coming soon. Stay tuned for setup guides, API usage, and more."}
              {openDialog === "github" && (
                <>
                  View our GitHub repository:
                  <a
                    href="https://github.com/your-repo/mailwise"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-2 underline text-[#10b981]"
                  >
                    github.com/your-repo/mailwise
                  </a>
                </>
              )}
            </p>
            <button
              onClick={() => setOpenDialog(null)}
              className="absolute top-2 right-3 text-gray-400 hover:text-[#4f46e5] text-2xl font-bold"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#fefefe] border-t border-gray-300 text-gray-500 text-center py-12">
        <div>
          <h6 className="text-[#4f46e5] font-semibold text-lg mb-2">MailWise</h6>
          <p className="text-sm max-w-md mx-auto">
            An AI-powered platform for inbox clarity, productivity, and smarter decisions.
          </p>
        </div>
        <div className="mt-6 text-xs">&copy; {new Date().getFullYear()} MailWise. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default MailWiseLogin;
