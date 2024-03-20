jsPsych.plugins['survey-multi-catch-image'] = (function() {
  var plugin = {};

  // Initialize failed submission data
  var failedSubmissionData = {
    count: 0,
    timestamps: []
  };

  plugin.info = {
    name: 'survey-multi-catch-image',
    description: 'A plugin for multiple-choice survey questions with instruction looping and error catching',
    parameters: {
      questions: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        array: true,
        pretty_name: 'Questions',
        nested: {
          prompt: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Prompt',
            default: undefined,
            description: 'The strings that will be associated with a group of options.'
          },
          options: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Options',
            array: true,
            default: undefined,
            description: 'Displays options for an individual question.'
          },
          required: {
            type: jsPsych.plugins.parameterType.BOOL,
            pretty_name: 'Required',
            default: false,
            description: 'Subject will be required to pick an option for each question.'
          },
          horizontal: {
            type: jsPsych.plugins.parameterType.BOOL,
            pretty_name: 'Horizontal',
            default: false,
            description: 'If true, then questions are centered and options are displayed horizontally.'
          },
          name: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Question Name',
            default: '',
            description: 'Controls the name of data values associated with this question'
          }
        }
      },
      randomize_question_order: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Randomize Question Order',
        default: false,
        description: 'If true, the order of the questions will be randomized'
      },
      preamble: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Preamble',
        default: null,
        description: 'HTML formatted string to display at the top of the page above all the questions.'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default: 'Continue',
        description: 'Label of the button.'
      },
      correct_answers: {
        type: jsPsych.plugins.parameterType.OBJECT,
        pretty_name: 'Correct Answers',
        default: {},
        description: 'An object containing the correct answers for each question'
      },
      instructions: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Instructions',
        default: null,
        description: 'HTML-formatted string containing the instructions to display when an incorrect answer is given'
      },
      ship_list: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        pretty_name: 'Ship List',
        default: undefined,
        description: 'An array containing the ship stimulus images and labels.'
      },
      contingencies_correct: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Contingencies Correct',
        default: false,
        description: 'Flag indicating whether the contingencies are correctly answered.'
      }
    }
  };

  plugin.trial = function(display_element, trial) {
    var plugin_id_name = "jspsych-survey-multi-catch-image";
    var html = "";

    // Inject CSS for styling the trial
    html += '<style id="jspsych-survey-multi-catch-image-css">';
    html += ".jspsych-survey-multi-catch-image-question { margin-top: 2em; margin-bottom: 2em; text-align: center; }" +
      ".jspsych-survey-multi-catch-image-text span.required {color: darkred;}" +
      ".jspsych-survey-multi-catch-image-option { display: inline-block; margin-left: 1em; margin-right: 1em; vertical-align: top; text-align: center; }" +
      ".jspsych-survey-multi-catch-image-option img { display: block; margin: 0 auto 0.5em; }" +
      "label.jspsych-survey-multi-catch-image-text input[type='radio'] {margin-right: 1em;}";
    html += '</style>';

    // Show preamble text
    if (trial.preamble !== null) {
      html += '<div id="jspsych-survey-multi-catch-image-preamble" class="jspsych-survey-multi-catch-image-preamble">' + trial.preamble + '</div>';
    }

    // Add form element
    html += '<form id="jspsych-survey-multi-catch-image-form">';

    // Generate question order
    var question_order = [];
    for (var i = 0; i < trial.questions.length; i++) {
      question_order.push(i);
    }
    if (trial.randomize_question_order) {
      question_order = jsPsych.randomization.shuffle(question_order);
    }

    // Iterate over questions
    for (var i = 0; i < trial.questions.length; i++) {
      var question = trial.questions[question_order[i]];
      var question_id = question_order[i];

      // Create question container
      html += '<div id="jspsych-survey-multi-catch-image-' + question_id + '" class="jspsych-survey-multi-catch-image-question" data-name="' + question.name + '">';

      // Add question text
      html += '<p class="jspsych-survey-multi-catch-image-text survey-multi-catch-image">' + question.prompt;
      if (question.required) {
        html += "<span class='required'>*</span>";
      }
      html += '</p>';

    // Iterate over options
    for (var j = 0; j < question.options.length; j++) {
      var option_id_name = "jspsych-survey-multi-catch-image-option-" + question_id + "-" + j;
      var input_name = 'jspsych-survey-multi-catch-image-response-' + question_id;
      var input_id = 'jspsych-survey-multi-catch-image-response-' + question_id + '-' + j;

      var required_attr = question.required ? 'required' : '';

      // Add option container
      html += '<div id="' + option_id_name + '" class="jspsych-survey-multi-catch-image-option">';
      html += question.options[j]; // Use the HTML string directly
      html += '</div>';
    }

      html += '</div>';
    }

    // Add submit button
    html += '<div class="jspsych-survey-multi-catch-image-nav">';
    html += '<input type="submit" id="' + plugin_id_name + '-next" class="' + plugin_id_name + ' jspsych-btn" value="Continue"></input>';
    html += '</div>';

    html += '</form>';

    // Initialize variables
    var instruction_count = 0;
    var start_time = performance.now();
    var responses = {};
    var question_data = {};
    var instructionTimeout = null;

    function display_instructions() {
      instruction_count++;

      // Create the modal overlay
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

      // Create the modal content
      var modalContent = document.createElement('div');
      modalContent.style.backgroundColor = 'white';
      modalContent.style.padding = '20px';
      modalContent.style.borderRadius = '5px';
      modalContent.style.maxWidth = '80%';
      modalContent.innerHTML = `${trial.instructions}`;

      // Append the modal content to the overlay
      modalOverlay.appendChild(modalContent);

      // Append the modal overlay to the display element
      display_element.appendChild(modalOverlay);

      // Set a timeout to hide the instructions after 10 seconds
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

    // Render the initial form HTML
    display_element.innerHTML = html;

    // Set up form submission event listener after rendering the form
    var formElement = display_element.querySelector('form');
    if (formElement) {
      formElement.addEventListener('submit', function(event) {
        event.preventDefault();
        // measure response time
        var end_time = performance.now();
        var response_time = end_time - start_time;

        // create object to hold responses
        for (var i = 0; i < trial.questions.length; i++) {
          var match = display_element.querySelector('#jspsych-survey-multi-catch-' + i);
          var id = "Q" + i;
          if (match.querySelector("input[type=radio]:checked") !== null) {
            var val = match.querySelector("input[type=radio]:checked").value;
          } else {
            var val = "";
          }
          var obje = {};
          var name = id;
          if (match.attributes['data-name'].value !== '') {
            name = match.attributes['data-name'].value;
          }
          obje[name] = val;
          Object.assign(question_data, obje);
        }

        // check answers
        var all_correct = true;
        for (var q in question_data) {
          if (question_data[q] !== trial.correct_answers[q]) {
            all_correct = false;
            break;
          }
        }

        if (all_correct) {
          display_element.innerHTML = '';
          var trial_data = {
            "rt": response_time,
            "responses": JSON.stringify(question_data),
            "question_order": JSON.stringify(question_order),
            "instruction_count": instruction_count,
            "all_correct": all_correct,
            "failed_submission_count": failedSubmissionData.count,
            "failed_submission_timestamps": JSON.stringify(failedSubmissionData.timestamps)
          };
          jsPsych.finishTrial(trial_data);
        } else {
          // Increment failed submission count and store timestamp
          failedSubmissionData.count++;
          failedSubmissionData.timestamps.push(performance.now());

          responses = question_data;
          display_instructions();
        }
      });
    } else {
      console.error('Form element not found in the DOM.');
    }

    // Add custom CSS for styling
    var style = document.createElement('style');
    style.innerHTML = `
      .option-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 20px;
      }
      .option-image {
        width: 200px;
        height: 200px;
        object-fit: contain;
        margin-bottom: 10px;
      }
      .option-button {
        padding: 10px 20px;
        font-size: 16px;
        background-color: #e0e0e0;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
      .option-button:hover {
        background-color: #d0d0d0;
      }
    `;
    document.head.appendChild(style);

    // Add event listener to option buttons
    var optionButtons = document.querySelectorAll('.option-button');
    optionButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        var selectedOption = this.value;
        var questionName = this.closest('.jspsych-survey-multi-catch-image-question').dataset.name;
        var inputName = 'jspsych-survey-multi-catch-image-response-' + questionName;
        var inputElement = document.querySelector('input[name="' + inputName + '"]');
        inputElement.value = selectedOption;
        inputElement.checked = true;
      });
    });

    // Update contingencies_correct variable
    // trial.contingencies_correct = trial.contingencies_correct || false;
    // var responses = JSON.parse(trial.data.responses);
    // if (responses.Q0 === trial.correct_answers.Q0) {
    //   trial.contingencies_correct = true;
    // }
  };

  return plugin;
})();