// Define the valence-check-5 plugin
jsPsych.plugins['valence-check-5'] = (function () {
  var plugin = {};

  // Register preloads for images
  jsPsych.pluginAPI.registerPreload('valence-check-5', 'stimulus', 'image');

  plugin.info = {
    name: 'valence-check-5',
    description: '',
    parameters: {
      // Stimulus properties
      stimulus_0: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus 0',
        default: undefined,
        description: 'The first image to be displayed',
      },
      stim_text_0: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Stimulus text 0',
        default: null,
        description: 'Any content here will be displayed with stimulus 0.',
      },
      stimulus_1: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus 1',
        default: undefined,
        description: 'The second image to be displayed',
      },
      stim_text_1: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Stimulus text 1',
        default: null,
        description: 'Any content here will be displayed with stimulus 1.',
      },
      stimulus_2: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus 2',
        default: undefined,
        description: 'The third image to be displayed',
      },
      stim_text_2: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Stimulus text 2',
        default: null,
        description: 'Any content here will be displayed with stimulus 2.',
      },
      stimulus_3: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus 3',
        default: undefined,
        description: 'The forth image to be displayed',
      },
      stim_text_3: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Stimulus text 3',
        default: null,
        description: 'Any content here will be displayed with stimulus 3.',
      },
      stimulus_4: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus 4',
        default: undefined,
        description: 'The fifth image to be displayed',
      },
      stim_text_4: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Stimulus text 4',
        default: null,
        description: 'Any content here will be displayed with stimulus 4.',
      },

      // Visual representation settings
      stimulus_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Image height',
        default: null,
        description: 'Set the image height in pixels',
      },
      stimulus_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Image width',
        default: null,
        description: 'Set the image width in pixels',
      },
      maintain_aspect_ratio: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Maintain aspect ratio',
        default: true,
        description: 'Maintain the aspect ratio after setting width or height',
      },

      // Rating scale properties
      min: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Min slider',
        default: 0,
        description: 'Sets the minimum value of the slider.',
      },
      max: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Max slider',
        default: 100,
        description: 'Sets the maximum value of the slider',
      },
      start: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Slider starting value',
        default: 50,
        description: 'Sets the starting value of the slider',
      },
      step: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Step',
        default: 1,
        description: 'Sets the step of the slider',
      },
      labels: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Labels',
        default: [],
        array: true,
        description: 'Labels of the slider.',
      },
      slider_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Slider width',
        default: null,
        description: 'Width of the slider in pixels.',
      },

      // Buttons and timing
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default: 'Continue',
        array: false,
        description: 'Label of the button to advance.',
      },
      require_movement: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Require movement',
        default: false,
        description: 'If true, the participant will have to move the slider before continuing.',
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed at the top of the screen.',
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.',
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show the trial.',
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when user makes a response.',
      },
    },
  };

  plugin.trial = function (display_element, trial) {
    // Initialize variables
    var html = '<div id="jspsych-valence-check-5-wrapper" style="margin: 100px 0px;">';

    // Show prompt
    if (trial.prompt !== null) {
      html += trial.prompt + "<br><br><br>";
    }

    // Create stimuli and rating scales
    for (var i = 0; i < 5; ++i) {
      html += createRatingScale(i, trial);
    }

    // Close off wrapper div
    html += '</div>';

    // Inject created elements into DOM
    display_element.innerHTML = html;

    // Store initial positions of slider thumbs
    var sliderThumbPositions = [];
    for (var i = 0; i < 5; ++i) {
      sliderThumbPositions.push(document.getElementById('slider-thumb-' + i));
    }

    // Listeners for moving sliders
    for (var i = 0; i < 5; ++i) {
      sliderThumbPositions[i].addEventListener('mouseup', handleMouseUp);
      sliderThumbPositions[i].addEventListener('touchstop', handleTouchStop);
    }

    // Listeners for buttons
    display_element.querySelector('#jspsych-valence-check-5-next').addEventListener('click', function () {
      recordResponsesAndEnd(display_element, trial);
    });

    // Hide slides and initialize timers
    initTimersHideSlides(trial);
  };

  /**
   * Creates the HTML string for one item, which contains both the stimulus and its associated rating scale.
   * @param index Index of the current item being constructed.
   * @returns String containing the entire HTML for one item.
   */
  function createItem(index) {
    var imgStyleString = '';
    if (typeof trial.stimulus_height === 'number') {
      imgStyleString += 'height:' + trial.stimulus_height + 'px; ';
    }
    if (typeof trial.stimulus_width === 'number') {
      imgStyleString += 'width:' + trial.stimulus_width + 'px; ';
    }
    if (!trial.maintain_aspect_ratio) {
      imgStyleString += 'object-fit: contain; ';
    }

    var innerDiv = (trial.stim_text_index || '') + "<br><br><";
      '<div id="slider-' + index + '" class="rating-scale">' +
      '<output id="slider-value-' + index + '"></output>' +
      '<input type="range" id="slider-input-' + index + '" class="horizontal-slider" ' +
      'name="slider[]" min="' + trial.min + '" max="' + trial.max + '" step="' + trial.step + '" ' +
      'value="' + trial.start + '" list="tickmarks-' + index + '">' +
      '<datalist id="tickmarks-' + index + '">';
        
    // Generate tick marks based on given labels
    if (Array.isArray(trial.labels)) {
      for (var i = 0; i < trial.labels.length; ++i) {
        innerDiv += '<option value="' + ((i * (trial.max - trial.min)) / (trial.labels.length - 1) + trial.min) + '">' +
          '<span style="padding-right: .5rem">' + trial.labels[i] + '</span>' +
          '</option>';
      }
    }
    
    innerDiv += '</datalist>' +
      '</div>';

    // Return the final string
    return '' +
      '<div id="item-' + index + '-wrapper" class="item-wrapper">' +
      '<div id="item-' + index + '-content" class="item-content">' +
      '<img src="' + trial.stimulus_[index] + '" id="item-' + index + '" class="centered-img" style="' + imgStyleString + '"/>' +
      innerDiv +
      '</div>' +
      '</div>';
  }

  /**
   * Handles mouse clicks on the slider thumb. Records the response if the requirement has been met.
   */
  function handleMouseUp() {
    if (trial.require_movement) {
      recordResponsesAndEnd(display_element, trial);
    }
  }

  /**
   * Handles touch events on the slider thumb. Records the response if the requirement has been met.
   */
  function handleTouchStop() {
    if (trial.require_movement) {
      recordResponsesAndEnd(display_element, trial);
    }
  }

  /**
   * Generates the necessary functions to manage hiding and showing items during trials.
   * Also starts the timer to track the overall trial duration.
   * @param trial The trial object passed down from JS Psych.
   */
  function initTimersHideSlides(trial) {
    var itemsToShow = Array(5).fill().map((_, idx) => idx);

    // Show initially selected items
    itemsToShow.forEach(showItem);

    // Hide remaining items according to the specified durations
    if (trial.stimulus_duration) {
      setTimeout(() => {
        itemsToShow.forEach(hideItem);
      }, trial.stimulus_duration);
    }

    // Overall trial duration
    if (trial.trial_duration) {
      setTimeout(() => {
        recordResponsesAndEnd(display_element, trial);
      }, trial.trial_duration);
    }
  }

  /**
   * Shows the target item by adding classes to reveal it and fading out other items.
   * @param index Index of the item to show.
   */
  function showItem(index) {
    document.getElementById('item-' + index + '-wrapper').classList.add('visible-item');
    hideOtherItemsExcept(index);
  }

  /**
   * Hides the target item by removing the visible-item class.
   * @param index Index of the item to hide.
   */
  function hideItem(index) {
    document.getElementById('item-' + index + '-wrapper').classList.remove('visible-item');
  }

  /**
   * Hides all items except for the one with the specified index.
   * @param index Index of the item to remain visible.
   */
  function hideOtherItemsExcept(index) {
    for (var i = 0; i < 5; ++i) {
      if (i !== parseInt(index, 10)) {
        document.getElementById('item-' + i + '-wrapper').classList.remove('visible-item');
      }
    }
  }

  /**
   * Records the current slider values and finishes the trial.
   * @param display_element The main container where everything gets rendered.
   * @param trial The trial object passed down from JS Psych.
   */
  function recordResponsesAndEnd(display_element, trial) {
    clearInterval(intervalID);

    // Record slider values
    for (var i = 0; i < 5; ++i) {
      var currentValue = getCurrentSliderValue(i);
      console.log('Response ', i, ':', currentValue);
    }

    // Remove listeners
    for (var i = 0; i < 5; ++i) {
      sliderThumbPositions[i].removeEventListener('mouseup', handleMouseUp);
      sliderThumbPositions[i].removeEventListener('touchstop', handleTouchStop);
    }

    // Reset styles for cleaner closing
    resetStyles();

    // Send data back to JS Psych
    var trial_data = {
      'RT': Date.now() - startTime,
      'responses': []
    };

    for (var i = 0; i < 5; ++i) {
      trial_data.responses.push({
        'stimulus': trial['stimulus_' + i],
        'score': getCurrentSliderValue(i),
        'time': Date.now()
      });
    }

    display_element.innerHTML = '';
    jsPsych.pluginAPI.cancelAllKeyboardResponses();
    jsPsych.finishTrial(trial_data);
  }

  /**
   * Gets the currently recorded value of the slider.
   * @param index Index of the slider whose value needs to be retrieved.
   * @return Number representing the current value of the slider.
   */
  function getCurrentSliderValue(index) {
    return parseFloat(document.getElementById('slider-value-' + index).innerText);
  }

  return plugin;
})();