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
      attack_text: {
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
      },
      question_prompts: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Question prompts',
        default: null,
        array: true,
        description: 'Array of HTML strings representing the question prompts.'
      },
      question_options: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Question options',
        default: null,
        array: true,
        description: 'Array of HTML strings representing the options for each question.'
      },
      correct_answers: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Correct answers',
        default: null,
        array: true,
        description: 'Array of strings representing the correct answers for each question.'
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
  
// Modify createCatchQuestions function
function createCatchQuestions() {
  var html = `
    <p align='center'><b>Check your knowledge before you continue.</b></p>
    ${trial.attack_text_1}
    ${trial.question_prompts.map((prompt, index) => `
      <p align='center'><b>Question ${index + 1}:</b> ${prompt}</p>
      <div class="jspsych-survey-multi-catch-options">
        ${trial.question_options[index].map((option, optionIndex) => `
          <div class="option-container">
            <img src="${option.image}" class="option-image">
            <input type="radio" name="Q${index}" value="${option.value}" required>
            <label>${option.label}</label>
          </div>
        `).join('')}
      </div>
    `).join('')}
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
  
        var selectedAnswer1 = document.querySelector('input[name="Q0"]:checked').value;
        var selectedAnswer2 = document.querySelector('input[name="Q1"]:checked').value;
        var selectedAnswer3 = document.querySelector('input[name="Q2"]:checked').value;
        var selectedAnswer4 = document.querySelector('input[name="Q3"]:checked').value;
  
        var correctAnswer1 = catchQuestions.ship_attack_damage[0] !== 0 ? 'Planet A' : 'Planet B';
        var correctAnswer2 = catchQuestions.ship_attack_damage[0] !== 0 ? 'Ship 1' : 'Ship 2';
        var correctAnswer3 = catchQuestions.ship_attack_damage[1] !== 0 ? 'Planet B' : 'Planet C';
        var correctAnswer4 = catchQuestions.ship_attack_damage[1] !== 0 ? 'Ship 2' : 'Ship 3';
  
        catchResponses = {
          answer1: selectedAnswer1,
          answer2: selectedAnswer2,
          answer3: selectedAnswer3,
          answer4: selectedAnswer4
        };
  
        contingencies_correct = (
          selectedAnswer1 === correctAnswer1 &&
          selectedAnswer2 === correctAnswer2 &&
          selectedAnswer3 === correctAnswer3 &&
          selectedAnswer4 === correctAnswer4
        );
  
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