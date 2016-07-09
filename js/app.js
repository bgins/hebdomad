$(document).foundation()

context = new AudioContext()

// declare globals
var voices = []
    heldKeys = [],
    mixAmp = context.createGain(),
    ampEnvAttack = 0.1,
    ampEnvDelay = 0.0,
    ampEnvSustain = 1.0,
    ampEnvRelease = 0.1

// ---------- init instrument ----------------
$(document).ready(function() {
    initTuning()
    initControls()
})

function initTuning() {
    $('#voice-one-pitch').attr("value","440")
    $('#voice-two-pitch').attr("value","493.88")
    $('#voice-three-pitch').attr("value","523.33")
    $('#voice-four-pitch').attr("value","587.33")
    $('#voice-five-pitch').attr("value","659.26")
    $('#voice-six-pitch').attr("value","698.46")
    $('#voice-seven-pitch').attr("value","783.99")
    $('#voice-eight-pitch').attr("value","880")
}

function initControls() {
    // $('#gain').attr("value","1")
    mixAmp.gain.value = 0.1
}


// ---------- start and stop voices------------
function startVoice(n,freq) {
    // check for retrigger
    if (voices[n]) {
        voices[n].osc.stop()
    }

    // instantiate and start voice 
    voices[n] = new Voice(mixAmp)
    voices[n].play(freq)
}

function stopVoice(n) {
    voices[n].stop()
}


// ---------- Voice class ----------------
function Voice(mixAmp) {
    this.osc = context.createOscillator()
    this.oscAmp = context.createGain()
    this.ampEnv = ADSR(context)

    this.play = function(frequency) {
        this.osc.type = 'triangle'
        this.osc.frequency.value = frequency
        console.log(frequency)

        this.oscAmp.gain = 0

        this.ampEnv.attack = ampEnvAttack
        this.ampEnv.delay = ampEnvDelay
        this.ampEnv.sustain = ampEnvSustain
        this.ampEnv.release = ampEnvRelease
        this.ampEnv.endValue = 0.0
        console.log(this.ampEnv.sustain)
    
        // routing
        this.osc.connect(this.oscAmp)
        this.oscAmp.connect(mixAmp)
        this.ampEnv.connect(this.oscAmp.gain)
        mixAmp.connect(context.destination)

        this.ampEnv.start(context.currentTime)
        this.osc.start(context.CurrentTime)          
    }

    this.stop = function() {
        var stopAt = this.ampEnv.stop(context.currentTime + ampEnvRelease)
        // this.osc.stop(stopAt)
        this.oscAmp.gain.setTargetAtTime(0.0, context.currentTime + ampEnvRelease, ampEnvRelease*0.5)
    }
}
