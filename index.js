var _ = require('lodash');


/**
 * @param {Array<number>} [width, height]
 */
module.exports = function generateMazeByClustering(size) {

  var cellWidth = size[0] * 2 + 1;
  var cellHeight = size[1] * 2 + 1;

  var Square = function Square(serialNumber) {
    this.serialNumber = serialNumber;
    this.clusterId = serialNumber;
  };
  var Wall = function Wall(position, isBreakable) {
    this.position = position;
    this.isBreakable = isBreakable;
    this.isBroken = false;
  };

  // generate squares
  var squareSerialNumber = -1;
  var squares = [];
  var walls = [];
  //
  // Create cells like this:
  //
  // #######
  // # * * #
  // #*#*#*#
  // # * * #
  // #######
  //
  // (space) = square
  // #       = unbreakable wall
  // *       = breakable wall
  //
  var cells = _.range(cellHeight).map(function(cellRowIndex) {
    return _.range(cellWidth).map(function(cellColumnIndex) {
      // square
      if (
        cellRowIndex % 2 === 1 && cellColumnIndex % 2 === 1
      ) {
        var square = new Square(++squareSerialNumber);
        squares.push(square);
        return square;
      // unbreakable wall
      } else if (
        cellRowIndex === 0 ||
        cellRowIndex === cellHeight - 1 ||
        cellColumnIndex === 0 ||
        cellColumnIndex === cellWidth - 1 ||
        cellRowIndex % 2 === 0 && cellColumnIndex % 2 === 0
      ) {
        var wall = new Wall([cellRowIndex, cellColumnIndex], false);
        walls.push(wall);
        return wall;
      // breakable wall
      } else if (
        cellRowIndex % 2 === 0 && cellColumnIndex % 2 === 1 ||
        cellRowIndex % 2 === 1 && cellColumnIndex % 2 === 0
      ) {
        var wall = new Wall([cellRowIndex, cellColumnIndex], true);
        walls.push(wall);
        return wall;
      } else {
        throw new Error('[' + cellRowIndex + ', ' + cellColumnIndex + '] is unexpected cell');
      }
    });
  });

  _.shuffle(walls)
    .filter(function(wall) {
      return wall.isBreakable;
    })
    .forEach(function(wall) {
      var aroundSquares = [];
      [
        [-1, 0],
        [0, 1],
        [1, 0],
        [0, -1]
      ].forEach(function(posDelta) {
        var cellRowIndex = wall.position[0] + posDelta[0];
        var cellColumnIndex = wall.position[1] + posDelta[1];
        var cell = cells[cellRowIndex][cellColumnIndex];
        if (cell instanceof Square) {
          aroundSquares.push(cell);
        }
      });

      if (aroundSquares.length !== 2) {
        throw new Error('Unexpected situation');
      }

      if (aroundSquares[0].clusterId === aroundSquares[1].clusterId) {
        return;
      }

      var fromClusterId = Math.max(aroundSquares[0].clusterId, aroundSquares[1].clusterId);
      var toClusterId = Math.min(aroundSquares[0].clusterId, aroundSquares[1].clusterId);
      squares.forEach(function(square) {
        if (square.clusterId === fromClusterId) {
          square.clusterId = toClusterId;
        }
      });
      wall.isBroken = true;
    })
  ;

  var maze = {
    Square: Square,
    Wall: Wall,

    squares: squares,
    walls: walls,
    cells: cells,

    formatCell: function formatCell(cell) {
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
      } else {
        throw new Error('Invalid cell');
      }
    },

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

      var text = cells.map(function(cellLine) {
        return cellLine.map(function(cell) {
          return maze.cellFormatters[options.formatter](cell);
        }).join('');
      }).join('\n');
      return text;
    }
  };

  return maze;
};
