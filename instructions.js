let helloWorld = "Hello World";
let demo_text = [
    '<p> Gender: ' +
    '<input type="radio" name="gender" value="male" required/> Male &nbsp; ' +
    '<input type="radio" name="gender" value="female" required/> Female &nbsp;' +
    '<input type="radio" name="gender" value="other" required/> Other<br>' + '<br>' +
    '<p> Age: <input name="age" type="text" required/> </p>' + '<br>' +
    '<p> Native language: <input name="language" type="text" required/> </p>' + '<br>'
  ];
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
    
    
  //----------------------------------------------------------------------------
  /* self-report questionnaires (CFI-HTQ-AUDIT) */

  // CFI
  let cfi = [];
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
  let htq = [];
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
  let audit = [];
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

//----------------------------------------------------------------------------