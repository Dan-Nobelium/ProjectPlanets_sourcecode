const demographics_block = {
    type: 'survey-html-form',
    preamble: '<p><b>Please fill in your demographic details</b></p>',
    html: 
    '<p> Gender: ' +
    '<input type="radio" name="gender" value="male" required/> Male &nbsp; ' +
    '<input type="radio" name="gender" value="female" required/> Female &nbsp;' +
    '<input type="radio" name="gender" value="other" required/> Other<br>' + '<br>' +
    '<p> Age: <input name="age" type="text" required/> </p>' + '<br>' +
    '<p> Native language: <input name="language" type="text" required/> </p>' + '<br>',
    data: {
      phase: 'demographics'
    }
  };

  var consent_block = {
    type: 'html-button-response',
    stimulus:   '<img src= "./img/logo.png"></img>' +
    '<p>Welcome to the experiment!</p>' +
    '<p>Before you begin, please read the information sheet carefully.</p>' +
    '<br>' +
    '<p><b>PARTICIPANT INFORMATION STATEMENT AND CONSENT</b></p>' +
      '<embed src="data/consent/PIS_SONA_3385.pdf" width="800px" height="2100px" />' +
    '<p>By continuing, you are making a decision whether or not to participate. Clicking the button below indicates that, having read the information provided on the participant information sheet, you consent to the above.' +
    '<br></p>',
    choices: ['I consent to participate'],
    data: {
    phase: 'consent'
    },
    }   

    preques = [
        '<p>WELCOME TO THE EXPERIMENT!</p>' +
        '<p>To ensure high-quality data and minimise fatigue, we ask that you make a concerted effort to complete the study <b>within 45 minutes </b>. Please keep in mind that those who take significantly longer may be timed out and they may not be eligible to complete the remainder of the study. </p>' +
        '<p>Before commencing the game, we will ask you a couple of questions about yourself. Please read each item carefully and answer as accurately as possible. This would take 5-10 minutes to complete. </p>'
      ];
      
      pretrain1 = [
        '<p>EXPERIMENT PHASE BEGINS</p>' +
        '<p>Throughout the experiment, please <b>read all instructions carefully</b> and click on the buttons to go forward or back. You may need to scroll down on some pages. </p>' +
        '<p>Please complete the experiment in ONE sitting in FULL SCREEN mode <b>on a computer or a tablet (not a phone).</b></p>'
      ];
    
      pretrain2 = [
        '<p>In this experiment you will be playing a game over 6 blocks. </p>' +
        '<p>In this game, you are an intergalactic trader in space. You will be situated between two planets that you can trade with. You can send a signal to each planet by clicking on them. Sometimes locals on these planets will receive the signal and be willing to trade. Each successful trade will give you points. </p>' +
        '<p><b>Your goal is to gain as many points as possible. </b></p>'
        // '<p><b>Note:</b> Whatever you earn in-game will be converted into real money for you at the end of the experiment. The more you earn in-game, the more you make in real life. You can earn more points by trading with both planets. </p>'
      ];
    
      pretrain3 = [
        '<p>You can click on each of the planets as many times as you like. Just remember, the aim is to get as many points as possible! </p>' +
        '<p>There are multiple blocks in this experiment. Between each block we will ask you some questions about each of the game elements. </p>' +
        '<p>Please do your best to engage in the task and answer all questions to the best of your ability. </p>' +
        '<p><b>There will be monetary prizes for participants with high scores (top 10% of the cohort) and <i>timely</i> answers </b>, so try do your best! </p>'
      ];

          // if (sample === "ProA") {
    //   var ProA_insert = [
    //     '<p>If anything goes wrong during the experiment, please take a screenshot and notify the requester. Please <b>DO NOT</b> hit refresh or the back button on your browser. This will make it hard for you to get paid.</p>' +
    //     '<p>If you complete the task and pass the attention check, you will get your payment no matter what. Please take your time and think about your predictions and judgements seriously. </p>'
    //   ]
    // } else {
    //   var ProA_insert = '';
    // }

    let instructionPages = [preques, pretrain1, pretrain2, pretrain3];


    const questions = [
        {
          prompt: "<b>Question 1:</b> The aim of the task is to:",
          options: ["Get as many points as possible", "Battle the aliens on the planets"],
          correct: "Get as many points as possible"
        },
        {
          prompt: "<b>Question 2:</b> Clicking on each planet will:",
          options: ["Make the planet disappear", "Sometimes result in a successful trade, earning me points"],
          correct: "Sometimes result in a successful trade, earning me points"
        },
        {
          prompt: "<b>Question 3:</b> There will be multiple blocks in this experiment, with questions in between each block.",
          options: ["FALSE", "TRUE"],
          correct: "TRUE"
        },
        {
          prompt: "<b>Question 4:</b> The top 10% performers at the end of the task will receive:",
          options: ["An additional monetary prize", "Extra course credit"],
          correct: "An additional monetary prize"
        }
      ];