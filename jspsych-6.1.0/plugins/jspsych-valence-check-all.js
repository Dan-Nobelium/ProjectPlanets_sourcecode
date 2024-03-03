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
          <fieldset class="valence-check-all-options">
      `;

      // Insert the possible answers
      Object.entries(answerChoices).forEach(([value, answerLabel]) => {
        markup += `
            <div class="valence-check-all-option">
              <input type="radio" name="valence-check-all-group-${index}" id="valence-check-all-option-${index}-${value}" value="${value}" required/>
              <label for="valence-check-all-option-${index}-${value}">${answerLabel}</label>
            </div>
          `;
      });

      markup += `
          </fieldset>
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
   * Handles the finished event of the trial
   * @param {Object} data - Data collected during the trial
   */
  const handleFinishedEvent = (data) => {
    // Get the selected values
    data.response = data.response.map(r => parseInt(r));
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

    // Attach the generated markup to the display_element
    display_element.innerHTML = markup;

    // Save the trial data
    const rawData = {
      stimuli: trial.stimuli,
      num_stimuli: trial.num_stimuli
    };
    jsPsych.data.addProperties(rawData);

    // Handle the submission
    display_element.querySelector("#valence-check-all-next-btn").addEventListener("click", () => {
      const radioButtons = display_element.querySelectorAll("[type='radio'][required]:checked");

      if (radioButtons.length >= trial.num_stimuli) {
        const selections = Array.from(radioButtons).map(rb => rb.value);
        jsPsych.data.append({
          correct: selections.every(v => typeof v === 'number'),
          response: selections,
        });

        handleFinishedEvent(jsPsych.data.latest());
        jsPsych.finishTrial();
      } else {
        alert("You must select a value for every item.");
      }
    });
  };

  // Answer Choices Dictionary
  const answerChoices = {
    1: 'Very Negative',
    2: 'Slightly Negative',
    3: 'Neutral',
    4: 'Slightly Positive',
    5: 'Very Positive',
  };

  return plugin;
})();