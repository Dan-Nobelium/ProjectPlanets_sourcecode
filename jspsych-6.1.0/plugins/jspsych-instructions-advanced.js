jsPsych.plugins['instructions-advanced'] = (function() {
  var plugin = {};

  plugin.info = {
    name: 'instructions-advanced',
    description: 'A plugin for displaying instructions with a grid of images and associated data, along with contingency check questions.',
    parameters: {
      pages: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Pages',
        default: null,
        array: true,
        description: 'Each element of the array is the content for a single page.'
      },
      key_forward: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Key forward',
        default: 'rightarrow',
        description: 'The key the subject can press in order to advance to the next page.'
      },
      key_backward: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Key backward',
        default: 'leftarrow',
        description: 'The key that the subject can press to return to the previous page.'
      },
      allow_backward: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Allow backward',
        default: true,
        description: 'If true, the subject can return to the previous page of the instructions.'
      },
      allow_keys: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Allow keys',
        default: true,
        description: 'If true, the subject can use keyboard keys to navigate the pages.'
      },
      show_clickable_nav: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Show clickable nav',
        default: false,
        description: 'If true, then a "Previous" and "Next" button will be displayed beneath the instructions.'
      },
      show_page_number: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Show page number',
        default: false,
        description: 'If true, and clickable navigation is enabled, then Page x/y will be shown between the nav buttons.'
      },
      button_label_previous: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label previous',
        default: 'Previous',
        description: 'The text that appears on the button to go backwards.'
      },
      button_label_next: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label next',
        default: 'Next',
        description: 'The text that appears on the button to go forwards.'
      },
      instructlate: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Instructions (Late)',
        default: null,
        description: 'The instruction information string for the late condition.'
      },
      instructearly: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Instructions (Early)',
        default: null,
        description: 'The instruction information string for the early condition.'
      },
      Q0_cont_text: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Q0 Text',
        default: null,
        description: 'The text for the first contingency check question.'
      },
      Q0_cont_answers: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Q0 Answers',
        default: null,
        array: true,
        description: 'An array of answer options for the first contingency check question.'
      },
      Q1_cont_text: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Q1 Text',
        default: null,
        description: 'The text for the second contingency check question.'
      },
      Q1_cont_answers: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Q1 Answers',
        default: null,
        array: true,
        description: 'An array of answer options for the second contingency check question.'
      },
      correctstring_cont: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Correct Answers',
        default: null,
        description: 'A string representing the correct answers for the contingency check questions.'
      },
      image_data: {
        type: jsPsych.plugins.parameterType.OBJECT,
        pretty_name: 'Image Data',
        default: null,
        description: 'An object containing image data, such as ship type, damage value, and associated images.'
      },
      condition: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Condition',
        default: null,
        description: 'The condition (late or early) for displaying the appropriate instruction information.'
      }
    }
  };

  plugin.trial = function(display_element, trial) {
    var current_page = 0;
    var view_history = [];
    var start_time = performance.now();
    var last_page_update_time = start_time;

    // Function to handle button click navigation
    function btnListener(evt) {
      evt.target.removeEventListener('click', btnListener);
      if (this.id === "jspsych-instructions-back") {
        back();
      } else if (this.id === 'jspsych-instructions-next') {
        next();
      }
    }

    // Function to display the current page
    function show_current_page() {
      var html = '';

      // Check if the current page is an instruction page
      if (current_page < trial.pages.length) {
        html = trial.pages[current_page];
      } else {
        // Display the appropriate instruction information based on the condition
        if (trial.condition === 'late') {
          html = trial.instructlate;
        } else if (trial.condition === 'early') {
          html = trial.instructearly;
        }
      }

      var pagenum_display = "";
      if (trial.show_page_number) {
        pagenum_display = "<span style='margin: 0 1em;' class='" +
          "jspsych-instructions-pagenum'>Page " + (current_page + 1) + "/" + trial.pages.length + "</span>";
      }

      if (trial.show_clickable_nav) {
        var nav_html = "<div class='jspsych-instructions-nav' style='padding: 10px 0px;'>";
        if (trial.allow_backward) {
          var allowed = (current_page > 0) ? '' : "disabled='disabled'";
          nav_html += "<button id='jspsych-instructions-back' class='jspsych-btn' style='margin-right: 5px;' " + allowed + ">&lt; " + trial.button_label_previous + "</button>";
        }
        if (trial.pages.length > 1 && trial.show_page_number) {
          nav_html += pagenum_display;
        }
        nav_html += "<button id='jspsych-instructions-next' class='jspsych-btn'" +
          "style='margin-left: 5px;'>" + trial.button_label_next +
          " &gt;</button></div>";

        html += nav_html;
      } else {
        if (trial.show_page_number && trial.pages.length > 1) {
          html += "<div class='jspsych-instructions-pagenum'>" + pagenum_display + "</div>";
        }
      }

      display_element.innerHTML = html;

      if (current_page !== 0 && trial.allow_backward && trial.show_clickable_nav) {
        display_element.querySelector('#jspsych-instructions-back').addEventListener('click', btnListener);
      }

      if (trial.show_clickable_nav) {
        display_element.querySelector('#jspsych-instructions-next').addEventListener('click', btnListener);
      }
    }

    // Function to display the contingency check questions and answers
    function show_contingency_check() {
      var html = '<div class="contingency-check">';

      // Display the first contingency check question
      html += '<p>' + trial.Q0_cont_text + '</p>';
      for (var i = 0; i < trial.Q0_cont_answers.length; i++) {
        html += '<label><input type="radio" name="Q0" value="' + trial.Q0_cont_answers[i] + '">' + trial.Q0_cont_answers[i] + '</label><br>';
      }

      // Display the second contingency check question
      html += '<p>' + trial.Q1_cont_text + '</p>';
      for (var i = 0; i < trial.Q1_cont_answers.length; i++) {
        html += '<label><input type="radio" name="Q1" value="' + trial.Q1_cont_answers[i] + '">' + trial.Q1_cont_answers[i] + '</label><br>';
      }

      html += '<button id="contingency-check-submit">Submit</button>';
      html += '</div>';

      display_element.innerHTML = html;

      // Add event listener for the submit button
      display_element.querySelector('#contingency-check-submit').addEventListener('click', check_contingency_answers);
    }

    // Function to check the participant's answers to the contingency check questions
    function check_contingency_answers() {
      var Q0_answer = display_element.querySelector('input[name="Q0"]:checked').value;
      var Q1_answer = display_element.querySelector('input[name="Q1"]:checked').value;

      var correct_answers = JSON.parse(trial.correctstring_cont);

      if (Q0_answer === correct_answers.Q0 && Q1_answer === correct_answers.Q1) {
        // Answers are correct, proceed to the next part of the experiment
        endTrial();
      } else {
        // Answers are incorrect, display the instruction pages again
        current_page = 0;
        show_current_page();
      }
    }

    // Function to move to the next page
    function next() {
      add_current_page_to_view_history();
      current_page++;

      if (current_page < trial.pages.length) {
        show_current_page();
      } else if (current_page === trial.pages.length) {
        show_contingency_check();
      }
    }

    // Function to move to the previous page
    function back() {
      add_current_page_to_view_history();
      current_page--;
      show_current_page();
    }

    // Function to add the current page to the view history
    function add_current_page_to_view_history() {
      var current_time = performance.now();
      var page_view_time = current_time - last_page_update_time;
      view_history.push({
        page_index: current_page,
        viewing_time: page_view_time
      });
      last_page_update_time = current_time;
    }

    // Function to end the trial
    function endTrial() {
      if (trial.allow_keys) {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboard_listener);
      }

      display_element.innerHTML = '';

      var trial_data = {
        "view_history": JSON.stringify(view_history),
        "rt": performance.now() - start_time,
        "Q0_response": display_element.querySelector('input[name="Q0"]:checked').value,
        "Q1_response": display_element.querySelector('input[name="Q1"]:checked').value
      };

      jsPsych.finishTrial(trial_data);
    }

    // Function to handle keyboard navigation
    var after_response = function(info) {
      keyboard_listener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: [trial.key_forward, trial.key_backward],
        rt_method: 'performance',
        persist: false,
        allow_held_key: false
      });

      if (jsPsych.pluginAPI.compareKeys(info.key, trial.key_backward)) {
        if (current_page !== 0 && trial.allow_backward) {
          back();
        }
      }

      if (jsPsych.pluginAPI.compareKeys(info.key, trial.key_forward)) {
        next();
      }
    };

    // Display the first page
    show_current_page();

    // Set up keyboard navigation listener
    if (trial.allow_keys) {
      var keyboard_listener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: [trial.key_forward, trial.key_backward],
        rt_method: 'performance',
        persist: false
      });
    }
  };

  return plugin;
})();