import React, { useState, useEffect } from 'react';
import { Typography, Box, styled, Tooltip, Avatar } from "@mui/material";
import AttachmentIcon from '@mui/icons-material/Attachment';
import { useNavigate } from 'react-router-dom';
import { routes } from '../routes/route';
import { getRandomColor } from '../content/getColor';
import { motion, AnimatePresence } from 'framer-motion';

// Minimalist Professional theme colors
const bgWhite = '#ffffff';
const bgHover = '#f3f4f6'; // light gray hover background (#f9fafb is very light)
const borderColor = '#e5e7eb'; // light border (#e0e0e0 is close)
const accentBlue = '#2563eb'; // bright blue for highlights
const textPrimary = '#111827'; // dark gray/black for main text
const textSecondary = '#4b5563'; // medium gray for secondary text

const Wrapper = styled(Box)`
  position: relative;
  padding: 16px 20px;
  background: ${bgWhite};
  display: flex;
  align-items: center;
  cursor: pointer;
  border-bottom: 1px solid ${borderColor};
  width: 100%;
  box-sizing: border-box;
  transition: background 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background: ${bgHover};
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
  }
`;

const Indicator = styled(motion.div)`
  font-size: 14px;
  color: ${bgWhite};
  border-radius: 9999px;
  padding: 7px 18px;
  font-weight: 700;
  background: ${(props) => props.color || accentBlue};
  box-shadow: 0 3px 10px rgba(37, 99, 235, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.6px;
  white-space: nowrap;
  user-select: none;
`;

const LeftSection = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-basis: 22%;
  min-width: 200px;
  max-width: 250px;
  overflow: hidden;
`;

const MiddleSection = styled(Box)`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-basis: 60%;
  flex-grow: 1;
  overflow: hidden;
`;

const RightSection = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  flex-basis: 18%;
  min-width: 180px;
`;

const SenderInfo = styled(Box)`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const SenderName = styled(Typography)`
  font-weight: 600;
  font-size: 15px;
  color: ${textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: 'Inter', sans-serif;
`;

const SubjectText = styled(Typography)`
  color: ${textSecondary};
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1;
  font-family: 'Inter', sans-serif;
`;

const AttachmentWrapper = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #dbeafe;  // light blue #dbeafe (blue-100)
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 14px;
  color: ${accentBlue};
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: 'Inter', sans-serif;
`;

const SummaryTooltip = styled(motion.div)`
  position: absolute;
  top: -65px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${bgWhite};
  color: ${accentBlue};
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.15);
  z-index: 999;
  max-width: 80%;
  text-align: center;
  font-family: 'Inter', monospace;
`;

const DisplayEmail = ({ email }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [hoverDelay, setHoverDelay] = useState(null);
  const [localTime, setLocalTime] = useState('');

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  useEffect(() => {
    if (email.received_date) {
      const dateObj = new Date(email.received_date);
      const timeString = dateObj.toLocaleString(undefined, { timeZone: userTimeZone });
      setLocalTime(timeString);
    }
  }, [email.received_date, userTimeZone]);

  const senderName = email.sender.includes('<')
    ? email.sender.split('<')[0].trim()
    : email.sender;

  const handleMouseEnter = () => {
    setHoverDelay(setTimeout(() => setHovered(true), 800));
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverDelay);
    setHovered(false);
  };
  let hr;
  if(localTime){
    if(parseInt(localTime.split(",")[1].split(":")[0])==0)hr=12;
    else if(parseInt(localTime.split(",")[1].split(":")[0])>12)hr=parseInt(localTime.split(",")[1].split(":")[0])%12;
    else hr=parseInt(localTime.split(",")[1].split(":")[0])
  }

  return (
    <Wrapper
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => {
        if (e.target.type !== 'checkbox' && e.target.tagName !== 'svg') {
          navigate(routes.view.path, { state: { email } });
        }
      }}
      role="button"
      tabIndex={0}
    >
      <Box sx={{ flexBasis: '10%', minWidth: 90, color: textSecondary, fontSize: 13, userSelect: 'none', fontFamily: 'Inter, sans-serif', marginRight: 1 }}>
        {(localTime ?hr.toString()+":"+localTime.split(",")[1].split(":")[1].split(":")[0]+
        (parseInt(localTime.split(",")[1].split(":")[0])<12?"am":"pm") : '') }
      </Box>

      <LeftSection>
        <Avatar
          sx={{
            width: 36,
            height: 36,
            fontSize: 14,
            bgcolor: getRandomColor(senderName),
            fontFamily: 'Inter, sans-serif',
            userSelect: 'none',
          }}
        >
          {senderName[0]}
        </Avatar>
        <Tooltip title={senderName}>
          <SenderInfo>
            <SenderName>{senderName}</SenderName>
          </SenderInfo>
        </Tooltip>
      </LeftSection>

      <MiddleSection>
        <Indicator
          color={getRandomColor(email.category)}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          {email.category}
        </Indicator>

        <SubjectText
          dangerouslySetInnerHTML={{ __html: `<strong>${email.subject}</strong>` }}
        />
      </MiddleSection>

      {email.attachname && (
        <RightSection>
          <Tooltip title={email.attachname}>
            <AttachmentWrapper>
              <AttachmentIcon sx={{ fontSize: 22, color: accentBlue }} />
              <Typography variant="caption">{email.attachname}</Typography>
            </AttachmentWrapper>
          </Tooltip>
        </RightSection>
      )}

      <AnimatePresence>
        {hovered && email.emailsummary && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              backgroundColor: '#ffffff', // deep space blue
              padding: '10px 14px',
              borderRadius: '10px',
              marginTop: '8px',
              fontSize: '16px',
              marginRight:'13px',
              color: '#000000', // neon cyan
              boxShadow: '0 0 20px rgba(127, 219, 255, 0.3)', // glowing sci-fi aura
              fontFamily: 'Share Tech Mono', // sci-fi terminal vibe
            }}
          >
            {email.emailsummary}
          </motion.div>
        )}
      </AnimatePresence>
    </Wrapper>
  );
};

export default DisplayEmail;
