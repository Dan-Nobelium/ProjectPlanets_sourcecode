jsPsych.plugins['html-slider-triangle'] = (function() {
  var plugin = {};

  plugin.info = {
    name: 'html-slider-triangle',
    description: 'A plugin for creating a 3D triangle slider',
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
        description: 'Any content here will be displayed above the triangle slider.'
      },
      slider_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Slider width',
        default: 500,
        description: 'Width of the triangle slider in pixels.'
      },
      slider_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Slider height',
        default: 400,
        description: 'Height of the triangle slider in pixels.'
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
        description: 'Labels to display on the triangle slider.'
      },
      require_movement: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Require movement',
        default: false,
        description: 'If true, the participant will have to move the slider before continuing.'
      }
    }
  };

  // Helper functions
  // =================

  // Get image position for a given index
  function getImagePosition(index, sliderWidth, sliderHeight, stimulusHeight) {
    switch (index) {
      case 0:
        return `top: 0; left: 0; transform: translate(-50%, -${0 + stimulusHeight / 2}%);`;
      case 1:
        return `top: 0; right: 0; transform: translate(50%, -${0 + stimulusHeight / 2}%);`;
      case 2:
        return `bottom: 0; left: 50%; transform: translate(-50%, ${0 + stimulusHeight / 2}%);`;
      default:
        return '';
    }
  }

  // Get label position for a given index
  function getLabelPosition(index) {
    switch (index) {
      case 0:
        return 'top: 0; left: 0; transform: translate(-50%, -100%);';
      case 1:
        return 'top: 0; right: 0; transform: translate(50%, -100%);';
      case 2:
        return 'bottom: 0; left: 50%; transform: translate(-50%, 100%);';
      default:
        return '';
    }
  }

  // Get default proportion for a given index
  function getDefaultProportion(index) {
    return 33; // Equal proportions for all three planets
  }

  // Get pie chart gradient based on planet colors and proportions
  function getPieChartGradient(planetColors, planetOrder, proportions = [33, 33, 34]) {
    var colorStops = [];
    var cumulativePercentage = 0;

    for (var i = 0; i < planetOrder.length; i++) {
      var planet = planetOrder[i];
      var color = planetColors[planet];
      var percentage = proportions[i];

      colorStops.push(`${color} ${cumulativePercentage}% ${cumulativePercentage + percentage}%`);
      cumulativePercentage += percentage;
    }

    return `conic-gradient(${colorStops.join(', ')})`;
  }

  // Trial function
  // ==============

  plugin.trial = function(display_element, trial) {
    var planetOrder = trial.stimulus_all;

    // HTML structure
    // =============

    var html = `
      <div id="jspsych-html-slider-triangle-wrapper" style="position: relative; width: ${trial.slider_width}px; height: ${trial.slider_height}px;">
        <div id="jspsych-html-slider-triangle-stimulus" style="position: relative; width: 100%; height: 100%;">
          <!-- Planet images -->
          ${planetOrder.map((planet, index) => `
            <img src="${planet}" style="position: absolute; ${getImagePosition(index, trial.slider_width, trial.slider_height, trial.stimulus_height)}; width: ${trial.stimulus_height}px; height: ${trial.stimulus_height}px;"/>
          `).join('')}

          <!-- Planet labels -->
          ${planetOrder.map((planet, index) => `
            <div id="planet-${index}-label" style="position: absolute; ${getLabelPosition(index)}; color: ${trial.planetColors[planet]};">Planet ${String.fromCharCode(65 + index)} (${getDefaultProportion(index)}%)</div>
          `).join('')}

          <!-- Triangle -->
          <div id="jspsych-html-slider-triangle" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; clip-path: polygon(50% 100%, 0 0, 100% 0); background-color: #ddd;"></div>

          <!-- Handle -->
          <div id="jspsych-html-slider-triangle-handle" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 20px; height: 20px; background-color: #333; border-radius: 50%; cursor: pointer;"></div>
        </div>

        <!-- Pie chart -->
        <div id="jspsych-html-slider-triangle-pie-chart" style="position: absolute; top: 50%; right: 20px; transform: translateY(-50%); width: 150px; height: 150px; border-radius: 50%; background-image: ${getPieChartGradient(trial.planetColors, planetOrder)}"></div>
      </div>

      <!-- Continue button -->
      <button id="jspsych-html-slider-triangle-continue" class="jspsych-btn" style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);">Continue</button>
    `;

    if (trial.prompt !== null) {
      html = `<div>${trial.prompt}</div>` + html;
    }

    display_element.innerHTML = html;

    // DOM elements
    // ============

    var triangle = display_element.querySelector('#jspsych-html-slider-triangle');
    var handle = display_element.querySelector('#jspsych-html-slider-triangle-handle');
    var pieChart = display_element.querySelector('#jspsych-html-slider-triangle-pie-chart');
    var continueButton = display_element.querySelector('#jspsych-html-slider-triangle-continue');

    // State variables
    // ===============

    var isDragging = false;
    var proportions = []; // Declare the proportions array

    // Response object
    // ===============

    var response = {
      proportions: null,
      clicked: false,
      rt: null,
      timestamps: {
        start: null,
        end: null,
        clicks: []
      },
      locations: {
        clicks: [],
      },
      stimulus_all: trial.stimulus_all,
      planetColors: trial.planetColors
    };

    // Record the start timestamp
    response.timestamps.start = performance.now();

    // Calculate the coordinates of the triangle corners relative to the document
    var triangleRect = triangle.getBoundingClientRect();
    var topLeftCorner = { x: triangleRect.left, y: triangleRect.top + triangleRect.height };
    var topRightCorner = { x: triangleRect.right, y: triangleRect.top + triangleRect.height };
    var bottomCorner = { x: triangleRect.left + triangleRect.width / 2, y: triangleRect.top };

    // Log the coordinates of the triangle corners to the console
    console.log("Top Left Corner:", topLeftCorner);
    console.log("Top Right Corner:", topRightCorner);
    console.log("Bottom Corner:", bottomCorner);

    // Update handle position and proportions based on mouse position
    function updateHandlePosition(mouseX, mouseY) {
      var x = mouseX - triangleRect.left;
      var y = mouseY - triangleRect.top;

      handle.style.left = `${x}px`;
      handle.style.top = `${y}px`;

      proportions = updateProportions(x, y);
    }

    // Update proportions and labels
    function updateProportions(x, y) {
      var topProportion = (1 - y / triangleRect.height) * 100;
      var bottomProportion = (y / triangleRect.height - x / triangleRect.width) * 100;
      var rightProportion = (x / triangleRect.width) * 100;

      proportions = [topProportion, rightProportion, bottomProportion];

      // Update the labels with the new proportions
      planetOrder.forEach((planet, index) => {
        var label = display_element.querySelector(`#planet-${index}-label`);
        label.textContent = `Planet ${String.fromCharCode(65 + index)} (${proportions[index].toFixed(2)}%)`;
      });

      // Update the pie chart rendering
      pieChart.style.backgroundImage = getPieChartGradient(trial.planetColors, planetOrder, proportions);

      // Return the updated proportions array
      return proportions;
    }

    // Event listener for mousemove event on the triangle
    triangle.addEventListener('mousemove', function(event) {
      if (isDragging) {
        var mouseX = event.clientX;
        var mouseY = event.clientY;
        updateHandlePosition(mouseX, mouseY);
      }
    });

    // Event listener for mousedown event on the triangle
    triangle.addEventListener('mousedown', function(event) {
      if (event.button === 0) {
        isDragging = true;
        var mouseX = event.clientX;
        var mouseY = event.clientY;
        updateHandlePosition(mouseX, mouseY);
        response.clicked = true;
        var timestamp = performance.now();
        response.timestamps.clicks.push(timestamp);
        response.locations.clicks.push({
          x: mouseX,
          y: mouseY,
          proportions: proportions
        });
      }
    });

    // Event listener for mouseup event on the document
    document.addEventListener('mouseup', function(event) {
      if (event.button === 0) {
        isDragging = false;
      }
    });

    // Event listener for mouseleave event on the triangle
    triangle.addEventListener('mouseleave', function(event) {
      isDragging = false;
    });

    // Function to end the trial
    var end_trial = function() {
      // Remove event listeners
      triangle.removeEventListener('mousemove', updateHandlePosition);
      triangle.removeEventListener('mousedown', updateHandlePosition);
      document.removeEventListener('mouseup', updateHandlePosition);
      triangle.removeEventListener('mouseleave', updateHandlePosition);

      // Set the final proportions
      response.proportions = proportions;

      // Set the end timestamp and reaction time
      response.timestamps.end = performance.now();
      response.rt = response.timestamps.end - response.timestamps.start;

      // Prepare the trial data
      var trial_data = {
        response: response
      };

      // Clear the display
      display_element.innerHTML = '';

      // End the trial
      jsPsych.finishTrial(trial_data);
    };

    // Event listener for the continue button
    continueButton.addEventListener('click', end_trial);
  };

  return plugin;
})();