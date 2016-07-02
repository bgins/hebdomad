$(document).foundation()

context = new AudioContext()

// declare globals
var noteOne, noteTwo,
    voices = [],
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

// keydown starts notes, keyup stops note
// voices keeps track of which keys are currently held
// keycodes: a = 66, s = 83, d = 68, f = 70
//           j = 74, k = 75, l = 76, ; = 59
$(document).keydown(function(e) {
    // check if key is currently pressed
    if (voices[e.which]) {
        return
    }

    switch (e.which) {
        case 65:
            startNoteOne()
            break
        case 83:
            startNoteTwo()
            break
        case 68:
            break
        case 70:
            break
        case 74:
            break
        case 75:
            break
        case 76:
            break
        case 59:
            break
    }
    voices[e.which] = true
});

$(document).keyup(function(e) {
    switch (e.which) {
        case 65:
            stopNoteOne()
            break
        case 83:
            stopNoteTwo()
            break
        case 68:
            break
        case 70:
            break
        case 74:
            break
        case 75:
            break
        case 76:
            break
        case 59:
            break
    }
    voices[e.which] = false
});
