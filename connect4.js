/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let otherPlayer = 2;
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  board = [];                           // resets the board before making it again
  let widthArr = [];                    // declares a placeholder array for the width
  for (let i = 0; i < WIDTH; i++) {     // pushes null as an entry for the width
    widthArr.push(null)
  }
  for (let j = 0; j < HEIGHT; j++) {    // pushes a whole widthArr into board for the height
    board[j] = widthArr.map(x => x);
  }
  return board

}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  const htmlBoard = document.getElementById("board");
  const top = document.createElement("tr");     // creates top row inside board
  top.setAttribute("id", "column-top");         // adds "column-top" id to the top row
  top.addEventListener("click", handleClick);   // adds event listener to top row

  for (let x = 0; x < WIDTH; x++) {             // creates cell in the top row for the given width
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);             // adds id of x position to each cell
    top.append(headCell);                       // appends each cell to top row
  }
  htmlBoard.append(top);                        // appends whole top row to the htmlBoard

  for (let y = HEIGHT - 1; y >= 0; y--) {            // creates a row for the given height
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {           // creates cells within the row for the given width
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);     // gives each cell an id of its coordinates
      row.append(cell);                         // adds cell to the given row
    }
    htmlBoard.append(row);                      // adds each row to the board
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (let y = 0; y < HEIGHT; y++) {
    if (board[y][x] === null) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  let currCell = document.getElementById(`${y}-${x}`);    // gets current cell
  // console.log(currCell);
  const newPiece = document.createElement('div');         // creates new piece
  newPiece.setAttribute("class", `piece player${currPlayer}`); // adds piece and current player class
  currCell.append(newPiece);                              // appends new piece to current cell
  // console.log(newPiece);
  board[y][x] = currPlayer;
}

/** endGame: announce game end */

function endGame(msg) {
  const gameCont = document.getElementById('game');
  const overlay = document.createElement('div');
  const endPop = document.createElement('div');
  overlay.setAttribute('id', 'overlay');
  endPop.innerText = msg;
  endPop.setAttribute('id', 'popover');
  const button = document.createElement('button')
  button.innerHTML = "Play again!<br>";
  button.addEventListener("click", resetGame);
  endPop.append(button);
  overlay.append(endPop);
  gameCont.append(overlay);
  document.getElementById("column-top").classList.remove("p2");
  currPlayer = 1;
  otherPlayer = 2;
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  // console.log("click");
  const popUpDelay = 400;
  let x = +evt.target.id;
  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }
  // place piece in board and add to HTML table
  placeInTable(y, x);

  if (checkForWin()) {
    return setTimeout(() => (endGame(`Player ${currPlayer} won!`)), popUpDelay);
  }

  if (checkForTie()) {
    return setTimeout(() => (endGame(`it's a tie!`)), popUpDelay);  
  }
  // switch players
  [currPlayer, otherPlayer] = [otherPlayer, currPlayer]
  // toggle class for hover color at top
  document.getElementById("column-top").classList.toggle("p2");
}

function resetGame (evt) {
  evt.preventDefault();
  makeBoard();
  const board = document.getElementById("board")
  while(board.firstChild){
    board.removeChild(board.firstChild);
  }
  document.getElementById('overlay').remove();
  makeHtmlBoard();

}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.
  // creates an array of each possible win scenario starting from each cell on the board
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horizontalWinCondition = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let verticalWinCondition = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagonalDownRightWinCondition = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagonalDownLeftWinCondition = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horizontalWinCondition) || _win(verticalWinCondition) || _win(diagonalDownRightWinCondition) || _win(diagonalDownLeftWinCondition)) {
        return true;
      }
    }
  }
}

function checkForTie() {
  return board.every(val => val.every(x => x > 0))
}

makeBoard();
makeHtmlBoard();
