
//----------------------------------------------------------------------------
// Import JS files
//----------------------------------------------------------------------------


//----------------------------------------------------------------------------
// Functions
//----------------------------------------------------------------------------

/**
 * Saves JSPsych data as a local JSON file.
 *
 * @param {Object|Array<Object>} outputData - Output data received from JSPsych
 */
async function saveJsPsychData(outputData) {
  try {
  // Ensure that the input is treated as an array
  const processedOutput = Array.isArray(outputData)
  ? outputData
  : [outputData];
  // Decode the inner JSON strings since they appear to include multiple entries
  const decodedData = [];
  for (const datum of processedOutput) {
  decodedData.push(JSON.parse(datum));
  }

  // Convert the data structure to JSON format and add whitespace
  const jsonData = JSON.stringify(decodedData, null, 2);

  // Construct a Blob object consisting of the JSON data
  const blob = new Blob([jsonData], { type: 'application/json' });

  // Define the filename for the JSON file
  const fileName = 'user_data.json';

  // Generate a downloadable anchor element with the specified attributes
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', URL.createObjectURL(blob));
  linkElement.setAttribute('download', fileName);

  // Simulate clicking the anchor element to initiate the download
  linkElement.style.display = 'none';
  document.body.appendChild(linkElement);
  linkElement.click();
  document.body.removeChild(linkElement);
  } catch (error) {
  console.error('An error occurred: ', error);
  }

}

    // toggle on/off for dev
      const runJatos = false;
    
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
    
      // Contingency Instructions Screen Setup
      const pun_planet = stim_list[pun_planet_side].substring(4).slice(0, -5);
      const unpun_planet = stim_list[1 - pun_planet_side].substring(4).slice(0, -5);
      const pun_ship = ship_list[pun_planet_side].substring(8).slice(0, -4);
      const unpun_ship = ship_list[1 - pun_planet_side].substring(8).slice(0, -4);
      const planet_layout = pun_planet_side === "0" ? ["left", "right"] : ["right", "left"];
    
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
    
  //----------------------------------------------------------------------------
  /* instructions text */
  let consent_text = [
    '<img src= "./img/logo.png"></img>' +
      '<p>Welcome to the experiment!</p>' +
      '<p>Before you begin, please read the information sheet carefully.</p>' +
      '<br>' +
      '<p><b>PARTICIPANT INFORMATION STATEMENT AND CONSENT</b></p>' +
        '<embed src="data/consent/PIS_SONA_3385.pdf" width="800px" height="2100px" />' +
      '<p>By continuing, you are making a decision whether or not to participate. Clicking the button below indicates that, having read the information provided on the participant information sheet, you consent to the above.' +
      '<br></p>'
    ];
  
    let demo_text = [
      '<p> Gender: ' +
      '<input type="radio" name="gender" value="male" required/> Male &nbsp; ' +
      '<input type="radio" name="gender" value="female" required/> Female &nbsp;' +
      '<input type="radio" name="gender" value="other" required/> Other<br>' + '<br>' +
      '<p> Age: <input name="age" type="text" required/> </p>' + '<br>' +
      '<p> Native language: <input name="language" type="text" required/> </p>' + '<br>'
    ];
    
  
    if (sample === "ProA") {
      var ProA_insert = [
        '<p>If anything goes wrong during the experiment, please take a screenshot and notify the requester. Please <b>DO NOT</b> hit refresh or the back button on your browser. This will make it hard for you to get paid.</p>' +
        '<p>If you complete the task and pass the attention check, you will get your payment no matter what. Please take your time and think about your predictions and judgements seriously. </p>'
      ]
    } else {
      var ProA_insert = '';
    }
  
    // instruction check
    var Q0_text = "<b>Question 1:</b> The aim of the task is to:";
    var Q0_answers = ["Get as many points as possible", "Battle the aliens on the planets"];
    var Q1_text = "<b>Question 2:</b> Clicking on each planet will: ";
    var Q1_answers = ["Make the planet disappear", "Sometimes result in a successful trade, earning me points"];
    var Q2_text = "<b>Question 3:</b> There will be multiple blocks in this experiment, with questions in between each block. ";
    var Q2_answers = ["FALSE", "TRUE"];
    var Q3_text = "<b>Question 4:</b> The top 10% performers at the end of the task will receive: ";
    var Q3_answers = ["An additional monetary prize", "Extra course credit"];
    var correctstring = '{"Q0":"' + Q0_answers[0] +
      '","Q1":"' + Q1_answers[1] +
      '","Q2":"' + Q2_answers[1] +
      '","Q3":"' + Q3_answers[0] +
      '"}';
  
    // contingency check
    var Q0_cont_text = "<b>Question 1:</b> Which (pirate) ship leads to attacks?";
    var Q0_cont_answers = ['Ship Type 1', 'Ship Type 2','Ship Type 3'];
    var Q1_cont_text = "<b>Question 2:</b> Which planet has been attracting pirate ships?";
    var Q1_cont_answers = ['The ' + pun_planet + ' planet (' + planet_layout[0] + ' side)', 'The ' + unpun_planet + ' planet (' + planet_layout[1] + ' side)'];
    // var Q2_cont_text = "<b>Question 3:</b> Which ship has the " + pun_planet + "  planet (" + planet_layout[0] + " side) been attracting?";
    // var Q2_cont_answers = ["Ship Type 1", "Ship Type 2"];
    // var Q3_cont_text = "<b>Question 4:</b> Which ship has the " + unpun_planet + "  planet (" + planet_layout[0] + " side) been attracting?";
    // var Q3_cont_answers = ["Ship Type 1", "Ship Type 2"];
    var correctstring_cont = '{"Q0":"' + Q0_cont_answers[pun_ship-1] +
      '","Q1":"' + Q1_cont_answers[0] +
      // '","Q2":"' + Q1_cont_answers[parseInt(pun_ship-1)] +
      // '","Q3":"' + Q2_cont_answers[parseInt(unpun_ship-1)] +
      '"}';


      
    var ins = {};
  
    ins.preques = [
      '<p>WELCOME TO THE EXPERIMENT!</p>' +
      '<p>To ensure high-quality data and minimise fatigue, we ask that you make a concerted effort to complete the study <b>within 45 minutes </b>. Please keep in mind that those who take significantly longer may be timed out and they may not be eligible to complete the remainder of the study. </p>' +
      '<p>Before commencing the game, we will ask you a couple of questions about yourself. Please read each item carefully and answer as accurately as possible. This would take 5-10 minutes to complete. </p>'
    ];
    
    ins.pretrain1 = [
      '<p>EXPERIMENT PHASE BEGINS</p>' +
      '<p>Throughout the experiment, please <b>read all instructions carefully</b> and click on the buttons to go forward or back. You may need to scroll down on some pages. </p>' +
      ProA_insert +
      '<p>Please complete the experiment in ONE sitting in FULL SCREEN mode <b>on a computer or a tablet (not a phone).</b></p>'
    ];
  
    ins.pretrain2 = [
      '<p>In this experiment you will be playing a game over 6 blocks. </p>' +
      '<p>In this game, you are an intergalactic trader in space. You will be situated between two planets that you can trade with. You can send a signal to each planet by clicking on them. Sometimes locals on these planets will receive the signal and be willing to trade. Each successful trade will give you points. </p>' +
      '<p><b>Your goal is to gain as many points as possible. </b></p>'
      // '<p><b>Note:</b> Whatever you earn in-game will be converted into real money for you at the end of the experiment. The more you earn in-game, the more you make in real life. You can earn more points by trading with both planets. </p>'
    ];
  
    ins.pretrain3 = [
      '<p>You can click on each of the planets as many times as you like. Just remember, the aim is to get as many points as possible! </p>' +
      '<p>There are multiple blocks in this experiment. Between each block we will ask you some questions about each of the game elements. </p>' +
      '<p>Please do your best to engage in the task and answer all questions to the best of your ability. </p>' +
      '<p><b>There will be monetary prizes for participants with high scores (top 10% of the cohort) and <i>timely</i> answers </b>, so try do your best! </p>'
    ];
  

  
    ins.phase2 = [
      '<p>There have been reports of local pirates stealing from trading ships. Watch out! </p>' +
      // '<p>In the next few blocks, trading with a planet might result in the arrival of a pirate ship. </p>' +
      '<p>Your ship has a shield that can keep these pirates from stealing from you, but the shield will not always be available. If available, you can activate the shield by pressing the ACTIVATE button. </p>' +
      '<p>Remember, your goal is still to <b> gain as many points as possible! </b></p>'
    ];
  
    ins.instructlate = [          // past tense (LATE condition)
      '<p>Local intel has determined where the pirates are coming from!</p>' +
      '<br>' +
      '<p>Your signals to the ' + pun_planet + ' planet (' + planet_layout[0] + ' side) have been attracting pirate ships (Ship: Type ' + pun_ship + '), that have been stealing your points! </p>' +
      '<p><img src=' + stim_list[pun_planet_side] + ' height="100">' +
      '<img src=' + 'img/arrow.jpg' + ' height="100">' + 
      '<img src=' + ship_list[pun_planet_side] + ' height="100">' +
      '<img src=' + 'img/arrow.jpg' + ' height="100">' + 
      '<img src=' + 'img/lose.png' + ' height="100"></p>' + 
      '<br><br><br>' +
      '<p>Your signals to the ' + unpun_planet + ' planet (' + planet_layout[1] + ' side) have only been attracting friendly ships (Ship: Type ' + unpun_ship + '). </p>' +
      '<p><img src=' + stim_list[1-pun_planet_side] + ' height="100">' +
      '<img src=' + 'img/arrow.jpg' + ' height="100">' + 
      '<img src=' + ship_list[1-pun_planet_side] + ' height="100">' + 
      '<img src=' + 'img/blank_arrow.jpg' + ' height="100">' + 
      '<img src=' + 'img/blank_lose.jpg' + ' height="100"></p>'
    ];
  
    ins.instructearly = [          // future tense (LATE condition)
      '<p>Local intel has determined where the pirates are coming from!</p>' +
      '<br>' +
      '<p>Your signals to the ' + pun_planet + ' planet (' + planet_layout[0] + ' side) will attract pirate ships (Ship: Type ' + pun_ship + ') and steal your points! </p>' +
      '<p><img src=' + stim_list[pun_planet_side] + ' height="100">' +
      '<img src=' + 'img/arrow.jpg' + ' height="100">' + 
      '<img src=' + ship_list[pun_planet_side] + ' height="100">' +
      '<img src=' + 'img/arrow.jpg' + ' height="100">' + 
      '<img src=' + 'img/lose.png' + ' height="100"></p>' + 
      '<br><br><br>' +
      '<p>Your signals to the ' + unpun_planet + ' planet (' + planet_layout[1] + ' side) will only attract friendly ships (Ship: Type ' + unpun_ship + '). </p>' +
      '<p><img src=' + stim_list[1-pun_planet_side] + ' height="100">' +
      '<img src=' + 'img/arrow.jpg' + ' height="100">' + 
      '<img src=' + ship_list[1-pun_planet_side] + ' height="100">' + 
      '<img src=' + 'img/blank_arrow.jpg' + ' height="100">' + 
      '<img src=' + 'img/blank_lose.jpg' + ' height="100"></p>'
    ];
  
    ins.debrief = [
      '<p>Please confirm that you have read the debriefing questions below: </p>' +
  
      '<p><b><i>What are the research questions?</i></b></p>' + 
      '<p>Our behaviour changes in response to experienced rewards and losses. This study asks how behaviour and accompanying beliefs change when these outcomes have varying degrees of relationship to our behaviour. </p>' +
  
      '<p><b><i>How does this study extend on previous research on this topic?</i></b></p>' +
      '<p>Existing research suggests that stronger relationships between behaviours and outcomes will influence behaviour more. For example, behaviours that earn immediate and regular rewards are more likely to be reinforced than behaviours with a weaker relationship to rewards. We extend this by examining how dependent these changes are on beliefs and personality traits. </p>' +
  
      '<p><b><i>What are some potential real-world implications of this research?</i></b></p>' +
      '<p>We learn about our environments through experience. Understanding how beliefs develop with this experience to change behaviour can help us better understand and predict adaptive/maladaptive decision-making. A potential outcome of this understanding is the development of more effective strategies to improve learning and decision-making. </p>' +
  
      '<p><b><i>Describe a potential issue or limitation of the study (e.g., ethical, design etc.), or opportunities for future work that extends this study.</i></b></p>' +
      '<p>Participants might have prior experience or beliefs that would affect performance in the task. We have attempted to control for this by using a cover-story to help participants understand and engage in the task. Future studies could vary this cover-story to assess how this affects learning and decision-making in the task. </p>' +
  
      '<p><b><i>Describe the study methodology (e.g., design, dependent/independent variables, stimulus presentation).</i></b></p>' +
      '<p>Participants are given the opportunity to click on “planets” to earn point rewards. In addition to this, “ships” that may or may not result in point loss are presented. The key independent variable is the programmed strength of the relationship between particular actions and point outcomes (weak vs. strong relationship). The key dependent variables are clicking behaviour, valuations of task elements, and inferred relationships between task elements. Personality traits are also assessed to observe how these relate to behaviour and beliefs. </p>' +
  
      '<p><b><i>Further reading: </i></b></p>' +
      '<p> Lovibond, P.F., & Shanks, D.R. (2002). The role of awareness in Pavlovian conditioning: Empirical evidence and theoretical implications. Journal of Experimental Psychology: Animal Behavior Processes, 28, 3. </p>'
    ];
    
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
        text: "Planet B (right)"
      },
      {
        stimulus: 'img/ship1.png',
        text: "Ship 1"
      },
      {
        stimulus: 'img/ship2.png',
        text: "Ship 2"
      }
      ];
    
      var valence_labels = [
        'Very <br>negative',
        'Slightly <br>negative',
        'Neutral',
        'Slightly <br>positive',
        'Very <br>positive'
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
    
      // phase 1, planet B
      var inf_img_p1_B = [
        {
          stimulus: 'img/win100.png',
          text: "Winning $100"
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
          stimulus: 'img/ship1.png',
          text: "Ship 1"
        },
        {
          stimulus: 'img/ship2.png',
          text: "Ship 2"
        },
      ];
    
      // phase 2, planet B
      var inf_img_p2_B = [
        {
          stimulus: 'img/win100.png',
          text: "Winning $100"
        },
        {
          stimulus: 'img/lose.png',
          text: "Losing $"
        },
        {
          stimulus: 'img/ship1.png',
          text: "Ship 1"
        },
        {
          stimulus: 'img/ship2.png',
          text: "Ship 2"
        },
      ];
    
      var contingency_labels = [
        '<p>' + 'Never' + '<br>(0%)</p>',
        '<p>' + 'Sometimes' + '</p>',
        '<p>' + 'Every time' + '<br>(100%)</p>'
      ];
    
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

      // var slider_img_right = [{
      //   stimulus: stim_list[2],
      //   text: "Planet C (right)"
      // }]
      
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
    
    
    '<img src= "./img/logo.png"></img>' +
        '<p>Welcome to the experiment!</p>'
    
      
    
      // info statement and consent
      var consent_block = {
            type: 'html-button-response',
            stimulus: consent_text,
            choices: ['I consent to participate'],
        data: {
          phase: 'consent'
        },
        }
        // timeline.push(consent_block);
    
      // demographics
      var demographics_block = {
        type: 'survey-html-form',
        preamble: '<p><b>Please fill in your demographic details</b></p>',
        html: demo_text,
        data: {
          phase: 'demographics'
        }
      };
      // timeline.push(demographics_block);
    
      
    
// define general instructions
var gen_ins_block = {
    type: "instructions",
    pages: [ins.pretrain1, ins.pretrain2, ins.pretrain3],
    allow_keys: false,
    show_clickable_nav: true,
    post_trial_gap: iti,
    data: {
      phase: "instructions",
    },
  };
  introloop.push(gen_ins_block);
    
      // define instruction check block
      var instructioncorrect = true; //was false
      var instruction_check = {
        type: "survey-multi-choice",
        preamble: ["<p align='center'><b>Check your knowledge before you begin!</b></p>"],
        questions: [
          {prompt: Q0_text, options: Q0_answers, required: true},
          {prompt: Q1_text, options: Q1_answers, required: true},
          {prompt: Q2_text, options: Q2_answers, required: true},
          {prompt: Q3_text, options: Q3_answers, required: true}
            ],
        on_finish: function(data) {
          if(data.responses == correctstring) {
            action = false;
            instructioncorrect = true;
            catchcorrect = true;
          }
        }
      }
      // introloop.push(instruction_check);
    
      // define a page for the incorrect response
      var showsplash = true;
      var splash_screen = {
        type: 'html-button-response',
        choices: ['Click here to read the instructions again'],
        stimulus: '<center>Unfortunately, at least one of your answers was incorrect.</center>'
      }
    
      // push it to a conditional node that only shows it if the response was wrong
      var conditional_splash = {
        timeline: [splash_screen],
        conditional_function: function(data) {
              return !instructioncorrect // skip if correct
          }
      }
        introloop.push(conditional_splash);
    
      // add all to loop node and push to timeline
      var loop_node = {
        timeline: introloop,
        loop_function: function(data) {
              //var action = true;
              return !instructioncorrect // stop looping if correct
          }
      }
        timeline.push(loop_node);
    
      // success trial
      var successtrial = {
        type: 'html-button-response',
        post_trial_gap: 0,
        choices: ['Click here to start Phase 1'],
        stimulus: '<center>Well done!</center>'
      };
        timeline.push(successtrial);
    
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
    
        // inference check p1 (planet B)
        var infer_p1_B = {
          type: 'inference-check-1',
          main_stimulus: stim_list[1],
          main_stimulus_height: main_stim_height,
          prompt: inference_prompt[1],
          stimulus_1: inf_img_p1_B[0].stimulus,
          stim_text_1: inf_img_p1_B[0].text,
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
    
      //NEW: slider questions p1 
      //NEW: define slider Qs variables
      let left_label ="";
      let right_label ="";
      
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
    
      //timeline.push(valence_p1);
      timeline.push(infer_p1_A);
      //timeline.push(infer_p1_B);
      //timeline.push(slider_p1_q1);
      //timeline.push(slider_p1_q2);
        
        }
    
    
        // ----- Phase 2 -----
    
        // define pre-phase 2 instructions
      var phase2_ins_block = {
        type: 'instructions',
        pages: [
          ins.phase2
          ],
        allow_keys: false,
        show_clickable_nav: true,
        post_trial_gap: iti,
        data: {
          phase: 'instructions'
        }
      };
    
    
      
      timeline.push(phase2_ins_block);
    
        // Generate list of shield appearances
        // copy a planet with ship version from noship
        var planet_ship = Object.assign({},planet_noship); // note that nested objects might not be copied and simply referenced? Be careful when trying to edit nested objects. Will probably need to clone them separately.
        planet_ship.show_ship = true;
        planet_ship.data = Object.assign({},planet_noship.data)
        planet_ship.data.block_type = 'planet_ship';
        planet_ship.show_ship_delay = rf_ship_delay;
        planet_ship.data.phase = 'Phase2';
        
        // push specified number of blocks into timeline
      if (group.includes("late")) {      // LATE condition
        for (var i=0; i<nBlocks_p2; i++){
    
            if (i === nBlocks_p2-1) {
                
                // present correct contingencies
                var cont_instructions = {
                    type: 'instructions',
                    pages: [
                        '<p>Local intel has determined where the pirates are coming from!<br>Click Next to view this intel.</p>',
                        ins.instructlate
                    ],
                    allow_keys: false,
                    show_clickable_nav: true,
                    post_trial_gap: iti,
                    data: {
                        phase: 'instruct contingencies'
                    }
                };
                block6loop.push(cont_instructions);
    
          // contingency knowledge quiz
          var contingenciescorrect = true; //was false
          var contingencies_check = {
            type: "survey-multi-choice",
            preamble: [
              "<p align='center'><b>Check your knowledge before you continue.</b></p>" +
              '<img src=' + ship_list[0] + ' height="100">' +
              '<img src=' + ship_list[1] + ' height="100">'],
            questions: [
              {prompt: Q0_cont_text, options: Q0_cont_answers, required: true},
              {prompt: Q1_cont_text, options: Q1_cont_answers, required: true}
                ],
            on_finish: function(data) {
              if( data.responses == correctstring_cont) {
                action = false;
                contingenciescorrect = true;
              }
            },
            data: {
              phase: 'contingency quiz'
            }
          }
          block6loop.push(contingencies_check);
    
          // define a page for the incorrect response
          var showsplash = true;
          var block6splash_screen = {
            type: 'html-button-response',
            choices: ['Click here to read the intel again'],
            stimulus: '<center>Unfortunately, at least one of your answers was incorrect.</center>'
          }
    
          // push it to a conditional node that only shows it if the response was wrong
          var block6conditional_splash = {
            timeline: [block6splash_screen],
            conditional_function: function(data) {
                  return !contingenciescorrect // skip if correct
              }
          }
          block6loop.push(block6conditional_splash);
    
          // add all to loop node and push to timeline
          var block6loop_node = {
            timeline: block6loop,
            loop_function: function(data) {
                  return !contingenciescorrect // stop looping if correct
              }
          }
                timeline.push(block6loop_node);
        }
    
          var block_ship = {
            timeline: [planet_ship],
            repetitions: nTrialspBlk
          }
          timeline.push(block_ship);
    
        // value check p2
        var valence_p2 = {
          type: 'valence-check-6',
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
          type: 'inference-check-4',
          main_stimulus: stim_list[0],
          main_stimulus_height: main_stim_height,
          prompt: inference_prompt[0],
          stimulus_1: inf_img_p2_A[0].stimulus,
          stimulus_2: inf_img_p2_A[1].stimulus,
          stimulus_3: inf_img_p2_A[2].stimulus,
          stimulus_4: inf_img_p2_A[3].stimulus,
          stim_text_1: inf_img_p2_A[0].text,
          stim_text_2: inf_img_p2_A[1].text,
          stim_text_3: inf_img_p2_A[2].text,
          stim_text_4: inf_img_p2_A[3].text,
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
    
        // inference check p2 (planet B)
        var infer_p2_B = {
          type: 'inference-check-4',
          main_stimulus: stim_list[1],
          main_stimulus_height: main_stim_height,
          prompt: inference_prompt[1],
          stimulus_1: inf_img_p2_B[0].stimulus,
          stimulus_2: inf_img_p2_B[1].stimulus,
          stimulus_3: inf_img_p2_B[2].stimulus,
          stimulus_4: inf_img_p2_B[3].stimulus,
          stim_text_1: inf_img_p2_B[0].text,
          stim_text_2: inf_img_p2_B[1].text,
          stim_text_3: inf_img_p2_B[2].text,
          stim_text_4: inf_img_p2_B[3].text,
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
    
        // inference check p2 (ship 1)
        var infer_p2_ship1 = {
          type: 'inference-check-1',
          main_stimulus: 'img/ship1.png',
          main_stimulus_height: main_stim_height,
          prompt: inference_prompt[2],
          stimulus_1: 'img/lose.png',
          stim_text_1: 'Losing $',
          slider_text_top: contingency_q[2],
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
          prompt: inference_prompt[3],
          stimulus_1: 'img/lose.png',
          stim_text_1: 'Losing $',
          slider_text_top: contingency_q[3],
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
        let left_label ="";
        let right_label ="";
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
    
            timeline.push(valence_p2);
            timeline.push(infer_p2_A);
            timeline.push(infer_p2_B);
            timeline.push(infer_p2_ship1);
            timeline.push(infer_p2_ship2);
        timeline.push(slider_p2_q1);
        timeline.push(slider_p2_q2);
        }
    }
    
    if (group.includes("early")) {      // EARLY condition
        for (var i=0; i<nBlocks_p2; i++){
    
            if (i === nBlocks_p2-4) {
                
                // present correct contingencies
                var cont_instructions = {
                    type: 'instructions',
                    pages: [
                        '<p>Local intel has determined where the pirates are coming from!<br>Click Next to view this intel.</p>',
                        ins.instructearly
                    ],
                    allow_keys: false,
                    show_clickable_nav: true,
                    post_trial_gap: iti,
                    data: {
                        phase: 'instruct contingencies'
                    }
                };
                //block6loop.push(cont_instructions);
    
          // contingency knowledge quiz
          var contingenciescorrect = false;
          var contingencies_check = {
            type: "survey-multi-choice",
            preamble: [
              "<p align='center'><b>Check your knowledge before you continue.</b></p>" +
              '<img src=' + ship_list[0] + ' height="100">' +
              '<img src=' + ship_list[1] + ' height="100">'],
            questions: [
              {prompt: Q0_cont_text, options: Q0_cont_answers, required: true},
              {prompt: Q1_cont_text, options: Q1_cont_answers, required: true}
                ],
            on_finish: function(data) {
              if( data.responses == correctstring_cont) {
                action = false;
                contingenciescorrect = true;
              }
            },
            data: {
              phase: 'contingency quiz'
            }
          }
          //block6loop.push(contingencies_check);
    
          // define a page for the incorrect response
          var showsplash = true;
          var block6splash_screen = {
            type: 'html-button-response',
            choices: ['Click here to read the intel again'],
            stimulus: '<center>Unfortunately, at least one of your answers was incorrect.</center>'
          }
    
          // push it to a conditional node that only shows it if the response was wrong
          var block6conditional_splash = {
            timeline: [block6splash_screen],
            conditional_function: function(data) {
                  return !contingenciescorrect // skip if correct
              }
          }
          //block6loop.push(block6conditional_splash);
    
          // add all to loop node and push to timeline
          var block6loop_node = {
            timeline: block6loop,
            loop_function: function(data) {
                  return !contingenciescorrect // stop looping if correct
              }
          }
                timeline.push(block6loop_node);
        }
    
            var block_ship = {
                timeline: [planet_ship],
                repetitions: nTrialspBlk
            }
            timeline.push(block_ship);
    
        // value check p2
        var valence_p2 = {
          type: 'valence-check-6',
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
          type: 'inference-check-4',
          main_stimulus: stim_list[0],
          main_stimulus_height: main_stim_height,
          prompt: inference_prompt[0],
          stimulus_1: inf_img_p2_A[0].stimulus,
          stimulus_2: inf_img_p2_A[1].stimulus,
          stimulus_3: inf_img_p2_A[2].stimulus,
          stimulus_4: inf_img_p2_A[3].stimulus,
          stim_text_1: inf_img_p2_A[0].text,
          stim_text_2: inf_img_p2_A[1].text,
          stim_text_3: inf_img_p2_A[2].text,
          stim_text_4: inf_img_p2_A[3].text,
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
    
        // inference check p2 (planet B)
        var infer_p2_B = {
          type: 'inference-check-4',
          main_stimulus: stim_list[1],
          main_stimulus_height: main_stim_height,
          prompt: inference_prompt[1],
          stimulus_1: inf_img_p2_B[0].stimulus,
          stimulus_2: inf_img_p2_B[1].stimulus,
          stimulus_3: inf_img_p2_B[2].stimulus,
          stimulus_4: inf_img_p2_B[3].stimulus,
          stim_text_1: inf_img_p2_B[0].text,
          stim_text_2: inf_img_p2_B[1].text,
          stim_text_3: inf_img_p2_B[2].text,
          stim_text_4: inf_img_p2_B[3].text,
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
    
        // inference check p2 (ship 1)
        var infer_p2_ship1 = {
          type: 'inference-check-1',
          main_stimulus: 'img/ship1.png',
          main_stimulus_height: main_stim_height,
          prompt: inference_prompt[2],
          stimulus_1: 'img/lose.png',
          stim_text_1: 'Losing $',
          slider_text_top: contingency_q[2],
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
          prompt: inference_prompt[3],
          stimulus_1: 'img/lose.png',
          stim_text_1: 'Losing $',
          slider_text_top: contingency_q[3],
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
        let left_label ="";
        let right_label ="";
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
    
        // 	timeline.push(valence_p2);
        // 	timeline.push(infer_p2_A);
        // 	timeline.push(infer_p2_B);
        // 	timeline.push(infer_p2_ship1);
        // 	timeline.push(infer_p2_ship2);
        //timeline.push(slider_p2_q1);
        //timeline.push(slider_p2_q2);
        }
    }
    
    
      // ----- HREAP-C stuff -----
    
      // debrief
      var debrief_block = {
        type: 'instructions',
        pages: [
          ins.debrief
          ],
        button_label_next: "I acknowledge that I have received this debriefing information" + " WOO",
        show_clickable_nav: true,
        post_trial_gap: iti,
        data: {
          phase: 'debrief'
        }
    
    
        
      };
      timeline.push(debrief_block);
    
      var contact_block = {
        type: 'survey-text',
        questions: [
          {
            prompt: 'If you would like to receive a copy of the study results via email, please provide your email address below. Your email address will be used for this purpose only, and will not be stored alongside your data. MEEE',
            rows: 2,
            columns: 80
          }
        ],
        preamble: '<font size="-1">You may leave this blank if you wish. </font>',
        data: {
          phase: 'contact'
        }
    
        
      };
      timeline.push(contact_block);
    
    
    
      //----------------------------------------------------------------------------
      // // start experiment
  
      
      // Code to run JATOS removed from here

      // else if (runJatos === false)
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
    
          jsPsych.data.displayData();
        }
      });
    }