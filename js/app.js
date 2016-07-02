$(document).foundation()

context = new AudioContext()

// declare globals
var note,
    volume = context.createGain()

// initialize volume
volume.gain.value = 0.1

function initNote(freq) {
    note = context.createOscillator()
    note.type = 'sawtooth'
    note.frequency.value = freq
    note.connect(volume)
    volume.connect(context.destination)
}

function startSaw() {
    initNote(440)
    note.start(0)          
}

function stopSaw() {
    note.stop()
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

