/* File: utils.js */

/**
 * Logger Function
 * @param {String} message Message to log in the browser console
 */
const logger = message => {
    console.info(message);
  };
  
  /**
   * Handle Timeout Function
   * @param {Number} timeoutMs Delay period in milliseconds
   * @param {Function} callback Callback function executed after delay
   */
  const handleTimeout = (timeoutMs, callback) => {
    setTimeout(() => {
      callback();
    }, timeoutMs);
  };
  
  /**
   * Shuffle Array Items Function
   * @param {Array} arr Input array whose items shall be randomized
   */
  const shuffleArrayItems = arr => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  };
  
  // Export the utility functions
  export { logger, handleTimeout, shuffleArrayItems };