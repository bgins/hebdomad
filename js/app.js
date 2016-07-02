$(document).foundation()

context = new AudioContext()

// declare globals
var noteOne, noteTwo,
    volume = context.createGain()

// initialize volume
volume.gain.value = 0.1

function initNote(note, freq) {
    note.type = 'sawtooth'
    note.frequency.value = freq
    note.connect(volume)
    volume.connect(context.destination)
}

function startNoteOne() {
    noteOne = context.createOscillator()
    initNote(noteOne,440)
    noteOne.start(0)          
}

function stopNoteOne() {
    noteOne.stop()
}

function startNoteTwo() {
    noteTwo = context.createOscillator()
    initNote(noteTwo,880)
    noteTwo.start(0)          
}

function stopNoteTwo() {
    noteTwo.stop()
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

