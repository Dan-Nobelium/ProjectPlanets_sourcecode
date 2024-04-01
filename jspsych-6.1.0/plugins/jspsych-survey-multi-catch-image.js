jsPsych.plugins['survey-multi-catch-image'] = (function() {
  var plugin = {};

  // Define plugin information
  plugin.info = {
    name: 'survey-multi-catch-image',
    description: 'Displays instruction pages with catch questions and images',
    parameters: {
      pages: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Pages',
        default: undefined,
        array: true,
        description: 'Each element of the array is the content for a single page.'
      },
      preamble: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Preamble',
        array: true,
        default: null,
        description: 'HTML-formatted string to display at the top of the page above all the questions.'
      },
      ship_attack_damage: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Ship Attack Damage',
        array: true,
        default: undefined,
        description: 'An array of integers representing the attack damage for each ship.'
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
      instructions: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Instructions',
        default: null,
        description: 'HTML-formatted string containing the instructions to display when an incorrect answer is given.'
      },
      attack_text_1: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Attack Text',
        default: null,
        description: 'HTML-formatted string representing the attack text to display.'
      },
      attack_text_2: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Attack Text',
        default: null,
        description: 'HTML-formatted string representing the attack text to display.'
      }
    }
  };


  plugin.trial = function(display_element, trial) {
    var currentInstructionPage = 0;
    var startTime = performance.now();
    var instructionPages = trial.pages;
    var catchQuestions = {
      preamble: trial.preamble,
      ship_attack_damage: trial.ship_attack_damage
    };
    var catchResponses = {};
    var contingencies_correct = false;
    var failedSubmissionCount = 0;
  
    // Function to create the HTML for an instruction page
    function createInstructionPage(pageContent) {
      var pageHtml = `
        <div class="jspsych-content">
          ${pageContent}
        </div>
      `;
      return pageHtml;
    }
  
    // Function to create the HTML for the catch questions
    function createCatchQuestions() {
      var preamble = catchQuestions.preamble.join('') || '';
  
      var html = `
        ${preamble}
        <form id="jspsych-survey-multi-catch-form">
          <div class="jspsych-survey-multi-catch-nav">
            <button id="backButton" class="jspsych-btn">${trial.button_label_previous}</button>
            <button type="submit" id="submitButton" class="jspsych-btn">${trial.button_label_next}</button>
          </div>
        </form>
      `;
  
      return html;
    }
  
    // Function to show an instruction page
    function showInstructionPage() {
      var pageContent = instructionPages[currentInstructionPage];
      var pageHtml = createInstructionPage(pageContent);
      display_element.innerHTML = pageHtml;
  
      if (trial.show_clickable_nav) {
        var navButtons = `
          <div class="jspsych-instructions-nav">
            <button id="prevButton" class="jspsych-btn">${trial.button_label_previous}</button>
            <button id="nextButton" class="jspsych-btn">${trial.button_label_next}</button>
          </div>
        `;
        display_element.insertAdjacentHTML('beforeend', navButtons);
  
        display_element.querySelector('#prevButton').addEventListener('click', previousPage);
        display_element.querySelector('#nextButton').addEventListener('click', nextPage);
      }
  
      if (trial.show_page_number) {
        var pageNumber = `
          <div class="jspsych-instructions-page-number">
            Page ${currentInstructionPage + 1} of ${instructionPages.length}
          </div>
        `;
        display_element.insertAdjacentHTML('beforeend', pageNumber);
      }
  
      if (trial.allow_keys) {
        var keyListener = jsPsych.pluginAPI.getKeyboardResponse({
          callback_function: keyHandler,
          valid_responses: [trial.key_backward, trial.key_forward],
          rt_method: 'performance',
          persist: false
        });
      }
    }
  
    // Function to show the catch questions
    function showCatchQuestions() {
      var catchQuestionsHtml = createCatchQuestions();
      display_element.innerHTML = catchQuestionsHtml;

      display_element.querySelector('#backButton').addEventListener('click', function() {
        currentInstructionPage = instructionPages.length - 1;
        showInstructionPage();
      });

      display_element.querySelector('#jspsych-survey-multi-catch-form').addEventListener('submit', function(event) {
        event.preventDefault();
        var selectedShips = [];
        var checkboxes_ships = document.querySelectorAll('input[name="Q0"]:checked');
        for (var i = 0; i < checkboxes_ships.length; i++) {
          var ship_index = parseInt(checkboxes_ships[i].value.split(' ')[1]) - 1;
          selectedShips.push(ship_index);
        }

        var selectedPlanets = [];
        var checkboxes_planets = document.querySelectorAll('input[name="Q1"]:checked');
        for (var i = 0; i < checkboxes_planets.length; i++) {
          var planet_index = parseInt(checkboxes_planets[i].value.split(' ')[1]) - 1;
          selectedPlanets.push(planet_index);
        }

        var correctShips = [];
        var correctPlanets = [];
        for (var i = 0; i < catchQuestions.ship_attack_damage.length; i++) {
          if (catchQuestions.ship_attack_damage[i] !== 0) {
            correctShips.push(i);
            correctPlanets.push(i);
          }
        }

        var allCorrectShips = selectedShips.length === correctShips.length;
        for (var i = 0; i < correctShips.length; i++) {
          if (!selectedShips.includes(correctShips[i])) {
            allCorrectShips = false;
            break;
          }
        }

        var allCorrectPlanets = selectedPlanets.length === correctPlanets.length;
        for (var i = 0; i < correctPlanets.length; i++) {
          if (!selectedPlanets.includes(correctPlanets[i])) {
            allCorrectPlanets = false;
            break;
          }
        }

        catchResponses = {
          ships: selectedShips,
          planets: selectedPlanets
        };

        contingencies_correct = allCorrectShips && allCorrectPlanets;

        if (contingencies_correct) {
          endTrial();
        } else {
          failedSubmissionCount++;
          displayInstructions();
        }
      });
    }
  
    // Function to handle navigation to the previous page
    function previousPage() {
      if (currentInstructionPage > 0) {
        currentInstructionPage--;
        showInstructionPage();
      }
    }
  
    // Function to handle navigation to the next page
    function nextPage() {
      if (currentInstructionPage < instructionPages.length - 1) {
        currentInstructionPage++;
        showInstructionPage();
      } else {
        showCatchQuestions();
      }
    }
  
    // Function to handle key presses for navigation
    function keyHandler(info) {
      if (jsPsych.pluginAPI.compareKeys(info.key, trial.key_backward) && trial.allow_backward) {
        previousPage();
      } else if (jsPsych.pluginAPI.compareKeys(info.key, trial.key_forward)) {
        nextPage();
      }
    }
  
    // Function to display instructions when an incorrect answer is given
    function displayInstructions() {
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
  
      var closeButton = document.createElement('button');
      closeButton.innerText = 'Close';
      closeButton.style.marginTop = '10px';
      closeButton.addEventListener('click', function() {
        modalOverlay.remove();
        currentInstructionPage = instructionPages.length - 1;
        showInstructionPage();
      });
  
      modalContent.appendChild(closeButton);
      modalOverlay.appendChild(modalContent);
      display_element.appendChild(modalOverlay);
    }
  
  
    // Function to end the trial
    function endTrial() {
      var endTime = performance.now();
      var responseTime = endTime - startTime;

      var trialData = {
        instruction_pages: JSON.stringify(instructionPages),
        catch_questions: JSON.stringify(catchQuestions),
        catch_responses: JSON.stringify(catchResponses),
        contingencies_correct: contingencies_correct,
        failed_submission_count: failedSubmissionCount,
        rt: responseTime
      };

      display_element.innerHTML = '';
      jsPsych.finishTrial(trialData);
    }
  
    // Start the trial by showing the first instruction page
    showInstructionPage();
  };

  return plugin;
})();