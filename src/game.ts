import { AStarFinder } from "./astar/astar";
import { Node } from "./astar/core/node";

const oneToNineArr =  ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
const originMahjongArr = [...oneToNineArr.map((value) => `man${value}`), ...oneToNineArr.map((value) => `tong${value}`),
                             ...oneToNineArr.map((value) => `sac${value}`), 'east', 'west', 'south', 'north',
                             'white', 'center', 'shoot'];
const mahjongArr = [...originMahjongArr, ...originMahjongArr];
const gameSize = 15;

interface Point {
  x: number;
  y: number;
}

interface ShisenshoMatrix {
  nodes: Node[][];
  types: string[][];
}

const MAX_SELECT = 2;

export class Game {
  private doc: Document;
  private gameBoard: HTMLElement;
  private aStarInstance: AStarFinder;
  private matrix: ShisenshoMatrix;
  private cellList: HTMLDivElement[][];
  private selectedList: HTMLDivElement[];

  constructor(doc: Document, gameBoard: HTMLElement) {
    this.doc = doc;
    this.gameBoard = gameBoard;
    this.aStarInstance = new AStarFinder({
      grid: {
        width: gameSize,
        height: gameSize,
        densityOfObstacles: 3,
      },
      diagonalAllowed: false,
      heuristic: 'Manhattan',
    });
    this.matrix = { nodes: this.aStarInstance.getGrid().getGridNodes(), types: Array.from(Array(gameSize), () => new Array(gameSize)) };
    this.cellList = Array.from(Array(gameSize), () => new Array(gameSize));
    this.selectedList = [];
  }

  public initGameBoard() {
    let count = 0;
    for (let i = 0 ; i < this.matrix.nodes.length; i++) {
      const row = this.matrix.nodes[i];
      for (let j = 0; j < row.length; j++) {
        const newCell = this.doc.createElement('div');
        newCell.classList.add('cell');
        newCell.id = `index-${j}-${i}`;
        
        if (!row[j].getIsWalkable()) {
          newCell.classList.add('block');

          let currentMahjong = this.selectRandomMahjong();
          this.matrix.types[i][j] = currentMahjong;
          newCell.textContent = currentMahjong;
          newCell.textContent = '#';
          count++;
        }

        this.cellList[j][i] = newCell;
        this.gameBoard.appendChild(newCell);
      }
    }

    this.gameBoard.onclick = (event) => {
      if (event.target instanceof HTMLDivElement) {
        const target = event.target;
        const isSelected = target.classList.contains('selected');
        const isFilled = target.classList.contains('block')
  
        if (isFilled && !isSelected) {
          if (this.selectedList.length < MAX_SELECT) {
            this.selectedList.push(target);
          }
  
          if (this.selectedList.length === MAX_SELECT) {
            this.updateCells();
            this.pathFinding();
            return;
          }
        } else if (isSelected) {
          let selectedIndex = 0;
  
          this.selectedList.some((cell, index) => {
            if (cell.id === target.id) {
              selectedIndex = index;
              return;
            }
          });
          this.selectedList.splice(selectedIndex, 1);
        }
  
        this.updateCells();
      }
    }
  }

  selectRandomMahjong() {
    const selectedIndex = Math.floor(Math.random() * mahjongArr.length);
    const selected = mahjongArr[selectedIndex];
    mahjongArr.splice(selectedIndex, 1);
    return selected;
  }

  idToXY(id: string) {
    const [_, x, y] = id.split('-');

    return { x: Number(x), y: Number(y) };
  }

  updateCells() {
    this.cellList.forEach((rowList, x) => {
      rowList.forEach((cell, y) => {
        cell.classList.remove('selected');
        cell.classList.remove('left-line');
        cell.classList.remove('right-line');
        cell.classList.remove('bottom-line');
        cell.classList.remove('top-line');
        if (this.matrix.nodes[y][x].getIsWalkable()) {
          cell.classList.remove('block');
          cell.textContent = '';
        }
      })
    });

    this.selectedList.forEach((cell) => {
      cell.classList.add('selected');
    })
  }

  setIsWalkable({ x, y }: Point, flag: boolean) {
    this.matrix.nodes[y][x].setIsWalkable(flag);
  }

  checkDirection(start: Point, end: Point) {
    if (start.x < end.x) return 'left';
    else if (start.x > end.x) return 'right';
    else if (start.y < end.y) return 'bottom';
    else return 'top';
  }

  clearSelect() {
    this.selectedList.splice(0, MAX_SELECT);
    this.updateCells();
  }

  solve(path: number[][]) {
    for (let i = 0 ; i < path.length - 1; i++) {
      const currentNode = path[i];
      const nextNode = path[i + 1];

      const direction = this.checkDirection(
                                        { x: currentNode[0], y: currentNode[1] }, 
                                        { x: nextNode[0], y: nextNode[1] }
                                      );
      const [x, y] = path[i];
      this.cellList[x][y].classList.add(`${direction}-line`);
    }

    setTimeout(() => {
      this.clearSelect();
    }, 500);
  }

  pathFinding() {
    const start = this.idToXY(this.selectedList[0].id);
    const end = this.idToXY(this.selectedList[1].id);

    if (this.matrix.types[start.y][start.x] !== this.matrix.types[end.y][end.x]) {
      this.clearSelect();
      console.log('wrong type');
      return;
    }

    this.setIsWalkable(start, true);
    this.setIsWalkable(end, true);

    const path = this.aStarInstance.findPath(start, end);
    const isSolve = path.length > 0;

    if (isSolve) {
      this.solve(path);
    } else {
      this.setIsWalkable(start, false);
      this.setIsWalkable(end, false);
      this.clearSelect();
    }
  }
}