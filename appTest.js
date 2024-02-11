
  //----------------------------------------------------------------------------
  /* self-report questionnaires (CFI-HTQ-AUDIT) */

  // CFI
  var cfi = [];
  cfi.prompt = '<b>Please rate how much you agree with the following statements. There are no right or wrong answers.</b>';
  cfi.items = [
    'I am good at "sizing up" situations.',
    'I have a hard time making decisions when faced with difficult situations.',
    'I consider multiple options making a decision.',
    'When I encounter difficult situations, I feel like I am losing control.',
    'I like to look at difficult situations from many different angles.',
    'I seek additional information not immediately available before attributing causes to behaviour.',
    'Select the left-most option, strongly disagree, for this question.',
    'When encountering difficult situations, I become so stressed that I can not think of a way to resolve the situation.',
    'I try to think about things from another person’ s point of view.', 
    'I find it troublesome that there are so many different ways to deal with difficult situations.',
    'I am good at putting myself in others’ shoes.',
    'When I encounter difficult situations, I just don’t know what to do.',
    'It is important to look at difficult situations from many angles.',
    'When in difficult situations, I consider multiple options before deciding how to behave.',
    'I  often look at a situation from different view-points.',
    'I am capable of overcoming the difficulties in life that I face.',
    'I consider all the available facts and information when attributing causes to behaviour.',
    'I feel I have no power to change things in difficult situations.',
    'When I encounter difficult situations, I stop and try to think of several ways to resolve it.',
    'I can think of more than one way to resolve a difficult situation I’m confronted with.',
    'I consider multiple options before responding to difficult situations.'
];
  cfi.labels = ['strongly<br>disagree', 'disagree', 'somewhat<br>disagree', 'neutral', 'somewhat<br>agree', 'agree', 'strongly<br>agree'];
 
  // HTQ
  var htq = [];
  htq.prompt = '<b>Please rate how much you agree with the following statements. There are no right or wrong answers.</b>';
  htq.items = [
    'I tend to dwell on the same issues.',
    'I mentally fixate on certain issues and can’t move on.',
    'The same thoughts often keep going through my mind over and over again.',
    'I tend to repeat actions because I keep doubting that I have done them properly.',
    'I like to have a regular, unchanging schedule.',
    'There is comfort in regularity.',
    'A good job has clear guidelines on what to do and how to do it.',
    'I hate it when my routines are disrupted.',
    'I look forward to new experiences.',
    'Life is boring if you never take risks and always play it safe.',
    'When eating at restaurants, I like to try new dishes rather than ones I have tried before.'
  ];
  htq.labels = ['strongly<br>disagree', 'disagree', 'somewhat<br>disagree', 'neutral', 'somewhat<br>agree', 'agree', 'strongly<br>agree'];

  // AUDIT
  var audit = [];
  audit.prompt = '<b>Please answer the following questions about your alcohol use during the <b>past 12 months</b>.</b>'
  audit.items = [
    'How often do you have a drink containing alcohol?',
    'How many drinks containing alcohol do you have on a typical day when you are drinking?',
    'How often do you have six or more standard drinks on one occasion?',
    'How often during the last year have you found that you were not able to stop drinking once you had started?',
    'How often during the last year have you failed to do what was normally expected of you because of drinking?',
    'How often during the last year have you needed a drink first thing in the morning to get yourself going after a heavy drinking session?',
    'Select the fourth option from the left, weekly, for this question.',
    'How often during the last year have you had a feeling of guilt or remorse after drinking?',
    'How often during the last year have you been unable to remember what happened the night before because of your drinking?',
    'Have you or someone else been injured because of your drinking?',
    'Has a relative, friend, doctor or other healthcare worker been concerned about your drinking or suggested you cut down?'
  ];
  audit.labels1 = ['never', 'monthly<br>or<br>less', '2-4 times<br>a<br>month', '2-3<br>times<br>a<br>week', '4+<br>times<br>a<br>week'];
  audit.labels2 = ['1 or 2', '3 or 4', '5 or 6', '7 or 9', '10 or more']
  audit.labels3_9 = ['never', 'monthly<br>or<br>less', 'monthly', 'weekly', 'daily<br>or<br>almost daily']
  audit.labels10_11 = ['no', 'yes, but not in the last year', 'yes, during the last year']

  // Likert survey data generator
function generateGenericSurvey({ name, prompt, items, labels, catchQuestion, catchLabelIndex }) {
    return {
      type: 'survey-likert',
      preamble: prompt,
      questions: items.map((item, index) => ({
        prompt: item,
        name: `${name}${index + 1}`,
        labels: labels,
        required: true,
      })),
      scale_width: inf_slider_width,
      post_trial_gap: iti,
      data: {
        phase: `ques_${name}`,
      },
    };
  }
  
  // Handler function for catch question logic
  function handleCatchLogic(params) {
    const { name, labelTypes, responses, catchQuestion } = params;
  
    if (!responses[catchQuestion]) {
      throw Error(`No response found for the catch item in ${name}`);
    }
  
    const caughtItemIndex = labelTypes.findIndex((x) => x === catchQuestion);
    const actualValue = parseInt(responses[catchQuestion]);
    const expectedValue = caughtItemIndex + 1;
  
    eval(`${name}_catch_flag = actualValue !== expectedValue;`);
    console.log(`${name}_catch_flag: ${eval(`${name}_catch_flag`)}`);
  }
  
  // ----- questionnaires -----
  // Initialize flags
  let cfi_catch_flag = false;
  let audit_catch_flag = false;
  let catchcorrect = false;
  
  // Instructions block
  const preques_ins_block = {
    type: 'instructions',
    pages: [ins.preques],
    allow_keys: false,
    show_clickable_nav: true,
    post_trial_gap: iti,
    data: {
      phase: 'instructions'
    }
  };
  timeline.push(preques_ins_block);
  
  // Create CFI block
  const cfi_block = generateGenericSurvey({
    identifier: 'cfi',
    prompt: cfi.prompt,
    items: cfi.items,
    labels: cfi.labels,
    catchQuestion: 6,
    catchLabelIndex: 6,
  });
  timeline.push(cfi_block);
  
  // Create HTQ block
  const htq_block = generateGenericSurvey({
    identifier: 'htq',
    prompt: htq.prompt,
    items: htq.items.slice(0, 11),
    labels: htq.labels,
  });
  timeline.push(htq_block);
  
  // Create Audit block
  const audit_block = generateGenericSurvey({
    identifier: 'audit',
    prompt: audit.prompt,
    items: audit.items,
    labels: audit.labels,
  });
  timeline.push(audit_block);
  
  // Attach catch logic after creating the audit_block
  handleCatchLogic({
    name: 'audit',
    labelTypes: audit.labels,
    responses: audit_block.questions[6].choices,
    catchQuestion: 6,
  });
  
  // Print flags for debugging purposes
  console.log("cfi_catch_flag: ", cfi_catch_flag);
  console.log("audit_catch_flag: ", audit_catch_flag);
  console.log("catchcorrect: ", catchcorrect);
  
  // Define exit page
  const exit_page = {
    type: 'html-keyboard-response',
    choices: [],
    on_start: function (trial) {
      if ((cfi_catch_flag || audit_catch_flag) || !catchcorrect) {
        jsPsych.pluginAPI.cancelKeyboardResponse(event);
        jsPsych.endExperiment('Thank you for your participation.');
      }
    }
  };
  timeline.push(exit_page);
  
  // NEW: catch Qs - define a page for incorrect responses
  const failed_url = 'https://app.prolific.co/submissions/complete?cc=C5D763KX';
  const failedAttCheck_msg = 'The experiment ends here. <p>Click <a href="' + failed_url + '">here</a> to be returned to Prolific.</p>';
  
  var showsplash_c = true; 
  const splash_screen_catch = {
    type: 'html-keyboard-response',
    choices: [],
    stimulus: '<center>Your response has been recorded. Unfortunatly, you do not meet the inclusion criteria for this study. We thank you for your interest in participating in the experiment.</center>',
    on_start: function (trial) {
      if (cfi_catch_flag || audit_catch_flag) {
        jsPsych.pluginAPI.cancelKeyboardResponse(event);
        saveJsPsychData(jsPsych.data.get().json());
        jsPsych.endExperiment('Thank you for your participation.');
      }
    }
  };
  
  // NEW: push it to a conditional code that only shows splash screen if one or more of the responses was wrong
  const conditional_splash_catch = {
    timeline: [splash_screen_catch],
    conditional_function: function () {
      return !(cfi_catch_flag === false && audit_catch_flag === false); // Show splash screen if either cfi_catch_flag or audit_catch_flag is true
    }
  }
  
  timeline.push(conditional_splash_catch);


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
          }
        });
      }