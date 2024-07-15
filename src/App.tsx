import { useEffect, useRef, useState, createContext, useContext } from "react";
import "./App.css";
import Mexp from "math-expression-evaluator";

type CellIdxSet = [[number, number], [number, number]];
type SetFocusedCell = React.Dispatch<React.SetStateAction<CellIdxSet>>;

const emptyCellIdx: CellIdx = [-1, -1];

const emptyFocusedCell: CellIdxSet = [emptyCellIdx, emptyCellIdx];

const setFocusedCell: SetFocusedCell = (_) => {};
const FocusedCellContext = createContext<CellIdxSet>(emptyFocusedCell);
const SetFocusedCellContext = createContext(setFocusedCell);

const updateGridValue = (
  grid: Array<Array<string | number>>,
  rowIdx: number,
  cellIdx: number,
  value: string | number,
): Array<Array<string | number>> =>
  grid[rowIdx] ? grid.with(rowIdx, grid[rowIdx]?.with(cellIdx, value)) : grid;

type Value = string | number;
type CellIdx = [number, number];
type Grid = Array<Array<Value>>;

interface CellProps {
  cell: Value;
  setActiveCell: React.Dispatch<React.SetStateAction<CellIdx>>;
  rowIdx: number;
  cellIdx: number;
  setGrid: React.Dispatch<React.SetStateAction<Grid>>;
  isActive: boolean;
  mainFocusedCell: string;
  setMainFocusedCell: React.Dispatch<React.SetStateAction<string>>;
}

const Cell = ({
  cell,
  setActiveCell,
  rowIdx,
  cellIdx,
  setGrid,
  isActive,
  mainFocusedCell,
  setMainFocusedCell,
}: CellProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const value = cell;
  const mexp = new Mexp();

  const focusedCell = useContext(FocusedCellContext);
  const setFocusedCell = useContext(SetFocusedCellContext);

  let calc;
  try {
    calc = mexp.eval(value as string);
  } catch (e) {
    calc = "Error";
  }

  const top = Math.min(focusedCell[0][0], focusedCell[1][0]);
  const bottom = Math.max(focusedCell[0][0], focusedCell[1][0]);

  const left = Math.min(focusedCell[0][1], focusedCell[1][1]);
  const right = Math.max(focusedCell[0][1], focusedCell[1][1]);

  const isFocused =
    rowIdx >= top && rowIdx <= bottom && cellIdx >= left && cellIdx <= right;

  const cellId = `${rowIdx},${cellIdx}`;
  const isMainFocused = mainFocusedCell === cellId;

  useEffect(() => {
    if (isMainFocused) {
      ref.current?.focus();
    }
  }, [isMainFocused]);

  return (
    <div
      ref={ref}
      className="cell"
      style={{
        backgroundColor: isActive ? "lightblue" : isFocused ? "lightgray" : "",
      }}
      onClick={() => {
        if (isFocused) {
          setActiveCell([rowIdx, cellIdx]);
        } else {
          setFocusedCell([
            [rowIdx, cellIdx],
            [rowIdx, cellIdx],
          ]);
        }
      }}
      tabIndex={isActive ? -1 : 0}
      onKeyDown={(e) => {
        if (e.shiftKey) {
          if (e.key === "ArrowUp") {
            setActiveCell(emptyCellIdx);

            const cellId = `${rowIdx - 1},${cellIdx}`;
            setMainFocusedCell(cellId);
            return setFocusedCell(([a, [x, y]]) => [a, [x - 1, y]]);
          }

          if (e.key === "ArrowDown") {
            setActiveCell(emptyCellIdx);

            const cellId = `${rowIdx + 1},${cellIdx}`;
            setMainFocusedCell(cellId);
            return setFocusedCell(([a, [x, y]]) => [a, [x + 1, y]]);
          }

          if (e.key === "ArrowLeft") {
            setActiveCell(emptyCellIdx);

            const cellId = `${rowIdx},${cellIdx - 1}`;
            setMainFocusedCell(cellId);
            return setFocusedCell(([a, [x, y]]) => [a, [x, y - 1]]);
          }

          if (e.key === "ArrowRight") {
            setActiveCell(emptyCellIdx);

            const cellId = `${rowIdx},${cellIdx + 1}`;
            setMainFocusedCell(cellId);
            return setFocusedCell(([a, [x, y]]) => [a, [x, y + 1]]);
          }
        }

        if (e.key === "Enter") {
          if (!isActive) {
            setFocusedCell([
              [rowIdx, cellIdx],
              [rowIdx, cellIdx],
            ]);
            return setActiveCell([rowIdx, cellIdx]);
          } else {
            const cellId = `${rowIdx},${cellIdx}`;

            setMainFocusedCell(cellId);
            setFocusedCell([
              [rowIdx, cellIdx],
              [rowIdx, cellIdx],
            ]);
            return setActiveCell(emptyCellIdx);
          }
        }

        if (e.key === "ArrowUp") {
          setActiveCell(emptyCellIdx);

          const cellId = `${rowIdx - 1},${cellIdx}`;
          setMainFocusedCell(cellId);
          return setFocusedCell([
            [rowIdx - 1, cellIdx],
            [rowIdx - 1, cellIdx],
          ]);
        }

        if (e.key === "ArrowDown") {
          setActiveCell(emptyCellIdx);

          const cellId = `${rowIdx + 1},${cellIdx}`;
          setMainFocusedCell(cellId);

          return setFocusedCell([
            [rowIdx + 1, cellIdx],
            [rowIdx + 1, cellIdx],
          ]);
        }

        if (e.key === "ArrowLeft") {
          setActiveCell(emptyCellIdx);

          const cellId = `${rowIdx},${cellIdx - 1}`;
          setMainFocusedCell(cellId);

          return setFocusedCell([
            [rowIdx, cellIdx - 1],
            [rowIdx, cellIdx - 1],
          ]);
        }

        if (e.key === "ArrowRight") {
          setActiveCell(emptyCellIdx);

          const cellId = `${rowIdx},${cellIdx + 1}`;
          setMainFocusedCell(cellId);

          return setFocusedCell([
            [rowIdx, cellIdx + 1],
            [rowIdx, cellIdx + 1],
          ]);
        }
      }}
    >
      {isActive ? (
        <input
          autoFocus
          type="text"
          value={value}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setActiveCell(emptyCellIdx);
              setTimeout(() => {
                ref.current?.focus();
              });
            }
          }}
          onChange={(e) => {
            setGrid((grid) =>
              updateGridValue(grid, rowIdx, cellIdx, e.target.value),
            );
          }}
        />
      ) : (
        <span>{value}</span>
      )}
    </div>
  );
};

const Grid = ({
  setActiveCell,
  grid,
  setGrid,
  activeCell,
  mainFocusedCell,
  setMainFocusedCell,
}: {
  grid: Grid;
  setActiveCell: React.Dispatch<React.SetStateAction<CellIdx>>;
  activeCell: CellIdx;
  setGrid: React.Dispatch<React.SetStateAction<Grid>>;
  mainFocusedCell: string;
  setMainFocusedCell: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const focusedCell = useContext(FocusedCellContext);

  const top = Math.min(focusedCell[0][0], focusedCell[1][0]);
  const bottom = Math.max(focusedCell[0][0], focusedCell[1][0]);

  const left = Math.min(focusedCell[0][1], focusedCell[1][1]);
  const right = Math.max(focusedCell[0][1], focusedCell[1][1]);

  return (
    <div
      className="grid"
      onKeyDown={(e) => {
        const selectedCells = grid
          .slice(top, bottom + 1)
          .map((row) => row.slice(left, right + 1).join(" "))
          .join("\n");

        if (e.metaKey && e.key === "c") {
          navigator.clipboard.writeText(selectedCells);
        }
      }}
    >
      {grid.map((row, rowIdx) => (
        <div className="row" key={rowIdx}>
          {row.map((cell, cellIdx) => (
            <Cell
              key={cellIdx + rowIdx}
              cell={cell}
              setActiveCell={setActiveCell}
              rowIdx={rowIdx}
              cellIdx={cellIdx}
              setGrid={setGrid}
              isActive={activeCell[0] === rowIdx && activeCell[1] === cellIdx}
              mainFocusedCell={mainFocusedCell}
              setMainFocusedCell={setMainFocusedCell}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [activeCell, setActiveCell] = useState<CellIdx>(emptyCellIdx);
  const [focusedCell, setFocusedCell] = useState<CellIdxSet>([
    emptyCellIdx,
    emptyCellIdx,
  ]);
  const [mainFocusedCell, setMainFocusedCell] = useState<string>(``);

  const [grid, setGrid] = useState<Array<Array<number | string>>>(
    new Array(15).fill(0).map(() => new Array(15).fill(0)),
  );

  // console.log(activeCell);

  // console.log(grid);

  console.log(activeCell[0]);
  console.log(activeCell[1]);

  const activeCellValue =
    activeCell === emptyCellIdx ? "" : grid[activeCell[0]][activeCell[1]];

  return (
    <div className="App">
      <label>
        <p>Formula: </p>
        <input type="text" name="formula" value={activeCellValue} disabled />
      </label>
      <SetFocusedCellContext.Provider value={setFocusedCell}>
        <FocusedCellContext.Provider value={focusedCell}>
          <Grid
            setActiveCell={setActiveCell}
            grid={grid}
            setGrid={setGrid}
            activeCell={activeCell}
            mainFocusedCell={mainFocusedCell}
            setMainFocusedCell={setMainFocusedCell}
          />
        </FocusedCellContext.Provider>
      </SetFocusedCellContext.Provider>
    </div>
  );
};

export default App;
