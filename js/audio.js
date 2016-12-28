var Envelope = require('envelope-generator');

var context = new AudioContext();

// declare globals
var voices = [],
    mixAmp = context.createGain(),
    gain = 0.1,
    waveform = 'sine',
    baseFreq = 261.6255,
    ampEnvAttack = 0.1,
    ampEnvDecay = 0.025,
    ampEnvSustain = 0.9,
    ampEnvRelease = 0.5,
    filterType = 'lowpass',
    filterFreq = 3000;

// -------- filter and global routing ----------
filter = context.createBiquadFilter();
filter.type = filterType;
filter.frequency.value = filterFreq;

filter.connect(mixAmp);
mixAmp.connect(context.destination);

// ---------- start and stop voices ------------
function startVoice(n,cents) {
    // check for retrigger
    if (voices[n]) {
        voices[n].osc.stop();
    }

    // instantiate and start voice
    voices[n] = new Voice(mixAmp);
    voices[n].play(cents);
}

function stopVoice(n) {
    voices[n].stop();
}


// ---------- Voice class ----------------
function Voice(mixAmp) {
    this.osc = context.createOscillator();
    this.oscAmp = context.createGain();
    this.oscAmp.gain.value = 0.0;

    // envelope settings
    let settings = {
        attackTime: ampEnvAttack,
        decayTime: ampEnvDecay,
        sustainLevel: ampEnvSustain,
        releaseTime: ampEnvRelease
    };
    this.ampEnv = new Envelope(context, settings);

    // routing
    this.osc.connect(this.oscAmp);
    this.ampEnv.connect(this.oscAmp.gain);
    this.oscAmp.connect(filter);

    this.play = function(cents) {
        this.osc.type = waveform;
        this.osc.frequency.value = baseFreq * Math.pow(2,(cents/1200));
        console.log(this.osc.frequency.value);

        this.ampEnv.start(context.currentTime);
        this.osc.start(context.CurrentTime);
    };

    this.stop = function() {
        this.ampEnv.release(context.currentTime);
        var stopAt = this.ampEnv.getReleaseCompleteTime();
        this.osc.stop(stopAt);
        this.ampEnv.stop(stopAt);
    };
}

// ---------- Controls --------------
function setWaveform(wv) {
    waveform = wv;
}

function setMixGain(gain) {
    mixAmp.gain.value = gain;
}

function setAttack(attack) {
    ampEnvAttack = attack;
}

function setDecay(decay) {
    ampEnvDecay = decay;
}

function setSustain(sustain) {
    ampEnvSustain = sustain;
}

function setRelease(release) {
    ampEnvRelease = release;
}

function setBaseFreq(bf) {
    baseFreq = bf;
}

function setFilterFreq(filtFreq) {
    filter.frequency.value = filtFreq;
}

// ---------- Exports --------------
exports.startVoice = startVoice;
exports.stopVoice = stopVoice;
exports.setWaveform = setWaveform;
exports.setMixGain = setMixGain;
exports.setAttack = setAttack;
exports.setDecay = setDecay;
exports.setSustain = setSustain;
exports.setRelease = setRelease;
exports.setBaseFreq = setBaseFreq;
exports.setFilterFreq = setFilterFreq;
