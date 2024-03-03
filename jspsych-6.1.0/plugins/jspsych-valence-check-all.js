/*
 * jsPsych plugins must be written in a particular format. See: https://www.jspsych.org/developers/writing-new-plugins/
 */

jsPsych.plugins["valence-check-all"] = (function() {

  var plugin = {};

  plugin.info = {
    name: "valence-check-all",
    parameters: {
      stimuli: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        nested: {
          picture: {
            type: jsPsych.plugins.parameterType.IMAGE,
            default: undefined,
          },
          text: {
            type: jsPsych.plugins.parameterType.STRING,
            default: "",
          },
          labels: {
            type: jsPsych.plugins.parameterType.ARRAY,
            default: ['Negative', 'Neutral', 'Positive'],
          },
        },
      },
      num_stimuli: {
        type: jsPsych.plugins.parameterType.INT,
        default: 3,
      },
      prompt: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        default: "",
      },
    },
  };

  plugin.trial = function(display_element, trial) {
    // Access to shared globals
    const plugin = this;

    // Data initialization
    const shuffledStimuli = _.shuffle(trial.stimuli);
    plugin._preloadImages([...shuffledStimuli.map(el => el.picture)]);

    // Generated HTML setup
    const html = `
      ${shuffledStimuli
        .map(
          (item, idx) => `
          <div class="jspsych-valence-check-all-item">
            <img src="${item.picture}" alt="${item.text}"/>
            <p>${item.text}</p>
            
            <!-- Slider -->
            <input type="range" id="jspsych-valence-check-all-slider-${idx}" min="0" max="100" step="1" value="50">
            
            <!-- Value indicators -->
            <div class="jspsych-valence-check-all-values">
              ${item.labels
                .map(
                  (label, labelIdx) => `
                  <span class="indicator-item indicator-${labelIdx}">${label}: <strong>${
                    labelIdx * 33.33
                  }%</strong></span>
                  `
                )
                .join("")}
            </div>
          </div>
        `
        )
        .join("")}
      
      <!-- Prompt -->
      <div class="jspsych-valence-check-all-prompt">${trial.prompt}</div>
      
      <!-- Submit button -->
      <button id="jspsych-valence-check-all-submit" class="jspsych-btn">Submit</button>
    `;

    // Display HTML
    display_element.innerHTML = html;

    // Gather slide values upon submission
    display_element.querySelector("#jspsych-valence-check-all-submit").addEventListener("click", () => {
      const values = shuffledStimuli.map((_, idx) => {
        return parseInt(
          display_element.querySelector(`#jspsych-valence-check-all-slider-${idx}`).value,
          10
        );
      });

      // Save data
      const trialData = {
        stimuli: shuffledStimuli,
        values: values,
      };

      // Finish trial
      plugin.finishTrial(trialData);
    });
  };

  return plugin;
})();