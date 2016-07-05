$(document).foundation()

context = new AudioContext()

// declare globals
var voices = []
    heldKeys = [],
    volume = context.createGain()


// initialize pitch values
$(document).ready(function() {
    initTuning()
})

function initTuning() {
    $('#voice-one-pitch').attr("value","440")
    $('#voice-two-pitch').attr("value","473.85")
    $('#voice-three-pitch').attr("value","513.33")
    $('#voice-four-pitch').attr("value","560")
    $('#voice-five-pitch').attr("value","616")
    $('#voice-six-pitch').attr("value","684.44")
    $('#voice-seven-pitch').attr("value","770")
    $('#voice-eight-pitch').attr("value","880")
    $('#gain').attr("value","1")
}


// initialize gain
volume.gain.value = 0.1

// Gain input event changes level from 0 to 1 
$('#gain').on('input',function(){
    gain = $("#gain").val() / 10
    volume.gain.value = gain
})


// ---------- start and stop voices------------
function startVoice(n,freq) {
    voices[n] = context.createOscillator()
    voices[n].type = 'triangle'
    console.log(freq)
    voices[n].frequency.value = freq
    voices[n].connect(volume)
    volume.connect(context.destination)
    voices[n].start(0)          
}

function stopVoice(n) {
    voices[n].stop()
}


// ---------- keypress events ------------
// keydown starts notes, keyup stops note
// heldKeys keeps track of which keys are currently held
// keycodes: a = 66, s = 83, d = 68, f = 70,
//           j = 74, k = 75, l = 76, 
//           ; = 59 (firefox) and 186 (chrome)
$(document).keydown(function(e) {
    // check if key is currently pressed
    if (heldKeys[e.which]) {
        return
    }

    switch (e.which) {
        case 65:
            var freq = $('#voice-one-pitch').val()
            startVoice(1,freq)
            break
        case 83:
            var freq = $('#voice-two-pitch').val()
            startVoice(2,freq)
            break
        case 68:
            var freq = $('#voice-three-pitch').val()
            startVoice(3,freq)
            break
        case 70:
            var freq = $('#voice-four-pitch').val()
            startVoice(4,freq)
            break
        case 74:
            var freq = $('#voice-five-pitch').val()
            startVoice(5,freq)
            break
        case 75:
            var freq = $('#voice-six-pitch').val()
            startVoice(6,freq)
            break
        case 76:
            var freq = $('#voice-seven-pitch').val()
            startVoice(7,freq)
            break
        case 59:
        case 186:
            var freq = $('#voice-eight-pitch').val()
            startVoice(8,freq)
            break
    }
    heldKeys[e.which] = true
});

$(document).keyup(function(e) {
    switch (e.which) {
        case 65:
            stopVoice(1)
            break
        case 83:
            stopVoice(2)
            break
        case 68:
            stopVoice(3)
            break
        case 70:
            stopVoice(4)
            break
        case 74:
            stopVoice(5);
            break
        case 75:
            stopVoice(6);
            break
        case 76:
            stopVoice(7);
            break
        case 59:
        case 186:
            stopVoice(8);
            break
    }
    heldKeys[e.which] = false
});


// ---------- click events ------------
// note starts on mousedown, then holds til mouseup
$('.key').mousedown(function() {
    switch(this.id) {
        case "voice-one":
            var freq = $('#voice-one-pitch').val()
            startVoice(1,freq)
            break
        case "voice-two":
            var freq = $('#voice-two-pitch').val()
            startVoice(2,freq)
            break
        case "voice-three":
            var freq = $('#voice-three-pitch').val()
            startVoice(3,freq)
            break
        case "voice-four":
            var freq = $('#voice-four-pitch').val()
            startVoice(4,freq)
            break
        case "voice-five":
            var freq = $('#voice-five-pitch').val()
            startVoice(5,freq)
            break
        case "voice-six":
            var freq = $('#voice-six-pitch').val()
            startVoice(6,freq)
            break
        case "voice-seven":
            var freq = $('#voice-seven-pitch').val()
            startVoice(7,freq)
            break
        case "voice-eight":
            var freq = $('#voice-eight-pitch').val()
            startVoice(8,freq)
            break
    }
})

$('.key').mouseup(function() {
    switch(this.id) {
        case "voice-one":
            stopVoice(1)
            break
        case "voice-two":
            stopVoice(2)
            break
        case "voice-three":
            stopVoice(3)
            break
        case "voice-four":
            stopVoice(4)
            break
        case "voice-five":
            stopVoice(5)
            break
        case "voice-six":
            stopVoice(6)
            break
        case "voice-seven":
            stopVoice(7)
            break
        case "voice-eight":
            stopVoice(8)
            break
    }
})


// ---------- utilities events ------------
// blur event that fires on any input:text enter
$("#btnHidden").on('click', function() {
    $("input:text").blur()
})
