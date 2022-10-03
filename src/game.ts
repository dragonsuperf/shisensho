import { AStarFinder } from "./astar/astar";
import { Node } from "./astar/core/node";

const oneToNineArr =  ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
const alphabets = Array(26).fill(0).map((_, index) => String.fromCharCode(97 + index)).filter((a) => a !== 'p');
const originMahjongArr = [...oneToNineArr, 
                          ...alphabets];
const mahjongArr = [...originMahjongArr, ...originMahjongArr];
const GAME_SIZE = 15;

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
  private root: HTMLElement;
  private solveableCountSpan: HTMLElement;
  private gameBoard: HTMLElement;
  private aStarInstance: AStarFinder;
  private matrix: ShisenshoMatrix;
  private cellList: HTMLDivElement[][];
  private blockList: Point[];
  private selectedList: HTMLDivElement[];

  constructor(doc: Document, root: HTMLElement) {
    this.doc = doc;
    this.root = root;
    
    const gameBoard = doc.createElement('div');
    gameBoard.classList.add('board');
    this.root.appendChild(gameBoard);

    this.gameBoard = gameBoard;

    const gamePanel = doc.createElement('div');
    gamePanel.classList.add('panel');
    this.root.appendChild(gamePanel);

    const fixedSpan = doc.createElement('span');
    fixedSpan.textContent = '클리어 가능한 블록 수: ';
    gamePanel.appendChild(fixedSpan);

    const solveableCountSpan = doc.createElement('span');
    gamePanel.appendChild(solveableCountSpan);
    this.solveableCountSpan = solveableCountSpan;

    this.aStarInstance = new AStarFinder({
      grid: {
        width: GAME_SIZE,
        height: GAME_SIZE,
        densityOfObstacles: 3,
      },
      diagonalAllowed: false,
      heuristic: 'Manhattan',
    });

    this.matrix = { nodes: this.aStarInstance.getGrid().getGridNodes(), types: Array.from(Array(GAME_SIZE), () => new Array(GAME_SIZE)) };
    this.cellList = Array.from(Array(GAME_SIZE), () => new Array(GAME_SIZE));
    this.selectedList = [];
    this.blockList = [];
  }

  public initGameBoard() {
    for (let i = 0 ; i < this.matrix.nodes.length; i++) {
      const row = this.matrix.nodes[i];
      for (let j = 0; j < row.length; j++) {
        const newCell = this.doc.createElement('div');
        newCell.classList.add('cell');
        newCell.id = `index-${j}-${i}`;
        
        if (!row[j].getIsWalkable()) {
          newCell.classList.add('block');

          this.blockList.push({ x: j, y: i });

          let currentMahjong = this.selectRandomMahjong();
          this.matrix.types[i][j] = currentMahjong;
          newCell.textContent = currentMahjong;
        }

        this.cellList[j][i] = newCell;
        this.gameBoard.appendChild(newCell);
      }
    }

    this.solveableCountSpan.textContent = this.checkSolveableNodes().toString();

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
            const path = this.pathFinding();
            const isSolve = path.length > 0;

            if (isSolve) {
              this.solve(path);
            } else {
              this.clearSelect();
            }
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

  checkSolveableNodes() {
    let solveableNodeCount = 0;
    const searchingArr = [...this.blockList];

    this.blockList.forEach((block, index) => {
      const { x, y } = block;

      searchingArr.splice(index, 1);
      const currentBlock = this.matrix.nodes[y][x];
      searchingArr.some((search) => {
        const searchBlock = this.matrix.nodes[search.y][search.x];
        
        if (this.matrix.types[y][x] === this.matrix.types[search.y][search.x]) {
          currentBlock.setIsWalkable(true);
          searchBlock.setIsWalkable(true);
          const path = this.aStarInstance.findPath(currentBlock.position, searchBlock.position);
          currentBlock.setIsWalkable(false);
          searchBlock.setIsWalkable(false);

          if (path.length > 0) {
            console.log(currentBlock.position, searchBlock.position);
            solveableNodeCount++;
            return;
          }
        }
      });
      searchingArr.splice(index, 0, block);
    })

    return solveableNodeCount;
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
    const firstNode = path[0];
    const lastNode = path[path.length - 1];
  
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
      this.setIsWalkable({ x: firstNode[0], y: firstNode[1] }, true);
      this.setIsWalkable({ x: lastNode[0], y: lastNode[1] }, true);

      this.clearSelect();
      this.solveableCountSpan.textContent = this.checkSolveableNodes().toString();
    }, 500);
  }

  pathFinding() {
    const start = this.idToXY(this.selectedList[0].id);
    const end = this.idToXY(this.selectedList[1].id);

    if (this.matrix.types[start.y][start.x] !== this.matrix.types[end.y][end.x]) {
      this.clearSelect();
      return [];
    }

    this.setIsWalkable(start, true);
    this.setIsWalkable(end, true);

    const path = this.aStarInstance.findPath(start, end);

    this.setIsWalkable(start, false);
    this.setIsWalkable(end, false);

    return path;
  }
}