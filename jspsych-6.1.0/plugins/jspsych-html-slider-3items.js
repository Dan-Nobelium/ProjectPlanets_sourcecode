jsPsych.plugins["jspsych-html-slider-3items"] = (function() {

  var plugin = {};
  
  plugin.info = {
    name: "custom-html-slider-3items",
    parameters: {
      left_stimulus: {
        type: jsPsych.plugins.parameterType.STRING,
        default: undefined,
        description: "Path to the image file for the left item."
      },
      middle_stimulus: {
        type: jsPsych.plugins.parameterType.STRING,
        default: undefined,
        description: "Path to the image file for the middle item."
      },
      right_stimulus: {
        type: jsPsych.plugins.parameterType.STRING,
        default: undefined,
        description: "Path to the image file for the right item."
      },
      slider_values: {
        type: jsPsych.plugins.parameterType.ARRAY,
        items: [
          {type: jsPsych.plugins.parameterType.FLOAT},
          {type: jsPsych.plugins.parameterType.FLOAT},
          {type: jsPsych.plugins.parameterType.FLOAT}
        ],
        default: [33, 33, 34],
        description: "Values corresponding to the relative weight of the three slider positions."
      }
    }
  };

  plugin.trial = function(display_element, trial) {

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

      return {
        top: y,
        left: x
      };
    }
  };

  return plugin;
})();