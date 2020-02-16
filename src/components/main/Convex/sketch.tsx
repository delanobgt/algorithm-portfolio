import { Point, makeHull } from "./tool";
import { random_range_float, random_range } from "src/util/helper";

export default function sketch(p: any) {
  let points: Point[] = [];

  function init() {
    points = [];
    for (let i = 0; i < 20; i++) {
      const dx = random_range_float(-3, 3);
      const dy = random_range_float(-3, 3);
      const d = random_range(10, 20);
      const point: Point = {
        x: p.windowWidth / 2,
        y: p.windowHeight / 2,
        dx,
        dy,
        d
      };
      points.push(point);
    }
  }

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.smooth();
    init();
  };

  p.myCustomRedrawAccordingToNewPropsHandler = function(props: any) {};

  p.draw = function() {
    p.clear();
    p.background(0, 0, 0);

    p.push();
    p.noStroke();
    p.fill(255);
    for (let point of points) {
      if (point.x + point.dx <= 0 || point.x + point.dx >= p.windowWidth) {
        point.dx = -point.dx;
      }
      if (point.y + point.dy <= 0 || point.y + point.dy >= p.windowHeight) {
        point.dy = -point.dy;
      }
      point.x += point.dx;
      point.y += point.dy;
      p.ellipse(point.x, point.y, point.d, point.d);
    }
    p.pop();

    p.push();
    p.stroke("cornflowerblue");
    p.strokeWeight(3);
    const hullPoints = makeHull(points);
    for (let i = 1; i < hullPoints.length; i++) {
      p.line(
        hullPoints[i - 1].x,
        hullPoints[i - 1].y,
        hullPoints[i].x,
        hullPoints[i].y
      );
    }
    p.line(
      hullPoints[0].x,
      hullPoints[0].y,
      hullPoints[hullPoints.length - 1].x,
      hullPoints[hullPoints.length - 1].y
    );
    p.pop();

    p.push();
    p.noStroke();
    for (let point of hullPoints) {
      p.fill("white");
      p.ellipse(point.x, point.y, point.d + 5, point.d + 5);
      p.fill("cornflowerblue");
      p.ellipse(point.x, point.y, point.d, point.d);
    }
    p.pop();
  };

  p.mouseClicked = function() {
    const dx = random_range_float(-3, 3);
    const dy = random_range_float(-3, 3);
    const d = random_range(10, 20);
    const point: Point = {
      x: p.windowWidth / 2,
      y: p.windowHeight / 2,
      dx,
      dy,
      d
    };
    points.push(point);
  };

  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    init();
  };
}
