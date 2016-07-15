var Envelope = require('envelope-generator')

context = new AudioContext()

// declare globals
var voices = [],
    mixAmp = context.createGain(),
    waveform = 'sine',
    ampEnvAttack = 0.1,
    ampEnvDecay = 0.025,
    ampEnvSustain = 0.9,
    ampEnvRelease = 0.5 

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
    
    this.oscAmp.gain.value = 0.0

    // envelope settings
    let settings = {
        attackTime: ampEnvAttack,
        decayTime: ampEnvDecay,
        sustainLevel: ampEnvSustain,
        releaseTime: ampEnvRelease
    }
    this.ampEnv = new Envelope(context, settings)
    
    // routing
    this.osc.connect(this.oscAmp)
    this.oscAmp.connect(mixAmp)
    this.ampEnv.connect(this.oscAmp.gain)
    mixAmp.connect(context.destination)

    this.play = function(frequency) {
        this.osc.type = waveform 
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
    }

    this.stop = function() {
        this.ampEnv.release(context.currentTime)
        var stopAt = this.ampEnv.getReleaseCompleteTime()
        this.osc.stop(stopAt)
        this.ampEnv.stop(stopAt)
    }
}

// ---------- Controls --------------
function setWaveform(wv) {
    waveform = wv
}

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
exports.setWaveform = setWaveform
exports.setMixGain = setMixGain
exports.setAttack = setAttack
exports.setDecay = setDecay
exports.setSustain = setSustain
exports.setRelease = setRelease
