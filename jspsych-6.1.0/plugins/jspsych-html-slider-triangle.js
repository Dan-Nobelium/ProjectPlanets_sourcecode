//visually broken by barcentric
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

  // Get image position for a given index (updated for equilateral triangle)
  function getImagePosition(index, sliderWidth, sliderHeight, stimulusHeight) {
    var angle = (index * 120 + 90) * Math.PI / 180;
    var radius = sliderWidth / 2 - stimulusHeight / 2;
    var x = sliderWidth / 2 + radius * Math.cos(angle);
    var y = sliderHeight - radius * Math.sin(angle);

    return `top: ${y}px; left: ${x}px; transform: translate(-50%, -50%);`;
  }

  // Get label position for a given index (updated for equilateral triangle)
  function getLabelPosition(index, sliderWidth, sliderHeight) {
    var angle = (index * 120 + 90) * Math.PI / 180;
    var radius = sliderWidth / 2 * 0.8;
    var x = sliderWidth / 2 + radius * Math.cos(angle);
    var y = sliderHeight - radius * Math.sin(angle);

    return `top: ${y}px; left: ${x}px; transform: translate(-50%, -50%);`;
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

  // Get barycentric coordinates of a point inside the triangle (updated to handle non-equilateral triangles)
  function getBarycentricCoordinates(x, y, x1, y1, x2, y2, x3, y3) {
    var detT = (y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3);
    var lambda1 = ((y2 - y3) * (x - x3) + (x3 - x2) * (y - y3)) / detT;
    var lambda2 = ((y3 - y1) * (x - x3) + (x1 - x3) * (y - y3)) / detT;
    var lambda3 = 1 - lambda1 - lambda2;
    return [lambda1, lambda2, lambda3];
  }

  // Check if a point is inside the triangle
  function isInsideTriangle(x, y, x1, y1, x2, y2, x3, y3) {
    var [lambda1, lambda2, lambda3] = getBarycentricCoordinates(x, y, x1, y1, x2, y2, x3, y3);
    return lambda1 >= 0 && lambda2 >= 0 && lambda3 >= 0;
  }

  // Trial function
  // ==============

  plugin.trial = function(display_element, trial) {
    // Parameter validation and error handling
    if (!Array.isArray(trial.stimulus_all) || trial.stimulus_all.length !== 3) {
      console.error('Error: stimulus_all should be an array of 3 image paths.');
      return;
    }

    if (typeof trial.planetColors !== 'object' || Object.keys(trial.planetColors).length !== 3) {
      console.error('Error: planetColors should be an object with 3 key-value pairs.');
      return;
    }

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
            <div id="planet-${index}-label" style="position: absolute; ${getLabelPosition(index, trial.slider_width, trial.slider_height)}; color: ${trial.planetColors[planet]};">Planet ${String.fromCharCode(65 + index)} (${getDefaultProportion(index)}%)</div>
          `).join('')}

          <!-- Equilateral Triangle -->
          <div id="jspsych-html-slider-triangle" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: ${trial.slider_width}px; height: ${trial.slider_height}px; clip-path: polygon(50% 0%, 0% 100%, 100% 100%); background-color: #ddd;" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="33" aria-label="Triangle Slider" tabindex="0"></div>

          <!-- Handle -->
          <div id="jspsych-html-slider-triangle-handle" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 20px; height: 20px; background-color: #333; border-radius: 50%; cursor: pointer;"></div>
        </div>

        <!-- Pie chart -->
        <div id="jspsych-html-slider-triangle-pie-chart" style="position: absolute; top: 50%; right: 20px; transform: translateY(-50%); width: 150px; height: 150px; border-radius: 50%; background-image: ${getPieChartGradient(trial.planetColors, planetOrder)}">
          <!-- Pie chart labels or legend -->
          ${planetOrder.map((planet, index) => `
            <div style="position: absolute; top: ${index * 33}%; left: 0; color: ${trial.planetColors[planet]};">Planet ${String.fromCharCode(65 + index)}</div>
          `).join('')}
        </div>
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
    var topLeftCorner = { x: triangleRect.left, y: triangleRect.top };
    var topRightCorner = { x: triangleRect.right, y: triangleRect.top };
    var bottomCorner = { x: triangleRect.left + triangleRect.width / 2, y: triangleRect.top + triangleRect.height };

    // Update handle position and proportions based on mouse position
    function updateHandlePosition(mouseX, mouseY) {
      var x = mouseX - triangleRect.left;
      var y = mouseY - triangleRect.top;

      handle.style.left = `${x}px`;
      handle.style.top = `${y}px`;

      proportions = updateProportions(x, y);
    }

    // Update proportions and labels (updated to handle mouse outside the triangle)
    function updateProportions(x, y) {
      var x1 = trial.slider_width / 2;
      var y1 = 0;
      var x2 = 0;
      var y2 = trial.slider_height;
      var x3 = trial.slider_width;
      var y3 = trial.slider_height;

      if (isInsideTriangle(x, y, x1, y1, x2, y2, x3, y3)) {
        var barycentricCoords = getBarycentricCoordinates(x, y, x1, y1, x2, y2, x3, y3);
        var topProportion = barycentricCoords[0] * 100;
        var leftProportion = barycentricCoords[1] * 100;
        var rightProportion = barycentricCoords[2] * 100;

        proportions = [topProportion, leftProportion, rightProportion];

        // Normalize proportions to sum up to 100%
        var sum = proportions.reduce((a, b) => a + b, 0);
        proportions = proportions.map(proportion => (proportion / sum) * 100);
      } else {
        // Mouse is outside the triangle, set default proportions
        proportions = [33, 33, 34];
      }

      // Update the labels with the new proportions
      planetOrder.forEach((planet, index) => {
        var label = display_element.querySelector(`#planet-${index}-label`);
        label.textContent = `Planet ${String.fromCharCode(65 + index)} (${Math.round(proportions[index])}%)`;
      });

      // Update the pie chart rendering
      pieChart.style.backgroundImage = getPieChartGradient(trial.planetColors, planetOrder, proportions);

      // Return the updated proportions array
      return proportions;
    }

    // Event listeners for window resizing
    function handleResize() {
      // Update triangle dimensions and positions
      triangleRect = triangle.getBoundingClientRect();
      topLeftCorner = { x: triangleRect.left, y: triangleRect.top };
      topRightCorner = { x: triangleRect.right, y: triangleRect.top };
      bottomCorner = { x: triangleRect.left + triangleRect.width / 2, y: triangleRect.top + triangleRect.height };
    }

    window.addEventListener('resize', handleResize);

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

    // Touch event handling
    function handleTouchMove(event) {
      if (event.touches.length === 1) {
        var touch = event.touches[0];
        var mouseX = touch.clientX;
        var mouseY = touch.clientY;
        updateHandlePosition(mouseX, mouseY);
      }
    }

    function handleTouchStart(event) {
      if (event.touches.length === 1) {
        var touch = event.touches[0];
        var mouseX = touch.clientX;
        var mouseY = touch.clientY;
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
    }

    function handleTouchEnd(event) {
      isDragging = false;
    }

    triangle.addEventListener('touchmove', handleTouchMove);
    triangle.addEventListener('touchstart', handleTouchStart);
    triangle.addEventListener('touchend', handleTouchEnd);

    // Continue button visibility
    function updateContinueButtonVisibility() {
      if (response.clicked) {
        continueButton.style.display = 'block';
      } else {
        continueButton.style.display = 'none';
      }
    }

    triangle.addEventListener('mousedown', updateContinueButtonVisibility);
    triangle.addEventListener('touchstart', updateContinueButtonVisibility);

    // Keyboard navigation support
    function handleKeyDown(event) {
      var key = event.key;
      var x = response.locations.clicks[response.locations.clicks.length - 1].x;
      var y = response.locations.clicks[response.locations.clicks.length - 1].y;

      switch (key) {
        case 'ArrowUp':
          y -= 10;
          break;
        case 'ArrowDown':
          y += 10;
          break;
        case 'ArrowLeft':
          x -= 10;
          break;
        case 'ArrowRight':
          x += 10;
          break;
        default:
          return;
      }

      updateHandlePosition(x, y);
      event.preventDefault();
    }

    document.addEventListener('keydown', handleKeyDown);

    // Function to end the trial
    var end_trial = function() {
      // Remove event listeners
      triangle.removeEventListener('mousemove', updateHandlePosition);
      triangle.removeEventListener('mousedown', updateHandlePosition);
      document.removeEventListener('mouseup', updateHandlePosition);
      triangle.removeEventListener('mouseleave', updateHandlePosition);
      triangle.removeEventListener('touchmove', handleTouchMove);
      triangle.removeEventListener('touchstart', handleTouchStart);
      triangle.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);

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