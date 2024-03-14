jsPsych.plugins['html-slider-triangle'] = (function() {
  // This is an anonymous function that returns an object representing the plugin
  var plugin = {};

  // This object contains metadata about the plugin
  plugin.info = {
    name: 'html-slider-triangle', // Plugin name
    description: 'A plugin for creating a 3D triangle slider', // Plugin description
    parameters: {
      // Plugin parameters
      stimulus_all: {
        type: jsPsych.plugins.parameterType.ARRAY, // Parameter type is an array
        pretty_name: 'Stimulus all', // User-friendly name for the parameter
        default: [], // Default value is an empty array
        description: 'Array of stimulus image paths' // Parameter description
      },
      planetColors: {
        type: jsPsych.plugins.parameterType.OBJECT, // Parameter type is an object
        pretty_name: 'Planet colors', // User-friendly name for the parameter
        default: null, // Default value is null
        description: 'Object mapping image paths to their respective colors' // Parameter description
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING, // Parameter type is a string
        pretty_name: 'Prompt', // User-friendly name for the parameter
        default: null, // Default value is null
        description: 'Any content here will be displayed above the triangle slider.' // Parameter description
      },
      slider_width: {
        type: jsPsych.plugins.parameterType.INT, // Parameter type is an integer
        pretty_name: 'Slider width', // User-friendly name for the parameter
        default: 500, // Default value is 500
        description: 'Width of the triangle slider in pixels.' // Parameter description
      },
      slider_height: {
        type: jsPsych.plugins.parameterType.INT, // Parameter type is an integer
        pretty_name: 'Slider height', // User-friendly name for the parameter
        default: 400, // Default value is 400
        description: 'Height of the triangle slider in pixels.' // Parameter description
      },
      stimulus_height: {
        type: jsPsych.plugins.parameterType.INT, // Parameter type is an integer
        pretty_name: 'Stimulus height', // User-friendly name for the parameter
        default: 100, // Default value is 100
        description: 'Height of the stimulus images in pixels.' // Parameter description
      },
      labels: {
        type: jsPsych.plugins.parameterType.STRING, // Parameter type is a string
        pretty_name: 'Labels', // User-friendly name for the parameter
        default: [], // Default value is an empty array
        array: true, // This parameter is an array of strings
        description: 'Labels to display on the triangle slider.' // Parameter description
      },
      require_movement: {
        type: jsPsych.plugins.parameterType.BOOL, // Parameter type is a boolean
        pretty_name: 'Require movement', // User-friendly name for the parameter
        default: false, // Default value is false
        description: 'If true, the participant will have to move the slider before continuing.' // Parameter description
      }
    }
  };

  // Helper functions
  // =================

  // Calculate distance between two points
  function dist(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }

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
    // Determine the order of planets
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

    // Event handlers
    // ==============

    // Update handle position and proportions based on mouse position
    function updateHandlePosition(x, y) {
      var triangleRect = triangle.getBoundingClientRect();
      var triangleHeight = triangleRect.height;
      var triangleWidth = triangleRect.width;
    
      // Calculate the normalized coordinates within the triangle
      var b = x / (triangleWidth / 2);
      var a = (triangleHeight - y) / triangleHeight;
      var c = 1 - Math.max(a, b);
    
      // Check if the mouse is within the triangle
      if (a >= 0 && b >= 0 && c >= 0) {
        // Ensure non-negative proportions
        a = Math.max(0, a);
        b = Math.max(0, b);
        c = Math.max(0, c);
    
        // Normalize the proportions to sum up to 1
        var sum = a + b + c;
        a /= sum;
        b /= sum;
        c /= sum;
    
        // Update the handle position
        handle.style.left = `${b * 100}%`;
        handle.style.top = `${(1 - a) * 100}%`;
    
        // Update the proportions calculation and store the returned value
        proportions = updateProportions(a, b, c);
      }
    }
    // Update proportions and labels
    function updateProportions(a, b, c) {
      proportions = [a, b, c].map(value => Math.round(value * 100));

      // Update the labels with the new proportions
      planetOrder.forEach((planet, index) => {
        var label = display_element.querySelector(`#planet-${index}-label`);
        label.textContent = `Planet ${String.fromCharCode(65 + index)} (${proportions[index]}%)`;
      });

      // Update the pie chart rendering
      pieChart.style.backgroundImage = getPieChartGradient(trial.planetColors, planetOrder, proportions);

      // Return the updated proportions array
      return proportions;
    }

    // Handle pointer down event
    function handlePointerDown(e) {
      isDragging = true;
      handlePointerMove(e);
      response.clicked = true;
      var timestamp = performance.now();
      response.timestamps.clicks.push(timestamp);

      // Record the click location and proportions
      response.locations.clicks.push({
        x: e.clientX,
        y: e.clientY,
        proportions: proportions
      });
    }

    // Handle pointer move event
    function handlePointerMove(e) {
      if (!isDragging) return;

      var triangleRect = triangle.getBoundingClientRect();
      var x = e.clientX - triangleRect.left;
      var y = e.clientY - triangleRect.top;

      updateHandlePosition(x, y);
    }

    // Handle pointer up event
    function handlePointerUp(e) {
      isDragging = false;
    }

    // Handle pointer cancel event (e.g., when the user drags outside the window)
    function handlePointerCancel(e) {
      isDragging = false;
    }

    // Event listeners for pointer events
    triangle.addEventListener('pointerdown', handlePointerDown);
    triangle.addEventListener('pointermove', handlePointerMove);
    triangle.addEventListener('pointerup', handlePointerUp);
    triangle.addEventListener('pointercancel', handlePointerCancel);

    // Function to end the trial
    var end_trial = function() {
      // Remove event listeners
      triangle.removeEventListener('pointerdown', handlePointerDown);
      triangle.removeEventListener('pointermove', handlePointerMove);
      triangle.removeEventListener('pointerup', handlePointerUp);
      triangle.removeEventListener('pointercancel', handlePointerCancel);

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