      // toggle on/off for dev
        const runJatos = false;
      
      /* 
      //----------------------------------------------------------------------------
      // Experiment Parameters
      //----------------------------------------------------------------------------
        Randomises the participant's group and sample. Also sets up the randomised
        position of the punished planet, left-right assignment of planets and ships,
        global variables, and the images list. */
      
        var groups = ["early_0.1", "early_0.4", "late_0.1", "late_0.4"];        
        let group = "" + jsPsych.randomization.sampleWithReplacement(groups, 1) + "";
      
      
        // Participant Sample Selection
        const samples = ["ProA", "others"];
        let sample = samples[0];

        // Stimulus List Initialization
        const stim_list = jsPsych.randomization.repeat(['img/bluep.png','img/orangep.png', 'img/planet3.png'], 1);
        const ship_list = jsPsych.randomization.repeat(['img/ship1.png','img/ship2.png','img/ship3.png'], 1);
      
  
        
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
              ship_attack_damage: ship_attack_damage,
              ship_hostile_idx: pun_planet_side,
              block_duration: block_duration,
              reset_planet_wait: 1000,
              shield_charging_time: 3000,
              ship_attack_time: 6000,
              feedback_duration: feedback_duration,
              probability_trade: probability_trade,
              probability_ship: probability_ship,
              probability_shield: probability_shield,
              data: {
                  phase: 'phase1',
                  block_type: 'planet_noship',
                  block_number: block_number,
                  trial_number: trial_number
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
      
          // inference check p1 (planet A)
          var infer_p1_A = {
            type: 'inference-check-1',
            main_stimulus: stim_list[0],
            main_stimulus_height: main_stim_height,
            prompt: inference_prompt[0],
            stimulus_1: inf_img_p1_A[0].stimulus,
            stim_text_1: inf_img_p1_A[0].text,
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
      
        timeline.push(infer_p1_A);

          
          }
      
      
      
      
        //----------------------------------------------------------------------------
        // start experiment
        if (runJatos === true) {
        
        // JATOS
        jatos.onLoad(function() {
         //subject info 
          var subject_id = jatos.urlQueryParameters.PROLIFIC_PID;
        //var study_id = jsPsych.data.getURLVariable('Study_id');
        //var session_id = jsPsych.data.getURLVariable('Session_id');
          if (subject_id === undefined) {
              subject_id = null;
          }
      
         // add properties to each trial in the jsPsych data
         jsPsych.data.addProperties({
          subject_id: subject_id,
          //study_id: study_id,
          //session_id: session_id,
          group: group,
          sample: sample,
          pun_planet_side: pun_planet_side,
          pun_planet: stim_list[pun_planet_side],
          pun_ship: ship_list[pun_planet_side],
          nBlocks_p1: nBlocks_p1,
          nBlocks_p2: nBlocks_p2
        });
      
        var completion_url = 'https://app.prolific.co/submissions/complete?cc=C1AH5EU5';
        var finish_msg = 'All done! Click <a href="' + completion_url + '">here</a> to be returned to Prolific and receive your payment.';
      
      
      
      
      
        jsPsych.init({
          timeline: timeline,
          preload_images: images,
          on_finish: function() {
            var result = jsPsych.data.get().json();
            jsPsych.data.displayData();
      
            
            jatos.submitResultData(result, function() {
                document.write('<div id="endscreen" class="endscreen" style="width:1000px"><div class="endscreen" style="text-align:center; border:0px solid; padding:10px; font-size:120%; width:800px; float:right"><p><br><br><br>' +
                finish_msg +
                '</p></div></div>')
              });
            }
          });
        })
      
      
        }
        
      
        else if (runJatos === false) {
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
          nBlocks_p1: nBlocks_p1,
          nBlocks_p2: nBlocks_p2
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