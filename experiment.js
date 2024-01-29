const surveysJson = JSON.parse(document.querySelector('#surveys').innerHTML);
console.log(surveysJson);

const group = Math.random() > 0.5 ? "early" : "late";
const sample = Math.random() > 0.5 ? "ProA" : "others";

const punishmentSide = Math.round(Math.random());
let stimList = [
  `../img/blue${punishmentSide}.png`,
  `../img/orange${1 - punishmentSide}.png`,
];
let shipList = [`../img/ship${punishmentSide}.png`, `../img/ship${1 - punishmentSide}.png`];

const currentStim = punishmentSide === 0 ? "blue" : "orange";
const oppositeStim = punishmentSide === 0 ? "orange" : "blue";

const planetLayout = punishmentSide === 0 ? ["left", "right"] : ["right", "left"];
const punPlanetName = `${currentStim}p`;
const unpunPlanetName = `${oppositeStim}p`;
const punPlanetIdx = planetLayout.indexOf(`${currentStim}`);
const unpunPlanetIdx = planetLayout.indexOf(`${oppositeStim}`);

const punShipName = `ship${punishmentSide}`;
const unpunShipName = `ship${1 - punishmentSide}`;

const trialsPerBlock = 5;
const numBlocks = 6;

const probTrades = [[0.5], [0.5]];
const probShields = [[0.5], [0.5]];
const probShips = [[0.1], [0.1]];

const rfShipDelay = 1500;

const delayBetweenTrials = 1000;
const durationOfOneBlock = 180 * 1000;

const imageHeight = 80;
const sliderWidth = 500;
const mainStimHeight = 250;

const feedbackDuration = 2500;

let blockNumber = 0;
let trialNumber = 0;
let totalPoints = 0;
let continuousResponse = true;

const initParams = {
  group: group,
  sample: sample,
  punishmentSide: punishmentSide,
  stimList: stimList,
  shipList: shipList,
  currentStim: currentStim,
  oppositeStim: oppositeStim,
  planeta: punPlanetName,
  planetb: unpunPlanetName,
  punPlanetIdx: punPlanetIdx,
  unpunPlanetIdx: unpunPlanetIdx,
  punShipName: punShipName,
  unpunShipName: unpunShipName,
  planetLayout: planetLayout,
  trialsPerBlock: trialsPerBlock,
  numBlocks: numBlocks,
  probTrades: probTrades,
  probShields: probShields,
  probShips: probShips,
  rfShipDelay: rfShipDelay,
  delayBetweenTrials: delayBetweenTrials,
  durationOfOneBlock: durationOfOneBlock,
  imageHeight: imageHeight,
  sliderWidth: sliderWidth,
  mainStimHeight: mainStimHeight,
  feedbackDuration: feedbackDuration,
};

/* Instruction Timeline Blocks */

const instructLoop = [];

const introText = {
  type: "html-keyboard-response",
  stimulus: `
    <p>Welcome to the experiment!</p>
    <p>This experiment investigates how people form impressions based on limited exposure to social media posts.</p>
    <p>Press any key to continue...</p>
  `,
  choices: [" "],
};

instructLoop.push(instructText);

const experimentalConditions = {
  type: "html-keyboard-response",
  stimulus: `
    <p>For the upcoming part of the experiment, you will see pairs of profiles consisting of three tweets each.</p>
    <p>Each pair belongs to either Condition A or Condition B. Press any key to continue...</p>
  `,
  choices: [" "],
};

instructLoop.push(experimentalConditions);

const profilePairInstructions = {
  type: "html-keyboard-response",
  stimulus: `
    <p>Condition A features Profile A on the left and Profile B on the right.
Condition B features Profile B on the left and Profile A on the right.</p>
    <p>Profile order within a condition is counterbalanced across participants.</p>
    <p>Press any key to continue...</p>
  `,
  choices: [" "],
};

instructLoop.push(profilePairInstructions);

const impressionFormationTask = {
  type: "html-keyboard-response",
  stimulus: `
    <p>After viewing each set of tweets, indicate which profile appears warmer and more competent by pressing keys ‘1’, ‘2’, ‘3’, or ‘4’.
Key mapping is displayed under each profile.</p>
    <p>Use the entire rating range and avoid neutral ratings whenever possible.
Take less than ten seconds per judgment.</p>
    <p>Press any key to continue...</p>
  `,
  choices: [" "],
};

instructLoop.push(impressionFormationTask);

const practiceProfilePair = {
  type: "html-keyboard-response",
  stimulus: `
    <p>Here is an example profile pair for Practice:</p>
    <table>
      <thead>
        <tr>
          <th scope="col">Profile A</th>
          <th scope="col">Profile B</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <ul>
              <li>“So excited for tonight!” #partyhard</li>
              <li>“Feeling blessed today.” #grateful</li>
              <li>“Just bought tickets to Hawaii!!” #islandlife #wanderlust</li>
            </ul>
          </td>
          <td>
            <ul>
              <li>“Can’t wait for dinner later…” #foodie</li>
              <li>“On the train now...” #commute</li>
              <li>“Finally got around to doing laundry.” #cleaningday</li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
    <p>Who seems warmer and more competent? Use the keyboard numbers 1 – 4 to respond.</p>
    <table>
      <thead>
        <tr>
          <th scope="col">Profile A</th>
          <th scope="col">Profile B</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>4</td>
        </tr>
        <tr>
          <td>2</td>
          <td>3</td>
        </tr>
      </tbody>
    </table>
  `,
  choices: [" "],
};

instructLoop.push(practiceProfilePair);

const readyToBegin = {
  type: "html-keyboard-response",
  stimulus: `
    <p>Ready to begin? Press any key to proceed...</p>
  `,
  choices: [" "],
};

instructLoop.push(readyToBegin);

/* End of Instruction Timeline Blocks */

/* Pre-questionnaire Survey */
const preQuestionnaire = {
  timeline: [
    {
      type: "survey-likert",
      preamble: "",
      questions: [],
      data: {},
    },
  ],
  timeline_variables: [
    {
      items: surveysJson["PreQuestionnaire"].questions,
      title: surveysJson["PreQuestionnaire"].title,
      subtitle: surveysJson["PreQuestionnaire"].subtitle,
    },
  ],
};
/* End of Pre-questionnaire Survey */

/* Begin Main Task */

const blockLoop = [];

const blockStart = {
  type: "html-keyboard-response",
  stimulus: `
    <p>BLOCK ${blockNumber}</p>
    <p>Press any key to begin...</p>
  `,
  choices: [" "],
};

blockLoop.push(blockStart);

const blockTimer = {
  routine: () => {
    setTimeout(() => {
      jsPsych.endCurrentTimeline();
    }, durationOfOneBlock);
  },
};

blockLoop.push(blockTimer);

const resetTrialVariables = {
  type: "html-keyboard-response",
  stimulus: ``,
  choices: [" "],
};

blockLoop.push(resetTrialVariables);

const blockEnd = {
  type: "html-keyboard-response",
  stimulus: `
    <p>END OF BLOCK ${blockNumber}</p>
    <p>Total Points earned: ${totalPoints}</p>
    <p>Press any key to continue...</p>
  `,
  choices: [" "],
};

blockLoop.push(blockEnd);

const blockEndSummary = {
  type: "html-keyboard-response",
  stimulus: `
    <p>END OF ALL TRIALS</p>
    <p>Thank you for completing the Impression Formation Task!</p>
    <p>Press any key to continue...</p>
  `,
  choices: [" "],
};

blockLoop.push(blockEndSummary);

const trialLoop = [];

const trialInit = {
  type: "html-keyboard-response",
  stimulus: ``,
  choices: [" "],
};

trialLoop.push(trialInit);

const updateSliderValue = {
  type: "custom-html-keyboard-response",
  timing_post_trial: 0,
  data: {
    choice: null,
  },
  custom_func: function (trials) {
    $(`.${trials.params.sliderClassId}`).val(trials.data.sliderValue);
  },
};

trialLoop.push(updateSliderValue);

const trialEnd = {
  type: "html-keyboard-response",
  stimulus: ``,
  choices: [" "],
};

trialLoop.push(trialEnd);

const triggerFeedback = {
  type: "html-keyboard-response",
  stimulus: ``,
  choices: [" "],
};

trialLoop.push(triggerFeedback);

/* End Main Task */

/* Post-questionnaire Survey */

const postQuestionnaire = {
  timeline: [
    {
      type: "survey-likert",
      preamble: "",
      questions: [],
      data: {},
    },
  ],
  timeline_variables: [
    {
      items: surveysJson["PostQuestionnaire"].questions,
      title: surveysJson["PostQuestionnaire"].title,
      subtitle: surveysJson["PostQuestionnaire"].subtitle,
    },
  ],
};
/* End of Post-questionnaire Survey */

/* Start Debriefing Screen */
const debriefScreen = {
  type: "html-keyboard-response",
  stimulus: `
    <p>THANK YOU FOR PARTICIPATING!</p>
    <p>You have completed the experiment successfully.</p>
    <p>Press any key to close the tab...</p>
  `,
  choices: [" "],
};
/* End of Debriefing Screen */

/* Create Final Timeline Structure */

const finalTimeline = [];
finalTimeline.push(
  ...instructLoop,
  preQuestionnaire,
  ...blockLoop.map((block) => ({
    timeline: [...block, ...trialLoop, {}],
    timeline_variables: [initParams],
  })),
  postQuestionnaire,
  debriefScreen
);

/* Initialize Experiment */

jsPsych.init({
  timeline: finalTimeline,
  on_interruption: function (data) {
    jsPsych.endExperiment("Interruptions detected!");
  },
});