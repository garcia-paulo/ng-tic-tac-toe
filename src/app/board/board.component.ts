import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  squares!: any[];
  xIsNext!: boolean;
  winner!: string | null;
  xIsStarter: boolean = true;
  xWins: number = 0;
  oWins: number = 0;
  botIsPlaying: boolean = false;
  lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  constructor() {}

  ngOnInit(): void {
    this.newGame();
  }

  ngDoCheck(): void {
    if (this.botIsPlaying && this.xIsNext === false && !this.winner) {
      const idx = this.botMove();
      if (idx != -1) this.makeMove(idx);
    }
  }

  newGame() {
    this.squares = Array(9).fill(null);
    this.winner = null;
    this.xIsNext = this.xIsStarter;
    this.xIsStarter = !this.xIsStarter;
  }

  get player() {
    return this.xIsNext ? 'X' : 'O';
  }

  makeMove(idx: number) {
    if (this.winner) {
      alert(`${this.winner} is the winner!`);
      return;
    }

    if (!this.squares[idx]) {
      this.squares.splice(idx, 1, this.player);
      this.xIsNext = !this.xIsNext;
    }

    this.winner = this.calculateWinner();
    if (this.winner === 'X') {
      this.xWins++;
    } else if (this.winner === 'O') {
      this.oWins++;
    }
  }

  calculateWinner() {
    for (let i = 0; i < this.lines.length; i++) {
      const [a, b, c] = this.lines[i];
      if (
        this.squares[a] &&
        this.squares[a] === this.squares[b] &&
        this.squares[a] === this.squares[c]
      )
        return this.squares[a];
    }
    return null;
  }

  botMove(): number {
    let bestScore: number = 0;
    let bestMove: number = -1;

    for (let i = 0; i < this.squares.length; i++) {
      let score: number = 0;

      if (!this.squares[i]) {
        for (const line of this.lines) {
          let oFinded: number = 0;
          let xFinded: number = 0;

          for (const idx of line) {
            if (idx === i) {
              line.forEach((sqr) => {
                if (this.squares[sqr] === 'X') xFinded++;
                else if (this.squares[sqr] === 'O') oFinded++;
              });

              switch (xFinded) {
                case 1:
                  score = 0.5;
                  break;
                case 2:
                  score = 8;
                  break;
              }

              switch (oFinded) {
                case 1:
                  score = 2;
                  break;
                case 2:
                  score = 10;
                  break;
              }

              switch (i) {
                case 0:
                  if (this.squares[8] === 'O') score += 2;
                  score += 1;
                  break;
                case 2:
                  if (this.squares[6] === 'O') score += 2;
                  score += 1;
                  break;
                case 4:
                  score += 0.5;
                  break;
                case 6:
                  if (this.squares[2] === 'O') score += 2;
                  score += 1;
                  break;
                case 8:
                  if (this.squares[0] === 'O') score += 2;
                  score += 1;
              }

              if (score > bestScore) {
                bestScore = score;
                bestMove = i;
              } else if (score === bestScore) {
                if (Math.random() > 0.5) bestMove = i;
              }
            }
          }
        }
      }
    }

    return bestMove;
  }
}
