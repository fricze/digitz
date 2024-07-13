import { useState } from "react";
import "./App.css";

const updateGridValue = (
  grid: Array<Array<string | number>>,
  rowIdx: number,
  cellIdx: number,
  value: string | number,
): Array<Array<string | number>> =>
  grid.with(rowIdx, grid.at(rowIdx)?.with(cellIdx, value) || []);

type Grid = Array<Array<string | number>>;

const Grid = ({
  setActiveCell,
  grid,
  setGrid,
}: {
  setActiveCell: (x: [number, number]) => void;
  grid: Grid;
  setGrid: React.Dispatch<React.SetStateAction<Grid>>;
}) => {
  return (
    <div className="grid">
      {grid.map((row, rowIdx) => (
        <div className="row">
          {row.map((cell, cellIdx) => (
            <div className="cell">
              <input
                type="text"
                value={cell}
                onFocus={() => setActiveCell([rowIdx, cellIdx])}
                onChange={(e) => {
                  setGrid((grid) =>
                    updateGridValue(grid, rowIdx, cellIdx, e.target.value),
                  );
                }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [activeCell, setActiveCell] = useState([0, 0]);

  const [grid, setGrid] = useState<Array<Array<number | string>>>(
    new Array(15).fill(0).map(() => new Array(15).fill(0)),
  );

  const activeCellValue = grid[activeCell[0]][activeCell[1]];

  return (
    <div className="App">
      <label>
        <p>Formula: </p>
        <input type="text" name="formula" value={activeCellValue} />
      </label>
      <Grid setActiveCell={setActiveCell} grid={grid} setGrid={setGrid} />
    </div>
  );
};

export default App;
