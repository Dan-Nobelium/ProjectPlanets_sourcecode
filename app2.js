      
    /* 
    //----------------------------------------------------------------------------
    // Experiment Parameters
    //----------------------------------------------------------------------------
      Randomises the participant's group and sample. Also sets up the randomised
      position of the punished planet, left-right assignment of planets and ships,
      global variables, and the images list. */
    
      // var groups = ["early_0.1", "early_0.4", "late_0.1", "late_0.4"];
      let groups = ["early_0.1", "early_0.4", "intermediate_0.2", "late_0.1", "late_0.4"];
      
      let group = "" + jsPsych.randomization.sampleWithReplacement(groups, 1) + "";
    
    
      // Participant Sample Selection
      const samples = ["ProA", "others"];
      let sample = samples[0];
    
      //var completion_code = (Math.floor(Math.random() * 99999) * 397).toString();
    
      // randomise position of punished planet, left-right assignment of planets and ships
      const num_planets = 3;
      var pun_planet_sides = [...Array(num_planets).keys()].map(x => x.toString());
      let pun_planet_side = jsPsych.randomization.sampleWithReplacement(pun_planet_sides, 1)[0];
    
      // Stimulus List Initialization
      const stim_list = jsPsych.randomization.repeat(['img/bluep.png','img/orangep.png', 'img/planet3.png'], 1);
      const ship_list = jsPsych.randomization.repeat(['img/ship1.png','img/ship2.png','img/ship3.png'], 1);
    
      // // Contingency Instructions Screen Setup
      // const pun_planet = stim_list[pun_planet_side].substring(4).slice(0, -5);
      // const unpun_planet = stim_list[1 - pun_planet_side].substring(4).slice(0, -5);
      // const pun_ship = ship_list[pun_planet_side].substring(8).slice(0, -4);
      // const unpun_ship = ship_list[1 - pun_planet_side].substring(8).slice(0, -4);
      // const planet_layout = pun_planet_side === "0" ? ["left", "right"] : ["right", "left"];
    
      // Global Variables Definition
      let block_number = 0;
      let trial_number = 0;
      let points = 0;
      let continuousResp = true;
      const nBlocks_p1 = 2;
      const nBlocks_p2 = 4;
      const block_duration = 180 * 10; // in milliseconds (3 mins)
      const iti = 1000;
      const inf_stim_height = 80;
      const inf_slider_width = 500;
      const main_stim_height = 250;
      const feedback_duration = 2500;
      const rf_ship_delay = 1500;
      const probability_trade = [[.5], [.5]];
      const probability_shield = [[.5], [.5]];

    
      // manipulate response-ship Rft rate
      if (group.includes("0.1")) {
        var probability_ship = [[0.1],[0.1]]; 
        var ship_attack_damage = 100;
      } else if (group.includes("0.2")) {
        var probability_ship = [[0.2],[0.2]];
        var ship_attack_damage = 100;
      } else if (group.includes("0.4")) {
        var probability_ship = [[0.4],[0.4]];
        var ship_attack_damage = 100;
      }
    
        var nTrialspBlk = 5; //if continuousResp is true though, this doesn't matter
        if (continuousResp){
            var nTrialspBlk = 1;
        }
    
      
      let images = [
        'img/signal1.png','img/signal2.png','img/signal3.png','img/signal4.png',
        'img/ship1.png','img/ship2.png',
        'img/bluep.png','img/orangep.png',
        'img/cursor.png','img/cursordark.png', 'img/selectring.png',
        'img/win100.png', 'img/lose.png',
        'img/arrow.jpg', 'img/blank_lose.jpg', 'img/blank_arrow.jpg'
      ];
    
        
  //   //----------------------------------------------------------------------------
  //   /* self-report questionnaires (CFI-HTQ-AUDIT) */
  
  //----------------------------------------------------------------------------
      
      //----------------------------------------------------------------------------
        /* experiment blocks */
      
          // initialise timeline
        var introloop = [];
        var timeline = [];
        var block6loop = []
      
      
      //force full screen
        timeline.push(
          {
            type: 'fullscreen',
            fullscreen_mode: true
          }
        );


        //----------------------------------------------------------------------------
        // ----- Phase 1 -----
      
          // define task blocks with no ships
          var planet_noship = {
              type: 'planet-response',
              stimulus: stim_list,
              stimulus_select:'img/selectring.png',
              prompt: ['Planet A','Planet B','Planet C'],
              ship_stimulus: ship_list,
              show_ship: false,
              reset_planet_wait: 1000,
              shield_charging_time: 3000,
              ship_attack_time: 6000,
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
      
          // loop over specified number of blocks
          for (var i=0; i<nBlocks_p1; i++) {
              var block_noship = {
                  timeline: [planet_noship],
                  repetitions: nTrialspBlk,
                  data: {
                      phase: 'phase1'
                  }
              }
              timeline.push(block_noship);
      
          
          }
      
      
      
      
        //----------------------------------------------------------------------------
        // 
         {
        var subject_id = jsPsych.data.getURLVariable('Subject_id');
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
            var result = jsPsych.data.get().json();
      
            // Move this line down from outside jsPsych.init()
            var jsonData = jsPsych.data.get().json();
      
            // Output JSON data to the console
            console.log(jsonData);
      
            // Call the saveJsPsychData() function with appropriate arguments
            saveJsPsychData(jsonData, 'experiment_data');
      
            // jatos.submitResultData(result, function() {
            //   document.write('<div id="endscreen" class="endscreen" style="width:1000px"><div class="endscreen" style="text-align:center; border:0px solid; padding:10px; font-size:120%; width:800px; float:right"><p>' +
            //   finish_msg +
            //   '</p></div></div>')
            // });
            jsPsych.data.displayData();
          }
        });
      }