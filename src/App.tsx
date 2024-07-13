import { useEffect, useRef, useState } from "react";
import "./App.css";
import Mexp from "math-expression-evaluator";

type FocusedCell = string;
type CellIdxSet = Set<FocusedCell>;
type SetFocusedCell = React.Dispatch<React.SetStateAction<CellIdxSet>>;

const emptyCellIdx: CellIdx = [-1, -1];
const emptyCellSet: Set<string> = new Set([``]);

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
  focusedCell: CellIdxSet;
  setFocusedCell: SetFocusedCell;
  isShiftHeld: boolean;
  setIsShiftHeld: React.Dispatch<React.SetStateAction<boolean>>;
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
  focusedCell,
  setFocusedCell,
  isShiftHeld,
  mainFocusedCell,
  setMainFocusedCell,
}: CellProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const value = cell;
  const mexp = new Mexp();
  let calc;
  try {
    calc = mexp.eval(value as string);
  } catch (e) {
    calc = "Error";
  }

  const isFocused = focusedCell.has(`${rowIdx},${cellIdx}`);

  const cellId = `${rowIdx},${cellIdx}`;

  useEffect(() => {
    if (mainFocusedCell === cellId) {
      ref.current?.focus();
    }
  }, [mainFocusedCell]);

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
          setFocusedCell(new Set([`${rowIdx},${cellIdx}`]));
        }
      }}
      tabIndex={isActive ? -1 : 0}
      onKeyDown={(e) => {
        if (isShiftHeld) {
          if (e.key === "ArrowUp") {
            setActiveCell(emptyCellIdx);
            const cellId = `${rowIdx - 1},${cellIdx}`;
            setMainFocusedCell(cellId);
            return setFocusedCell((cells) => new Set(cells).add(cellId));
          }

          if (e.key === "ArrowDown") {
            setActiveCell(emptyCellIdx);
            const cellId = `${rowIdx + 1},${cellIdx}`;
            setMainFocusedCell(cellId);
            return setFocusedCell((cells) => new Set(cells).add(cellId));
          }

          if (e.key === "ArrowLeft") {
            setActiveCell(emptyCellIdx);
            const cellId = `${rowIdx},${cellIdx - 1}`;
            setMainFocusedCell(cellId);
            return setFocusedCell((cells) => new Set(cells).add(cellId));
          }

          if (e.key === "ArrowRight") {
            setActiveCell(emptyCellIdx);
            const cellId = `${rowIdx},${cellIdx + 1}`;
            setMainFocusedCell(cellId);
            return setFocusedCell((cells) => new Set(cells).add(cellId));
          }
        }

        if (e.key === "Enter") {
          if (!isActive) {
            return setActiveCell([rowIdx, cellIdx]);
          } else {
            const cellId = `${rowIdx},${cellIdx}`;
            setMainFocusedCell(cellId);
            setFocusedCell(new Set([cellId]));
            return setActiveCell(emptyCellIdx);
          }
        }

        if (e.key === "ArrowUp") {
          setActiveCell(emptyCellIdx);

          const cellId = `${rowIdx - 1},${cellIdx}`;
          setMainFocusedCell(cellId);
          return setFocusedCell(new Set([cellId]));
        }

        if (e.key === "ArrowDown") {
          setActiveCell(emptyCellIdx);
          const cellId = `${rowIdx + 1},${cellIdx}`;
          setMainFocusedCell(cellId);
          return setFocusedCell(new Set([cellId]));
        }

        if (e.key === "ArrowLeft") {
          setActiveCell(emptyCellIdx);

          const cellId = `${rowIdx},${cellIdx - 1}`;
          setMainFocusedCell(cellId);
          return setFocusedCell(new Set([cellId]));
        }

        if (e.key === "ArrowRight") {
          setActiveCell(emptyCellIdx);

          const cellId = `${rowIdx},${cellIdx + 1}`;
          setMainFocusedCell(cellId);
          return setFocusedCell(new Set([cellId]));
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
  focusedCell,
  setFocusedCell,
  mainFocusedCell,
  setMainFocusedCell,
}: {
  grid: Grid;
  setActiveCell: React.Dispatch<React.SetStateAction<CellIdx>>;
  activeCell: CellIdx;
  setGrid: React.Dispatch<React.SetStateAction<Grid>>;
  focusedCell: CellIdxSet;
  setFocusedCell: SetFocusedCell;
  mainFocusedCell: string;
  setMainFocusedCell: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [isShiftHeld, setIsShiftHeld] = useState(false);

  return (
    <div
      className="grid"
      onKeyDown={(e) => {
        if (e.key === "Shift") {
          setIsShiftHeld(true);
        }
      }}
      onKeyUp={(e) => {
        if (e.key === "Shift") {
          setIsShiftHeld(false);
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
              focusedCell={focusedCell}
              setFocusedCell={setFocusedCell}
              isShiftHeld={isShiftHeld}
              setIsShiftHeld={setIsShiftHeld}
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
  const [focusedCell, setFocusedCell] = useState<CellIdxSet>(emptyCellSet);
  const [mainFocusedCell, setMainFocusedCell] = useState<string>(``);

  const [grid, setGrid] = useState<Array<Array<number | string>>>(
    new Array(15).fill(0).map(() => new Array(15).fill(0)),
  );

  const activeCellValue =
    activeCell === emptyCellIdx ? "" : grid[activeCell[0]][activeCell[1]];

  return (
    <div className="App">
      <label>
        <p>Formula: </p>
        <input type="text" name="formula" value={activeCellValue} disabled />
      </label>
      <Grid
        setActiveCell={setActiveCell}
        grid={grid}
        setGrid={setGrid}
        activeCell={activeCell}
        focusedCell={focusedCell}
        setFocusedCell={setFocusedCell}
        mainFocusedCell={mainFocusedCell}
        setMainFocusedCell={setMainFocusedCell}
      />
    </div>
  );
};

export default App;
