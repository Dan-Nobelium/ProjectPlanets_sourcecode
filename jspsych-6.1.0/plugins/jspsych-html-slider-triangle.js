jsPsych.plugins['html-slider-triangle'] = (function() {
  var plugin = {};

  plugin.info = {
    name: 'html-slider-triangle',
    description: 'A plugin for creating a 3D triangle slider',
    parameters: {
      stimulus_top: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Top stimulus',
        default: undefined,
        description: 'Stimulus image at the top of the triangle'
      },
      stimulus_left: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Left stimulus',
        default: undefined,
        description: 'Stimulus image on the left of the triangle'
      },
      stimulus_right: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Right stimulus',
        default: undefined,
        description: 'Stimulus image on the right of the triangle'
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
      },
    }
  };

  

  plugin.trial = function(display_element, trial) {
    var proportions = {
      left: 33,
      right: 33,
      top: 34
    };

    console.log(planetColors);
    
    var colors = trial.colors || {
      left: planetColors[0],
      right: planetColors[1],
      top: planetColors[2]
    };


    var html = `
      <div id="jspsych-html-slider-triangle-wrapper" style="position: relative; width: ${trial.slider_width}px; height: ${trial.slider_height}px;">
        <div id="jspsych-html-slider-triangle-stimulus" style="position: relative; width: 100%; height: 100%;">
          <!-- Planet images -->
          <img src="${trial.stimulus_left}" style="position: absolute; top: 0; left: 0; transform: translate(-50%, -150%); width: ${trial.stimulus_height}px; height: ${trial.stimulus_height}px;"/>
          <img src="${trial.stimulus_right}" style="position: absolute; top: 0; right: 0; transform: translate(50%, -150%); width: ${trial.stimulus_height}px; height: ${trial.stimulus_height}px;"/>
          <img src="${trial.stimulus_top}" style="position: absolute; bottom: 0; left: 50%; transform: translate(-50%, 150%); width: ${trial.stimulus_height}px; height: ${trial.stimulus_height}px;"/>

          <!-- Planet labels -->
          <div id="planet-a-label" style="position: absolute; top: 0; left: 0; transform: translate(-50%, -100%);">Planet A (${proportions.left}%)</div>
          <div id="planet-b-label" style="position: absolute; top: 0; right: 0; transform: translate(50%, -100%);">Planet B (${proportions.right}%)</div>
          <div id="planet-c-label" style="position: absolute; bottom: 0; left: 50%; transform: translate(-50%, 100%);">Planet C (${proportions.top}%)</div>

          <!-- Triangle -->
          <div id="jspsych-html-slider-triangle" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; clip-path: polygon(50% 100%, 0 0, 100% 0); background-color: #ddd;"></div>

          <!-- Handle -->
          <div id="jspsych-html-slider-triangle-handle" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 20px; height: 20px; background-color: #333; border-radius: 50%; cursor: pointer;"></div>
        </div>

        <!-- Pie chart -->
        <div id="jspsych-html-slider-triangle-pie-chart" style="position: absolute; top: 50%; right: 20px; transform: translateY(-50%); width: 150px; height: 150px; border-radius: 50%; background-image: conic-gradient(
          red 0 ${proportions.right}%,
          green 0 ${proportions.right + proportions.top}%,
          blue 0 100%
        );"></div>
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
    var planetALabel = display_element.querySelector('#planet-a-label');
    var planetBLabel = display_element.querySelector('#planet-b-label');
    var planetCLabel = display_element.querySelector('#planet-c-label');

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
      colors: colors,
    };

    // Record the start timestamp
    response.timestamps.start = performance.now();


    // Function to update the handle position
    function updateHandlePosition(x, y) {
      var triangleRect = triangle.getBoundingClientRect();

      // Calculate the normalized coordinates within the triangle
      var a = Math.max(0, Math.min(1, y / triangleRect.height));
      var b = Math.max(0, Math.min(1, (triangleRect.width - x) / triangleRect.width));
      var c = 1 - a - b;

      // Clamp the values to ensure they are within the valid range
      a = Math.max(0, Math.min(1, a));
      b = Math.max(0, Math.min(1 - a, b));
      c = 1 - a - b;

      // Update the handle position
      handle.style.left = `${(1 - b) * 100}%`;
      handle.style.top = `${a * 100}%`;

      // Update the proportions
      updateProportions(a, b, c);
    }

    // Function to update the proportions and pie chart
    function updateProportions(a, b, c) {
      proportions.left = Math.round(a * 100);
      proportions.right = Math.round(b * 100);
      proportions.top = Math.round(c * 100);

      // Update the labels with the new proportions
      planetALabel.textContent = `Planet A (${proportions.left}%)`;
      planetBLabel.textContent = `Planet B (${proportions.right}%)`;
      planetCLabel.textContent = `Planet C (${proportions.top}%)`;

      // Update the pie chart
      pieChart.style.backgroundImage = `conic-gradient(
        red 0 ${proportions.right}%,
        green 0 ${proportions.right + proportions.top}%,
        blue 0 100%
      )`;
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
          proportions: {
            left: proportions.left,
            right: proportions.right,
            top: proportions.top
          }
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

return plugin;
})();