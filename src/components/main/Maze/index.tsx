import React, { ReactChild } from "react";
import { Cell, OuterWrapper, GridWrapper, ControlPanel } from "./components";
import { makePair, random_range } from "src/util/helper";
import { Pair } from "src/util/types";
import { Button, Typography, CircularProgress } from "@material-ui/core";

const ROW_LEN = 20;
const COLUMN_LEN = 20;

const A = makePair<number>(0, 0);
const B = makePair<number>(ROW_LEN - 1, COLUMN_LEN - 1);

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

        if (nr === B.fi && nc === B.se) {
          return { dist, trace, maxDist };
        }
      }
    }
  }

  return { dist, trace, maxDist: -1 };
}

export default () => {
  const [generating, setGenerating] = React.useState<boolean>(false);
  const [generated, setGenerated] = React.useState<boolean>(false);
  const [searching, setSearching] = React.useState<boolean>(false);
  const [traceDepth, setTraceDepth] = React.useState<number>(null);
  const [conn, setConn] = React.useState<boolean[][][][]>(INITIAL_CONN);
  const [dist, setDist] = React.useState<number[][]>(null);
  const [solutionTrace, setSolutionTrace] = React.useState<boolean[][]>(null);

  const handleGenerate = React.useCallback(async () => {
    setGenerating(true);
    setTraceDepth(null);
    setDist(null);
    setSolutionTrace(null);

    const generateTrace: Pair<number>[][][] = [];
    generate(A, B, 0, generateTrace);

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

    let cur = makePair<number>(ROW_LEN - 1, COLUMN_LEN - 1);
    let i = 1;
    while (true) {
      if (cur.fi === -1 && cur.se === -1) {
        setTimeout(() => {
          setSearching(false);
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
  }, [conn]);

  const grid: ReactChild[] = React.useMemo<ReactChild[]>(() => {
    const grid: ReactChild[] = [];
    const lineStyle = "2px solid gold";
    for (let r = 0; r < ROW_LEN; r++) {
      const row: ReactChild[] = [];
      for (let c = 0; c < COLUMN_LEN; c++) {
        const style: React.CSSProperties = { width: `${100 / ROW_LEN}%` };

        // fences
        if (r > 0 && !conn[r][c][r - 1][c]) style.borderTop = lineStyle;
        if (r < ROW_LEN - 1 && !conn[r][c][r + 1][c])
          style.borderBottom = lineStyle;
        if (c > 0 && !conn[r][c][r][c - 1]) style.borderLeft = lineStyle;
        if (c < COLUMN_LEN - 1 && !conn[r][c][r][c + 1])
          style.borderRight = lineStyle;

        // type
        if (dist && traceDepth && dist[r][c] !== 0 && solutionTrace) {
          if (solutionTrace[r][c]) {
            style.background = "cornflowerblue";
          } else if (dist[r][c] === traceDepth) {
            style.background = "darkgray";
          } else if (dist[r][c] < traceDepth) {
            style.background = "gray";
          }
        }
        row.push(<Cell style={style} />);
      }
      grid.push(<div style={{ display: "flex" }}>{row}</div>);
    }
    return grid;
  }, [conn, traceDepth, dist, solutionTrace]);

  return (
    <>
      <OuterWrapper>
        <GridWrapper>
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
              <Typography variant="h6">
                Firstly, generate the maze first
              </Typography>
            ) : (
              <Typography variant="h6">Play around with the Maze</Typography>
            )}
            <br />
            <div>
              <Button
                onClick={handleGenerate}
                variant="contained"
                color="primary"
                disabled={generating || searching}
              >
                {generating ? <CircularProgress size={24} /> : "Generate"}
              </Button>
              <Button
                onClick={handleBFS}
                style={{ marginLeft: "1rem" }}
                variant="contained"
                color="primary"
                disabled={generating || searching || !generated}
              >
                {searching ? <CircularProgress size={24} /> : "Find a path"}
              </Button>
            </div>
          </>
        )}
      </ControlPanel>
    </>
  );
};
