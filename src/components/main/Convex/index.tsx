import "./style.css";
import React from "react";
import P5Wrapper from "react-p5-wrapper";

import { Link } from "react-router-dom";

import sketch from "./sketch";
import { IconButton, Typography } from "@material-ui/core";
import { ArrowBack as ArrowBackIcon } from "@material-ui/icons";

function AboutContent() {
  const [open, setOpen] = React.useState<boolean>(true);

  return (
    open && (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          display: "flex",
          alignItems: "center"
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.8)",
            width: "100%",
            padding: "1rem"
          }}
          onClick={() => setOpen(false)}
        >
          <Typography variant="h5" align="center">
            Convex Hull Fun
          </Typography>
          <Typography variant="subtitle1" align="center">
            An implementation of Andrew's Convex Hull algorithm.
          </Typography>
          <Typography variant="subtitle1" align="center">
            Click/Tap to spawn a new ball at the center.
          </Typography>
          <br />
          <Typography variant="body2" align="center">
            (Click/Tap to dismiss this message)
          </Typography>
        </div>
      </div>
    )
  );
}

export default () => {
  return (
    <>
      <AboutContent />
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          width: "100vw",
          height: "100vh",
          zIndex: -5
        }}
      >
        <Link
          to="/"
          style={{ position: "fixed", top: "1em", left: "1em", zIndex: 1000 }}
        >
          <IconButton style={{ color: "black", background: "white" }}>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        <P5Wrapper sketch={sketch} />
      </div>
    </>
  );
};
