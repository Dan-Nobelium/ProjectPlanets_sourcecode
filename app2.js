/* 
//----------------------------------------------------------------------------
// Experiment Parameters
//----------------------------------------------------------------------------
  Randomises the participant's group and sample. Also sets up the randomised
  position of the punished planet, left-right assignment of planets and ships,
  global variables, and the images list. */
// Text/string based variables are imported through text.js via the global scope..

// Participant Sample Selection
let groups = ["early_0.1", "early_0.4", "late_0.1", "late_0.4"];
let group = jsPsych.randomization.sampleWithReplacement(groups, 1);
let samples = ["ProA", "others"];
let sample = samples[0];  

// randomise position of planets (left/middle/right as 0/1/2)
let num_planets = 3;
let planet_sides = [...Array(num_planets).keys()].map(x => x.toString());
let planet_side = jsPsych.randomization.sampleWithReplacement(planet_sides, 1)[0];
console.log(planet_side);
// Stimulus and image Initialization
const stim_list = jsPsych.randomization.repeat(['img/bluep.png','img/orangep.png', 'img/pinkp.png'], 1);
const ship_list = jsPsych.randomization.repeat(['img/ship1.png','img/ship2.png','img/ship3.png'], 1);
const stim_selector_highlight = 'img/selectring.png';
const images = [
  'img/signal1.png','img/signal2.png','img/signal3.png','img/signal4.png',
  'img/ship1.png','img/ship2.png',
  'img/bluep.png','img/orangep.png',
  'img/cursor.png','img/cursordark.png', 'img/selectring.png',
  'img/win100.png', 'img/lose.png',
  'img/arrow.jpg', 'img/blank_lose.jpg', 'img/blank_arrow.jpg'
];

// Global Variables Definition
let block_number = 0;
let trial_number = 0;
let points = 0;
const block_duration = 180 * 10; // in milliseconds (3 mins)
const iti = 1000;
const inf_stim_height = 80;
const inf_slider_width = 500;
const main_stim_height = 250;
const feedback_duration = 2500;
const rf_ship_delay = 1500;
const probability_trade = [[.5], [.5], [.5]];
const probability_shield = [[.5], [.5], [.5]];
// const probability_trade = [[.0], [.0], [.0]];
// const probability_shield = [[.0], [.0], [.0]];
// const probability_trade = [[1], [1], [1]];
// const probability_shield = [[1], [1], [1]];
const reset_planet_wait_const = 1000;
const shield_charging_time_const = 3000;
const ship_attack_time_const = 6000;


// Condition controll Global Variables Definition
const nBlocks_p1 = 1;
const nBlocks_p2 = 1;
const nBlocks_p3 = 1;
ship_attack_damage_index = [0,100,25]
let ship_attack_damage = 100;


// manipulate response-ship Rft rate
if (group[0].includes("0.1")) {
  var probability_ship = [[0.1],[0.1],[0.1]]; 
} else if (group[0].includes("0.4")) {
  var probability_ship = [[0.4],[0.4],[0.4]];
} else (console.log("ERROR: group is not defined as 0.1 or 0.4"))

// var probability_ship = probability_ship;
//Continious or discreete testing phases
let continuousResp = true;
let nTrialspBlk = 5; //if continuousResp is true though, this doesnt matter
if (continuousResp){
    let nTrialspBlk = 1;
}

//----------------------------------------------------------------------------
/* functions */

// Define a function to add blocks to the timeline
function addBlocksToTimeline(timeline, blockConfig, nBlocks, nTrialsPerBlock) {
  for (let i = 0; i < nBlocks; i++) {
    let block = {
      timeline: [blockConfig],
      repetitions: nTrialsPerBlock,
      data: {
          phase: 'phase1'
      }
    };
    console.log(block);
    timeline.push(block);
  }
}

//----------------------------------------------------------------------------
// ----- Participant instructions -----

let gen_ins_block = {
  type: "instructions",
  pages: [preques, pretrain1, pretrain2, pretrain3],
  allow_keys: false,
  show_clickable_nav: true,
  post_trial_gap: iti,
  data: {
    phase: "instructions",
  },
};

// Define instruction check block
let instructionCheckWithFeedback = {
  type: "survey-multi-choice",
  questions: questions.map(q => ({
    prompt: q.prompt,
    options: q.options,
    required: true
  })),
  preamble: function() {
    if (window.instructionFeedbackNeeded) {
      // Dynamically insert overlay HTML with instruction content
      const overlayHTML = `
        <div id="instructionOverlay" style="position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.95); color: white; z-index: 1000; display: flex; justify-content: center; align-items: center; text-align: center; padding: 20px;">
          <div style="max-width: 80%;">
            ${pretrain1, pretrain2, pretrain3}
            <button id="closeOverlay" style="margin-top: 20px;">Acknowledge Instructions</button>
          </div>
        </div>
      `;

      // Insert the overlay HTML into the body
      document.body.insertAdjacentHTML('beforeend', overlayHTML);

      // Add event listener to the button to close the overlay
      document.getElementById("closeOverlay").addEventListener("click", function() {
        document.getElementById("instructionOverlay").style.display = "none";
        window.instructionFeedbackNeeded = false; // Reset flag
      });

      return "<p><i>One of your answers was incorrect. Please review the instructions again.</i></p>";
    } else {
      return ""; // No feedback needed initially
    }
  },

  on_finish: function(data) {
    // Parse the responses
    let responses = JSON.parse(data.responses);
    let allCorrect = true; // Assume true initially

    // Check each answer
    for (let i = 0; i < questions.length; i++) {
      if (responses[`Q${i}`] !== questions[i].correct) {
        allCorrect = false;
        break; // Exit the loop as soon as one incorrect answer is found
      }
    }

    // Update 'instructioncorrect' and feedback need flag based on the check
    instructioncorrect = allCorrect;
    window.instructionFeedbackNeeded = !allCorrect;
  }
}

// Loop structure for retrying questionnaire with immediate feedback
let instructionCheckLoopWithFeedback = {
  timeline: [instructionCheckWithFeedback],
  loop_function: function(data) {
    return !instructioncorrect; // Continue looping if not correct
  }
};

// Initialize the feedback needed flag, to alert participants they need to retry the question
window.instructionFeedbackNeeded = false;



// End instruction phase
var end_instruction = {
  type: 'html-button-response',
  post_trial_gap: 0,
  choices: ['Click here to start Phase 1'],
  stimulus: '<center>Well done!</center>'
};

//----------------------------------------------------------------------------
// ----- Phase 1 -----

// define task blocks with no ships
let planet_noship = {
    type: 'planet-response',
    show_ship: false,
    ship_hostile_idx: planet_side,
    prompt: ['Planet A','Planet B','Planet C'],
    stimulus: stim_list,
    stimulus_select: stim_selector_highlight,
    ship_stimulus: ship_list,              
    reset_planet_wait: reset_planet_wait_const,
    shield_charging_time: shield_charging_time_const,
    ship_attack_time: ship_attack_time_const,
    ship_attack_damage: ship_attack_damage,
    block_duration: block_duration,
    data: {
        phase: 'phase1',
        block_type: 'planet_noship'
    },
    on_start: function(trial) {
        trial.data.points = points;
        trial.data.block_number = block_number;
        trial.data.trial_number = trial_number;
    },
    on_finish: function(data){
        points = data.points_total;
        trial_number = data.trial_number;
        trial_number++;
        // script for continuous response block
        if (continuousResp) {
            jsPsych.endCurrentTimeline();
            block_number = data.block_number;
            block_number++
            console.log('Block ' + block_number)
        } else {
            if (trial_number >= nTrialspBlk) {
                trial_number = 0
                block_number = data.block_number;
                block_number++
                console.log('Block ' + block_number)
            }
        }
    }
}

//----------------------------------------------------------------------------

// define phase 2 instructions
var phaseTwoInstructions = {
  type: 'instructions',
  pages: [
    phase2_instructions
    ],
  allow_keys: false,
  show_clickable_nav: true,
  post_trial_gap: iti,
  data: {
    phase: 'instructions'
  }
};

//----------------------------------------------------------------------------
// ----- Phase 2 -----

// define task blocks with ships
let planet_ship = {
  type: 'planet-response',
  show_ship: true,
  ship_hostile_idx: planet_side,
  prompt: ['Planet A','Planet B','Planet C'],
  stimulus: stim_list,
  stimulus_select: stim_selector_highlight,
  ship_stimulus: ship_list,              
  reset_planet_wait: reset_planet_wait_const,
  shield_charging_time: shield_charging_time_const,
  ship_attack_time: ship_attack_time_const,
  ship_attack_damage: ship_attack_damage,
  block_duration: block_duration,
  probability_trade: probability_trade,
  probability_ship: probability_ship,
  probability_shield: probability_shield,
  data: {
      phase: 'phase2',
      block_type: 'planet_ship'
  },
  on_start: function(trial) {
      trial.data.points = points;
      trial.data.block_number = block_number;
      trial.data.trial_number = trial_number;
  },
  on_finish: function(data){
      points = data.points_total;
      trial_number = data.trial_number;
      trial_number++;
      // script for continuous response block
      if (continuousResp) {
          jsPsych.endCurrentTimeline();
          block_number = data.block_number;
          block_number++
          console.log('Block ' + block_number)
      } else {
          if (trial_number >= nTrialspBlk) {
              trial_number = 0
              block_number = data.block_number;
              block_number++
              console.log('Block ' + block_number)
          }
      }
  }
}

//----------------------------------------------------------------------------

// --- Debrief and experiment end

// debrief
var debrief_block = {
  type: 'instructions',
  pages: [
    debrief
    ],
  button_label_next: "I acknowledge that I have received this debriefing information",
  show_clickable_nav: true,
  post_trial_gap: iti,
  data: {
    phase: 'debrief'
  }

};

var contact_block = {
  type: 'survey-text',
  questions: [
    {
      prompt: contact,
      rows: 2,
      columns: 80
    }
  ],
  data: {
    phase: 'contact'
  }
};

var exit_experiment = {
  type: 'instructions',
  pages: [
    'The experiment has concluded.'
  ]
};
//



      //----------------------------------------------------------------------------
      /* valence & inference checks */
    
      // valence check
      const valence_q = `How do you feel about each of these game elements: 
    
      `;
  
  const val_img_p1 = [
    {
      stimulus: 'img/win100.png',
      text: "Winning $100"
    },
    {
      stimulus: stim_list[0],
      text: "Planet A (left)"
    },
    {
      stimulus: stim_list[1],
      text: "Planet B (right)"
    }
    ];
  
  
  
  
    // inference check prompt
    var inference_prompt = [
      'Please answer the following questions with respect to <b>Planet A</b> (left planet):',
      'Please answer the following questions with respect to <b>Planet B</b> (right planet):',
      'Please answer the following questions with respect to <b>Ship 1</b>:',
      'Please answer the following questions with respect to <b>Ship 2</b>:',
    ];
  
    // contingency question
    var contingency_q = [
      'How OFTEN did interacting with <b>planet A</b> lead to the above outcome?',
      'How OFTEN did interacting with <b>planet B</b> lead to the above outcome?',
      'How OFTEN did interacting with <b>Ship 1</b> lead to the above outcome?',
      'How OFTEN did interacting with <b>Ship 2</b> lead to the above outcome?',
    ];
  
    // phase 1, planet A
    var inf_img_p1_A = [
      {
        stimulus: 'img/win100.png',
        text: "Winning $100"
      }
    ];
  
  
  
  
    //* inference and valence checks end *-----------------

var i = 1;

            // valence check p1
            var valence_p1 = {
              type: 'valence-check-3',
              prompt: valence_q,
              stimulus_1: val_img_p1[0].stimulus,
              stim_text_1: val_img_p1[0].text,
              stimulus_2: val_img_p1[1].stimulus,
              stim_text_2: val_img_p1[1].text,
              stimulus_3: val_img_p1[2].stimulus,
              stim_text_3: val_img_p1[2].text,
              labels: valence_labels,
              stimulus_height: inf_stim_height,
              slider_width: inf_slider_width,
              require_movement: false,
              data: {
                phase: 'val_check_1',
                block_number: i
              }
            };
        

// valence check p1
const valence_p2 = {
  type: 'valence-checker',
  prompt: valence_q,
  stimuli: [val_img_p1[0].stimulus,val_img_p1[0].stimulus,val_img_p1[0].stimulus],
  // stimulus_1: val_img_p1[0].stimulus,
  // stim_text_1: val_img_p1[0].text,
  // stimulus_2: val_img_p1[1].stimulus,
  // stim_text_2: val_img_p1[1].text,
  // stimulus_3: val_img_p1[2].stimulus,
  // stim_text_3: val_img_p1[2].text,
  num_stims: 1,
  labels: valence_labels,
  stimulus_height: inf_stim_height,
  slider_width: inf_slider_width,
  require_movement: false,
  data: {
    phase: 'val_check_1',
    block_number: 1
  }
};















//////////////////////

// ---- Timeline creation ----
let timeline = []; // This is the master timeline, the experiment runs sequentially based on the objects pushed into this array.

// timeline.push(consent_block);
// timeline.push(demographics_block);
// timeline.push(gen_ins_block);
// timeline.push(instructionCheckLoopWithFeedback);
// timeline.push(end_instruction);   
// addBlocksToTimeline(timeline, planet_noship, nBlocks_p1, nTrialspBlk);
// timeline.push(phaseTwoInstructions);
// addBlocksToTimeline(timeline, planet_ship, nBlocks_p2, nTrialspBlk);
// timeline.push(debrief_block);
// timeline.push(contact_block);


          // timeline.push(valence_p1);
          timeline.push(valence_p2);
          // timeline.push(infer_p1_A);
          //timeline.push(infer_p1_B);
          //timeline.push(slider_p1_q1);
          //timeline.push(slider_p1_q2);

timeline.push(exit_experiment);

// Run the experiment
{
  let subject_id = jsPsych.data.getURLVariable('Subject_id');
  if (subject_id === undefined) {
    subject_id = null;
  }

  jsPsych.data.addProperties({
    subject_id: subject_id,
    group: group,
    sample: sample,
    planet_side: planet_side,
    pun_planet: stim_list[planet_side],
    pun_ship: ship_list[planet_side],
  });

  jsPsych.init({
    timeline: timeline,
    preload_images: images,
    on_finish: function() {
      jsPsych.data.displayData();
    }
  });
}