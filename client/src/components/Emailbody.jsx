import React from 'react';
import { styled } from '@mui/material';
import { motion } from 'framer-motion';

// Styled body for "Vibrant Dashboard UI" theme
const StyledBody = styled(motion.div)({
    fontSize: '16px',
    color: '#1e293b',
    lineHeight: '1.7',
    padding: '28px 30px',
    borderRadius: '18px',
    background: '#ffffff',
    boxShadow: '0 10px 24px rgba(79, 70, 229, 0.1)',
    fontFamily: "'DM Sans', 'Work Sans', sans-serif",
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    overflowWrap: 'anywhere',
    maxHeight: 'calc(100vh - 180px)',
    overflowY: 'auto',
    border: '1px solid #e5e7eb',
    position: 'relative',
    transition: 'all 0.3s ease',

    'h1, h2, h3, h4, h5, h6': {
        color: '#111827',
        marginTop: '1.2em',
        marginBottom: '0.6em',
    },
    h1: { fontSize: '1.8em', fontWeight: 700 },
    h2: { fontSize: '1.6em', fontWeight: 600 },
    h3: { fontSize: '1.4em', fontWeight: 600 },

    // Paragraphs
    p: {
        margin: '0 0 1em 0',
    },

    // Lists
    ul: {
        paddingLeft: '1.5em',
        marginBottom: '1em',
    },
    ol: {
        paddingLeft: '1.5em',
        marginBottom: '1em',
    },
    'ul li, ol li': {
        marginBottom: '0.5em',
    },

    // Images
    img: {
        maxWidth: '100%',
        borderRadius: '12px',
        margin: '1em 0',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    },

    // Bold and italic text
    b: { fontWeight: 700 },
    strong: { fontWeight: 700 },
    i: { fontStyle: 'italic' },
    em: { fontStyle: 'italic' },
    
    // Scrollbar styling
    '&::-webkit-scrollbar': {
        width: '6px',
    },
    '&::-webkit-scrollbar-thumb': {
        background: '#c7d2fe',
        borderRadius: '3px',
    },

    // Link styles
    a: {
        color: '#4f46e5',
        fontWeight: 600,
        textDecoration: 'none',
        borderBottom: '2px solid transparent',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
            color: '#4338ca',
            borderBottom: '2px solid #4f46e5',
        },
    },

    // Code block
    code: {
        background: '#f3f4f6',
        color: '#4b5563',
        padding: '4px 8px',
        borderRadius: '6px',
        fontSize: '14px',
        fontFamily: 'monospace',
    },

    // Blockquote
    blockquote: {
        borderLeft: '4px solid #10b981',
        background: '#f0fdf4',
        padding: '12px 20px',
        fontStyle: 'italic',
        borderRadius: '8px',
        color: '#065f46',
        margin: '1.5em 0',
    },

    // Subtle animated border glow on hover
    '&:hover': {
        boxShadow: '0 12px 30px rgba(79, 70, 229, 0.15)',
    },
});

// Auto-link converter
const formatEmailBody = (text) => {
    if (!text) return "📬 No message content available.";

    // Convert URLs to clickable links
    const urlRegex = /((https?:\/\/[^\s<]+))/g;
    let formatted = text.replace(urlRegex, (url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });

    // Preserve line breaks
    formatted = formatted.replace(/\n/g, '<br />');

    return formatted;
};


// Component
const EmailBody = ({ email }) => {
    return (
        <StyledBody
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            dangerouslySetInnerHTML={{ __html: formatEmailBody(email?.body) }}
        />
    );
};

export default EmailBody;
