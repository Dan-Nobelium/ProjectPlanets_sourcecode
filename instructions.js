// Constants
let sample = 'your_sample_value';
let pun_planet = 'your_pun_planet_value';
let unpun_planet = 'your_unpun_planet_value';
let pun_ship = 'your_pun_ship_value';
let planet_layout = ['your_planet_layout_value_for_0', 'your_planet_layout_value_for_1'];
let stim_list = ['your_stim_list_values'];
let ship_list = ['your_ship_list_values'];

// Instructions Text
export   var consent_text = `
<img src= "./img/logo.png"></img>
<p>Welcome to the experiment!</p>
`;

export let demo_text = [
  '<p> Gender: '
];

let ProA_insert = '';
if (sample === "ProA") {
  ProA_insert = [
    '<p>If anything goes wrong during the experiment, please take a screenshot and notify the requester. Please <b>DO NOT</b> hit refresh or the back button on your browser. This will make it hard for you to get paid.</p>'
  ];
}

export let ins = {};
ins.preques = [
  `<p>WELCOME TO THE EXPERIMENT!</p>
    <p>To ensure high-quality data and minimise fatigue, we ask that you make a concerted effort to complete the study <b>within 45 minutes </b>. Please keep in mind that those who take significantly longer may be timed out and they may not be eligible to complete the remainder of the study. </p>
    <p>Before commencing the game, we will ask you a couple of questions about yourself. Please read each item carefully and answer as accurately as possible. This would take 5-10 minutes to complete. </p>`
];

ins.pretrain1 = [
  `<p>EXPERIMENT PHASE BEGINS</p>
    <p>Throughout the experiment, please <b>read all instructions carefully</b> and click on the buttons to go forward or back. You may need to scroll down on some pages. </p>
    ${ProA_insert}
    <p>Please complete the experiment in ONE sitting in FULL SCREEN mode <b>on a computer or a tablet (not a phone).</b></p>`
];

ins.pretrain2 = [
  `<p>In this experiment you will be playing a game over 6 blocks. </p>
    <p>In this game, you are an intergalactic trader in space. You will be situated between two planets that you can trade with. You can send a signal to each planet by clicking on them. Sometimes locals on these planets will receive the signal and be willing to trade. Each successful trade will give you points. </p>
    <p><b>Your goal is to gain as many points as possible. </b></p>`
  // '<p><b>Note:</b> Whatever you earn in-game will be converted into real money for you at the end of the experiment. The more you earn in-game, the more you make in real life. You can earn more points by trading with both planets. </p>'
];

ins.pretrain3 = [
  `<p>You can click on each of the planets as many times as you like. Just remember, the aim is to get as many points as possible! </p>
    <p>There are multiple blocks in this experiment. Between each block we will ask you some questions about each of the game elements. </p>
    <p>Please do your best to engage in the task and answer all questions to the best of your ability. </p>
    <p><b>There will be monetary prizes for participants with high scores (top 10% of the cohort) and <i>timely</i> answers </b>, so try do your best! </p>`
];

// instruction check
let Q0_text = `<b>Question 1:</b> The aim of the task is to:`;
let Q0_answers = ["Get as many points as possible", "Battle the aliens on the planets"];
let Q1_text = `<b>Question 2:</b> Clicking on each planet will:`;
let Q1_answers = ["Make the planet disappear", "S sometimes result in a successful trade, earning me points"];
let Q2_text = `<b>Question 3:</b> There will be multiple blocks in this experiment, with questions in between each block. `;
let Q2_answers = ["FALSE", "TRUE"];
let Q3_text = `<b>Question 4:</b> The top 10% performers at the end of the task will receive:`;
let Q3_answers = ["An additional monetary prize", "Extra course credit"];
let correctstring = JSON.stringify({
  Q0: Q0_answers[0],
  Q1: Q1_answers[1],
  Q2: Q2_answers[1],
  Q3: Q3_answers[0]
});

// contingency check
let Q0_cont_text = `<b>Question 1:</b> Which (pirate) ship leads to attacks?`;
let Q0_cont_answers = ['Ship Type 1', 'Ship Type 2'];
let Q1_cont_text = `<b>Question 2:</b> Which planet has been attracting pirate ships?`;
let Q1_cont_answers = [`The ${pun_planet} planet (${planet_layout[0]} side)`, `The ${unpun_planet} planet (${planet_layout[1]} side)`];
// let Q2_cont_text = `<b>Question 3:</b> Which ship has the "${pun_planet}" planet (${planet_layout[0]} side) been attracting?`;
// let Q2_cont_answers = ['Ship Type 1', 'Ship Type 2'];
// let Q3_cont_text = `<b>Question 4:</b> Which ship has the "${unpun_planet}" planet (${planet_layout[0]} side) been attracting?`;
// let Q3_cont_answers = ['Ship Type 1', 'Ship Type 2'];
let correctstring_cont = JSON.stringify({
  Q0: Q0_cont_answers[pun_ship - 1],
  Q1: Q1_cont_answers[0],
  // Q2: Q2_cont_answers[pun_ship - 1],
  // Q3: Q3_cont_answers[unpun_ship - 1]
});

ins.phase2 = `
    <p>There have been reports of local pirates stealing from trading ships. Watch out! </p>
    <!-- <p>In the next few blocks, trading with a planet might result in the arrival of a pirate ship. </p> -->
    <p>Your ship has a shield that can keep these pirates from stealing from you, but the shield will not always be available. If available, you can activate the shield by pressing the ACTIVATE button. </p>
    <p>Remember, your goal is still to <b>gain as many points as possible!</b></p>`;

ins.instructlate = `
    <p>Local intel has determined where the pirates are coming from!</p>
    <p>Your signals to the ${pun_planet} planet (${planet_layout[0]} side) have been attracting pirate ships (Ship: Type ${pun_ship}), that have been stealing your points! </p>
    <p><img src=${stim_list[pun_planet_side]} height="100">
    <img src="img/arrow.jpg" height="100">
    <img src=${ship_list[pun_planet_side]} height="100">
    <img src="img/arrow.jpg" height="100">
    <img src="img/lose.png" height="100"></p>
    <p>Your signals to the ${unpun_planet} planet (${planet_layout[1]} side) have only been attracting friendly ships (Ship: Type ${unpun_ship}). </p>
    <p><img src=${stim_list[1-pun_planet_side]} height="100">
    <img src="img/arrow.jpg" height="100">
    <img src=${ship_list[1-pun_planet_side]} height="100">
    <img src="img/blank_arrow.jpg" height="100">
    <img src="img/blank_lose.jpg" height="100"></p>`;

ins.instructearly = `
    <p>Local intel has determined where the pirates are coming from!</p>
    <p>Your signals to the ${pun_planet} planet (${planet_layout[0]} side) will attract pirate ships (Ship: Type ${pun_ship}) and steal your points! </p>
    <p><img src=${stim_list[pun_planet_side]} height="100">
    <img src="img/arrow.jpg" height="100">
    <img src=${ship_list[pun_planet_side]} height="100">
    <img src="img/arrow.jpg" height="100">
    <img src="img/lose.png" height="100"></p>
    <p>Your signals to the ${unpun_planet} planet (${planet_layout[1]} side) will only attract friendly ships (Ship: Type ${unpun_ship}). </p>
    <p><img src=${stim_list[1-pun_planet_side]} height="100">
    <img src="img/arrow.jpg" height="100">
    <img src=${ship_list[1-pun_planet_side]} height="100">
    <img src="img/blank_arrow.jpg" height="100">
    <img src="img/blank_lose.jpg" height="100"></p>`;

ins.pretrain1 = [
  `<p>EXPERIMENT PHASE BEGINS</p>
    <p>Throughout the experiment, please <b>read all instructions carefully</b> and click on the buttons to go forward or back. You may need to scroll down on some pages. </p>
    ${ProA_insert}
    <p>Please complete the experiment in ONE sitting in FULL SCREEN mode <b>on a computer or a tablet (not a phone).</b></p>`
];

ins.debrief = [
  `<p>Please confirm that you have read the debriefing questions below:</p>

    <p><b><i>What are the research questions?</i></b></p>
    <p>Our behaviour changes in response to experienced rewards and losses. This study asks how behaviour and accompanying beliefs change when these outcomes have varying degrees of relationship to our behaviour. </p>

    <!-- Remaining content follows the same pattern -->

    <p><b><i>Further reading:</i></b></p>
    <p> Lovibond, P.F., & Shanks, D.R. (2002). The role of awareness in Pavlovian conditioning: Empirical evidence and theoretical implications. Journal of Experimental Psychology: Animal Behavior Processes, 28, 3. </p>`
];