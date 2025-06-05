import React, { useContext, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { emailContext } from "../App";
import DisplayEmail from "./DisplayEmail";

const SearchResults = ({ searchQuery, setShowSearchResults, category }) => {
  const { emails } = useContext(emailContext);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const searchResultsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target)
      ) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowSearchResults]);

  if (!searchQuery) return null;

  const searchWords = searchQuery
    .toLowerCase()
    .split(" ")
    .filter(Boolean);
  const filteredEmails = emails.filter((email) =>
    searchWords.some(
      (word) =>
        ((email.subject &&
          email.subject.toLowerCase().includes(word)) ||
          (email.body && email.body.toLowerCase().includes(word))) &&
        (category === "All" ? true : email.category === category)
    )
  );

  const ViewtheEmail = (email) => {
    setSelectedEmail(email);
  };

  return (
    <motion.div
      ref={searchResultsRef}
      className="absolute left-0 w-full max-w-2xl top-full mt-3 z-50 max-h-96 overflow-y-auto rounded-xl border"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background: "rgba(255, 255, 255, 0.95)",
        boxShadow:
          "0 0 25px rgba(79, 70, 229, 0.3), 0 0 15px rgba(16, 185, 129, 0.3)",
        backdropFilter: "blur(10px)",
        padding: "16px",
        fontFamily: "'DM Sans', sans-serif",
        color: "#1f2937", // dark slate gray text
        borderColor: "#4f46e5", // purple border
      }}
    >
      <h2
        className="text-xl mb-3"
        style={{
          fontWeight: 700,
          color: "#4f46e5",
          textShadow: "0 0 8px #6366f1",
        }}
      >
        Search Results:
      </h2>

      {filteredEmails.length > 0 ? (
        filteredEmails.map((email) => (
          <motion.div
            key={email._id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => ViewtheEmail(email)}
            style={{
              background: "rgba(79, 70, 229, 0.05)",
              border: "1.5px solid rgba(79, 70, 229, 0.3)",
              borderRadius: "12px",
              padding: "14px 18px",
              marginBottom: "12px",
              cursor: "pointer",
              transition: "all 0.3s ease-in-out",
              boxShadow: "0 6px 15px rgba(16, 185, 129, 0.15)",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <DisplayEmail email={email} />
          </motion.div>
        ))
      ) : (
        <p
          className="text-center text-base mt-4"
          style={{ color: "#9ca3af", fontStyle: "italic" }}
        >
          No matching emails.
        </p>
      )}

      {selectedEmail && (
        <div className="mt-6">
          <DisplayEmail email={selectedEmail} />
        </div>
      )}
    </motion.div>
  );
};

export default SearchResults;
