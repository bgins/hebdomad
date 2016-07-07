$(document).foundation()

context = new AudioContext()

// declare globals
var voices = []
    heldKeys = [],
    amp = context.createGain()


$(document).ready(function() {
    initTuning()
})

// initialize tuning
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
amp.gain.value = 0.1

// ---------- start and stop voices------------
function startVoice(n,freq) {
    voices[n] = context.createOscillator()
    voices[n].type = 'triangle'
    console.log(freq)
    voices[n].frequency.value = freq
    voices[n].connect(amp)
    amp.connect(context.destination)
    voices[n].start(0)          
}

function stopVoice(n) {
    voices[n].stop()
}
