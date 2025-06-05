import React from "react";
import { Drawer } from "@mui/material";
import SideBarContent from "./SideBarContent";

const SideBar = ({ openDrawer, setSelectedCategory }) => {
  return (
    <Drawer
      anchor="left"
      open={openDrawer}
      hideBackdrop={true}
      ModalProps={{ keepMounted: true }}
      variant="persistent"
      sx={{
        "& .MuiDrawer-paper": {
          width: openDrawer ? 280 : 90,
          transition: "width 0.3s ease-in-out",
          borderRight: "1px solid rgba(79, 70, 229, 0.2)", // subtle purple border
          marginTop: "64px",
          height: "calc(100vh - 64px)",
          overflowX: "hidden",
          background: "linear-gradient(135deg, #fefefe 0%, #e0e7ff 100%)",
          boxShadow: `
            0 10px 30px rgba(79, 70, 229, 0.1),
            0 4px 12px rgba(16, 185, 129, 0.08)
          `,
          color: "#111827", // dark text for light background
          display: "flex",
          flexDirection: "column",
          paddingTop: "16px",
        },
      }}
    >
      <SideBarContent openDrawer={openDrawer} setSelectedCategory={setSelectedCategory} />
    </Drawer>
  );
};

export default SideBar;
