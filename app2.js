/* 
//----------------------------------------------------------------------------
// Experiment Parameters
//----------------------------------------------------------------------------
  Randomises the participant's group and sample. Also sets up the randomised
  position of the punished planet, left-right assignment of planets and ships,
  global variables, and the images list.  */
// Text/string based variables are imported through text.js via the global scope.

// Participant Sample Selection
let groups = ["early_0.1", "early_0.4", "late_0.1", "late_0.4"];
let group = jsPsych.randomization.sampleWithReplacement(groups, 1);
let samples = ["ProA", "others"];
let sample = samples[0];  

// randomise position of planets (left/middle/right as 0/1/2)
let num_planets = 3;
let planet_sides = [...Array(num_planets).keys()].map(x => x.toString());
let planet_side = jsPsych.randomization.sampleWithReplacement(planet_sides, 1)[0];
// Stimulus and image Initialization
const stim_list = jsPsych.randomization.repeat(['img/planet_p.png','img/planet_o.png', 'img/planet_b.png'], 1);
const ship_list = jsPsych.randomization.repeat(['img/ship1.png','img/ship2.png','img/ship3.png'], 1);
const stim_selector_highlight = 'img/selectring.png';
const images = [
  'img/signal1.png','img/signal2.png','img/signal3.png','img/signal4.png',
  'img/ship1.png','img/ship2.png', 'img/planet_p.png',
  'img/planet_b.png','img/planet_o.png',
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
const reset_planet_wait_const = 1000;
const shield_charging_time_const = 3000;
const ship_attack_time_const = 6000;
const nBlocks_p1 = 1;
let nBlocks_p2 = 1;
let nBlocks_p3 = 1;
//let ship_attack_damage_index = [0(non-attack), fixed 100pts,25%]
let planet_labels = ['Planet A','Planet B','Planet C'];
let ship_attack_damage = [0, 100, 0.2];


// manipulate response-ship Rft rate
if (group[0].includes("0.1")) {
  var probability_ship = [[0.1],[0.1],[0.1]]; 
} else if (group[0].includes("0.4")) {
  var probability_ship = [[0.4],[0.4],[0.4]];
} else (console.error("ERROR: group is not defined as 0.1 or 0.4"))

var probability_ship = [[1],[1],[1]]; 

// // manipulate early/late instruction by block sizes of phase 2/3
// if (group[0].includes("early")) {
//   nBlocks_p2 = 2;
//   nBlocks_p3 = 3;
// } else if (group[0].includes("late")) {
//   nBlocks_p2 = 3;
//   nBlocks_p3 = 4;
// } else (console.log("ERROR: group is not defined as early or late"))


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

  // force full screen
  let fullscreen = {
      type: 'fullscreen',
      fullscreen_mode: true
    };

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

// Initialize variables to track failed attempts and start time
let failedAttempts = 0;
let startTime = null;

// Define instruction check block

let instructionCheckWithFeedback = {
  type: "survey-multi-catch",
  questions: questions.map(q => ({
    prompt: q.prompt,
    options: q.options,
    required: true
  })),
  correct_answers: questions.reduce((obj, q, index) => {
    obj[`Q${index}`] = q.correct;
    return obj;
  }, {}),
  instructions: `
    <div id="instructionOverlay" style="position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.95); color: white; z-index: 1000; display: flex; justify-content: center; align-items: center; text-align: center; padding: 20px;">
      <div style="max-width: 80%;">
        ${pretrain1, pretrain2, pretrain3}
        <button id="closeOverlay" style="margin-top: 20px;">Acknowledge Instructions</button>
      </div>
    </div>
  `
};

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
    prompt: planet_labels,
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
// ----- Phase 1  valance and inference checks-----

    // valence check
      const valence_q = `How do you feel about each of these game elements: `;
  
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
      text: "Planet B (middle)"
    },
    {
      stimulus: stim_list[2],
      text: "Planet C (right)"
    }
    ];
  
      // phase 1, winning $100 image/text
      var inf_img_p1_winning100 = [
        {
          stimulus: 'img/win100.png',
          text: "Winning $100"
        }
      ];
  
      // // phase 1, winning $100 image/text make this loosing
      // var inf_img_p1_winning100 = [
      //   {
      //     stimulus: 'img/win100.png',
      //     text: "Winning $100"
      //   }
      // ];
  
  
    //* inference and valence checks end *-----------------

var i = 1;
       
        // valence check phase 1
            const valence_p1 = {
              type: 'valence-check-4',
              prompt: valence_q,
              stimulus_1: val_img_p1[0].stimulus,
              stim_text_1: val_img_p1[0].text,
              stimulus_2: val_img_p1[1].stimulus,
              stim_text_2: val_img_p1[1].text,
              stimulus_3: val_img_p1[2].stimulus,
              stim_text_3: val_img_p1[2].text,
              stimulus_4: val_img_p1[3].stimulus,
              stim_text_4: val_img_p1[3].text,
              labels: valence_labels,
              stimulus_height: inf_stim_height,
              slider_width: inf_slider_width,
              require_movement: false,
              data: {
                phase: 'val_check_4',
                block_number: i
              }
            };

          // Map the Stimuli for Valence Check All
          const mappedValImgP1 = val_img_p1.map((entry) => {
            return {
              picture: entry.stimulus,
              id: entry.text,
            };
          });


        // inference check p1 (planet A)
        var infer_p1_A = {
          type: 'inference-check-1',
          main_stimulus: stim_list[0],
          main_stimulus_height: main_stim_height,
          prompt: inference_prompt[0],
          stimulus_1: inf_img_p1_winning100[0].stimulus,
          stim_text_1: inf_img_p1_winning100[0].text,
          slider_text_top: contingency_q[0],
          labels_top: contingency_labels,
          stimulus_height: inf_stim_height,
          slider_width: inf_slider_width,
          require_movement: false,
          data: {
            phase: 'inf_check_1_A',
            block_number: i
          }
        };

        // inference check p1 (planet B)
        var infer_p1_B = {
          type: 'inference-check-1',
          main_stimulus: stim_list[1],
          main_stimulus_height: main_stim_height,
          prompt: inference_prompt[1],
          stimulus_1: inf_img_p1_winning100[0].stimulus,
          stim_text_1: inf_img_p1_winning100[0].text,
          slider_text_top: contingency_q[1],
          labels_top: contingency_labels,
          stimulus_height: inf_stim_height,
          slider_width: inf_slider_width,
          require_movement: false,
          data: {
            phase: 'inf_check_1_B',
            block_number: i
          }
        };


        // inference check p1 (planet C)
        var infer_p1_C = {
          type: 'inference-check-1',
          main_stimulus: stim_list[2],
          main_stimulus_height: main_stim_height,
          prompt: inference_prompt[2],
          stimulus_1: inf_img_p1_winning100[0].stimulus,
          stim_text_1: inf_img_p1_winning100[0].text,
          slider_text_top: contingency_q[2],
          labels_top: contingency_labels,
          stimulus_height: inf_stim_height,
          slider_width: inf_slider_width,
          require_movement: false,
          data: {
            phase: 'inf_check_1_C',
            block_number: i
          }
        };


   //* inference and valence checks end *-----------------
    
      //NEW: slider response Qs - images
      var slider_img_left = [{
        stimulus: stim_list[0],
        text: "Planet A (left)"
      }]
    
      var slider_img_right = [{
        stimulus: stim_list[1],
        text: "Planet B (right)"
      }]

  // //NEW: slider questions p1 
  // //NEW: define slider Qs variables
  var left_label ="";
  var right_label ="";
  
  var slider_p1_q1 = {
    type: 'html-slider-response',
    prompt: "Reflecting back on what you did in the most recent block, <p>what proportion of your recent interactions were with Planet A (left) versus Planet B (right)?</p>",
    left_stimulus: slider_img_left[0].stimulus,
    left_stim_text: slider_img_left[0].text,
    right_stimulus: slider_img_right[0].stimulus,
    right_stim_text: slider_img_right[0].text,
    labels: ["100%/0%<p>(only click Planet A)</p>", "75%/25%", "50%/50%<p>(click both equally)</p>", "25%/75%", "0%/100%<p>(only click Planet B)</p>"],
    stimulus_height: 250,
    slider_width: 700,
    require_movement: false,
    data: {
      phase: 'slider-response_p1_q1',
      block_number: i
    }
  };

  var slider_p1_q2 = {
    type: 'html-slider-response',
    prompt: "To maximise your points in the <b>previous block</b>, what proportion of interactions would you allocate for Planet A (left) versus Planet B (right)?",
    left_stimulus: slider_img_left[0].stimulus,
    left_stim_text: slider_img_left[0].text,
    right_stimulus: slider_img_right[0].stimulus,
    right_stim_text: slider_img_right[0].text,
    labels: ["100%/0%<p>(only click Planet A)</p>", "75%/25%", "50%/50%<p>(click both equally)</p>", "25%/75%", "0%/100%<p>(only click Planet B)</p>"],
    stimulus_height: 250,
    slider_width: 700,
    require_movement: false,
    data: {
      phase: 'slider-response_p1_q2',
      block_number: i
    }
  };

//////////////////////

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
  prompt: planet_labels,
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
// ----- Phase 2 valance and inference-----

//p2 valance 8 items
  const val_img_p2 = [
    {
      stimulus: 'img/win100.png',
      text: "Winning $100"
    },
    {
      stimulus: 'img/lose.png',
      text: "Losing $"
    },
    {
      stimulus: stim_list[0],
      text: "Planet A (left)"
    },
    {
      stimulus: stim_list[1],
      text: "Planet B (middle)"
    },
    {
      stimulus: stim_list[2],
      text: "Planet C (right)"
    },
    {
      stimulus: 'img/ship1.png',
      text: "Ship 1"
    },
    {
      stimulus: 'img/ship2.png',
      text: "Ship 2"
    }
    ,
    {
      stimulus: 'img/ship3.png',
      text: "Ship 3"
    }
    ];


      // phase 2, planet A
      var inf_img_p2_A = [
        {
          stimulus: 'img/win100.png',
          text: "Winning $100"
        },
        {
          stimulus: 'img/lose.png',
          text: "Losing $"
        },
        {
          stimulus: ship_list[0],
          text: "Ship 1"
        },
        {
          stimulus: ship_list[1],
          text: "Ship 2"
        },
        {
          stimulus: ship_list[2],
          text: "Ship 3"
        },
      ];


//TODO: create valance check 8 library and use it here
        // value check p2
        
        var valence_p2 = {
          type: 'valence-check-8',
          prompt: valence_q,
          stimulus_1: val_img_p2[0].stimulus,
          stim_text_1: val_img_p2[0].text,
          stimulus_2: val_img_p2[1].stimulus,
          stim_text_2: val_img_p2[1].text,
          stimulus_3: val_img_p2[2].stimulus,
          stim_text_3: val_img_p2[2].text,
          stimulus_4: val_img_p2[3].stimulus,
          stim_text_4: val_img_p2[3].text,
          stimulus_5: val_img_p2[4].stimulus,
          stim_text_5: val_img_p2[4].text,
          stimulus_6: val_img_p2[5].stimulus,
          stim_text_6: val_img_p2[5].text,
          stimulus_7: val_img_p2[6].stimulus,
          stim_text_7: val_img_p2[6].text,
          stimulus_8: val_img_p2[7].stimulus,
          stim_text_8: val_img_p2[7].text,
          labels: valence_labels,
          stimulus_height: inf_stim_height,
          slider_width: inf_slider_width,
          require_movement: false,
          data: {
            phase: 'val_check_2',
            block_number: i + nBlocks_p1
          }
        };

        // inference check p2 (planet A)
        var infer_p2_A = {
          type: 'inference-check-5',
          main_stimulus: stim_list[0],
          main_stimulus_height: main_stim_height,
          prompt: inference_prompt[0],
          stimulus_1: inf_img_p2_A[0].stimulus,
          stimulus_2: inf_img_p2_A[1].stimulus,
          stimulus_3: inf_img_p2_A[2].stimulus,
          stimulus_4: inf_img_p2_A[3].stimulus,
          stimulus_5: inf_img_p2_A[4].stimulus,
          stim_text_1: inf_img_p2_A[0].text,
          stim_text_2: inf_img_p2_A[1].text,
          stim_text_3: inf_img_p2_A[2].text,
          stim_text_4: inf_img_p2_A[3].text,
          stim_text_5: inf_img_p2_A[4].text,
          slider_text_top: contingency_q[0],
          labels_top: contingency_labels,
          stimulus_height: inf_stim_height,
          slider_width: inf_slider_width,
          require_movement: false,
          data: {
            phase: 'inf_check_2_A',
            block_number: i + nBlocks_p1
          }
        };
    
        //create 5 item valance library check for p2 A/B/C
        // inference check p2 (planet B)
        var infer_p2_B = {
          type: 'inference-check-5',
          main_stimulus: stim_list[1],
          main_stimulus_height: main_stim_height,
          prompt: inference_prompt[1],
          stimulus_1: inf_img_p2_A[0].stimulus,
          stimulus_2: inf_img_p2_A[1].stimulus,
          stimulus_3: inf_img_p2_A[2].stimulus,
          stimulus_4: inf_img_p2_A[3].stimulus,
          stimulus_5: inf_img_p2_A[4].stimulus,
          stim_text_1: inf_img_p2_A[0].text,
          stim_text_2: inf_img_p2_A[1].text,
          stim_text_3: inf_img_p2_A[2].text,
          stim_text_4: inf_img_p2_A[3].text,
          stim_text_5: inf_img_p2_A[4].text,
          slider_text_top: contingency_q[1],
          labels_top: contingency_labels,
          stimulus_height: inf_stim_height,
          slider_width: inf_slider_width,
          require_movement: false,
          data: {
            phase: 'inf_check_2_B',
            block_number: i + nBlocks_p1
          }
        };

        // inference check p2 (planet B)
        var infer_p2_C = {
          type: 'inference-check-5',
          main_stimulus: stim_list[2],
          main_stimulus_height: main_stim_height,
          prompt: inference_prompt[2],
          stimulus_1: inf_img_p2_A[0].stimulus,
          stimulus_2: inf_img_p2_A[1].stimulus,
          stimulus_3: inf_img_p2_A[2].stimulus,
          stimulus_4: inf_img_p2_A[3].stimulus,
          stimulus_5: inf_img_p2_A[4].stimulus,
          stim_text_1: inf_img_p2_A[0].text,
          stim_text_2: inf_img_p2_A[1].text,
          stim_text_3: inf_img_p2_A[2].text,
          stim_text_4: inf_img_p2_A[3].text,
          stim_text_5: inf_img_p2_A[4].text,
          slider_text_top: contingency_q[2],
          labels_top: contingency_labels,
          stimulus_height: inf_stim_height,
          slider_width: inf_slider_width,
          require_movement: false,
          data: {
            phase: 'inf_check_2_B',
            block_number: i + nBlocks_p1
          }
        };
    
        // inference check p2 (ship 1)
        var infer_p2_ship1 = {
          type: 'inference-check-1',
          main_stimulus: 'img/ship1.png',
          main_stimulus_height: main_stim_height,
          prompt: inference_prompt[3],
          stimulus_1: 'img/lose.png',
          stim_text_1: 'Losing $',
          slider_text_top: contingency_q[3],
          labels_top: contingency_labels,
          stimulus_height: inf_stim_height,
          slider_width: inf_slider_width,
          require_movement: false,
          data: {
            phase: 'inf_check_2_ship1',
            block_number: i + nBlocks_p1
          }
        };
    
        // inference check p2 (ship 2)
        var infer_p2_ship2 = {
          type: 'inference-check-1',
          main_stimulus: 'img/ship2.png',
          main_stimulus_height: main_stim_height,
          prompt: inference_prompt[4],
          stimulus_1: 'img/lose.png',
          stim_text_1: 'Losing $',
          slider_text_top: contingency_q[4],
          labels_top: contingency_labels,
          stimulus_height: inf_stim_height,
          slider_width: inf_slider_width,
          require_movement: false,
          data: {
            phase: 'inf_check_2_ship2',
            block_number: i + nBlocks_p1
          }
        };

        // inference check p2 (ship 2)
        var infer_p2_ship3 = {
          type: 'inference-check-1',
          main_stimulus: 'img/ship3.png',
          main_stimulus_height: main_stim_height,
          prompt: inference_prompt[5],
          stimulus_1: 'img/lose.png',
          stim_text_1: 'Losing $',
          slider_text_top: contingency_q[5],
          labels_top: contingency_labels,
          stimulus_height: inf_stim_height,
          slider_width: inf_slider_width,
          require_movement: false,
          data: {
            phase: 'inf_check_2_ship2',
            block_number: i + nBlocks_p1
          }
        };
    
        //NEW: slider questions p2
        //NEW: define slider Qs variables
        var left_label ="";
        var right_label ="";
        var slider_p2_q1 = {
          type: 'html-slider-response',
          prompt: "Reflecting back on what you did in the most recent block, <p>what proportion of your recent interactions were with Planet A (left) versus Planet B (right)?</p>",
          left_stimulus: slider_img_left[0].stimulus,
          left_stim_text: slider_img_left[0].text,
          right_stimulus: slider_img_right[0].stimulus,
          right_stim_text: slider_img_right[0].text,
          labels: ["100%/0%<p>(only click Planet A)</p>", "75%/25%", "50%/50%<p>(click both equally)</p>", "25%/75%", "0%/100%<p>(only click Planet B)</p>"],
          stimulus_height: 250,
          slider_width: 700,
          require_movement: false,
          data: {
            phase: 'slider-response_p2_q1',
            block_number: i + nBlocks_p1
          }
        };
    
        var slider_p2_q2 = {
          type: 'html-slider-response',
          prompt: "To maximise your points in the <b>previous block</b>, what proportion of interactions would you allocate for Planet A (left) versus Planet B (right)?",
          left_stimulus: slider_img_left[0].stimulus,
          left_stim_text: slider_img_left[0].text,
          right_stimulus: slider_img_right[0].stimulus,
          right_stim_text: slider_img_right[0].text,
          labels: ["100%/0%<p>(only click Planet A)</p>", "75%/25%", "50%/50%<p>(click both equally)</p>", "25%/75%", "0%/100%<p>(only click Planet B)</p>"],
          stimulus_height: 250,
          slider_width: 700,
          require_movement: false,
          data: {
            phase: 'slider-response_p2_q2',
            block_number: i + nBlocks_p1
          }
        };
    

// NEW: slider questions p2
// NEW: define slider Qs variables
var left_label = "";
var right_label = "";

// Question 3
var slider_p2_q3 = {
  type: 'html-slider-triangle',
  prompt: "<p>What proportion of your recent interactions were with:</p>",
          //  "<ul><li>Planet A (left),</li><li>Planet B (middle), and</li><li>Planet C (right)?</li></ul>",
  stimulus_left: stim_list[0],
  stimulus_right: stim_list[1],
  stimulus_top: stim_list[2],
  stimulus_height: 250,
  slider_width: 900, // Increased width to accommodate more space for labels
  labels: ["100%/0%/0%<p>(only click Planet A)</p>", "66%/33%/0%", "50%/50%/0%<p>(click all equally)</p>", "33%/66%/0%", "0%/100%/0%<p>(only click Planet B)</p>", "0%/0%/100%<p>(only click Planet C)</p>"],
  require_movement: false,
  data: {
    phase: 'slider-response_p2_q3',
    block_number: i + nBlocks_p1,
  }
};


// // Question 4
// var slider_p2_q4 = {
//   type: 'jspsych-html-slider-3items',
//   prompt: "<p>To maximize your points in the <b>previous block</b>, what proportion of interactions would you allocate for:</p>" +
//            "<ul><li>Planet A (left),</li><li>Planet B (middle), and</li><li>Planet C (right)?</li></ul>",
//   left_stimulus: slider_img_left[0].stimulus,
//   left_stim_text: slider_img_left[0].text,
//   middle_stimulus: slider_img_center[0].stimulus,
//   middle_stim_text: slider_img_center[0].text,
//   right_stimulus: slider_img_right[0].stimulus,
//   right_stim_text: slider_img_right[0].text,
//   slider_values: [33, 33, 34], // Initial slider values for the 3 items
//   stimulus_height: 250,
//   slider_width: 900, // Increased width to accommodate more space for labels
//   labels: ["100%/0%/0%<p>(only click Planet A)</p>", "66%/33%/0%", "50%/50%/0%<p>(click all equally)</p>", "33%/66%/0%", "0%/100%/0%<p>(only click Planet B)</p>", "0%/0%/100%<p>(only click Planet C)</p>"],
//   require_movement: false,
//   data: {
//     phase: 'slider-response_p2_q4',
//     block_number: i + nBlocks_p1
//   }
// };

//----------------------------------------------------------------------------
// --- Phase 3

// 2 planet -> 3 planet conversion:
// How do we want to raise the 3 levels of pirate attraction

// instructlate = [          // past tense (LATE condition)
// '<p>Your signals to the ' + planet_side[0]+ ' planet (' + planet_layout[0] + ' side) have been attracting pirate ships (Ship: Type ' + pun_ship + '), that have been stealing your points! </p>' +

// ];

// instructearly = [          // future tense (LATE condition)
// '<p>Local intel has determined where the pirates are coming from!</p>' +
// '<p>Your signals to the ' + planet_side[0]+ ' planet (' + planet_layout[0] + ' side) will attract pirate ships (Ship: Type ' + pun_ship + ') and steal your points! </p>' +
// ];


// if (group.includes("early")) {      // EARLY condition
// 	for (var i=0; i<nBlocks_p2; i++){

// 		if (i === nBlocks_p2-4) {
			
			// present correct contingencies
			var cont_instructions = {
				type: 'instructions',
				pages: [
					'<p>Local intel has determined where the pirates are coming from!<br>Click Next to view this intel.</p>',
          '<p>[decide how to present this information]</p>',
        ],
				allow_keys: false,
				show_clickable_nav: true,
				post_trial_gap: iti,
				data: {
					phase: 'instruct contingencies'
				}
			};

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







// ---- Timeline creation ----
let timeline = []; // This is the master timeline, the experiment runs sequentially based on the objects pushed into this array.

// Induction
// timeline.push(fullscreen);
// timeline.push(consent_block);
// timeline.push(demographics_block);
// timeline.push(gen_ins_block);
timeline.push(instructionCheckWithFeedback);
timeline.push(end_instruction);   

// // Phase 1, no ships
// addBlocksToTimeline(timeline, planet_noship, nBlocks_p1, nTrialspBlk);
// timeline.push(valence_p1);
// timeline.push(infer_p1_A);
// timeline.push(infer_p1_B);
// timeline.push(infer_p1_C);

// timeline.push(slider_p1_q1); // replace with triangle
// timeline.push(slider_p1_q2); //
// // timeline.push(slider_p1_q3); // replace with triangle
// // timeline.push(slider_p1_q4); //

// // Phase2, ships
// timeline.push(phaseTwoInstructions);
// addBlocksToTimeline(timeline, planet_ship, nBlocks_p2, nTrialspBlk);

// timeline.push(valence_p2);
// timeline.push(infer_p2_A);
// timeline.push(infer_p2_B);
// timeline.push(infer_p2_C);
// timeline.push(infer_p2_ship1);
// timeline.push(infer_p2_ship2);
// timeline.push(infer_p2_ship3);
// timeline.push(slider_p2_q1); //
// timeline.push(slider_p2_q2); //

// // timeline.push(slider_p2_q3); // replace with triangle
// // timeline.push(slider_p2_q4); //





// //Phase3, ships
// timeline.push(cont_instructions);
// addBlocksToTimeline(timeline, planet_ship, nBlocks_p3, nTrialspBlk);
// timeline.push(valence_p2);
// timeline.push(infer_p2_A);
// timeline.push(infer_p2_B);
// timeline.push(infer_p2_C);
// // timeline.push(slider_p2_q3); // replace with triangle
// // timeline.push(slider_p2_q4); //

// //Debrief
// timeline.push(debrief_block);
// timeline.push(contact_block);



// planet A/B sliders (do we want more sliders for planet C?) 


// timeline.push(exit_experiment);

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