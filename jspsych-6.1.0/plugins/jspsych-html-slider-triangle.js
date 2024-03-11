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
      // Add other parameters as needed (e.g., stimulus dimensions, labels, prompt, etc.)
    }
  };

  plugin.trial = function(display_element, trial) {
    // Create the HTML for the triangle slider
    var html = `
      <div id="jspsych-html-slider-triangle-wrapper">
        <div id="triangle-container">
          <div id="triangle">
            <div id="slider-handle"></div>
          </div>
          <img src="${trial.stimulus_left}" class="stimulus-image left" alt="Left stimulus">
          <img src="${trial.stimulus_right}" class="stimulus-image right" alt="Right stimulus">
          <img src="${trial.stimulus_top}" class="stimulus-image top" alt="Top stimulus">
          <div id="proportion-left" class="proportion">33%</div>
          <div id="proportion-right" class="proportion">33%</div>
          <div id="proportion-top" class="proportion">34%</div>
        </div>
      </div>
    `;

    // Display the HTML
    display_element.innerHTML = html;

    // Get the necessary elements
    var triangle = display_element.querySelector('#triangle');
    var sliderHandle = display_element.querySelector('#slider-handle');
    var proportionLeft = display_element.querySelector('#proportion-left');
    var proportionRight = display_element.querySelector('#proportion-right');
    var proportionTop = display_element.querySelector('#proportion-top');

    // Variables to store the current proportions
    var proportions = {
      left: 33,
      right: 33,
      top: 34
    };

    // Function to handle the triangle slider interaction
    function handleTriangleSlider(e) {
      // Get the position of the mouse click relative to the triangle
      var trianglePosition = getTrianglePosition(e);

      // Update the position of the slider handle
      updateSliderHandle(trianglePosition);

      // Calculate the proportions for each stimulus based on the slider position
      proportions = calculateProportions(trianglePosition);

      // Update the displayed proportions
      updateProportionDisplay(proportions);
    }

    // Function to get the position of the mouse click relative to the triangle
    function getTrianglePosition(e) {
      var rect = triangle.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      return { x: x, y: y };
    }

    // Function to update the position of the slider handle
    function updateSliderHandle(position) {
      sliderHandle.style.left = position.x + 'px';
      sliderHandle.style.top = position.y + 'px';
    }

    // Function to calculate the proportions for each stimulus based on the slider position
    function calculateProportions(position) {
      var triangleWidth = triangle.offsetWidth;
      var triangleHeight = triangle.offsetHeight;

      var leftProportion = (triangleWidth - position.x) / triangleWidth * 100;
      var rightProportion = position.x / triangleWidth * 100;
      var topProportion = (triangleHeight - position.y) / triangleHeight * 100;

      var sum = leftProportion + rightProportion + topProportion;
      var normalizedLeft = (leftProportion / sum) * 100;
      var normalizedRight = (rightProportion / sum) * 100;
      var normalizedTop = (topProportion / sum) * 100;

      return {
        left: Math.round(normalizedLeft),
        right: Math.round(normalizedRight),
        top: Math.round(normalizedTop)
      };
    }

    // Function to update the displayed proportions
    function updateProportionDisplay(proportions) {
      proportionLeft.textContent = proportions.left + '%';
      proportionRight.textContent = proportions.right + '%';
      proportionTop.textContent = proportions.top + '%';
    }

    // Add event listener for the triangle slider interaction
    triangle.addEventListener('click', handleTriangleSlider);

    // Make the slider handle draggable
    sliderHandle.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);

    var isDragging = false;

    function startDragging(e) {
      isDragging = true;
    }

    function drag(e) {
      if (isDragging) {
        handleTriangleSlider(e);
      }
    }

    function stopDragging(e) {
      isDragging = false;
    }

    // Function to end the trial
    function endTrial() {
      // Prepare the trial data
      var trialData = {
        proportions: proportions,
        // Include other relevant data
      };

      // Clear the display
      display_element.innerHTML = '';

      // End the trial
      jsPsych.finishTrial(trialData);
    }

    // End the trial when a button is clicked
    var button = document.createElement('button');
    button.textContent = 'Submit';
    button.addEventListener('click', endTrial);
    display_element.appendChild(button);
  };

  return plugin;
})();