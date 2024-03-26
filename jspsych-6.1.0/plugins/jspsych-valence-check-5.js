jsPsych.plugins['valence-check-5'] = (function() {
  var plugin = {};

  jsPsych.pluginAPI.registerPreload('valence-check-5', 'stimulus', 'image');

  plugin.info = {
    name: 'valence-check-5',
    description: '',
    parameters: {
      // ... (plugin parameters remain the same)
    }
  }

  plugin.trial = function(display_element, trial) {
    var html = '<div id="jspsych-valence-check-5-wrapper" style="margin: 100px 0px;">';

    // prompt
    if (trial.prompt !== null){
      html += trial.prompt + '<br><br><br><br>';
    }

    // -------------------------------- stimulus 1 --------------------------------

    html += '<div id="jspsych-valence-check-5-stimulus1">';
    if (typeof trial.stimulus_1 === 'string' && trial.stimulus_1.startsWith('<')) {
      html += trial.stimulus_1;
    } else {
      html += '<img src="'+trial.stimulus_1+'" style="';
      if(trial.stimulus_height !== null){
        html += 'height:'+trial.stimulus_height+'px; '
        if(trial.stimulus_width == null && trial.maintain_aspect_ratio){
          html += 'width: auto; ';
        }
      }
      if(trial.stimulus_width !== null){
        html += 'width:'+trial.stimulus_width+'px; '
        if(trial.stimulus_height == null && trial.maintain_aspect_ratio){
          html += 'height: auto; ';
        }
      }
      html += '"></img>';
    }
    html += '</div>';

    // stimulus text
    if (trial.stim_text_1 !== null){
      html += trial.stim_text_1;
    }
    html += '<br><br>';

    // slider
    html += '<div class="jspsych-valence-check-5-container" style="position:relative; margin: 0 auto 3em auto; ';
    if(trial.slider_width !== null){
      html += 'width:'+trial.slider_width+'px;';
    }
    html += '">';
    html += '<input type="range" value="'+trial.start+'" min="'+trial.min+'" max="'+trial.max+'" step="'+trial.step+'" style="width: 100%;" id="jspsych-valence-check-5-response1"></input>';
    html += '<div>'
    for(var j=0; j < trial.labels.length; j++){
      var width = 100/(trial.labels.length-1);
      var left_offset = (j * (100 /(trial.labels.length - 1))) - (width/2);
      html += '<div style="display: inline-block; position: absolute; left:'+left_offset+'%; text-align: center; width: '+width+'%;">';
      html += '<span style="text-align: center; font-size: 80%;">'+trial.labels[j]+'</span>';
      html += '</div>'
    }
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '<br><br><br><hr><br><br><br>';

    // -------------------------------- stimulus 2 --------------------------------

    html += '<div id="jspsych-valence-check-5-stimulus2">';
    if (typeof trial.stimulus_2 === 'string' && trial.stimulus_2.startsWith('<')) {
      html += trial.stimulus_2;
    } else {
      html += '<img src="'+trial.stimulus_2+'" style="';
      if(trial.stimulus_height !== null){
        html += 'height:'+trial.stimulus_height+'px; '
        if(trial.stimulus_width == null && trial.maintain_aspect_ratio){
          html += 'width: auto; ';
        }
      }
      if(trial.stimulus_width !== null){
        html += 'width:'+trial.stimulus_width+'px; '
        if(trial.stimulus_height == null && trial.maintain_aspect_ratio){
          html += 'height: auto; ';
        }
      }
      html += '"></img>';
    }
    html += '</div>';

    // stimulus text
    if (trial.stim_text_2 !== null){
      html += trial.stim_text_2;
    }
    html += '<br><br>';

    // slider
    html += '<div class="jspsych-valence-check-5-container" style="position:relative; margin: 0 auto 3em auto; ';
    if(trial.slider_width !== null){
      html += 'width:'+trial.slider_width+'px;';
    }
    html += '">';
    html += '<input type="range" value="'+trial.start+'" min="'+trial.min+'" max="'+trial.max+'" step="'+trial.step+'" style="width: 100%;" id="jspsych-valence-check-5-response2"></input>';
    html += '<div>'
    for(var j=0; j < trial.labels.length; j++){
      var width = 100/(trial.labels.length-1);
      var left_offset = (j * (100 /(trial.labels.length - 1))) - (width/2);
      html += '<div style="display: inline-block; position: absolute; left:'+left_offset+'%; text-align: center; width: '+width+'%;">';
      html += '<span style="text-align: center; font-size: 80%;">'+trial.labels[j]+'</span>';
      html += '</div>'
    }
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '<br><br><br><hr><br><br><br>';

    // -------------------------------- stimuli 3-5 (images) --------------------------------

    for (var i = 3; i <= 5; i++) {
      html += '<div id="jspsych-valence-check-5-stimulus'+i+'">';
      html += '<img src="'+trial['stimulus_'+i]+'" style="';
      if(trial.stimulus_height !== null){
        html += 'height:'+trial.stimulus_height+'px; '
        if(trial.stimulus_width == null && trial.maintain_aspect_ratio){
          html += 'width: auto; ';
        }
      }
      if(trial.stimulus_width !== null){
        html += 'width:'+trial.stimulus_width+'px; '
        if(trial.stimulus_height == null && trial.maintain_aspect_ratio){
          html += 'height: auto; ';
        }
      }
      html += '"></img>';
      html += '</div>';

      // stimulus text
      if (trial['stim_text_'+i] !== null){
        html += trial['stim_text_'+i];
      }
      html += '<br><br>';

      // slider
      html += '<div class="jspsych-valence-check-5-container" style="position:relative; margin: 0 auto 3em auto; ';
      if(trial.slider_width !== null){
        html += 'width:'+trial.slider_width+'px;';
      }
      html += '">';
      html += '<input type="range" value="'+trial.start+'" min="'+trial.min+'" max="'+trial.max+'" step="'+trial.step+'" style="width: 100%;" id="jspsych-valence-check-5-response'+i+'"></input>';
      html += '<div>'
      for(var j=0; j < trial.labels.length; j++){
        var width = 100/(trial.labels.length-1);
        var left_offset = (j * (100 /(trial.labels.length - 1))) - (width/2);
        html += '<div style="display: inline-block; position: absolute; left:'+left_offset+'%; text-align: center; width: '+width+'%;">';
        html += '<span style="text-align: center; font-size: 80%;">'+trial.labels[j]+'</span>';
        html += '</div>'
      }
      html += '</div>';
      html += '</div>';
      html += '</div>';
      html += '<br><br><br><hr><br><br><br>';
    }

    // -------------------------------------------------------------------------

    // add submit button
    html += '<button id="jspsych-valence-check-5-next" class="jspsych-btn" '+ (trial.require_movement ? "disabled" : "") + '>'+trial.button_label+'</button>';

    display_element.innerHTML = html;

    // ... (rest of the plugin code remains the same)
  };

  return plugin;
})();