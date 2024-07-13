import { useRef, useState } from "react";
import "./App.css";
import Mexp from "math-expression-evaluator";

const emptyCellIdx: CellIdx = [-1, -1];

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
}

const Cell = ({
  cell,
  setActiveCell,
  rowIdx,
  cellIdx,
  setGrid,
  isActive,
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

  return (
    <div
      ref={ref}
      className="cell"
      onClick={() => setActiveCell([rowIdx, cellIdx])}
      tabIndex={isActive ? -1 : 0}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !isActive) {
          return setActiveCell([rowIdx, cellIdx]);
        }

        if (e.key === "ArrowUp") {
          return setActiveCell([rowIdx - 1, cellIdx]);
        }

        if (e.key === "ArrowDown") {
          return setActiveCell([rowIdx + 1, cellIdx]);
        }

        if (e.key === "ArrowLeft") {
          return setActiveCell([rowIdx, cellIdx - 1]);
        }

        if (e.key === "ArrowRight") {
          return setActiveCell([rowIdx, cellIdx + 1]);
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
}: {
  grid: Grid;
  setActiveCell: React.Dispatch<React.SetStateAction<CellIdx>>;
  activeCell: CellIdx;
  setGrid: React.Dispatch<React.SetStateAction<Grid>>;
}) => {
  return (
    <div className="grid">
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
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [activeCell, setActiveCell] = useState<CellIdx>([0, 0]);

  const [grid, setGrid] = useState<Array<Array<number | string>>>(
    new Array(15).fill(0).map(() => new Array(15).fill(0)),
  );

  const activeCellValue =
    activeCell === emptyCellIdx ? null : grid[activeCell[0]][activeCell[1]];

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
      />
    </div>
  );
};

export default App;
