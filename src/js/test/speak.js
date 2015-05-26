var Speakable = require('speakable');
var API_KEY = 'AIzaSyBBlv0xsX5PS9-fW5z1Aab8FxzgCAXKWgs';

// Setup google speech
var speakable = new Speakable({key: API_KEY});

speakable.on('speechStart', function() {
  console.log('onSpeechStart');
});

speakable.on('speechStop', function() {
  console.log('onSpeechStop');
  speakable.recordVoice();
});

speakable.on('speechReady', function() {
  console.log('onSpeechReady');
});

speakable.on('error', function(err) {
  console.log('onError:');
  console.log(err);
  speakable.recordVoice();
});

speakable.on('speechResult', function(spokenWords) {
    console.log('onSpeechResult:');
  console.log(spokenWords);
});

speakable.recordVoice();
