import { Game } from "./game";
import './css/global.css';

document.addEventListener('DOMContentLoaded', () => {
  const doc = window.document;
  const gameBoard = doc.getElementById('board');
  if (gameBoard === null) return;
  const game = new Game(doc, gameBoard);
  game.initGameBoard();
});