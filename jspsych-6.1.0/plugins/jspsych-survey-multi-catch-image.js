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
    html += '.jspsych-survey-multi-catch-image-option { display: inline-block; margin-left: 1em; margin-right: 1em; vertical-align: top; text-align: center; }';
    html += '.jspsych-survey-multi-catch-image-option img { display: block; margin: 0 auto 0.5em; }';
    html += 'label.jspsych-survey-multi-catch-image-text input[type="radio"] { margin-right: 1em; }';
    html += '</style>';

    if (trial.preamble !== null) {
      html += '<div id="jspsych-survey-multi-catch-image-preamble" class="jspsych-survey-multi-catch-image-preamble">' + trial.preamble + '</div>';
    }

    html += '<form id="jspsych-survey-multi-catch-image-form">';

    var option_order = [];
    for (var i = 0; i < trial.options.length; i++) {
      option_order.push(i);
    }
    if (trial.randomize_option_order) {
      option_order = jsPsych.randomization.shuffle(option_order);
    }

    for (var i = 0; i < trial.options.length; i++) {
      var option_index = option_order[i];

      html += '<div id="jspsych-survey-multi-catch-image-option-' + option_index + '" class="jspsych-survey-multi-catch-image-option">';
      html += trial.options[option_index];
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
      var radio_buttons = document.querySelectorAll('input[name="Q0"]:checked');
      for (var i = 0; i < radio_buttons.length; i++) {
        var ship_index = parseInt(radio_buttons[i].value.split(' ')[1]) - 1;
        selected_ships.push(ship_index);
      }

      var correct_ships = [];
      for (var i = 0; i < trial.ship_attack_damage.length; i++) {
        if (trial.ship_attack_damage[i] !== 0) {
          correct_ships.push(i);
        }
      }

      var all_correct = selected_ships.length === correct_ships.length;
      for (var i = 0; i < correct_ships.length; i++) {
        if (!selected_ships.includes(correct_ships[i])) {
          all_correct = false;
          break;
        }
      }

      if (all_correct) {
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