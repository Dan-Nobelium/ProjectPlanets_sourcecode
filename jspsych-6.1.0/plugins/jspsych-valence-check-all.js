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
      num_stimuli: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Number of stimuli per trial',
        default: 3,
        description: 'Specifies the number of stimuli to show simultaneously.',
      },
    },
  };

  plugin.trial = async function(display_element, trial) {
    await preloadImages(trial.stimuli);

    // Div for holding the individual rating containers
    const ratingsContainerDiv = document.createElement('div');
    ratingsContainerDiv.classList.add('jspsych-valence-check-all-ratings-container');

    // Prepare the grid layout
    const rowCount = Math.ceil(trial.num_stimuli / 3);
    let columnCounter = 1;
    for (let i = 0; i < trial.num_stimuli; ++i) {
      if (columnCounter === 4) {
        columnCounter = 1;
      }

      const ratingContainer = document.createElement('div');
      ratingContainer.classList.add('rating-container', `column-${columnCounter}`);

      const stimulus = trial.stimuli[i % trial.stimuli.length];

      const imageElement = document.createElement('img');
      imageElement.setAttribute('src', stimulus.picture);
      imageElement.setAttribute('alt', stimulus.text);

      const titleSpan = document.createElement('span');
      titleSpan.textContent = stimulus.text;

      ratingContainer.appendChild(imageElement);
      ratingContainer.appendChild(titleSpan);

      ratingsContainerDiv.appendChild(ratingContainer);

      columnCounter++;
    }

    display_element.appendChild(ratingsContainerDiv);

    // Collect ratings
    const promises = Array.from(document.querySelectorAll('.rating-container')).map(async (ratingContainer) => {
      const selector = '.rating-container.column-' + ratingContainer.classList[1];
      const initialValue = 0;

      const ratingInput = document.createElement('input');
      ratingInput.type = 'range';
      ratingInput.min = 0;
      ratingInput.max = 100;
      ratingInput.step = 1;
      ratingInput.value = initialValue;
      ratingInput.classList.add('rating-input');

      const ratingLabel = document.createElement('label');
      ratingLabel.textContent = `${initialValue}`;
      ratingLabel.htmlFor = 'rating-input';

      ratingContainer.appendChild(ratingInput);
      ratingContainer.appendChild(ratingLabel);

      // Update visual representation of the rating
      function updateLabelText() {
        const value = parseFloat(ratingInput.value);
        const percentage = (value / 100) * 100;
        ratingLabel.textContent = `${percentage.toFixed(0)}%`;
      }

      ratingInput.addEventListener('input', updateLabelText);
      updateLabelText();

      return new Promise((resolve) => {
        ratingInput.addEventListener('change', () => {
          const ratingValue = parseFloat(ratingInput.value);
          jsPsych.pluginAPI.clearAllTimeouts();
          ratingLabel.textContent = `${ratingValue}%`;

          // Store the rating in trial data
          const trialData = {
            stimulus_id: stimulus.id,
            rating: ratingValue,
          };

          jsPsych.data.write(trialData);
          resolve();
        });
      });
    });

    await Promise.all(promises);

    jsPsych.finishTrial();
  };

  function preloadImages(images) {
    return new Promise((resolve) => {
      const loadedImages = [];
      const totalImages = images.length;

      if (!totalImages) {
        resolve();
      }

      images.forEach((image, index) => {
        const imgObj = new Image();
        imgObj.src = image.picture;

        imgObj.onload = () => {
          loadedImages.push({
            source: image.picture,
            loaded: true,
          });

          if (loadedImages.length === totalImages) {
            resolve();
          }
        };

        imgObj.onerror = () => {
          loadedImages.push({
            source: image.picture,
            loaded: false,
          });

          if (loadedImages.length === totalImages) {
            resolve();
          }
        };
      });
    });
  }

  return plugin;
})();