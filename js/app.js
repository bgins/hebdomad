$(document).foundation()

context = new AudioContext()

var envelopeModulator = ADSR(context)

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
    $('#voice-two-pitch').attr("value","493.88")
    $('#voice-three-pitch').attr("value","523.33")
    $('#voice-four-pitch').attr("value","587.33")
    $('#voice-five-pitch').attr("value","659.26")
    $('#voice-six-pitch').attr("value","698.46")
    $('#voice-seven-pitch').attr("value","783.99")
    $('#voice-eight-pitch').attr("value","880")
    $('#gain').attr("value","1")
}

// initialize gain
amp.gain.value = 0.1

envelopeModulator.connect(amp.gain)

envelopeModulator.attack = 0.5 // seconds
envelopeModulator.decay = 0.4 // seconds
envelopeModulator.sustain = 0.6 // multiply gain.gain.value
envelopeModulator.release = 0.4 // seconds

envelopeModulator.value.value = 2 // value is an AudioParam


// ---------- start and stop voices------------
function startVoice(n,freq) {
    voices[n] = new Voice(amp)
    voices[n].play(freq)
}

function stopVoice(n) {
    voices[n].stop()
}


// ---------- Voice class ----------------
function Voice(amp) {
    this.osc = context.createOscillator()

    this.play = function(frequency) {
        this.osc.type = 'triangle'
        this.osc.frequency.value = frequency
        console.log(frequency)
    
        this.osc.connect(amp)
        amp.connect(context.destination)
        this.osc.start(0)          
    }

    this.stop = function() {
        this.osc.stop()
    }
}
