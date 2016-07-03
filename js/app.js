$(document).foundation()

context = new AudioContext()

// declare globals
var voiceOne, voiceTwo,
    voices = [],
    volume = context.createGain()

// initialize volume
volume.gain.value = 0.1

// initialize pitch values
$(document).ready(function(){
    $('#voice-one-pitch').attr("value","440")
    $('#voice-two-pitch').attr("value","493.88")
    $('#voice-three-pitch').attr("value","523.33")
    $('#voice-four-pitch').attr("value","587.33")
    $('#voice-five-pitch').attr("value","659.26")
    $('#voice-six-pitch').attr("value","698.46")
    $('#voice-seven-pitch').attr("value","783.99")
    $('#voice-eight-pitch').attr("value","880")
});

// Gain input event changes level from 0 to 1 
$('#gain').on('input',function(e){
    gain = $("#gain").val() / 10
    volume.gain.value = gain
});

// initialize a new note
function initVoice(voice, freq) {
    voice.type = 'triangle'
    console.log(freq)
    voice.frequency.value = freq
    voice.connect(volume)
    volume.connect(context.destination)
}


// start and stop voices
function startVoiceOne() {
    var freq = $('#voice-one-pitch').val()
    voiceOne = context.createOscillator()
    initVoice(voiceOne,freq)
    voiceOne.start(0)          
}

function stopVoiceOne() {
    voiceOne.stop()
}

function startVoiceTwo() {
    var freq = $('#voice-two-pitch').val()
    voiceTwo = context.createOscillator()
    initVoice(voiceTwo,freq)
    voiceTwo.start(0)          
}

function stopVoiceTwo() {
    voiceTwo.stop()
}

function startVoiceThree() {
    var freq = $('#voice-three-pitch').val()
    voiceThree = context.createOscillator()
    initVoice(voiceThree,freq)
    voiceThree.start(0)          
}

function stopVoiceThree() {
    voiceThree.stop()
}


function startVoiceFour() {
    var freq = $('#voice-four-pitch').val()
    voiceFour = context.createOscillator()
    initVoice(voiceFour,freq)
    voiceFour.start(0)          
}

function stopVoiceFour() {
    voiceFour.stop()
}

function startVoiceFive() {
    var freq = $('#voice-five-pitch').val()
    voiceFive = context.createOscillator()
    initVoice(voiceFive,freq)
    voiceFive.start(0)          
}

function stopVoiceFive() {
    voiceFive.stop()
}

function startVoiceSix() {
    var freq = $('#voice-six-pitch').val()
    voiceSix = context.createOscillator()
    initVoice(voiceSix,freq)
    voiceSix.start(0)          
}

function stopVoiceSix() {
    voiceSix.stop()
}

function startVoiceSeven() {
    var freq = $('#voice-seven-pitch').val()
    voiceSeven = context.createOscillator()
    initVoice(voiceSeven,freq)
    voiceSeven.start(0)          
}

function stopVoiceSeven() {
    voiceSeven.stop()
}

function startVoiceEight() {
    var freq = $('#voice-eight-pitch').val()
    voiceEight = context.createOscillator()
    initVoice(voiceEight,freq)
    voiceEight.start(0)          
}

function stopVoiceEight() {
    voiceEight.stop()
}


// ---------- click events ------------
$('#voice-one').mousedown(function() {
    startVoiceOne();
});

$('#voice-one').mouseup(function() {
    stopVoiceOne();
});

$('#voice-two').mousedown(function() {
    startVoiceTwo();
});

$('#voice-two').mouseup(function() {
    stopVoiceTwo();
});

$('#voice-three').mousedown(function() {
    startVoiceThree();
});

$('#voice-three').mouseup(function() {
    stopVoiceThree();
});

$('#voice-four').mousedown(function() {
    startVoiceFour();
});

$('#voice-four').mouseup(function() {
    stopVoiceFour();
});

$('#voice-five').mousedown(function() {
    startVoiceFive();
});

$('#voice-five').mouseup(function() {
    stopVoiceFive();
});

$('#voice-six').mousedown(function() {
    startVoiceSix();
});

$('#voice-six').mouseup(function() {
    stopVoiceSix();
});

$('#voice-seven').mousedown(function() {
    startVoiceSeven();
});

$('#voice-seven').mouseup(function() {
    stopVoiceSeven();
});

$('#voice-eight').mousedown(function() {
    startVoiceEight();
});

$('#voice-eight').mouseup(function() {
    stopVoiceEight();
});
// ---------- keypress events ------------
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
            startVoiceOne()
            break
        case 83:
            startVoiceTwo()
            break
        case 68:
            startVoiceThree()
            break
        case 70:
            startVoiceFour();
            break
        case 74:
            startVoiceFive();
            break
        case 75:
            startVoiceSix();
            break
        case 76:
            startVoiceSeven();
            break
        case 59:
            startVoiceEight();
            break
    }
    voices[e.which] = true
});

$(document).keyup(function(e) {
    switch (e.which) {
        case 65:
            stopVoiceOne()
            break
        case 83:
            stopVoiceTwo()
            break
        case 68:
            stopVoiceThree()
            break
        case 70:
            stopVoiceFour()
            break
        case 74:
            stopVoiceFive();
            break
        case 75:
            stopVoiceSix();
            break
        case 76:
            stopVoiceSeven();
            break
        case 59:
            stopVoiceEight();
            break
    }
    voices[e.which] = false
});

// blur event that fires on any input:text enter
$("#btnHidden").on('click', function() {
    $("input:text").blur()
})
