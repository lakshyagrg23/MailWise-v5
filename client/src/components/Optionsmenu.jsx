import React, { useState, useContext } from "react";
import { emailContext } from "../App";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar } from "@mui/material";
import { Sparkles } from "lucide-react";

const flyIn = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
};

const iconVariants = {
  hover: { scale: 1.15, rotate: 5 },
  tap: { scale: 0.9 },
};

const OptionsMenu = () => {
  const { name, email, picture } = useContext(emailContext);
  const [helpOpen, setHelpOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const logout = () => (window.location.href = "http://localhost:3000");

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-4 font-sans">
      {/* 💡 Help Orb */}
      <motion.div
        whileTap="tap"
        variants={iconVariants}
        onClick={() => {
          setHelpOpen(!helpOpen);
          setPanelOpen(false);
        }}
        className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#4f46e5] via-[#3b82f6] to-[#10b981] shadow-lg flex items-center justify-center cursor-pointer"
      >
        <Sparkles className="text-white w-7 h-7" />
        <AnimatePresence>
          {helpOpen && (
            <motion.div
              variants={flyIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute top-16 right-0 bg-white/95 text-gray-800 p-5 rounded-3xl w-80 shadow-lg backdrop-blur-sm border border-gray-300"
              style={{ fontWeight: 500 }}
            >
              <h2 className="font-bold text-xl mb-3 flex items-center gap-2 text-indigo-700">
                <span>💡</span> MailWise Pro Tips
              </h2>
              <ul className="text-sm space-y-3 text-gray-700 leading-relaxed">
                <li>🚀 Zoom through emails with smart category filters.</li>
                <li>🔍 Use AI-powered search to find anything instantly.</li>
                <li>📡 Connect with Gmail OAuth for real-time sync.</li>
                <li>🤖 Auto-email generation while typing messages.</li>
                <li>📂 Filter by Essentials, Social, Promotions & more with a tap.</li>
              </ul>
              <button
                onClick={() => setHelpOpen(false)}
                className="mt-4 w-full py-2 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors duration-200"
              >
                Got it, Commander 🚀
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 👤 User Orb */}
      <motion.div
        whileTap="tap"
        variants={iconVariants}
        onClick={() => {
          setPanelOpen(!panelOpen);
          setHelpOpen(false);
        }}
        className="relative w-14 h-14 rounded-full shadow-lg bg-white flex items-center justify-center cursor-pointer"
      >
        <Avatar
          src={picture}
          className="w-14 h-14 border-2 border-indigo-600 shadow-md"
        />
        <AnimatePresence>
          {panelOpen && (
            <motion.div
              variants={flyIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute top-16 right-0 bg-white/95 text-gray-900 p-5 rounded-3xl w-80 shadow-lg backdrop-blur-sm border border-gray-300"
            >
              <div className="flex items-center gap-4">
                <img
                  src={picture}
                  alt="User"
                  className="w-16 h-16 rounded-full shadow-md border-2 border-indigo-600"
                />
                <div>
                  <p className="text-xl font-bold text-indigo-700">{name}</p>
                  <p className="text-sm text-gray-600">{email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="mt-5 w-full py-2 bg-amber-400 text-gray-900 font-semibold rounded-xl hover:bg-amber-500 transition-colors"
              >
                Log Out 🛰️
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default OptionsMenu;
