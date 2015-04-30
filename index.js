var _ = require('lodash');


function Square(serialNumber) {

  this.serialNumber = serialNumber;

  this.clusterId = serialNumber;
}

function Wall(direction, rowIndex, columnIndex) {

  /** "horizontal" or "vertical" */
  this.direction = direction;

  this.rowIndex = rowIndex;
  this.columnIndex = columnIndex;

  /**
   * @var {Array<Square|null>}
   */
  this.edgedSquares = [null, null];

  this.isBroken = false;

  this.isBreakable = function isBreakable() {
    return (
      this.edgedSquares[0] &&
      this.edgedSquares[1] &&
      this.edgedSquares[0].clusterId !== this.edgedSquares[1].clusterId &&
      !this.isBroken
    );
  };

  this.beBroken = function beBroken() {
    if (this.edgedSquares[0].clusterId < this.edgedSquares[1].clusterId) {
      this.edgedSquares[1].clusterId = this.edgedSquares[0].clusterId;
    } else if (this.edgedSquares[1].clusterId < this.edgedSquares[0].clusterId) {
      this.edgedSquares[0].clusterId = this.edgedSquares[1].clusterId;
    } else {
      throw new Error('same clusterIds are passed');
    }
    this.isBroken = true;
  };
}

function getSquare(squares, rowIndex, columnIndex) {
  var line = squares[rowIndex];
  if (!line) return null;
  var square = line[columnIndex];
  if (!square) return null;
  return square;
}


/**
 * @param {Array<number>} [width, height]
 */
module.exports = function generateMazeByClustering(size) {

  var width = size[0];
  var height = size[1];

  // put squares
  var serialNumber = -1;
  var squares = _.range(height).map(function() {
    return _.range(width).map(function() {
      return new Square(++serialNumber);
    });
  });

  // put walls
  //
  // e.g.
  //
  //   [width, height] = [3, 2]
  //
  //   +--8-+-11-+-14-+
  //   |    |    |    |
  //   0    1    2    3
  //   |    |    |    |
  //   +--9-+-12-+-15-+
  //   |    |    |    |
  //   4    5    6    7
  //   |    |    |    |
  //   +-10-+-13-+-16-+
  //
  // However, the order is irrelevant (with the exception of debugging).
  //
  var walls = [];
  _.range(squares.length).map(function(rowIndex) {
    _.range(squares[0].length + 1).map(function(columnIndex) {
      var wall = new Wall('vertical', rowIndex, columnIndex);
      wall.edgedSquares[0] = getSquare(squares, rowIndex, columnIndex - 1);
      wall.edgedSquares[1] = getSquare(squares, rowIndex, columnIndex);
      walls.push(wall);
    });
  });
  _.range(squares[0].length).map(function(columnIndex) {
    _.range(squares.length + 1).map(function(rowIndex) {
      var wall = new Wall('horizontal', rowIndex, columnIndex);
      wall.edgedSquares[0] = getSquare(squares, rowIndex - 1, columnIndex);
      wall.edgedSquares[1] = getSquare(squares, rowIndex, columnIndex);
      walls.push(wall);
    });
  });

  _.shuffle(walls).forEach(function(wall) {
    if (!wall.isBreakable()) return;
    wall.beBroken();
  });

  var maze = {
    /**
     * @return {string} e.g.
     *
     *   +-+-+-+-+\n
     *   | |   | |\n
     *   + + + + +\n
     *   |   |   |\n
     *   + + + +-+\n
     *   | | |   |\n
     *   +-+ +-+ +\n
     *   |   |   |\n
     *   +-+-+-+-+
     */
    toString: function toString() {
      var height = squares.length * 2 + 1;
      var width = squares[0].length * 2 + 1;
      var dots = _.range(height).map(function(rowIndex) {
        return _.range(width).map(function(columnIndex) {
          return (!(rowIndex % 2) && !(columnIndex % 2)) ? '+' : '#';
        });
      });
      walls.forEach(function(wall) {
        if (wall.direction === 'vertical') {
          dots[wall.rowIndex * 2 + 1][wall.columnIndex * 2] = (wall.isBroken ? '#' : '|');
        } else if (wall.direction === 'horizontal') {
          dots[wall.rowIndex * 2][wall.columnIndex * 2 + 1] = (wall.isBroken ? '#' : '-');
        }
      });
      return dots.map(function(line) {
        return line.join('') + '\n';
      }).join('');
    }
  };

  return {
    maze: maze,
    rawSquares: squares,
    rawWalls: walls
  };
};
