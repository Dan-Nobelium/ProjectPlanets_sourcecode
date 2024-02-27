      
    /* 
    //----------------------------------------------------------------------------
    // Experiment Parameters
    //----------------------------------------------------------------------------
      Randomises the participant's group and sample. Also sets up the randomised
      position of the punished planet, left-right assignment of planets and ships,
      global variables, and the images list. */
    
     

      // Participant Sample Selection
      let groups = ["early_0.1", "early_0.4", "late_0.1", "late_0.4"];      
      let group = "" + jsPsych.randomization.sampleWithReplacement(groups, 1) + "";
      let samples = ["ProA", "others"];
      let sample = samples[0];  

      // randomise position of punished planet, left-right assignment of planets and ships
      let num_planets = 3;
      let pun_planet_sides = [...Array(num_planets).keys()].map(x => x.toString());
      let pun_planet_side = jsPsych.randomization.sampleWithReplacement(pun_planet_sides, 1)[0];

      // Stimulus List Initialization
      const stim_list = jsPsych.randomization.repeat(['img/bluep.png','img/orangep.png', 'img/pinkp.png'], 1);
      const ship_list = jsPsych.randomization.repeat(['img/ship1.png','img/ship2.png','img/ship3.png'], 1);
      const stim_selector_highlight = 'img/selectring.png';
    
      // Global Variables Definition
      let block_number = 0;
      let trial_number = 0;
      let points = 0;
      const nBlocks_p1 = 2;
      const nBlocks_p2 = 4;
      const block_duration = 180 * 1; // in milliseconds (3 mins)
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

    
      // manipulate response-ship Rft rate
      if (group.includes("0.1")) {
        let probability_ship = [[0.1],[0.1]]; 
        let ship_attack_damage = 100;
      } else if (group.includes("0.2")) {
        let probability_ship = [[0.2],[0.2]];
        let ship_attack_damage = 100;
      } else if (group.includes("0.4")) {
        let probability_ship = [[0.4],[0.4]];
        let ship_attack_damage = 100;
      }

      //Continious or discreete testing phases
      let continuousResp = true;
      let nTrialspBlk = 5; //if continuousResp is true though, this doesn't matter
      if (continuousResp){
          let nTrialspBlk = 1;
      }
    

      let images = [
        'img/signal1.png','img/signal2.png','img/signal3.png','img/signal4.png',
        'img/ship1.png','img/ship2.png',
        'img/bluep.png','img/orangep.png',
        'img/cursor.png','img/cursordark.png', 'img/selectring.png',
        'img/win100.png', 'img/lose.png',
        'img/arrow.jpg', 'img/blank_lose.jpg', 'img/blank_arrow.jpg'
      ];
    
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
            timeline.push(block);
        }
      }




      // ----- Timeline creation -----
      let timeline = []; // This is the master timeline, the experiment in sequence based on the objects pushed into this array.



//data

let demo_text = [
  '<p> Gender: ' +
  '<input type="radio" name="gender" value="male" required/> Male &nbsp; ' +
  '<input type="radio" name="gender" value="female" required/> Female &nbsp;' +
  '<input type="radio" name="gender" value="other" required/> Other<br>' + '<br>' +
  '<p> Age: <input name="age" type="text" required/> </p>' + '<br>' +
  '<p> Native language: <input name="language" type="text" required/> </p>' + '<br>'
];


  // demographics
  let demographics_block = {
    type: 'survey-html-form',
    preamble: '<p><b>Please fill in your demographic details</b></p>',
    html: demo_text,
    data: {
      phase: 'demographics'
    }
  };
  timeline.push(demographics_block);


// let consent_text = [
//   '<img src= "./img/logo.png"></img>' +
//     '<p>Welcome to the experiment!</p>' +
//     '<p>Before you begin, please read the information sheet carefully.</p>' +
//     '<br>' +
//     '<p><b>PARTICIPANT INFORMATION STATEMENT AND CONSENT</b></p>' +
//       '<embed src="data/consent/PIS_SONA_3385.pdf" width="800px" height="2100px" />' +
//     '<p>By continuing, you are making a decision whether or not to participate. Clicking the button below indicates that, having read the information provided on the participant information sheet, you consent to the above.' +
//     '<br></p>'
//   ];



//       // info statement and consent
//       var consent_block = {
//         type: 'html-button-response',
//         stimulus: consent_text,
//         choices: ['I consent to participate'],
//     data: {
//       phase: 'consent'
//     },
//     }
//     timeline.push(consent_block);


  

        //----------------------------------------------------------------------------
        // ----- Phase 1 -----
      

          // define task blocks with no ships
          let planet_noship = {
              type: 'planet-response',
              show_ship: false,
              stimulus: stim_list,
              stimulus_select: stim_selector_highlight,
              ship_stimulus: ship_list,              
              reset_planet_wait: reset_planet_wait_const,
              shield_charging_time: shield_charging_time_const,
              ship_attack_time: ship_attack_time_const,
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
      
          addBlocksToTimeline(timeline, planet_noship, nBlocks_p1, nTrialspBlk);

        //----------------------------------------------------------------------------
        // 
         {
        let subject_id = jsPsych.data.getURLVariable('Subject_id');
        if (subject_id === undefined) {
          subject_id = null;
        }
      
        jsPsych.data.addProperties({
          subject_id: subject_id,
          group: group,
          sample: sample,
          pun_planet_side: pun_planet_side,
          pun_planet: stim_list[pun_planet_side],
          pun_ship: ship_list[pun_planet_side],
          nBlocks_p1: 1,
          nBlocks_p2: 2
        });
      
        jsPsych.init({
          timeline: timeline,
          preload_images: images,
          on_finish: function() {

            jsPsych.data.displayData();
          }
        });
      }