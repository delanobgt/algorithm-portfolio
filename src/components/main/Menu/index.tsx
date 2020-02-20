import React from "react";
import MazePng from "./maze.png";
import ConvexPng from "./convex.png";
import LogoEmail from "../../images/logo_email.png";
import LogoGithub from "../../images/logo_github.png";
import LogoLinkedin from "../../images/logo_linkedin.png";
import LogoPhone from "../../images/logo_phone.png";
import {
  Typography,
  CardMedia,
  Card,
  CardContent,
  CardActions,
  Button,
  Container,
  Grid
} from "@material-ui/core";
import { Link } from "react-router-dom";
import styled from "styled-components";

const LinkDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default () => {
  return (
    <div>
      <br />
      <Typography variant="h4" align="center">
        Algorithm Portfolio
      </Typography>
      <Typography variant="subtitle1" align="center">
        - Irvin Delano -
      </Typography>
      <br />
      <div>
        <LinkDiv>
          <img alt="" src={LogoPhone} style={{ height: "1rem" }} />
          <Typography
            variant="subtitle1"
            style={{ display: "inline-block", marginLeft: "0.5rem" }}
          >
            +6287891864290
          </Typography>
        </LinkDiv>
        <LinkDiv>
          <img alt="" src={LogoGithub} style={{ height: "1rem" }} />
          <Typography
            variant="subtitle1"
            style={{ display: "inline-block", marginLeft: "0.5rem" }}
          >
            <a
              href="https://www.github.com/delanobgt"
              rel="noopener noreferrer"
            >
              github.com/delanobgt
            </a>
          </Typography>
        </LinkDiv>
        <LinkDiv>
          <img alt="" src={LogoEmail} style={{ height: "1rem" }} />
          <Typography
            variant="subtitle1"
            style={{ display: "inline-block", marginLeft: "0.5rem" }}
          >
            <a href="mailto:irvindelano@gmail.com" rel="noopener noreferrer">
              irvindelano@gmail.com
            </a>
          </Typography>
        </LinkDiv>
        <LinkDiv>
          <img alt="" src={LogoLinkedin} style={{ height: "1rem" }} />
          <Typography
            variant="subtitle1"
            style={{ display: "inline-block", marginLeft: "0.5rem" }}
          >
            <a
              href="https://www.linkedin.com/in/irvin-delano-9a9489157"
              rel="noopener noreferrer"
            >
              linkedin.com/in/irvin-delano
            </a>
          </Typography>
        </LinkDiv>
      </div>
      <br />

      <Container fixed>
        <Grid container spacing={3}>
          <Grid item md={3} sm={6} xs={12}>
            <Card>
              <CardMedia
                style={{ height: 0, paddingTop: "56.25%" }}
                image={MazePng}
                title="Maze Simulator"
              />
              <CardContent>
                <Typography variant="h6">Maze Simulator</Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Maze Simulator is a place where you can simulate Maze
                  Generation (using Recursive Division) and Pathfinding (using
                  BFS).
                </Typography>
              </CardContent>
              <CardActions
                style={{ paddingLeft: "1rem", paddingBottom: "1rem" }}
              >
                <Link to="/maze" style={{ textDecoration: "none" }}>
                  <Button variant="contained" color="primary">
                    Show Me
                  </Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>
          <Grid item md={3} sm={6} xs={12}>
            <Card>
              <CardMedia
                style={{ height: 0, paddingTop: "56.25%" }}
                image={ConvexPng}
                title="Convex Hull Fun"
              />
              <CardContent>
                <Typography variant="h6">Convex Hull Fun</Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  An implementation of Andrew's Convex Hull algorithm.
                  <br />
                  <br />
                  <br />
                </Typography>
              </CardContent>
              <CardActions
                style={{ paddingLeft: "1rem", paddingBottom: "1rem" }}
              >
                <Link to="/convex" style={{ textDecoration: "none" }}>
                  <Button variant="contained" color="primary">
                    Show Me
                  </Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};
