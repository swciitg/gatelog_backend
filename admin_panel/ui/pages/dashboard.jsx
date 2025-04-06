import React from "react";
import { Box, Button } from "@adminjs/design-system";
import AdminJS from "adminjs";


export const Dashboard = () => {
  const handleRedirect = () => {
    window.location.href =
      "admin/resources/KhokhaEntryModel";
  };

  return (
    <Box>
      <section
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "32px",
        }}
      >
        <p>
          <span
            style={{
              fontSize: "3rem",
              fontWeight: "700",
            }}
          >
            GateLog
          </span>
          <span
            style={{
              fontSize: "3rem",
              fontWeight: "normal",
              color: "#282828",
            }}
          >
            {" "}
            Admin
          </span>
        </p>
      </section>
      <section
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "32px",
        }}
      >
        <Box display="block" marginTop="10px">
          <Button variant="primary" onClick={handleRedirect}>
            Get Logs
          </Button>
        </Box>
      </section>
    </Box>
  );
};

export default Dashboard;
