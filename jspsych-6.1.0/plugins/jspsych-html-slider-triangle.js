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
      }
    }
  };

  plugin.trial = function(display_element, trial) {
    var html = `
      <div id="jspsych-html-slider-triangle-wrapper" style="position: relative; width: ${trial.slider_width}px; height: ${trial.slider_height}px;">
        <div id="jspsych-html-slider-triangle-stimulus" style="position: relative; width: 100%; height: 100%;">
          <img src="${trial.stimulus_left}" style="position: absolute; bottom: 0; left: 0; width: ${trial.stimulus_height}px; height: ${trial.stimulus_height}px;"/>
          <img src="${trial.stimulus_right}" style="position: absolute; bottom: 0; right: 0; width: ${trial.stimulus_height}px; height: ${trial.stimulus_height}px;"/>
          <img src="${trial.stimulus_top}" style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: ${trial.stimulus_height}px; height: ${trial.stimulus_height}px;"/>
          <div id="jspsych-html-slider-triangle" style="position: absolute; top: ${trial.stimulus_height}px; left: 0; width: 100%; height: calc(100% - ${trial.stimulus_height}px); clip-path: polygon(50% 0%, 0% 100%, 100% 100%); background-color: #ddd;"></div>
          <div id="jspsych-html-slider-triangle-handle" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 20px; height: 20px; background-color: #333; border-radius: 50%; cursor: pointer;"></div>
        </div>
        <div id="jspsych-html-slider-triangle-labels" style="position: absolute; top: calc(100% + 10px); left: 0; width: 100%; display: flex; justify-content: space-between;">
          ${trial.labels.map(label => `<div style="text-align: center;">${label}</div>`).join('')}
        </div>
      </div>
    `;

    if (trial.prompt !== null) {
      html = `<div>${trial.prompt}</div>` + html;
    }

    display_element.innerHTML = html;

    var triangle = display_element.querySelector('#jspsych-html-slider-triangle');
    var handle = display_element.querySelector('#jspsych-html-slider-triangle-handle');
    var labels = display_element.querySelectorAll('#jspsych-html-slider-triangle-labels div');

    var triangleRect = triangle.getBoundingClientRect();
    var handleRect = handle.getBoundingClientRect();

    var isDragging = false;
    var proportions = {
      left: 33,
      right: 33,
      top: 34
    };

    function updateHandlePosition(x, y) {
      handle.style.left = `${x}px`;
      handle.style.top = `${y}px`;
    }

    function updateProportions(x, y) {
      var left = x / triangleRect.width;
      var right = 1 - left;
      var top = 1 - (y / triangleRect.height);

      var sum = left + right + top;

      proportions.left = Math.round((left / sum) * 100);
      proportions.right = Math.round((right / sum) * 100);
      proportions.top = Math.round((top / sum) * 100);

      labels[0].textContent = `${proportions.left}%`;
      labels[1].textContent = `${proportions.right}%`;
      labels[2].textContent = `${proportions.top}%`;
    }

    function handleMouseMove(e) {
      if (!isDragging) return;

      var x = e.clientX - triangleRect.left - handleRect.width / 2;
      var y = e.clientY - triangleRect.top - handleRect.height / 2;

      if (x < 0) x = 0;
      if (x > triangleRect.width - handleRect.width) x = triangleRect.width - handleRect.width;
      if (y < 0) y = 0;
      if (y > triangleRect.height - handleRect.height) y = triangleRect.height - handleRect.height;

      updateHandlePosition(x, y);
      updateProportions(x + handleRect.width / 2, y + handleRect.height / 2);
    }

    function handleMouseDown(e) {
      isDragging = true;
      handleMouseMove(e);
    }

    function handleMouseUp() {
      isDragging = false;
    }

    triangle.addEventListener('click', function(e) {
      var x = e.clientX - triangleRect.left - handleRect.width / 2;
      var y = e.clientY - triangleRect.top - handleRect.height / 2;

      updateHandlePosition(x, y);
      updateProportions(x + handleRect.width / 2, y + handleRect.height / 2);
    });

    handle.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    var end_trial = function() {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      var trial_data = {
        proportions: proportions
      };

      display_element.innerHTML = '';
      jsPsych.finishTrial(trial_data);
    };

    if (trial.require_movement) {
      handle.addEventListener('mousedown', function() {
        document.getElementById('jspsych-html-slider-triangle-response').disabled = false;
      });
    }

    display_element.querySelector('#jspsych-html-slider-triangle-next').addEventListener('click', function() {
      end_trial();
    });

    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-html-slider-triangle-stimulus').style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }

    var trial_duration = trial.trial_duration;
    if (trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial_duration);
    }
  };

  return plugin;
})();