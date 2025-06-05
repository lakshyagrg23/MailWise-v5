/* eslint-disable no-unused-vars */
import { useEffect, useContext, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Box, List, IconButton, Popover, Typography, Alert } from "@mui/material";
import DisplayEmail from "./DisplayEmail";
import NoMails from "./error/NoMails";
import { emailContext } from "../App";
import fetchEmails from "../api/api";
import { motion } from "framer-motion";
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import CheckIcon from '@mui/icons-material/Check';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import dayjs from 'dayjs';


const Email = () => {
  const [selectedEmails, setSelectedEmails] = useState([]);

  const { openDrawer } = useOutletContext();
  const emailhook = useContext(emailContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'calendar-popover' : undefined;

  const urlParams = new URLSearchParams(window.location.search)

  const handleDateClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const filteredEmails = Array.isArray(emailhook.emails)
    ? [...(emailhook.category === "All"
        ? emailhook.emails
        : emailhook.emails.filter((email) => email.category === emailhook.category))]
      .sort((a,b)=> new Date(b.received_date) - new Date(a.received_date))
    : [];

  useEffect(() => {
    if (emailhook.messageSent) {
      const timer = setTimeout(() => {
        emailhook.setmessageSent(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
    if (emailhook.mailsReceived) {
      const timer = setTimeout(() => {
        emailhook.setMailsReceived(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [emailhook]);

  const listAnimation = {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" },
    }),
  };



  return (
    <motion.div
      className="min-h-screen w-full p-5 rounded-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        marginLeft: openDrawer ? 250 : 0,
        width: openDrawer ? "calc(100% - 250px)" : "100%",
        background: "#f9fafb", // light gray background
        boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {emailhook.newMailsLoaded && (
        <div className="w-full py-2 text-sm text-blue-600 bg-blue-50 text-center font-medium animate-pulse rounded-md shadow">
          Loading new emails...
        </div>
        
      )}
      {/* Header Controls */}
      <div className="flex items-center gap-4 mb-5">
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
          PaperProps={{
            sx: {
              borderRadius: 2,
              backgroundColor: "#ffffff",
              boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
              color: "#2563eb",
              p: 1,
              minWidth: 280,
            },
          }}
        >
        </Popover>
      </div>

      {/* Success message */}
      {emailhook.messageSent && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-5"
        >
          <Alert
            icon={<CheckIcon fontSize="inherit" />}
            severity="success"
            sx={{
              borderRadius: 2,
              backgroundColor: "#dbeafe",
              color: "#1e40af",
              fontWeight: 600,
              textAlign: "center",
              boxShadow: "0 4px 8px rgba(59, 130, 246, 0.2)",
            }}
          >
            Your email was sent successfully 🚀
          </Alert>
        </motion.div>
      )}

      {emailhook.mailsReceived && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-5"
        >
          <Alert
            icon={<CheckIcon fontSize="inherit" />}
            severity="success"
            sx={{
              borderRadius: 2,
              backgroundColor: "#dbeafe",
              color: "#1e40af",
              fontWeight: 600,
              textAlign: "center",
              boxShadow: "0 4px 8px rgba(59, 130, 246, 0.2)",
            }}
          >
            {emailhook.message}
          </Alert>
        </motion.div>
      )}

      {/* Loading state */}
      {!emailhook.loaded ? (
        <motion.div
          className="flex flex-col items-center justify-center h-[60vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <AutoAwesomeIcon
            sx={{
              fontSize: 60,
              color: '#2563eb',
              animation: 'spin 2s linear infinite',
            }}
          />
          <Typography
            variant="body1"
            sx={{ mt: 3, color: '#4b5563', fontFamily: "'Inter', sans-serif" }}
          >
            Scanning galaxies for mail signals...
          </Typography>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </motion.div>
      ) : (
        <List sx={{ p: 0 }}>
          {filteredEmails.length > 0 ? (
            filteredEmails.map((email, index) => (
              <motion.div
                key={email._id}
                custom={index}
                variants={listAnimation}
                initial="hidden"
                animate="visible"
                whileHover={{
                  scale: 1.01,
                  boxShadow: "0px 6px 15px rgba(37, 99, 235, 0.15)",
                }}
                style={{
                  marginBottom: "12px",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <DisplayEmail
                  email={email}
                  selectedEmails={selectedEmails}
                  setSelectedEmails={setSelectedEmails}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              className="w-full h-[60vh] flex justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <NoMails />
            </motion.div>
          )}
        </List>
      )}
    </motion.div>
  );
};

export default Email;
