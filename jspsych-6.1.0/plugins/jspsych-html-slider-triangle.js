jsPsych.plugins['html-slider-triangle'] = (function() {
  var plugin = {};

  plugin.info = {
    name: 'html-slider-triangle',
    description: 'A plugin for creating a 3D triangle slider',
    parameters: {
      // 1. Update plugin parameters
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

  var proportions = []; // Declare the proportions array outside the trial function

  plugin.trial = function(display_element, trial) {
    // 3. Determine the order of planets
    var planetOrder = trial.stimulus_all;

    // 2. Refactor the HTML structure
    var html = `
      <div id="jspsych-html-slider-triangle-wrapper" style="position: relative; width: ${trial.slider_width}px; height: ${trial.slider_height}px;">
        <div id="jspsych-html-slider-triangle-stimulus" style="position: relative; width: 100%; height: 100%;">
          <!-- Planet images -->
          ${planetOrder.map((planet, index) => `
            <img src="${planet}" style="position: absolute; ${getImagePosition(index)}; width: ${trial.stimulus_height}px; height: ${trial.stimulus_height}px;"/>
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

    var triangle = display_element.querySelector('#jspsych-html-slider-triangle');
    var handle = display_element.querySelector('#jspsych-html-slider-triangle-handle');
    var pieChart = display_element.querySelector('#jspsych-html-slider-triangle-pie-chart');
    var continueButton = display_element.querySelector('#jspsych-html-slider-triangle-continue');

    var isDragging = false;

    // Initialize the response object
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
      // 8. Update the response object
      stimulus_all: trial.stimulus_all,
      planetColors: trial.planetColors
    };

    // Record the start timestamp
    response.timestamps.start = performance.now();

    function updateHandlePosition(x, y) {
      var triangleRect = triangle.getBoundingClientRect();
    
// Calculate the normalized coordinates within the triangle
var b = Math.max(0, Math.min(1, x / triangleRect.width));
var a = Math.max(0, Math.min(1, y / triangleRect.height));
var c = 1 - a - b;

// Invert the values for a and c
a = 1 - a;
c = 1 - c;

// Clamp the values to ensure they are within the valid range
a = Math.max(0, Math.min(1, a));
b = Math.max(0, Math.min(a, b));
c = Math.max(0, Math.min(1 - a, c));
      // Update the handle position
      handle.style.left = `${b * 100}%`;
      handle.style.top = `${a * 100}%`;
    
      // Update the proportions calculation and store the returned value
      proportions = updateProportions(a, b, c);
    }

    // 7. Update the proportions calculation
    function updateProportions(a, b, c) {
      proportions = [a, b, c].map(value => Math.round(value * 100));

      // Update the labels with the new proportions
      planetOrder.forEach((planet, index) => {
        var label = display_element.querySelector(`#planet-${index}-label`);
        label.textContent = `Planet ${String.fromCharCode(65 + index)} (${proportions[index]}%)`;
      });

      // 5. Update the pie chart rendering
      pieChart.style.backgroundImage = getPieChartGradient(trial.planetColors, planetOrder, proportions);

      // Return the updated proportions array
      return proportions;
    }

    // Event listener for mouse movement
    function handleMouseMove(e) {
      if (!isDragging) return;

      var triangleRect = triangle.getBoundingClientRect();
      var x = e.clientX - triangleRect.left;
      var y = e.clientY - triangleRect.top;

      updateHandlePosition(x, y);
    }

    // Event listener for mouse button down
    function handleMouseDown(e) {
      if (e.button === 0) {
        isDragging = true;
        handleMouseMove(e);
        response.clicked = true;
        var timestamp = performance.now();
        response.timestamps.clicks.push(timestamp);

        // Record the click location and proportions
        response.locations.clicks.push({
          x: e.clientX,
          y: e.clientY,
          proportions: proportions // Use the updated proportions array
        });
      }
    }

    // Event listener for mouse button up
    function handleMouseUp(e) {
      if (e.button === 0) {
        isDragging = false;
      }
    }

    // Add event listeners
    triangle.addEventListener('mousedown', handleMouseDown);
    triangle.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // Function to end the trial
    var end_trial = function() {
      // Remove event listeners
      triangle.removeEventListener('mousedown', handleMouseDown);
      triangle.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

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
    continueButton.addEventListener('click', function() {
      end_trial();
    });
  };

  // Helper functions
  function getImagePosition(index) {
    switch (index) {
      case 0:
        return 'top: 0; left: 0; transform: translate(-50%, -150%);';
      case 1:
        return 'top: 0; right: 0; transform: translate(50%, -150%);';
      case 2:
        return 'bottom: 0; left: 50%; transform: translate(-50%, 150%);';
      default:
        return '';
    }
  }

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

  function getDefaultProportion(index) {
    switch (index) {
      case 0:
        return 33;
      case 1:
        return 33;
      case 2:
        return 34;
      default:
        return 0;
    }
  }

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

  return plugin;
})();