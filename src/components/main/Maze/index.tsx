import React, { ReactChild } from "react";
import { Cell, OuterWrapper, GridWrapper, ControlPanel } from "./components";
import { makePair, random_range } from "src/util/helper";
import { Pair } from "src/util/types";
import {
  Button,
  Typography,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
  Paper
} from "@material-ui/core";
import {
  ArrowBack as ArrowBackIcon,
  Help as HelpIcon
} from "@material-ui/icons";
import { Link } from "react-router-dom";
import ConfirmDialog from "src/components/generic/dialog/ConfirmDialog";

const ROW_LEN = 20;
const COLUMN_LEN = 20;

const dr: number[] = [0, -1, 0, 1];
const dc: number[] = [-1, 0, 1, 0];

const INITIAL_CONN: boolean[][][][] = getInitialConn();
function getInitialConn() {
  const initialConn: boolean[][][][] = [];
  for (let a = 0; a < ROW_LEN; a++) {
    const ar: boolean[][][] = [];
    for (let b = 0; b < COLUMN_LEN; b++) {
      const br: boolean[][] = [];
      for (let c = 0; c < ROW_LEN; c++) {
        const cr: boolean[] = [];
        for (let d = 0; d < COLUMN_LEN; d++) {
          cr.push(true);
        }
        br.push(cr);
      }
      ar.push(br);
    }
    initialConn.push(ar);
  }
  return initialConn;
}

function getInitialSolutionTrace() {
  const initialConn: boolean[][] = [];
  for (let a = 0; a < ROW_LEN; a++) {
    const ar: boolean[] = [];
    for (let b = 0; b < COLUMN_LEN; b++) {
      ar.push(false);
    }
    initialConn.push(ar);
  }
  return initialConn;
}

function getInitialDist() {
  const dist: number[][] = [];
  for (let r = 0; r < ROW_LEN; r++) {
    const row: number[] = [];
    for (let c = 0; c < COLUMN_LEN; c++) {
      row.push(0);
    }
    dist.push(row);
  }
  return dist;
}

function getInitialTrace() {
  const initialTrace: Pair<number>[][] = [];
  for (let r = 0; r < ROW_LEN; r++) {
    const row: Pair<number>[] = [];
    for (let c = 0; c < COLUMN_LEN; c++) {
      row.push(makePair<number>(-1, -1));
    }
    initialTrace.push(row);
  }
  return initialTrace;
}

const generate = (
  a: Pair<number>,
  b: Pair<number>,
  dir: number,
  generateTrace: Pair<number>[][][]
) => {
  if (a.fi === b.fi || a.se === b.se) {
    return;
  }
  const trace: Pair<number>[][] = [];
  if (dir === 0) {
    // horizontal
    const rt = random_range(a.fi, b.fi - 1);
    const ct = random_range(a.se, b.se);
    for (let c = a.se; c <= b.se; c++) {
      if (c === ct) continue;
      trace.push([makePair(rt, c), makePair(rt + 1, c)]);
    }
    generateTrace.push(trace);
    generate(a, makePair(rt, b.se), dir ^ 1, generateTrace);
    generate(makePair(rt + 1, a.se), b, dir ^ 1, generateTrace);
  } else {
    // vertical
    const rt = random_range(a.fi, b.fi);
    const ct = random_range(a.se, b.se - 1);
    for (let r = a.fi; r <= b.fi; r++) {
      if (r === rt) continue;
      trace.push([makePair(r, ct), makePair(r, ct + 1)]);
    }
    generateTrace.push(trace);
    generate(a, makePair(b.fi, ct), dir ^ 1, generateTrace);
    generate(makePair(a.fi, ct + 1), b, dir ^ 1, generateTrace);
  }
};

function BFS(source: Pair<number>, dest: Pair<number>, conn: boolean[][][][]) {
  const q: Pair<number>[] = [];

  const trace = getInitialTrace();
  const dist = getInitialDist();

  q.push(source);
  dist[source.fi][source.se] = 1;

  let maxDist = Number.MIN_SAFE_INTEGER;

  while (q.length) {
    const cur = q.shift();

    for (let i = 0; i < 4; i++) {
      const nr = dr[i] + cur.fi;
      const nc = dc[i] + cur.se;
      if (
        0 <= nr &&
        nr < ROW_LEN &&
        0 <= nc &&
        nc < COLUMN_LEN &&
        conn[cur.fi][cur.se][nr][nc] &&
        conn[nr][nc][cur.fi][cur.se] &&
        !dist[nr][nc]
      ) {
        trace[nr][nc] = cur;
        dist[nr][nc] = dist[cur.fi][cur.se] + 1;
        maxDist = Math.max(maxDist, dist[nr][nc]);
        q.push(makePair<number>(nr, nc));

        if (nr === dest.fi && nc === dest.se) {
          return { dist, trace, maxDist };
        }
      }
    }
  }

  return { dist, trace, maxDist: -1 };
}

function AboutContent() {
  return (
    <div>
      <Typography variant="h6">What is Maze Simulator?</Typography>
      <Typography variant="subtitle1">
        Maze Simulator is a place where you can simulate Maze Generation (using
        Recursive Division) and Pathfinding (using BFS).
      </Typography>
    </div>
  );
}

export default () => {
  const [generating, setGenerating] = React.useState<boolean>(false);
  const [generated, setGenerated] = React.useState<boolean>(false);
  const [searching, setSearching] = React.useState<boolean>(false);
  const [traceDepth, setTraceDepth] = React.useState<number>(null);
  const [conn, setConn] = React.useState<boolean[][][][]>(INITIAL_CONN);
  const [dist, setDist] = React.useState<number[][]>(null);
  const [solutionTrace, setSolutionTrace] = React.useState<boolean[][]>(null);
  const [helpDialogOpen, setHelpDialogOpen] = React.useState<boolean>(false);
  const [draggingA, setDraggingA] = React.useState<boolean>(false);
  const [draggingB, setDraggingB] = React.useState<boolean>(false);
  const [moveable, setMoveable] = React.useState<boolean>(false);
  const [guideText, setGuideText] = React.useState<string>("");
  const [A, setA] = React.useState<Pair<number>>(makePair<number>(0, 0));
  const [B, setB] = React.useState<Pair<number>>(
    makePair<number>(ROW_LEN - 1, COLUMN_LEN - 1)
  );

  const handleGenerate = React.useCallback(async () => {
    setMoveable(false);
    setGenerating(true);
    setTraceDepth(null);
    setDist(null);
    setSolutionTrace(null);

    const generateTrace: Pair<number>[][][] = [];
    generate(
      makePair<number>(0, 0),
      makePair<number>(ROW_LEN - 1, COLUMN_LEN - 1),
      0,
      generateTrace
    );

    const _conn = getInitialConn();

    const generateTraceDelay = 150;

    for (let i = 0; i < generateTrace.length; i++) {
      setTimeout(() => {
        for (let trace of generateTrace[i]) {
          _conn[trace[0].fi][trace[0].se][trace[1].fi][trace[1].se] = false;
          _conn[trace[1].fi][trace[1].se][trace[0].fi][trace[0].se] = false;
        }
        setConn([..._conn]);
      }, i * generateTraceDelay + 500);
    }
    setTimeout(() => {
      setGenerated(true);
      setGenerating(false);
    }, generateTrace.length * generateTraceDelay + 500);
  }, []);

  const handleBFS = React.useCallback(() => {
    setSearching(true);
    const { dist, trace, maxDist } = BFS(A, B, conn);
    setDist(dist);
    const _solutionTrace = getInitialSolutionTrace();
    setSolutionTrace(_solutionTrace);
    const traceDepthDelay = 150;
    for (let i = 1; i <= maxDist + 1; i++) {
      setTimeout(() => {
        setTraceDepth(i);
      }, i * traceDepthDelay + 1000);
    }

    let cur = B;
    let i = 1;
    while (true) {
      if (cur.fi === -1 && cur.se === -1) {
        setTimeout(() => {
          setSearching(false);
          setMoveable(true);
        }, i * 150 + (maxDist + 2) * traceDepthDelay + 1000);
        break;
      }
      const _cur = cur;
      setTimeout(() => {
        _solutionTrace[_cur.fi][_cur.se] = true;
        setSolutionTrace([..._solutionTrace]);
      }, i * 150 + (maxDist + 2) * traceDepthDelay + 1000);
      cur = trace[cur.fi][cur.se];
      i += 1;
    }
  }, [conn, A, B]);

  const reBFS = React.useCallback(() => {
    const { dist, trace, maxDist } = BFS(A, B, conn);
    setDist(dist);
    const _solutionTrace = getInitialSolutionTrace();
    setTraceDepth(maxDist + 1);

    let cur = B;
    while (true) {
      if (cur.fi === -1 && cur.se === -1) {
        break;
      }
      const _cur = cur;
      _solutionTrace[_cur.fi][_cur.se] = true;
      cur = trace[cur.fi][cur.se];
    }
    setSolutionTrace([..._solutionTrace]);
  }, [conn, A, B]);

  const grid: ReactChild[] = React.useMemo<ReactChild[]>(() => {
    const grid: ReactChild[] = [];
    const lineStyle = "1.5px solid gold";
    for (let r = 0; r < ROW_LEN; r++) {
      const row: ReactChild[] = [];
      for (let c = 0; c < COLUMN_LEN; c++) {
        const style: React.CSSProperties = { width: `${100 / ROW_LEN}%` };

        // type
        if (A.fi === r && A.se === c) {
          style.background = "green";
          if (draggingA) {
            // style.border = "1.5px solid white";
          } else {
            // style.border = "";
          }
        } else if (B.fi === r && B.se === c) {
          style.background = "red";
          if (draggingB) {
            // style.border = "1.5px solid white";
          } else {
            // style.border = "";
          }
        } else if (dist && traceDepth && dist[r][c] !== 0 && solutionTrace) {
          const borderNames = [
            "borderLeft",
            "borderTop",
            "borderRight",
            "borderBottom"
          ];
          if (solutionTrace[r][c]) {
            style.background = "lightblue";
            for (let i = 0; i < 4; i++) {
              // @ts-ignore
              style[borderNames[i]] = "1.5px solid lightblue";
            }
          } else if (dist[r][c] === traceDepth) {
            style.background = "lightgray";
          } else if (dist[r][c] < traceDepth) {
            style.background = "gray";
            for (let i = 0; i < 4; i++) {
              // @ts-ignore
              style[borderNames[i]] = "1.5px solid gray";
            }
          }
        }

        // fences
        if (r > 0 && !conn[r][c][r - 1][c]) style.borderTop = lineStyle;
        if (r < ROW_LEN - 1 && !conn[r][c][r + 1][c])
          style.borderBottom = lineStyle;
        if (c > 0 && !conn[r][c][r][c - 1]) style.borderLeft = lineStyle;
        if (c < COLUMN_LEN - 1 && !conn[r][c][r][c + 1])
          style.borderRight = lineStyle;

        row.push(
          <Cell
            key={c}
            style={style}
            onMouseDown={e => {
              if (searching || generating) return;
              if (A.fi === r && A.se === c) {
                setDraggingA(true);
              } else if (B.fi === r && B.se === c) {
                setDraggingB(true);
              }
            }}
            onMouseUp={e => {
              if (searching || generating) return;
              if (A.fi === r && A.se === c) {
                setDraggingA(false);
              } else if (B.fi === r && B.se === c) {
                setDraggingB(false);
              }
            }}
            onMouseEnter={e => {
              if (draggingA) {
                setA(makePair<number>(r, c));
              } else if (draggingB) {
                setB(makePair<number>(r, c));
              }
            }}
          />
        );
      }
      grid.push(
        <div key={r} style={{ display: "flex" }}>
          {row}
        </div>
      );
    }
    return grid;
  }, [
    conn,
    traceDepth,
    dist,
    solutionTrace,
    A,
    B,
    draggingA,
    draggingB,
    generating,
    searching
  ]);

  // guideText
  React.useEffect(() => {
    const guideTexts = [
      "Have fun with the Maze!",
      "You can move the Start Node and End Node by holding LMOUSE (only on Computer)",
      "If you experience lag, please set your battery performance to Medium/High (on Laptop)"
    ];
    let index = 0;
    const interval = setInterval(() => {
      setGuideText(guideTexts[index]);
      index = (index + 1) % guideTexts.length;
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  // reBFS
  React.useEffect(() => {
    if (moveable) reBFS();
  }, [A, B, moveable, reBFS]);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <IconButton edge="start" color="inherit">
              <ArrowBackIcon />
            </IconButton>
          </Link>
          <Typography
            variant="h6"
            style={{ flexGrow: 1, marginLeft: "0.8rem" }}
          >
            Maze Simulator
          </Typography>
        </Toolbar>
      </AppBar>
      <br />
      <br />
      <OuterWrapper>
        <GridWrapper>
          <Paper elevation={2} style={{ padding: "0.8rem 1.5rem" }}>
            <Button
              onClick={handleGenerate}
              color="primary"
              variant="contained"
              disabled={generating || searching}
            >
              {generating ? <CircularProgress size={24} /> : "Generate"}
            </Button>
            <Button
              onClick={handleBFS}
              style={{ marginLeft: "1rem" }}
              color="primary"
              variant="contained"
              disabled={generating || searching || !generated}
            >
              {searching ? <CircularProgress size={24} /> : "Find a path"}
            </Button>
            <IconButton
              onClick={() => setHelpDialogOpen(true)}
              style={{ marginLeft: "1rem" }}
            >
              <HelpIcon />
            </IconButton>
          </Paper>
          <div>{grid}</div>
        </GridWrapper>
      </OuterWrapper>
      <ControlPanel>
        {generating ? (
          <Typography variant="h6" align="center">
            Generating Maze...
          </Typography>
        ) : searching ? (
          <Typography variant="h6" align="center">
            Finding best path...
          </Typography>
        ) : (
          <>
            {!generated ? (
              <Typography variant="h6" align="center">
                Firstly, generate the maze
              </Typography>
            ) : (
              <Typography variant="h6" align="center">
                {guideText || "Have fun with the Maze!"}
              </Typography>
            )}
          </>
        )}
      </ControlPanel>
      <ConfirmDialog
        title="About"
        message={<AboutContent />}
        visible={helpDialogOpen}
        dismiss={() => setHelpDialogOpen(false)}
      />
    </>
  );
};
