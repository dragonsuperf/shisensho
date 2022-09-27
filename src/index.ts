import { AStarFinder } from 'astar-typescript';

interface Point {
  x: number;
  y: number;
}

document.addEventListener('DOMContentLoaded', () => {
  const doc = window.document;
  const gameBoard = doc.getElementById('board');
  const aStarInstance = new AStarFinder({
    grid: {
      width: 20,
      height: 20,
      densityOfObstacles: 4,
    },
    diagonalAllowed: false,
    heuristic: 'Manhattan',
  });
  if (gameBoard === null) return;

  const matrix = aStarInstance.getGrid().getGridNodes();
  const cellList: HTMLDivElement[][] = Array.from(Array(20), () => new Array(20));
  const selectedList: HTMLDivElement[] = [];

  function initGameBoard() {
    if (gameBoard === null) return;

    console.log(matrix);

    for (let i = 0 ; i < matrix.length; i++) {
      const row = matrix[i];
      for (let j = 0; j < row.length; j++) {
        const newCell = doc.createElement('div');
        newCell.classList.add('cell');
        newCell.id = `index-${j}-${i}`;
        
        if (!row[j].getIsWalkable()) {
          newCell.classList.add('block');
        }
        cellList[j][i] = newCell;
        gameBoard.appendChild(newCell);
      }
    }
  }

  function idToXY(id: string) {
    const [_, x, y] = id.split('-');

    return { x: Number(x), y: Number(y) };
  }

  function updateCells() {
    cellList.forEach((rowList, x) => {
      rowList.forEach((cell, y) => {
        cell.classList.remove('selected');
        cell.classList.remove('left-line');
        cell.classList.remove('right-line');
        cell.classList.remove('bottom-line');
        cell.classList.remove('top-line');
        if (matrix[y][x].getIsWalkable()) cell.classList.remove('block');
      })
    });

    selectedList.forEach((cell) => {
      cell.classList.add('selected');
    })
  }

  function setIsWalkable({ x, y }: Point, flag: boolean) {
    matrix[y][x].setIsWalkable(flag);
  }

  function checkDirection(start: Point, end: Point) {
    if (start.x < end.x) return 'left';
    else if (start.x > end.x) return 'right';
    else if (start.y < end.y) return 'bottom';
    else return 'top';
  }

  function solve(path: number[][]) {
    for (let i = 0 ; i < path.length - 1; i++) {
      const direction = checkDirection(
                                        { x: path[i][0], y: path[i][1] }, 
                                        { x: path[i + 1][0], y: path[i + 1][1] }
                                      );
      const [x, y] = path[i];
      cellList[x][y].classList.add(`${direction}-line`);
    }

    setTimeout(() => {
      selectedList.splice(0, 2);
      updateCells();
    }, 500);
  }

  function pathFinding() {
    const start = idToXY(selectedList[0].id);
    const end = idToXY(selectedList[1].id);
    setIsWalkable(start, true);
    setIsWalkable(end, true);
    console.log(start);
    console.log(end);

    const path = aStarInstance.findPath(start, end);

    if (path.length > 0) {
      solve(path);
    } else {
      setIsWalkable(start, false);
      setIsWalkable(end, false);
      selectedList.splice(0, 2);
    }
  }

  gameBoard.onclick = (event) => {
    if (event.target instanceof HTMLDivElement) {
      const target = event.target;
      const isSelected = target.classList.contains('selected');
      const isFilled = target.classList.contains('block')

      if (isFilled && !isSelected) {
        if (selectedList.length < 2) {
          selectedList.push(target);
        }
        if (selectedList.length === 2) {
          updateCells();
          pathFinding();
          return;
        }
      } else if (isSelected) {
        
        let selectedIndex = 0;
        selectedList.some((cell, index) => {
          if (cell.id === target.id) {
            selectedIndex = index;
            return;
          }
        });
        selectedList.splice(selectedIndex, 1);
      }

      updateCells();
    }
  }

  initGameBoard();
});