jsPsych.plugins['html-slider-grid'] = (function() {
  var plugin = {};

  plugin.info = {
    name: 'html-slider-grid',
    description: 'A plugin for creating a grid-based proportion selector',
    parameters: {
      stimulus_all: {
        type: jsPsych.plugins.parameterType.ARRAY,
        pretty_name: 'Stimulus all',
        default: [],
        description: 'Array of stimulus image paths'
      },
      planetColors: {
        type: jsPsych.plugins.parameterType.OBJECT,
        pretty_name: 'Planet colors',
        default: null,
        description: 'Object mapping image paths to their respective colors'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed above the grid.'
      },
      grid_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Grid width',
        default: 500,
        description: 'Width of the grid in pixels.'
      },
      grid_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Grid height',
        default: 500,
        description: 'Height of the grid in pixels.'
      },
      stimulus_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus height',
        default: 100,
        description: 'Height of the stimulus images in pixels.'
      },
      labels: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Labels',
        default: [],
        array: true,
        description: 'Labels to display on the grid.'
      },
      require_movement: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Require movement',
        default: false,
        description: 'If true, the participant will have to interact with the grid before continuing.'
      }
    }
  };

  plugin.trial = function(display_element, trial) {
    var numRows = 3;
    var numCols = 101;

    var html = `
      <div id="jspsych-html-slider-grid-container" style="position: relative; width: ${trial.grid_width}px; height: ${trial.grid_height}px;">
        <div id="jspsych-html-slider-grid" style="width: 100%; height: 100%;"></div>
        <div id="jspsych-html-slider-grid-labels" style="position: absolute; top: 0; left: 0; width: 100%; display: flex; justify-content: space-between;">
          ${trial.labels.map((label, index) => `
            <div style="text-align: center;">
              <img src="${trial.stimulus_all[index]}" style="height: ${trial.stimulus_height}px;"/>
              <div>${label}</div>
            </div>
          `).join('')}
        </div>
        <div id="jspsych-html-slider-grid-pie-chart" style="position: absolute; bottom: 0; right: 0; width: 150px; height: 150px; border-radius: 50%;"></div>
      </div>
      <button id="jspsych-html-slider-grid-submit" class="jspsych-btn" style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);">Submit</button>
    `;

    display_element.innerHTML = html;

    var gridContainer = display_element.querySelector('#jspsych-html-slider-grid');
    var pieChart = display_element.querySelector('#jspsych-html-slider-grid-pie-chart');
    var submitButton = display_element.querySelector('#jspsych-html-slider-grid-submit');

    var proportions = new Array(numRows).fill(0);
    var selectedCells = new Array(numRows).fill(null);

    function generateGrid(numRows, numCols, gridWidth, gridHeight) {
      var cellWidth = gridWidth / numCols;
      var cellHeight = gridHeight / numRows;

      var gridHtml = '';

      for (var row = 0; row < numRows; row++) {
        gridHtml += '<div class="jspsych-html-slider-grid-row" style="display: flex;">';
        for (var col = 0; col < numCols; col++) {
          gridHtml += `<div class="jspsych-html-slider-grid-cell" data-row="${row}" data-col="${col}" style="width: ${cellWidth}px; height: ${cellHeight}px; border: 1px solid #ccc;"></div>`;
        }
        gridHtml += '</div>';
      }

      return gridHtml;
    }

    function getCellPercentages(rowIndex, colIndex, numRows, numCols) {
      var percentages = new Array(numRows).fill(0);
      percentages[rowIndex] = (colIndex + 1) / numCols * 100;
      return percentages;
    }

    function updateLabels(proportions) {
      var labels = display_element.querySelectorAll('#jspsych-html-slider-grid-labels > div > div');
      labels.forEach((label, index) => {
        label.textContent = `${Math.round(proportions[index])}%`;
      });
    }

    function updatePieChart(proportions) {
      var colors = trial.stimulus_all.map(stimulus => trial.planetColors[stimulus]);
      var chartHtml = `
        <svg viewBox="0 0 32 32">
          ${proportions.map((proportion, index) => {
            var startAngle = index === 0 ? 0 : proportions.slice(0, index).reduce((sum, p) => sum + p, 0) / 100 * 360;
            var endAngle = startAngle + proportion / 100 * 360;
            var largeArc = endAngle - startAngle > 180 ? 1 : 0;
            var x1 = 16 + Math.cos(startAngle * Math.PI / 180) * 16;
            var y1 = 16 + Math.sin(startAngle * Math.PI / 180) * 16;
            var x2 = 16 + Math.cos(endAngle * Math.PI / 180) * 16;
            var y2 = 16 + Math.sin(endAngle * Math.PI / 180) * 16;
            return `<path d="M16,16 L${x1},${y1} A16,16 0 ${largeArc},1 ${x2},${y2} Z" fill="${colors[index]}"/>`;
          }).join('')}
        </svg>
      `;
      pieChart.innerHTML = chartHtml;
    }

    function handleCellClick(event) {
      var cell = event.target;
      var rowIndex = parseInt(cell.dataset.row);
      var colIndex = parseInt(cell.dataset.col);

      selectedCells[rowIndex] = cell;
      proportions = getCellPercentages(rowIndex, colIndex, numRows, numCols);

      selectedCells.forEach((selectedCell, index) => {
        if (selectedCell !== null && index !== rowIndex) {
          selectedCell.style.backgroundColor = '';
        }
      });

      cell.style.backgroundColor = 'lightblue';

      updateLabels(proportions);
      updatePieChart(proportions);
    }

    function endTrial() {
      var response = {
        proportions: proportions,
        rt: performance.now() - startTime
      };

      display_element.innerHTML = '';
      jsPsych.finishTrial(response);
    }

    gridContainer.innerHTML = generateGrid(numRows, numCols, trial.grid_width, trial.grid_height);
    var cells = gridContainer.querySelectorAll('.jspsych-html-slider-grid-cell');
    cells.forEach(cell => {
      cell.addEventListener('click', handleCellClick);
    });

    var startTime = performance.now();
    submitButton.addEventListener('click', endTrial);
  };

  return plugin;
})();