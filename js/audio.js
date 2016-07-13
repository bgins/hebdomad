var ADSR = require('adsr')

context = new AudioContext()

// declare globals
var voices = [],
    mixAmp = context.createGain(),
    ampEnvAttack = 0.3,
    ampEnvDecay = 0.1,
    ampEnvSustain = 0.1,
    ampEnvRelease = 0.4 

// ---------- init instrument ----------------
$(document).ready(function() {
    initTuning()
    initControls()
})

function initTuning() {
    $('#voice-one-pitch').attr("value","440")
    $('#voice-two-pitch').attr("value","495")
    $('#voice-three-pitch').attr("value","528")
    $('#voice-four-pitch').attr("value","594")
    $('#voice-five-pitch').attr("value","660")
    $('#voice-six-pitch').attr("value","742.5")
    $('#voice-seven-pitch').attr("value","792")
    $('#voice-eight-pitch').attr("value","880")
}

function initControls() {
    mixAmp.gain.value = 0.1
}


// ---------- start and stop voices------------
function startVoice(n,freq) {
    // check for retrigger
    if (voices[n]) {
        voices[n].osc.stop()
        // delete voices[n]
    }

    // instantiate and start voice 
    voices[n] = new Voice(mixAmp)
    voices[n].play(freq)
}

function stopVoice(n) {
    voices[n].stop()
    // delete voices[n]
}


// ---------- Voice class ----------------
function Voice(mixAmp) {
    this.osc = context.createOscillator()
    this.oscAmp = context.createGain()
    this.ampEnv = ADSR(context)
    
    this.oscAmp.gain.value = 0.0

    this.ampEnv.attack = ampEnvAttack
    this.ampEnv.decay = ampEnvDecay
    this.ampEnv.sustain = ampEnvSustain
    this.ampEnv.release = ampEnvRelease
    
    // routing
    this.osc.connect(this.oscAmp)
    this.oscAmp.connect(mixAmp)
    this.ampEnv.connect(this.oscAmp.gain)
    mixAmp.connect(context.destination)

    this.play = function(frequency) {
        this.osc.type = 'triangle'
        this.osc.frequency.value = frequency
        console.log(frequency)

        
        /*
        this.oscAmp.gain.value = 0.0

        this.ampEnv.attack = ampEnvAttack
        this.ampEnv.decay = ampEnvDecay
        this.ampEnv.sustain = ampEnvSustain
        this.ampEnv.release = ampEnvRelease
    
        // routing
        this.osc.connect(this.oscAmp)
        this.oscAmp.connect(mixAmp)
        this.ampEnv.connect(this.oscAmp.gain)
        mixAmp.connect(context.destination)
        */


        this.ampEnv.start(context.currentTime)
        this.osc.start(context.CurrentTime)          
        console.log(this.oscAmp.gain.value)
    }

    this.stop = function() {
        // console.log(this.ampEnv.release)
        var stopAt = this.ampEnv.stop(context.currentTime)
        this.osc.stop(stopAt)
    }
}

// ---------- Controls --------------
function setMixGain(gain) {
    mixAmp.gain.value = gain
}

function setAttack(attack) {
    ampEnvAttack = attack
}

function setDecay(decay) {
    ampEnvDecay = decay
}

function setSustain(sustain) {
    ampEnvSustain = sustain
}

function setRelease(release) {
    ampEnvRelease = release
}

// ---------- Exports --------------
exports.startVoice = startVoice
exports.stopVoice = stopVoice
exports.setMixGain = setMixGain
exports.setAttack = setAttack
exports.setDecay = setDecay
exports.setSustain = setSustain
exports.setRelease = setRelease
