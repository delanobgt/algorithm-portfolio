import React from "react";
import MazePng from "./maze.png";
import ConvexPng from "./convex.png";
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
