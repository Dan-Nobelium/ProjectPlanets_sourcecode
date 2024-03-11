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
        default: true,
        description: 'If true, the participant will have to move the slider before continuing.'
      }
    }
  };

  

  plugin.trial = function(display_element, trial) {
    var proportions = {
      left: 33,
      right: 33,
      top: 34
    };

    var html = `
      <div id="jspsych-html-slider-triangle-wrapper" style="position: relative; width: ${trial.slider_width}px; height: ${trial.slider_height}px;">
        <div id="jspsych-html-slider-triangle-stimulus" style="position: relative; width: 100%; height: 100%;">
          <!-- Planet images -->
          <img src="${trial.stimulus_left}" style="position: absolute; top: 0; left: 0; transform: translate(-50%, -120%); width: ${trial.stimulus_height}px; height: ${trial.stimulus_height}px;"/>
          <img src="${trial.stimulus_right}" style="position: absolute; top: 0; right: 0; transform: translate(50%, -120%); width: ${trial.stimulus_height}px; height: ${trial.stimulus_height}px;"/>
          <img src="${trial.stimulus_top}" style="position: absolute; bottom: 0; left: 50%; transform: translate(-50%, 120%); width: ${trial.stimulus_height}px; height: ${trial.stimulus_height}px;"/>

          <!-- Planet labels -->
          <div style="position: absolute; top: 0; left: 0; transform: translate(-50%, -70%);">Planet A (${proportions.left}%)</div>
          <div style="position: absolute; top: 0; right: 0; transform: translate(50%, -70%);">Planet B (${proportions.right}%)</div>
          <div style="position: absolute; bottom: 0; left: 50%; transform: translate(-50%, 70%);">Planet C (${proportions.top}%)</div>

          <!-- Triangle -->
          <div id="jspsych-html-slider-triangle" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; clip-path: polygon(50% 100%, 0 0, 100% 0); background-color: #ddd;"></div>

          <!-- Handle -->
          <div id="jspsych-html-slider-triangle-handle" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 20px; height: 20px; background-color: #333; border-radius: 50%; cursor: pointer;"></div>
        </div>

        <!-- Pie chart -->
        <div id="jspsych-html-slider-triangle-pie-chart" style="position: absolute; top: 50%; right: 20px; transform: translateY(-50%); width: 150px; height: 150px; border-radius: 50%; background-image: conic-gradient(
          red 0 ${proportions.left}%,
          green 0 ${proportions.left + proportions.right}%,
          blue 0 100%
        );"></div>
      </div>

      <!-- Continue button -->
      <button id="jspsych-html-slider-triangle-continue" class="jspsych-btn" style="margin-top: 20px;">Continue</button>
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

    // Function to update the handle position
    function updateHandlePosition(x, y) {
      var triangleRect = triangle.getBoundingClientRect();
      var handleRect = handle.getBoundingClientRect();

      // Calculate the barycentric coordinates of the point
      var s = (x - triangleRect.left) / triangleRect.width;
      var t = 1 - (y - triangleRect.top) / triangleRect.height;

      // Check if the point is inside the triangle
      if (s >= 0 && t >= 0 && s + t <= 1) {
        handle.style.left = `${s * 100}%`;
        handle.style.top = `${(1 - t) * 100}%`;
        updateProportions(s * 100, (1 - s - t) * 100, t * 100);
      }
    }

    // Function to update the proportions and pie chart
    function updateProportions(left, right, top) {
      proportions.left = Math.round(left);
      proportions.right = Math.round(right);
      proportions.top = Math.round(top);

      // Update the labels with the new proportions
      display_element.querySelector('#jspsych-html-slider-triangle-stimulus > div:nth-child(4)').textContent = `Planet A (${proportions.left}%)`;
      display_element.querySelector('#jspsych-html-slider-triangle-stimulus > div:nth-child(5)').textContent = `Planet B (${proportions.right}%)`;
      display_element.querySelector('#jspsych-html-slider-triangle-stimulus > div:nth-child(6)').textContent = `Planet C (${proportions.top}%)`;

      // Update the pie chart
      pieChart.style.backgroundImage = `conic-gradient(
        red 0 ${proportions.left}%,
        green 0 ${proportions.left + proportions.right}%,
        blue 0 100%
      )`;
    }

    // Event listener for mouse movement
    function handleMouseMove(e) {
      if (!isDragging) return;

      var triangleRect = triangle.getBoundingClientRect();
      var x = e.clientX;
      var y = e.clientY;

      updateHandlePosition(x, y);
    }

    // Event listener for mouse button down
    function handleMouseDown(e) {
      isDragging = true;
      handleMouseMove(e);
    }

    // Event listener for mouse button up
    function handleMouseUp() {
      isDragging = false;
    }

    // Event listener for clicking on the triangle
    triangle.addEventListener('click', function(e) {
      var triangleRect = triangle.getBoundingClientRect();
      var x = e.clientX;
      var y = e.clientY;

      updateHandlePosition(x, y);
    });

    // Add event listeners
    handle.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // Function to end the trial
    var end_trial = function() {
      // Remove event listeners
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      // Prepare the trial data
      var trial_data = {
        proportions: proportions
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