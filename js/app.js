$(document).foundation()

context = new AudioContext()

// declare globals
var voices = []
    heldKeys = [],
    voiceAmps = []


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
    $('#gain').attr("value","5")
}

// create and initialize master gain
amp = context.createGain()
amp.gain.value = 0.5
amp.connect(context.destination)


// ---------- start and stop voices------------
function startVoice(n,freq) {
    voices[n] = context.createOscillator()
    voices[n].type = 'triangle'
    console.log(freq)
    voices[n].frequency.value = freq

    voiceAmps[n] = context.createGain()
    voiceAmps[n].gain.value = 0
    voiceAmps[n].gain.setTargetAtTime(0.1, context.currentTime, 0.5)

    voices[n].connect(voiceAmps[n])
    voiceAmps[n].connect(amp)
    voices[n].start(0)          
    // voiceAmps[n].gain.setTargetAtTime(0, context.currentTime + 2, 0.1)
    voiceAmps[n].gain.linearRampToValueAtTime(0.01, context.currentTime + 1)
}

function stopVoice(n) {
    // voiceAmps[n].gain.linearRampToValueAtTime(0.01, context.currentTime + 1)
    // voiceAmps[n].gain.setTargetAtTime(0, context.currentTime, 0.2)
    voices[n].stop(context.currentTime + 1)
    voiceAmps[n].disconnect()
}
