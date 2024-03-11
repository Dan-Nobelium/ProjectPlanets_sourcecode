
//3d slider, sawpping to mouse

jsPsych.plugins["jspsych-triangle-slider"] = (function() {
  var plugin = {};

  plugin.info = {
    name: "jspsych-html-slider-3items",
    description: "A custom plugin for creating a 3-item rating task with a draggable dot on a triangular area.",
    parameters: {
      left_stimulus: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Left stimulus",
        default: undefined,
        description: "Path to the image file for the left item.",
      },
      middle_stimulus: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Middle stimulus",
        default: undefined,
        description: "Path to the image file for the middle item.",
      },
      right_stimulus: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Right stimulus",
        default: undefined,
        description: "Path to the image file for the right item.",
      },
      stimulus_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Stimulus Height",
        default: null,
        description: "Height of the stimuli in pixels.",
      },
      stimulus_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Stimulus Width",
        default: null,
        description: "Width of the stimuli in pixels.",
      },
      maintain_aspect_ratio: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: "Maintain Aspect Ratio",
        default: true,
        description: "Whether to maintain the aspect ratio after setting width or height.",
      },
      min: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Minimum Value",
        default: 0,
        description: "Sets the minimum value of the slider.",
      },
      max: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Maximum Value",
        default: 100,
        description: "Sets the maximum value of the slider.",
      },
      start: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Starting Point",
        default: 50,
        description: "Sets the starting point of the draggable dot.",
      },
      step: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Step Size",
        default: 1,
        description: "Sets the step size of the draggable dot.",
      },
      labels: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: "Slider Labels",
        default: [],
        array: true,
        description: "Labels for the slider positions.",
      },
      slider_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Slider Width",
        default: null,
        description: "Width of the slider in pixels.",
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Submit Button Label",
        default: "Continue",
        description: "Label for the submit button.",
      },
      require_movement: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: "Requires Movement",
        default: true,
        description: "If enabled, requires the participant to move the dot before submitting.",
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Prompt Text",
        default: "null",
        description: "Text displayed at the beginning of the trial.",
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Stimulus Visible Duration",
        default: 1000,
        description: "Duration (in seconds) the stimuli are visible.",
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Total Trial Duration",
        default: 100000,
        description: "Duration (in seconds) the trial lasts.",
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: "Response Terminates Trial",
        default: false,
        description: "Determines if a response triggers the end of the trial.",
      },
    },
  };

  plugin.trial = function(display_element, trial) {

    
console.log('plugin up')

      // display stimulus
      var html = '<div id="jspsych-image-mouseclick-response-stimulus">' 

    const containerDiv = document.createElement('div');
    containerDiv.setAttribute('id', 'container');
    display_element.appendChild(containerDiv);

    const triangleDiv = document.createElement('div');
    triangleDiv.setAttribute('id', 'x_triangle');
    containerDiv.appendChild(triangleDiv);

    const nodeDiv = document.createElement('div');
    nodeDiv.setAttribute('id', 'x_node');
    triangleDiv.appendChild(nodeDiv);

    const inputs = Array.from(document.getElementsByTagName('INPUT'));
    const formFields = [...inputs];

    const nwidth = nodeDiv.clientWidth / 2;
    const nheight = nodeDiv.clientHeight / 2;
    const width = triangleDiv.clientWidth;
    const height = triangleDiv.clientHeight;

    const initialY = height / 100 * (100 - trial.slider_values[0]) + nheight;
    const initialX = width / 100 * (100 - trial.slider_values[1]) - nwidth;

    let interval;
    let uielem;

    const formatter = Intl.NumberFormat("en");

    formFields.forEach(function(elem, idx) {
      elem.value = formatter.format(trial.slider_values[idx]);
    });

    triangleDiv.onclick = click;
    nodeDiv.ondragstart = dragStart;
    nodeDiv.ondragend = dragEnd;

    function click(event) {
      const rect = event.target.getBoundingClientRect();
      const xy = calcXY(event.clientX - rect.left, event.clientY - rect.top);
      nodeDiv.style.left = `${xy.left - nwidth}px`;
      nodeDiv.style.top = `${xy.top + nwidth}px`;
      calcDistance(xy.left - nwidth, xy.top + nwidth);
    }

    function dragStart(event) {
      uielem = event;
      interval = setInterval(function() {
        calcDistance(uielem.clientX, uielem.clientY);
      }, 50);
    }

    function dragEnd(event) {
      clearInterval(interval);
      calcDistance(event.clientX, event.clientY);

      const values = [];
      formFields.forEach(function(elem) {
        values.push(parseFloat(elem.value));
      });

      trial_data = {
        left_weight: values[0],
        mid_weight: values[1],
        right_weight: values[2]
      };

      jsPsych.finishTrial(trial_data);
    }

    function calcDistance(x, y) {
      x += nwidth;
      y -= nheight;
      const pixels = [
        Math.sqrt(Math.pow(Math.abs(x - width / 2), 2) + Math.pow(y, 2)),
        Math.sqrt(Math.pow(x, 2) + Math.pow(height - y, 2)),
        Math.sqrt(Math.pow(width - x, 2) + Math.pow(height - y, 2))];
      const sum = pixels[0] + pixels[1] + pixels[2];

      formFields.forEach(function(elem, index) {
        const percent = ((100 / sum * pixels[index]).toFixed(2)).toString().slice(0,-1);
        elem.value = percent;
      });
    }

    function calcXY(left, top) {
      let x = left + nwidth,
        y = top + nheight,
        difference = Math.abs(x - width / 2),
        min_y = height * (difference / (width / 2));

      if (y < min_y) y = min_y;
      if (x < 0) x = 0;
      if (y < 0) y = 0;
      if (x > width) x = width;
      if (y > height) y = height;
        console.log(y);
        console.log(x);

      return {
        top: y,
        left: x
      };
    }
  };
  
  console.log("slider-3items loaded");
  return plugin;
})();