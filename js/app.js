$(document).foundation()

context = new AudioContext()

// declare globals
var saw,
    volume = context.createGain()

// initialize volume
volume.gain.value = 0.1

function init() {
    saw = context.createOscillator()
    saw.type = 'sawtooth'
    saw.frequency.value = 440           // set the frequency to 440 HZ

    saw.connect(volume)
    volume.connect(context.destination)
}

function startSaw() {
    saw.start(0)          
}

function stopSaw() {
    saw.stop()
}

// Gain input event changes level from 0 to 1 
$('#gain').on('input',function(e){
    gain = $("#gain").val()
    volume.gain.value = gain
});

// test keypress 'a'
$(document).keydown(function(e) {
    if (e.which == 65) { 
        startSaw()
    }
});

init()
