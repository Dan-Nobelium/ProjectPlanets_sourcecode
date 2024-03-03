/**
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
        description: 'List of stimuli to evaluate.'
      },
      num_stimuli: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Number of stimuli per trial',
        default: 4,
        description: 'Specifies the number of stimuli to show simultaneously.'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Submit Ratings',
        array: false,
        description: 'Label of the button to advance.'
      }
    }
  };

  /**
   * Creates the markup for the trial
   * @param {Object} trial - The trial object
   * @returns {string} Markup for the trial
   */
  const createMarkup = (trial) => {
    // Start building the container
    let markup = `
      <div id="valence-check-all-main-container" class="valence-check-all-grid">
    `;

    // Iterate over the list of stimuli
    trial.stimuli.forEach((stimulus, index) => {
      // Construct the stimulus container
      markup += `
        <div class="valence-check-all-stimulus">
          <img src="${stimulus.picture}" alt="${stimulus.id}"/>
          <input type="range" min="-100" max="100" step="1" value="0" class="valence-check-all-slider" id="valence-check-all-slider-${index}">
          <output for="valence-check-all-slider-${index}" id="valence-check-all-slider-value-${index}"></output>
        </div>
      `;
    });

    // Close the container
    markup += `
      </div>
      <button class="jspsych-btn" id="valence-check-all-next-btn">${trial.button_label}</button>
    `;

    return markup;
  };

  /**
   * Updates the slider value visually
   * @param {HTMLElement} slider - Slider being updated
   */
  const updateSliderValueVisual = (slider) => {
    const value = Math.round(slider.value / 10) * 10;
    slider.previousElementSibling.innerText = `${value}`;
    slider.setAttribute('aria-valuemax', Math.abs(Math.ceil(Math.abs(value) / 10) * 10));
  };

  /**
   * Handles the finished event of the trial
   * @param {Object} data - Data collected during the trial
   */
  const handleFinishedEvent = (data) => {
    // Calculate the response
    const response = data.values().slice(-trial.num_stimuli).map(v => parseFloat(v));

    // Store the calculated response in the data object
    data.response = response;
  };

  /**
   * Initialization method for the trial
   * @param {Object} display_element - Element where the trial will be rendered
   * @param {Object} trial - Trial specification
   */
  plugin.trial = function(display_element, trial) {
    // Clear out old contents
    display_element.innerHTML = '';

    // Build the trial markup
    const markup = createMarkup(trial);

    // Add the generated markup to the display element
    display_element.innerHTML = markup;

    // Connect sliders with the same ID
    const sliders = display_element.querySelectorAll('.valence-check-all-slider');
    for (let i = 0; i < sliders.length; ++i) {
      sliders[i].addEventListener('input', () => {
        updateSliderValueVisual(sliders[i]);
      });
    }

    // Function updating the visual representation of the slider
    const updateSliderValueVisual = (slider) => {
      const value = Math.round(slider.value / 10) * 10;
      slider.setAttribute('aria-valuenow', value);
      slider.previousElementSibling.innerText = `${value}`;
    };

    // Initialize sliders
    for (let i = 0; i < sliders.length; ++i) {
      updateSliderValueVisual(sliders[i]);
    }

    // When the Next button is clicked
    const onNextClicked = () => {
      // Collect all slider values
      const sliderValues = Array.from(display_element.querySelectorAll('.valence-check-all-slider'))
        .map(slider => slider.value);

      // Gather the collected data
      const data = jsPsych.pluginAPI.gatherData(this);

      // Process the gathered data
      data.response = sliderValues;

      // Clean up and close the trial
      handleFinishedEvent(data);
      display_element.querySelector('#valence-check-all-next-btn').removeEventListener('click', onNextClicked);
      display_element.querySelector('#valence-check-all-next-btn').disabled = true;
    };

    // Add click handler for the next button
    display_element.querySelector('#valence-check-all-next-btn')
      .addEventListener('click', onNextClicked);
  };

  return plugin;
})();