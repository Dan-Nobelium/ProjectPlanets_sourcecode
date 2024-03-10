jsPsych.plugins["jspsych-html-slider-3items"] = (function() {

    var plugin = {};
  
    plugin.info = {
      name: "jspsych-html-slider-3items",
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
  
      const $container = $('<div/>', {'id': 'container'}).appendTo(display_element);
      const $triangle = $('<div/>', {'id': 'x_triangle'}).appendTo($container);
      const $node = $('<div/>', {'id': 'x_node'}).appendTo($triangle);
      const $formFields = $([]).add($('#x_inputtop')).add($('#x_inputleft')).add($('#x_inputright'));
      
      let nwidth = parseInt($node.outerWidth() / 2);
      let nheight = parseInt($node.outerHeight() / 2);
      let width = parseFloat($triangle.outerWidth());
      let height = parseFloat($triangle.outerHeight());
      let initialY = height / 100 * (100 - trial.slider_values[0]) + nheight;
      let initialX = width / 100 * (100 - trial.slider_values[1]) - nwidth;
      let interval;
      let uielem;
  
      const formatter = Intl.NumberFormat("en");
  
      $formFields.each(function(i, elem) {
        $(elem).val(formatter.format(trial.slider_values[i]));
      });
  
      $triangle.click(click);
      $node.draggable({
        scroll: false,
        drag: drag,
        start: start,
        stop: stop
      });
  
      function click(e) {
        const xy = calcXY(e.offsetX, e.offsetY);
        $node.css({
          left: xy.left - nwidth,
          top: xy.top + nwidth
        });
        calcDistance(xy.left - nwidth, xy.top + nwidth);
      }
  
      function drag(e, ui) {
        const xy = calcXY(ui.position.left, ui.position.top);
        ui.position.top = xy.top;
        ui.position.left = xy.left;
        uielem = ui;
      }
  
      function start(e, ui) {
        uielem = ui;
        interval = setInterval(function() {
          calcDistance(uielem.position.left, uielem.position.top);
        }, 50);
      }
  
      function stop(e, ui) {
        clearInterval(interval);
        calcDistance(ui.position.left, ui.position.top);
        
        const values = [];
        $formFields.each(function(i, elem) {
          values.push(parseFloat($(elem).val()));
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
  
        $formFields.each(function(index) {
          const percent = ((100 / sum * pixels[index]).toFixed(2)).toString().slice(0,-1);
          $(this).val(percent);
        });
      }
  
      function calcXY(left, top) {
        let x = left + nwidth,
          y = top - nheight,
          difference = Math.abs(x - width / 2),
          min_y = height * (difference / (width / 2));
  
        if (y < min_y) y = min_y;
        if (x < 0) x = 0;
        if (y < 0) y = 0;
        if (x > width) x = width;
        if (y > height) y = height;
  
        return {
          top: y + nheight,
          left: x - nwidth
        };
      }
    };
  
    return plugin;
  })();