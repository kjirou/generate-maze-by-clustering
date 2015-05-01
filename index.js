var _ = require('lodash');


var Square = function Square(serialNumber) {
  this.serialNumber = serialNumber;
  this.clusterId = serialNumber;
};

var Wall = function Wall(position, isBreakable) {
  this.position = position;
  this.isBreakable = isBreakable;
  this.isBroken = false;
};
Wall.prototype.beBrokenIfBreakable = function beBrokenIfBreakable(edgedSquares, allSquares) {

  if (edgedSquares.length !== 2) {
    throw new Error('Unexpected situation');
  }

  // Is breakable?
  if (
    !this.isBreakable ||
    edgedSquares[0].clusterId === edgedSquares[1].clusterId
  ) {
    return;
  }

  // Update clusterIds of adjacent cells to adjusting smaller
  var fromClusterId = Math.max(edgedSquares[0].clusterId, edgedSquares[1].clusterId);
  var toClusterId = Math.min(edgedSquares[0].clusterId, edgedSquares[1].clusterId);
  allSquares.forEach(function(square) {
    if (square.clusterId === fromClusterId) {
      square.clusterId = toClusterId;
    }
  });

  this.isBroken = true;
};

/**
 * Create base cells
 *
 * e.g. squareSize = [3, 2]
 *
 * #######
 * # * * #
 * #*#*#*#
 * # * * #
 * #######
 *
 * (space) = square
 * #       = unbreakable wall
 * *       = breakable wall
 */
var createCells = function createCells(squareSize) {

  var cellWidth = squareSize[0] * 2 + 1;
  var cellHeight = squareSize[1] * 2 + 1;

  var squareSerialNumber = -1;
  var squares = [];
  var walls = [];
  var cells = _.range(cellHeight).map(function(cellRowIndex) {
    return _.range(cellWidth).map(function(cellColumnIndex) {
      var cell;
      // square
      if (
        cellRowIndex % 2 === 1 && cellColumnIndex % 2 === 1
      ) {
        cell = new Square(++squareSerialNumber);
        squares.push(cell);
        return cell;
      // unbreakable wall
      } else if (
        cellRowIndex === 0 ||
        cellRowIndex === cellHeight - 1 ||
        cellColumnIndex === 0 ||
        cellColumnIndex === cellWidth - 1 ||
        cellRowIndex % 2 === 0 && cellColumnIndex % 2 === 0
      ) {
        cell = new Wall([cellRowIndex, cellColumnIndex], false);
        walls.push(cell);
        return cell;
      // breakable wall
      } else if (
        cellRowIndex % 2 === 0 && cellColumnIndex % 2 === 1 ||
        cellRowIndex % 2 === 1 && cellColumnIndex % 2 === 0
      ) {
        cell = new Wall([cellRowIndex, cellColumnIndex], true);
        walls.push(cell);
        return cell;
      } else {
        throw new Error('[' + cellRowIndex + ', ' + cellColumnIndex + '] is unexpected cell');
      }
    });
  });

  return {
    squares: squares,
    walls: walls,
    cells: cells
  };
};

/**
 * @param {Array<number>} centerPosition  [cellRowIndex, cellColumnIndex]
 */
var pickAroundSquares = function pickAroundSquares(cells, centerPosition) {
  var aroundSquares = [];
  [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1]
  ].forEach(function(posDelta) {
    var cellRowIndex = centerPosition[0] + posDelta[0];
    var cellColumnIndex = centerPosition[1] + posDelta[1];
    var cell = cells[cellRowIndex][cellColumnIndex];
    if (cell instanceof Square) {
      aroundSquares.push(cell);
    }
  });
  return aroundSquares;
};


/**
 * Generate a maze by "Clustering Method" algorithm
 *
 * @param {Array<number>} squareSize  [squareWidth, squareHeight]
 * @ref "Clustering Method" (クラスタリング法)
 *      http://apollon.issp.u-tokyo.ac.jp/~watanabe/tips/maze.html
 *
 * ----
 * squareHeight/squareWidth do not mean byte length.
 * If you set [3, 2] then you will get the following size:
 *
 *   #######
 *   # # # #
 *   #######
 *   # # # #
 *   #######
 *
 * In the [1, 1] case:
 *
 *   ###
 *   # #
 *   ###
 */
module.exports = function generateMazeByClustering(squareSize) {

  var results = createCells(squareSize);
  var squares = results.squares;
  var walls = results.walls;
  var cells = results.cells;

  // Break walls in random order
  _.shuffle(walls)
    .forEach(function(wall) {
      //
      // Filter to become only "*" points
      //
      // #######
      // # * * #
      // #*#*#*#
      // # * * #
      // #######
      //
      if (!wall.isBreakable) {
        return;
      }
      var edgedSquares = pickAroundSquares(cells, wall.position);
      if (edgedSquares.length !== 2) {
        return;
      }

      // Apply breaking
      wall.beBrokenIfBreakable(edgedSquares, squares);
    })
  ;

  var maze = {
    Square: Square,
    Wall: Wall,

    squares: squares,
    walls: walls,
    cells: cells,

    cellFormatters: {
      simple: function simple(cell) {
        if (
          cell instanceof Square ||
          cell instanceof Wall && cell.isBroken
        ) {
          return ' ';
        }
        return '#';
      },
      debug: function debug(cell) {
        if (
          cell instanceof Square
        ) {
          return cell.clusterId + '';
        } else if (
          cell instanceof Wall && cell.isBroken
        ) {
          return ';';
        } else if (
          cell instanceof Wall && !cell.isBroken
        ) {
          return '#';
        }
        throw new Error('Invalid cell');
      }
    },

    toText: function toText(options) {
      options = _.assign({}, {
        formatter: 'simple'
      }, options);

      return cells.map(function(cellLine) {
        return cellLine.map(function(cell) {
          return maze.cellFormatters[options.formatter](cell);
        }).join('');
      }).join('\n');
    }
  };

  return maze;
};
