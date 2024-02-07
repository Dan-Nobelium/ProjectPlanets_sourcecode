const ins = {};
export const getIns = () => {
  
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
}