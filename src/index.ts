import { Game } from "./game";
import './css/global.css';

document.addEventListener('DOMContentLoaded', () => {
  const doc = window.document;
  const root = doc.getElementById('app');
  if (root === null) return;
  const game = new Game(doc, root);
  game.initGameBoard();
});