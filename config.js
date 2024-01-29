/* File: config.js */

/**
 * Configuration Object
 * @typedef {{
*  group: String,
*  samples: Array<String|Number>,
*  punishmentSide: Number,
*  stimuliList: Array<String>,
*  imagePaths: Object<String, String>,
*  probabilities: Object<String, Number>,
*  trialDuration: Number,
*  intervalTime: Number,
*  infStimHeight: Number,
*  infSliderWidth: Number,
*  mainStimHeight: Number,
*  feedbackDuration: Number,
*  rfShipDelay: Number,
*  probabilityTrade: Array<Number>,
*  probabilityShield: Array<Number>,
*  blockCountP1: Number,
*  blockCountP2: Number,
*  iterationsPerBlock: Number,
*  totalIterations: Number,
*  images: Array<HTMLImageElement>
* }} ConfigType
*/

/**
* Default configuration object with empty fields
* @constant
* @type {ConfigType}
*/
const DEFAULT_CONFIG = {
 group: "",
 samples: [],
 punishmentSide: 0,
 stimuliList: [],
 imagePaths: {},
 probabilities: {},
 trialDuration: 0,
 intervalTime: 0,
 infStimHeight: 0,
 infSliderWidth: 0,
 mainStimHeight: 0,
 feedbackDuration: 0,
 rfShipDelay: 0,
 probabilityTrade: [],
 probabilityShield: [],
 blockCountP1: 0,
 blockCountP2: 0,
 iterationsPerBlock: 0,
 totalIterations: 0,
 images: []
};

/**
* Singleton instance of the configuration object
* @type {ConfigType}
*/
export const config = Object.assign({}, DEFAULT_CONFIG);
