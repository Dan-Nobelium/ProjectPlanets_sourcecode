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