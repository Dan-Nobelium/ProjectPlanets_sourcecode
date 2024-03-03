/*
 * jsPsych plugin for checking multiple valences at once
 */

jsPsych.plugins['valence-check-all'] = (function() {

  const plugin = {};

  plugin.info = {
    name: 'valence-check-all',
    description: '',
    parameters: {
      stimuli: {
        type: jsPsych.plugins.parameterType.JSON,
        pretty_name: 'Stimuli',
        default: [],
        description: 'List of stimuli to evaluate.',
      },
      text_descriptions: {
        type: jsPsych.plugins.parameterType.ARRAY,
        pretty_name: 'Text Descriptions',
        default: [],
        description: 'List of text descriptions to associate with each stimulus.',
      },
      num_stimuli: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Number of stimuli per trial',
        default: 3,
        description: 'Specifies the number of stimuli to show simultaneously.',
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Continue',
        array: false,
        description: 'Label of the button to advance.',
      },
    },
  };

  plugin.trial = function(display_element, trial) {
    // Create a container for the stimuli
    const stimulusContainers = document.createElement('div');
    stimulusContainers. className = 'jspsych-valence-check-all-stimulus-container';

    // Display the stimuli
    const stimuli = trial.stimuli;
    const texts = trial.text_descriptions;
    for (let i = 0; i < trial.num_stimuli && i < stimuli.length; i++) {
      const stimulusContainer = document.createElement('div');
      stimulusContainer.className = 'jspsych-valence-check-all-stimulus';
      stimulusContainer.appendChild(document.createTextNode(texts[i]));
      const image = document.createElement('img');
      image.src = stimuli[i].picture;
      stimulusContainer.appendChild(image);
      stimulusContainers.appendChild(stimulusContainer);
    }

    // Create a wrapper around the slider inputs
    const sliderWrapper = document.createElement('div');
    sliderWrapper.className = 'jspsych-valence-check-all-slider-wrapper';

    // Create the slider inputs
    const sliders = [];
    for (let i = 0; i < trial.num_stimuli && i < stimuli.length; i++) {
      const slider = document.createElement('input');
      slider.type = 'range';
      slider.min = 0;
      slider.max = 100;
      slider.step = 1;
      slider.value = 50;
      sliderWrapper.appendChild(slider);
      sliders.push(slider);
    }

    // Add the stimulus container to the display element
    display_element.appendChild(stimulusContainers);

    // Add the slider container to the display element
    display_element.appendChild(sliderWrapper);

    // Function handling updates to the slider
    function handleSliderChange(event) {
      const sliderIndex = Array.from(sliders).indexOf(event.target);
      const value = parseFloat(event.target.value);
      trial.response[sliderIndex] = value;
      display_element.querySelector('#valence-score').innerHTML = JSON.stringify(trial.response);
    }

    // Register listeners for the slider inputs
    for (let i = 0; i < trial.num_stimuli && i < stimuli.length; i++) {
      sliders[i].addEventListener('input', handleSliderChange);
    }

    // On Finish Callback
    const on_finish = function(data) {
      data.correct = true;
      delete data.response;
    };

    // Render the plugin
    jsPsych.pluginAPI.convertKeysToKeyCodes(trial.keys);
    display_element.innerHTML = "";
    display_element.appendChild(stimulusContainers);
    display_element.appendChild(sliderWrapper);
    display_element.appendChild(generateContinueButton(trial.button_label));
    jsPsych.pluginAPI.registerNextTrialCallback(on_finish);
  };

  function generateContinueButton(button_label) {
    const button = document.createElement("button");
    button.className = "jspsych-btn";
    button.innerHTML = button_label;

    button.addEventListener("click", function() {
      jsPsych.finishTrial();
    });

    return button;
  }

  return plugin;
})();