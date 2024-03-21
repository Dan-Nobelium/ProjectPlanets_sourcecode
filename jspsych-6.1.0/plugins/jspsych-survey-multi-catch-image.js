jsPsych.plugins['survey-multi-catch-image'] = (function() {
  var plugin = {};

  plugin.info = {
    name: 'survey-multi-catch-image',
    description: 'A plugin for multiple-choice survey questions with instruction looping and error catching',
    parameters: {
      options: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Options',
        array: true,
        default: undefined,
        description: 'An array of HTML strings representing the options.'
      },
      randomize_option_order: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Randomize Option Order',
        default: false,
        description: 'If true, the order of the options will be randomized.'
      },
      preamble: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Preamble',
        default: null,
        description: 'HTML-formatted string to display at the top of the page above the options.'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default: 'Continue',
        description: 'Label of the button.'
      },
      instructions: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Instructions',
        default: null,
        description: 'HTML-formatted string containing the instructions to display when an incorrect answer is given.'
      },
      ship_attack_damage: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Ship Attack Damage',
        array: true,
        default: undefined,
        description: 'An array of integers representing the attack damage for each ship.'
      }
    }
  };

  plugin.trial = function(display_element, trial) {
    var plugin_id_name = "jspsych-survey-multi-catch-image";
    var html = "";

    html += '<style id="jspsych-survey-multi-catch-image-css">';
    html += '.jspsych-survey-multi-catch-image-options-row { display: flex; justify-content: center; margin-bottom: 20px; }';
    html += '.jspsych-survey-multi-catch-image-option { flex: 1; margin-left: 10px; margin-right: 10px; text-align: center; }';
    html += '.jspsych-survey-multi-catch-image-option img { display: block; margin: 0 auto 0.5em; }';
    html += 'label.jspsych-survey-multi-catch-image-text input[type="checkbox"] { margin-right: 1em; }';
    html += '.jspsych-survey-multi-catch-image-preamble p { margin-bottom: 10px; }'; // Add margin bottom to preamble paragraphs
    html += '</style>';

    if (trial.preamble !== null) {
      html += '<div id="jspsych-survey-multi-catch-image-preamble" class="jspsych-survey-multi-catch-image-preamble">' + trial.preamble + '</div>';
    }

    html += '<form id="jspsych-survey-multi-catch-image-form">';

    const createOptionElement = (option) => {
      const optionElement = document.createElement('div');
      optionElement.classList.add('option-container');

      const imageElement = document.createElement('img');
      imageElement.src = option.imageSrc;
      imageElement.classList.add('option-image');
      optionElement.appendChild(imageElement);

      const inputElement = document.createElement('input');
      inputElement.type = 'checkbox';
      inputElement.name = option.name;
      inputElement.value = option.value;
      optionElement.appendChild(inputElement);

      const labelElement = document.createElement('label');
      labelElement.textContent = option.label;
      optionElement.appendChild(labelElement);

      return optionElement;
    };

    const renderOptions = (options) => {
      return options.map(createOptionElement);
    };

    for (var q = 0; q < trial.options.length; q++) {
      html += '<div class="jspsych-survey-multi-catch-image-options-row">';

      if (Array.isArray(trial.options[q])) {
        const optionElements = renderOptions(trial.options[q]);
        optionElements.forEach(element => html += element.outerHTML);
      } else {
        html += trial.options[q];
      }

      html += '</div>';
    }

    html += '<div class="jspsych-survey-multi-catch-image-nav">';
    html += '<input type="submit" id="' + plugin_id_name + '-next" class="' + plugin_id_name + ' jspsych-btn" value="' + trial.button_label + '"></input>';
    html += '</div>';

    html += '</form>';

    var instruction_count = 0;
    var start_time = performance.now();
    var responses = {};
    var question_data = {};
    var instructionTimeout = null;

    function display_instructions() {
      instruction_count++;

      var modalOverlay = document.createElement('div');
      modalOverlay.id = 'instructionModal';
      modalOverlay.style.position = 'fixed';
      modalOverlay.style.top = '0';
      modalOverlay.style.left = '0';
      modalOverlay.style.width = '100%';
      modalOverlay.style.height = '100%';
      modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      modalOverlay.style.zIndex = '9999';
      modalOverlay.style.display = 'flex';
      modalOverlay.style.justifyContent = 'center';
      modalOverlay.style.alignItems = 'center';

      var modalContent = document.createElement('div');
      modalContent.style.backgroundColor = 'white';
      modalContent.style.padding = '20px';
      modalContent.style.borderRadius = '5px';
      modalContent.style.maxWidth = '80%';
      modalContent.innerHTML = trial.instructions;

      modalOverlay.appendChild(modalContent);

      display_element.appendChild(modalOverlay);

      instructionTimeout = setTimeout(hide_instructions, 5000);
    }

    function hide_instructions() {
      var modalOverlay = document.getElementById('instructionModal');
      if (modalOverlay) {
        modalOverlay.remove();
        start_time = performance.now();
        instructionTimeout = null;
      }
    }

    display_element.innerHTML = html;

    function check_answers() {
      var selected_ships = [];
      var checkboxes_ships = document.querySelectorAll('input[name="Q0"]:checked');
      for (var i = 0; i < checkboxes_ships.length; i++) {
        var ship_index = parseInt(checkboxes_ships[i].value.split(' ')[1]) - 1;
        selected_ships.push(ship_index);
      }

      var selected_planets = [];
      var checkboxes_planets = document.querySelectorAll('input[name="Q1"]:checked');
      for (var i = 0; i < checkboxes_planets.length; i++) {
        var planet_index = parseInt(checkboxes_planets[i].value.split(' ')[1]) - 1;
        selected_planets.push(planet_index);
      }

      var correct_ships = [];
      var correct_planets = [];
      for (var i = 0; i < trial.ship_attack_damage.length; i++) {
        if (trial.ship_attack_damage[i] !== 0) {
          correct_ships.push(i);
          correct_planets.push(i);
        }
      }

      var all_correct_ships = selected_ships.length === correct_ships.length;
      for (var i = 0; i < correct_ships.length; i++) {
        if (!selected_ships.includes(correct_ships[i])) {
          all_correct_ships = false;
          break;
        }
      }

      var all_correct_planets = selected_planets.length === correct_planets.length;
      for (var i = 0; i < correct_planets.length; i++) {
        if (!selected_planets.includes(correct_planets[i])) {
          all_correct_planets = false;
          break;
        }
      }

      if (all_correct_ships && all_correct_planets) {
        contingencies_correct = true;
        display_element.innerHTML = '';
        var trial_data = {
          "responses": JSON.stringify(responses),
          "instruction_count": instruction_count,
          "contingencies_correct": contingencies_correct
        };
        jsPsych.finishTrial(trial_data);
      } else {
        display_instructions();
      }
    }

    document.querySelector('#jspsych-survey-multi-catch-image-form').addEventListener('submit', function(event) {
      event.preventDefault();
      check_answers();
    });
  };

  return plugin;
})();