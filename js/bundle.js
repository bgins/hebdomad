(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var audio = require('./audio.js')

$(document).foundation()

// Gain input event changes level from 0 to 1 
$('#gain').on('input',function(){
    audio.setMixGain($("#gain").val() / 50)
})

$('#attack').on('input',function(){
    audio.setAttack($("#attack").val() / 1000)
})

$('#decay').on('input',function(){
    audio.setDecay($("#decay").val() / 1000)
})

$('#sustain').on('input',function(){
    audio.setSustain($("#sustain").val() / 100)
})

$('#release').on('input',function(){
    audio.setRelease($("#release").val() / 1000)
})


// ---------- keypress events ------------
// keydown starts notes, keyup stops note
// heldKeys keeps track of which keys are currently held
// keycodes: a = 66, s = 83, d = 68, f = 70,
//           j = 74, k = 75, l = 76, 
//           ; = 59 (firefox) and 186 (chrome)

var heldKeys = []

$(document).keydown(function(e) {
    // check if key is currently pressed
    if (heldKeys[e.which]) {
        return
    }

    switch (e.which) {
        case 65:
            var freq = $('#voice-one-pitch').val()
            audio.startVoice(1,freq)
            break
        case 83:
            var freq = $('#voice-two-pitch').val()
            audio.startVoice(2,freq)
            break
        case 68:
            var freq = $('#voice-three-pitch').val()
            audio.startVoice(3,freq)
            break
        case 70:
            var freq = $('#voice-four-pitch').val()
            audio.startVoice(4,freq)
            break
        case 74:
            var freq = $('#voice-five-pitch').val()
            audio.startVoice(5,freq)
            break
        case 75:
            var freq = $('#voice-six-pitch').val()
            audio.startVoice(6,freq)
            break
        case 76:
            var freq = $('#voice-seven-pitch').val()
            audio.startVoice(7,freq)
            break
        case 59:
        case 186:
            var freq = $('#voice-eight-pitch').val()
            audio.startVoice(8,freq)
            break
    }
    heldKeys[e.which] = true
});

$(document).keyup(function(e) {
    switch (e.which) {
        case 65:
            audio.stopVoice(1)
            break
        case 83:
            audio.stopVoice(2)
            break
        case 68:
            audio.stopVoice(3)
            break
        case 70:
            audio.stopVoice(4)
            break
        case 74:
            audio.stopVoice(5)
            break
        case 75:
            audio.stopVoice(6)
            break
        case 76:
            audio.stopVoice(7)
            break
        case 59:
        case 186:
            audio.stopVoice(8)
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
            audio.startVoice(1,freq)
            break
        case "voice-two":
            var freq = $('#voice-two-pitch').val()
            audio.startVoice(2,freq)
            break
        case "voice-three":
            var freq = $('#voice-three-pitch').val()
            audio.startVoice(3,freq)
            break
        case "voice-four":
            var freq = $('#voice-four-pitch').val()
            audio.startVoice(4,freq)
            break
        case "voice-five":
            var freq = $('#voice-five-pitch').val()
            audio.startVoice(5,freq)
            break
        case "voice-six":
            var freq = $('#voice-six-pitch').val()
            audio.startVoice(6,freq)
            break
        case "voice-seven":
            var freq = $('#voice-seven-pitch').val()
            audio.startVoice(7,freq)
            break
        case "voice-eight":
            var freq = $('#voice-eight-pitch').val()
            audio.startVoice(8,freq)
            break
    }
})

$('.key').mouseup(function() {
    switch(this.id) {
        case "voice-one":
            audio.stopVoice(1)
            break
        case "voice-two":
            audio.stopVoice(2)
            break
        case "voice-three":
            audio.stopVoice(3)
            break
        case "voice-four":
            audio.stopVoice(4)
            break
        case "voice-five":
            audio.stopVoice(5)
            break
        case "voice-six":
            audio.stopVoice(6)
            break
        case "voice-seven":
            audio.stopVoice(7)
            break
        case "voice-eight":
            audio.stopVoice(8)
            break
    }
})


// ---------- utilities ------------
// blur event that fires on any input:text enter
$("#btnHidden").on('click', function() {
    $("input:text").blur()
})

},{"./audio.js":2}],2:[function(require,module,exports){
var ADSR = require('adsr')

context = new AudioContext()

// declare globals
var voices = [],
    mixAmp = context.createGain(),
    ampEnvAttack = 0.3,
    ampEnvDecay = 0,
    ampEnvSustain = 1,
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
        // delete voices[n]
        // voices[n].ampEnv.stop(context.currentTime, true)
        voices[n].osc.stop()
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


        // tests
        this.ampEnv.decay = 0.5
        this.ampEnv.sustain = 1
        */

        this.ampEnv.start(context.currentTime)
        this.osc.start(context.CurrentTime)          
        console.log(this.oscAmp.gain.value)


        // test for extra note
        // var stopAt = this.ampEnv.stop(context.currentTime + ampEnvAttack + ampEnvDecay)
        // this.osc.stop(stopAt)

    }

    this.stop = function() {
        console.log(this.ampEnv.release)
        var stopAt = this.ampEnv.stop(context.currentTime)
        this.osc.stop(stopAt)
        // var stopAt = this.ampEnv.stop(context.currentTime + ampEnvRelease)
        // this.osc.stop(stopAt)
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

},{"adsr":3}],3:[function(require,module,exports){
module.exports = ADSR

function ADSR(audioContext){
  var node = audioContext.createGain()

  var voltage = node._voltage = getVoltage(audioContext)
  var value = scale(voltage)
  var startValue = scale(voltage)
  var endValue = scale(voltage)

  node._startAmount = scale(startValue)
  node._endAmount = scale(endValue)

  node._multiplier = scale(value)
  node._multiplier.connect(node)
  node._startAmount.connect(node)
  node._endAmount.connect(node)

  node.value = value.gain
  node.startValue = startValue.gain
  node.endValue = endValue.gain

  node.startValue.value = 0
  node.endValue.value = 0

  Object.defineProperties(node, props)
  return node
}

var props = {

  attack: { value: 0, writable: true },
  decay: { value: 0, writable: true },
  sustain: { value: 1, writable: true },
  release: {value: 0, writable: true },

  getReleaseDuration: {
    value: function(){
      return this.release
    }
  },

  start: {
    value: function(at){
      var target = this._multiplier.gain
      var startAmount = this._startAmount.gain
      var endAmount = this._endAmount.gain

      this._voltage.start(at)
      this._decayFrom = this._decayFrom = at+this.attack
      this._startedAt = at

      var sustain = this.sustain

      target.cancelScheduledValues(at)
      startAmount.cancelScheduledValues(at)
      endAmount.cancelScheduledValues(at)

      endAmount.setValueAtTime(0, at)

      if (this.attack){
        target.setValueAtTime(0, at)
        target.linearRampToValueAtTime(1, at + this.attack)

        startAmount.setValueAtTime(1, at)
        startAmount.linearRampToValueAtTime(0, at + this.attack)
      } else {
        target.setValueAtTime(1, at)
        startAmount.setValueAtTime(0, at)
      }

      if (this.decay){
        target.setTargetAtTime(sustain, this._decayFrom, getTimeConstant(this.decay))
      }
    }
  },

  stop: {
    value: function(at, isTarget){
      if (isTarget){
        at = at - this.release
      }

      var endTime = at + this.release
      if (this.release){

        var target = this._multiplier.gain
        var startAmount = this._startAmount.gain
        var endAmount = this._endAmount.gain

        target.cancelScheduledValues(at)
        startAmount.cancelScheduledValues(at)
        endAmount.cancelScheduledValues(at)

        var expFalloff = getTimeConstant(this.release)

        // truncate attack (required as linearRamp is removed by cancelScheduledValues)
        if (this.attack && at < this._decayFrom){
          var valueAtTime = getValue(0, 1, this._startedAt, this._decayFrom, at)
          target.linearRampToValueAtTime(valueAtTime, at)
          startAmount.linearRampToValueAtTime(1-valueAtTime, at)
          startAmount.setTargetAtTime(0, at, expFalloff)
        }

        endAmount.setTargetAtTime(1, at, expFalloff)
        target.setTargetAtTime(0, at, expFalloff)
      }

      this._voltage.stop(endTime)
      return endTime
    }
  },

  onended: {
    get: function(){
      return this._voltage.onended
    },
    set: function(value){
      this._voltage.onended = value
    }
  }

}

var flat = new Float32Array([1,1])
function getVoltage(context){
  var voltage = context.createBufferSource()
  var buffer = context.createBuffer(1, 2, context.sampleRate)
  buffer.getChannelData(0).set(flat)
  voltage.buffer = buffer
  voltage.loop = true
  return voltage
}

function scale(node){
  var gain = node.context.createGain()
  node.connect(gain)
  return gain
}

function getTimeConstant(time){
  return Math.log(time+1)/Math.log(100)
}

function getValue(start, end, fromTime, toTime, at){
  var difference = end - start
  var time = toTime - fromTime
  var truncateTime = at - fromTime
  var phase = truncateTime / time
  var value = start + phase * difference

  if (value <= start) {
      value = start
  }
  if (value >= end) {
      value = end
  }

  return value
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Vzci9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImFwcC5qcyIsImF1ZGlvLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Fkc3IvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGF1ZGlvID0gcmVxdWlyZSgnLi9hdWRpby5qcycpXG5cbiQoZG9jdW1lbnQpLmZvdW5kYXRpb24oKVxuXG4vLyBHYWluIGlucHV0IGV2ZW50IGNoYW5nZXMgbGV2ZWwgZnJvbSAwIHRvIDEgXG4kKCcjZ2FpbicpLm9uKCdpbnB1dCcsZnVuY3Rpb24oKXtcbiAgICBhdWRpby5zZXRNaXhHYWluKCQoXCIjZ2FpblwiKS52YWwoKSAvIDUwKVxufSlcblxuJCgnI2F0dGFjaycpLm9uKCdpbnB1dCcsZnVuY3Rpb24oKXtcbiAgICBhdWRpby5zZXRBdHRhY2soJChcIiNhdHRhY2tcIikudmFsKCkgLyAxMDAwKVxufSlcblxuJCgnI2RlY2F5Jykub24oJ2lucHV0JyxmdW5jdGlvbigpe1xuICAgIGF1ZGlvLnNldERlY2F5KCQoXCIjZGVjYXlcIikudmFsKCkgLyAxMDAwKVxufSlcblxuJCgnI3N1c3RhaW4nKS5vbignaW5wdXQnLGZ1bmN0aW9uKCl7XG4gICAgYXVkaW8uc2V0U3VzdGFpbigkKFwiI3N1c3RhaW5cIikudmFsKCkgLyAxMDApXG59KVxuXG4kKCcjcmVsZWFzZScpLm9uKCdpbnB1dCcsZnVuY3Rpb24oKXtcbiAgICBhdWRpby5zZXRSZWxlYXNlKCQoXCIjcmVsZWFzZVwiKS52YWwoKSAvIDEwMDApXG59KVxuXG5cbi8vIC0tLS0tLS0tLS0ga2V5cHJlc3MgZXZlbnRzIC0tLS0tLS0tLS0tLVxuLy8ga2V5ZG93biBzdGFydHMgbm90ZXMsIGtleXVwIHN0b3BzIG5vdGVcbi8vIGhlbGRLZXlzIGtlZXBzIHRyYWNrIG9mIHdoaWNoIGtleXMgYXJlIGN1cnJlbnRseSBoZWxkXG4vLyBrZXljb2RlczogYSA9IDY2LCBzID0gODMsIGQgPSA2OCwgZiA9IDcwLFxuLy8gICAgICAgICAgIGogPSA3NCwgayA9IDc1LCBsID0gNzYsIFxuLy8gICAgICAgICAgIDsgPSA1OSAoZmlyZWZveCkgYW5kIDE4NiAoY2hyb21lKVxuXG52YXIgaGVsZEtleXMgPSBbXVxuXG4kKGRvY3VtZW50KS5rZXlkb3duKGZ1bmN0aW9uKGUpIHtcbiAgICAvLyBjaGVjayBpZiBrZXkgaXMgY3VycmVudGx5IHByZXNzZWRcbiAgICBpZiAoaGVsZEtleXNbZS53aGljaF0pIHtcbiAgICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgc3dpdGNoIChlLndoaWNoKSB7XG4gICAgICAgIGNhc2UgNjU6XG4gICAgICAgICAgICB2YXIgZnJlcSA9ICQoJyN2b2ljZS1vbmUtcGl0Y2gnKS52YWwoKVxuICAgICAgICAgICAgYXVkaW8uc3RhcnRWb2ljZSgxLGZyZXEpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDgzOlxuICAgICAgICAgICAgdmFyIGZyZXEgPSAkKCcjdm9pY2UtdHdvLXBpdGNoJykudmFsKClcbiAgICAgICAgICAgIGF1ZGlvLnN0YXJ0Vm9pY2UoMixmcmVxKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA2ODpcbiAgICAgICAgICAgIHZhciBmcmVxID0gJCgnI3ZvaWNlLXRocmVlLXBpdGNoJykudmFsKClcbiAgICAgICAgICAgIGF1ZGlvLnN0YXJ0Vm9pY2UoMyxmcmVxKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA3MDpcbiAgICAgICAgICAgIHZhciBmcmVxID0gJCgnI3ZvaWNlLWZvdXItcGl0Y2gnKS52YWwoKVxuICAgICAgICAgICAgYXVkaW8uc3RhcnRWb2ljZSg0LGZyZXEpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDc0OlxuICAgICAgICAgICAgdmFyIGZyZXEgPSAkKCcjdm9pY2UtZml2ZS1waXRjaCcpLnZhbCgpXG4gICAgICAgICAgICBhdWRpby5zdGFydFZvaWNlKDUsZnJlcSlcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgNzU6XG4gICAgICAgICAgICB2YXIgZnJlcSA9ICQoJyN2b2ljZS1zaXgtcGl0Y2gnKS52YWwoKVxuICAgICAgICAgICAgYXVkaW8uc3RhcnRWb2ljZSg2LGZyZXEpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDc2OlxuICAgICAgICAgICAgdmFyIGZyZXEgPSAkKCcjdm9pY2Utc2V2ZW4tcGl0Y2gnKS52YWwoKVxuICAgICAgICAgICAgYXVkaW8uc3RhcnRWb2ljZSg3LGZyZXEpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDU5OlxuICAgICAgICBjYXNlIDE4NjpcbiAgICAgICAgICAgIHZhciBmcmVxID0gJCgnI3ZvaWNlLWVpZ2h0LXBpdGNoJykudmFsKClcbiAgICAgICAgICAgIGF1ZGlvLnN0YXJ0Vm9pY2UoOCxmcmVxKVxuICAgICAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgaGVsZEtleXNbZS53aGljaF0gPSB0cnVlXG59KTtcblxuJChkb2N1bWVudCkua2V5dXAoZnVuY3Rpb24oZSkge1xuICAgIHN3aXRjaCAoZS53aGljaCkge1xuICAgICAgICBjYXNlIDY1OlxuICAgICAgICAgICAgYXVkaW8uc3RvcFZvaWNlKDEpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDgzOlxuICAgICAgICAgICAgYXVkaW8uc3RvcFZvaWNlKDIpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDY4OlxuICAgICAgICAgICAgYXVkaW8uc3RvcFZvaWNlKDMpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDcwOlxuICAgICAgICAgICAgYXVkaW8uc3RvcFZvaWNlKDQpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDc0OlxuICAgICAgICAgICAgYXVkaW8uc3RvcFZvaWNlKDUpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDc1OlxuICAgICAgICAgICAgYXVkaW8uc3RvcFZvaWNlKDYpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDc2OlxuICAgICAgICAgICAgYXVkaW8uc3RvcFZvaWNlKDcpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDU5OlxuICAgICAgICBjYXNlIDE4NjpcbiAgICAgICAgICAgIGF1ZGlvLnN0b3BWb2ljZSg4KVxuICAgICAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgaGVsZEtleXNbZS53aGljaF0gPSBmYWxzZVxufSk7XG5cblxuLy8gLS0tLS0tLS0tLSBjbGljayBldmVudHMgLS0tLS0tLS0tLS0tXG4vLyBub3RlIHN0YXJ0cyBvbiBtb3VzZWRvd24sIHRoZW4gaG9sZHMgdGlsIG1vdXNldXBcbiQoJy5rZXknKS5tb3VzZWRvd24oZnVuY3Rpb24oKSB7XG4gICAgc3dpdGNoKHRoaXMuaWQpIHtcbiAgICAgICAgY2FzZSBcInZvaWNlLW9uZVwiOlxuICAgICAgICAgICAgdmFyIGZyZXEgPSAkKCcjdm9pY2Utb25lLXBpdGNoJykudmFsKClcbiAgICAgICAgICAgIGF1ZGlvLnN0YXJ0Vm9pY2UoMSxmcmVxKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSBcInZvaWNlLXR3b1wiOlxuICAgICAgICAgICAgdmFyIGZyZXEgPSAkKCcjdm9pY2UtdHdvLXBpdGNoJykudmFsKClcbiAgICAgICAgICAgIGF1ZGlvLnN0YXJ0Vm9pY2UoMixmcmVxKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSBcInZvaWNlLXRocmVlXCI6XG4gICAgICAgICAgICB2YXIgZnJlcSA9ICQoJyN2b2ljZS10aHJlZS1waXRjaCcpLnZhbCgpXG4gICAgICAgICAgICBhdWRpby5zdGFydFZvaWNlKDMsZnJlcSlcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgXCJ2b2ljZS1mb3VyXCI6XG4gICAgICAgICAgICB2YXIgZnJlcSA9ICQoJyN2b2ljZS1mb3VyLXBpdGNoJykudmFsKClcbiAgICAgICAgICAgIGF1ZGlvLnN0YXJ0Vm9pY2UoNCxmcmVxKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSBcInZvaWNlLWZpdmVcIjpcbiAgICAgICAgICAgIHZhciBmcmVxID0gJCgnI3ZvaWNlLWZpdmUtcGl0Y2gnKS52YWwoKVxuICAgICAgICAgICAgYXVkaW8uc3RhcnRWb2ljZSg1LGZyZXEpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIFwidm9pY2Utc2l4XCI6XG4gICAgICAgICAgICB2YXIgZnJlcSA9ICQoJyN2b2ljZS1zaXgtcGl0Y2gnKS52YWwoKVxuICAgICAgICAgICAgYXVkaW8uc3RhcnRWb2ljZSg2LGZyZXEpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIFwidm9pY2Utc2V2ZW5cIjpcbiAgICAgICAgICAgIHZhciBmcmVxID0gJCgnI3ZvaWNlLXNldmVuLXBpdGNoJykudmFsKClcbiAgICAgICAgICAgIGF1ZGlvLnN0YXJ0Vm9pY2UoNyxmcmVxKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSBcInZvaWNlLWVpZ2h0XCI6XG4gICAgICAgICAgICB2YXIgZnJlcSA9ICQoJyN2b2ljZS1laWdodC1waXRjaCcpLnZhbCgpXG4gICAgICAgICAgICBhdWRpby5zdGFydFZvaWNlKDgsZnJlcSlcbiAgICAgICAgICAgIGJyZWFrXG4gICAgfVxufSlcblxuJCgnLmtleScpLm1vdXNldXAoZnVuY3Rpb24oKSB7XG4gICAgc3dpdGNoKHRoaXMuaWQpIHtcbiAgICAgICAgY2FzZSBcInZvaWNlLW9uZVwiOlxuICAgICAgICAgICAgYXVkaW8uc3RvcFZvaWNlKDEpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIFwidm9pY2UtdHdvXCI6XG4gICAgICAgICAgICBhdWRpby5zdG9wVm9pY2UoMilcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgXCJ2b2ljZS10aHJlZVwiOlxuICAgICAgICAgICAgYXVkaW8uc3RvcFZvaWNlKDMpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIFwidm9pY2UtZm91clwiOlxuICAgICAgICAgICAgYXVkaW8uc3RvcFZvaWNlKDQpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIFwidm9pY2UtZml2ZVwiOlxuICAgICAgICAgICAgYXVkaW8uc3RvcFZvaWNlKDUpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIFwidm9pY2Utc2l4XCI6XG4gICAgICAgICAgICBhdWRpby5zdG9wVm9pY2UoNilcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgXCJ2b2ljZS1zZXZlblwiOlxuICAgICAgICAgICAgYXVkaW8uc3RvcFZvaWNlKDcpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIFwidm9pY2UtZWlnaHRcIjpcbiAgICAgICAgICAgIGF1ZGlvLnN0b3BWb2ljZSg4KVxuICAgICAgICAgICAgYnJlYWtcbiAgICB9XG59KVxuXG5cbi8vIC0tLS0tLS0tLS0gdXRpbGl0aWVzIC0tLS0tLS0tLS0tLVxuLy8gYmx1ciBldmVudCB0aGF0IGZpcmVzIG9uIGFueSBpbnB1dDp0ZXh0IGVudGVyXG4kKFwiI2J0bkhpZGRlblwiKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAkKFwiaW5wdXQ6dGV4dFwiKS5ibHVyKClcbn0pXG4iLCJ2YXIgQURTUiA9IHJlcXVpcmUoJ2Fkc3InKVxuXG5jb250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpXG5cbi8vIGRlY2xhcmUgZ2xvYmFsc1xudmFyIHZvaWNlcyA9IFtdLFxuICAgIG1peEFtcCA9IGNvbnRleHQuY3JlYXRlR2FpbigpLFxuICAgIGFtcEVudkF0dGFjayA9IDAuMyxcbiAgICBhbXBFbnZEZWNheSA9IDAsXG4gICAgYW1wRW52U3VzdGFpbiA9IDEsXG4gICAgYW1wRW52UmVsZWFzZSA9IDAuNCBcblxuLy8gLS0tLS0tLS0tLSBpbml0IGluc3RydW1lbnQgLS0tLS0tLS0tLS0tLS0tLVxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgaW5pdFR1bmluZygpXG4gICAgaW5pdENvbnRyb2xzKClcbn0pXG5cbmZ1bmN0aW9uIGluaXRUdW5pbmcoKSB7XG4gICAgJCgnI3ZvaWNlLW9uZS1waXRjaCcpLmF0dHIoXCJ2YWx1ZVwiLFwiNDQwXCIpXG4gICAgJCgnI3ZvaWNlLXR3by1waXRjaCcpLmF0dHIoXCJ2YWx1ZVwiLFwiNDk1XCIpXG4gICAgJCgnI3ZvaWNlLXRocmVlLXBpdGNoJykuYXR0cihcInZhbHVlXCIsXCI1MjhcIilcbiAgICAkKCcjdm9pY2UtZm91ci1waXRjaCcpLmF0dHIoXCJ2YWx1ZVwiLFwiNTk0XCIpXG4gICAgJCgnI3ZvaWNlLWZpdmUtcGl0Y2gnKS5hdHRyKFwidmFsdWVcIixcIjY2MFwiKVxuICAgICQoJyN2b2ljZS1zaXgtcGl0Y2gnKS5hdHRyKFwidmFsdWVcIixcIjc0Mi41XCIpXG4gICAgJCgnI3ZvaWNlLXNldmVuLXBpdGNoJykuYXR0cihcInZhbHVlXCIsXCI3OTJcIilcbiAgICAkKCcjdm9pY2UtZWlnaHQtcGl0Y2gnKS5hdHRyKFwidmFsdWVcIixcIjg4MFwiKVxufVxuXG5mdW5jdGlvbiBpbml0Q29udHJvbHMoKSB7XG4gICAgbWl4QW1wLmdhaW4udmFsdWUgPSAwLjFcbn1cblxuXG4vLyAtLS0tLS0tLS0tIHN0YXJ0IGFuZCBzdG9wIHZvaWNlcy0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gc3RhcnRWb2ljZShuLGZyZXEpIHtcbiAgICAvLyBjaGVjayBmb3IgcmV0cmlnZ2VyXG4gICAgaWYgKHZvaWNlc1tuXSkge1xuICAgICAgICAvLyBkZWxldGUgdm9pY2VzW25dXG4gICAgICAgIC8vIHZvaWNlc1tuXS5hbXBFbnYuc3RvcChjb250ZXh0LmN1cnJlbnRUaW1lLCB0cnVlKVxuICAgICAgICB2b2ljZXNbbl0ub3NjLnN0b3AoKVxuICAgIH1cblxuICAgIC8vIGluc3RhbnRpYXRlIGFuZCBzdGFydCB2b2ljZSBcbiAgICB2b2ljZXNbbl0gPSBuZXcgVm9pY2UobWl4QW1wKVxuICAgIHZvaWNlc1tuXS5wbGF5KGZyZXEpXG59XG5cbmZ1bmN0aW9uIHN0b3BWb2ljZShuKSB7XG4gICAgdm9pY2VzW25dLnN0b3AoKVxuICAgIC8vIGRlbGV0ZSB2b2ljZXNbbl1cbn1cblxuXG4vLyAtLS0tLS0tLS0tIFZvaWNlIGNsYXNzIC0tLS0tLS0tLS0tLS0tLS1cbmZ1bmN0aW9uIFZvaWNlKG1peEFtcCkge1xuICAgIHRoaXMub3NjID0gY29udGV4dC5jcmVhdGVPc2NpbGxhdG9yKClcbiAgICB0aGlzLm9zY0FtcCA9IGNvbnRleHQuY3JlYXRlR2FpbigpXG4gICAgdGhpcy5hbXBFbnYgPSBBRFNSKGNvbnRleHQpXG4gICAgXG4gICAgdGhpcy5vc2NBbXAuZ2Fpbi52YWx1ZSA9IDAuMFxuXG4gICAgdGhpcy5hbXBFbnYuYXR0YWNrID0gYW1wRW52QXR0YWNrXG4gICAgdGhpcy5hbXBFbnYuZGVjYXkgPSBhbXBFbnZEZWNheVxuICAgIHRoaXMuYW1wRW52LnN1c3RhaW4gPSBhbXBFbnZTdXN0YWluXG4gICAgdGhpcy5hbXBFbnYucmVsZWFzZSA9IGFtcEVudlJlbGVhc2VcbiAgICBcbiAgICAvLyByb3V0aW5nXG4gICAgdGhpcy5vc2MuY29ubmVjdCh0aGlzLm9zY0FtcClcbiAgICB0aGlzLm9zY0FtcC5jb25uZWN0KG1peEFtcClcbiAgICB0aGlzLmFtcEVudi5jb25uZWN0KHRoaXMub3NjQW1wLmdhaW4pXG4gICAgbWl4QW1wLmNvbm5lY3QoY29udGV4dC5kZXN0aW5hdGlvbilcblxuICAgIHRoaXMucGxheSA9IGZ1bmN0aW9uKGZyZXF1ZW5jeSkge1xuICAgICAgICB0aGlzLm9zYy50eXBlID0gJ3RyaWFuZ2xlJ1xuICAgICAgICB0aGlzLm9zYy5mcmVxdWVuY3kudmFsdWUgPSBmcmVxdWVuY3lcbiAgICAgICAgY29uc29sZS5sb2coZnJlcXVlbmN5KVxuXG4gICAgICAgIFxuICAgICAgICAvKlxuICAgICAgICB0aGlzLm9zY0FtcC5nYWluLnZhbHVlID0gMC4wXG5cbiAgICAgICAgdGhpcy5hbXBFbnYuYXR0YWNrID0gYW1wRW52QXR0YWNrXG4gICAgICAgIHRoaXMuYW1wRW52LmRlY2F5ID0gYW1wRW52RGVjYXlcbiAgICAgICAgdGhpcy5hbXBFbnYuc3VzdGFpbiA9IGFtcEVudlN1c3RhaW5cbiAgICAgICAgdGhpcy5hbXBFbnYucmVsZWFzZSA9IGFtcEVudlJlbGVhc2VcbiAgICBcbiAgICAgICAgLy8gcm91dGluZ1xuICAgICAgICB0aGlzLm9zYy5jb25uZWN0KHRoaXMub3NjQW1wKVxuICAgICAgICB0aGlzLm9zY0FtcC5jb25uZWN0KG1peEFtcClcbiAgICAgICAgdGhpcy5hbXBFbnYuY29ubmVjdCh0aGlzLm9zY0FtcC5nYWluKVxuICAgICAgICBtaXhBbXAuY29ubmVjdChjb250ZXh0LmRlc3RpbmF0aW9uKVxuXG5cbiAgICAgICAgLy8gdGVzdHNcbiAgICAgICAgdGhpcy5hbXBFbnYuZGVjYXkgPSAwLjVcbiAgICAgICAgdGhpcy5hbXBFbnYuc3VzdGFpbiA9IDFcbiAgICAgICAgKi9cblxuICAgICAgICB0aGlzLmFtcEVudi5zdGFydChjb250ZXh0LmN1cnJlbnRUaW1lKVxuICAgICAgICB0aGlzLm9zYy5zdGFydChjb250ZXh0LkN1cnJlbnRUaW1lKSAgICAgICAgICBcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5vc2NBbXAuZ2Fpbi52YWx1ZSlcblxuXG4gICAgICAgIC8vIHRlc3QgZm9yIGV4dHJhIG5vdGVcbiAgICAgICAgLy8gdmFyIHN0b3BBdCA9IHRoaXMuYW1wRW52LnN0b3AoY29udGV4dC5jdXJyZW50VGltZSArIGFtcEVudkF0dGFjayArIGFtcEVudkRlY2F5KVxuICAgICAgICAvLyB0aGlzLm9zYy5zdG9wKHN0b3BBdClcblxuICAgIH1cblxuICAgIHRoaXMuc3RvcCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmFtcEVudi5yZWxlYXNlKVxuICAgICAgICB2YXIgc3RvcEF0ID0gdGhpcy5hbXBFbnYuc3RvcChjb250ZXh0LmN1cnJlbnRUaW1lKVxuICAgICAgICB0aGlzLm9zYy5zdG9wKHN0b3BBdClcbiAgICAgICAgLy8gdmFyIHN0b3BBdCA9IHRoaXMuYW1wRW52LnN0b3AoY29udGV4dC5jdXJyZW50VGltZSArIGFtcEVudlJlbGVhc2UpXG4gICAgICAgIC8vIHRoaXMub3NjLnN0b3Aoc3RvcEF0KVxuICAgIH1cbn1cblxuLy8gLS0tLS0tLS0tLSBDb250cm9scyAtLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gc2V0TWl4R2FpbihnYWluKSB7XG4gICAgbWl4QW1wLmdhaW4udmFsdWUgPSBnYWluXG59XG5cbmZ1bmN0aW9uIHNldEF0dGFjayhhdHRhY2spIHtcbiAgICBhbXBFbnZBdHRhY2sgPSBhdHRhY2tcbn1cblxuZnVuY3Rpb24gc2V0RGVjYXkoZGVjYXkpIHtcbiAgICBhbXBFbnZEZWNheSA9IGRlY2F5XG59XG5cbmZ1bmN0aW9uIHNldFN1c3RhaW4oc3VzdGFpbikge1xuICAgIGFtcEVudlN1c3RhaW4gPSBzdXN0YWluXG59XG5cbmZ1bmN0aW9uIHNldFJlbGVhc2UocmVsZWFzZSkge1xuICAgIGFtcEVudlJlbGVhc2UgPSByZWxlYXNlXG59XG5cbi8vIC0tLS0tLS0tLS0gRXhwb3J0cyAtLS0tLS0tLS0tLS0tLVxuZXhwb3J0cy5zdGFydFZvaWNlID0gc3RhcnRWb2ljZVxuZXhwb3J0cy5zdG9wVm9pY2UgPSBzdG9wVm9pY2VcbmV4cG9ydHMuc2V0TWl4R2FpbiA9IHNldE1peEdhaW5cbmV4cG9ydHMuc2V0QXR0YWNrID0gc2V0QXR0YWNrXG5leHBvcnRzLnNldERlY2F5ID0gc2V0RGVjYXlcbmV4cG9ydHMuc2V0U3VzdGFpbiA9IHNldFN1c3RhaW5cbmV4cG9ydHMuc2V0UmVsZWFzZSA9IHNldFJlbGVhc2VcbiIsIm1vZHVsZS5leHBvcnRzID0gQURTUlxuXG5mdW5jdGlvbiBBRFNSKGF1ZGlvQ29udGV4dCl7XG4gIHZhciBub2RlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKVxuXG4gIHZhciB2b2x0YWdlID0gbm9kZS5fdm9sdGFnZSA9IGdldFZvbHRhZ2UoYXVkaW9Db250ZXh0KVxuICB2YXIgdmFsdWUgPSBzY2FsZSh2b2x0YWdlKVxuICB2YXIgc3RhcnRWYWx1ZSA9IHNjYWxlKHZvbHRhZ2UpXG4gIHZhciBlbmRWYWx1ZSA9IHNjYWxlKHZvbHRhZ2UpXG5cbiAgbm9kZS5fc3RhcnRBbW91bnQgPSBzY2FsZShzdGFydFZhbHVlKVxuICBub2RlLl9lbmRBbW91bnQgPSBzY2FsZShlbmRWYWx1ZSlcblxuICBub2RlLl9tdWx0aXBsaWVyID0gc2NhbGUodmFsdWUpXG4gIG5vZGUuX211bHRpcGxpZXIuY29ubmVjdChub2RlKVxuICBub2RlLl9zdGFydEFtb3VudC5jb25uZWN0KG5vZGUpXG4gIG5vZGUuX2VuZEFtb3VudC5jb25uZWN0KG5vZGUpXG5cbiAgbm9kZS52YWx1ZSA9IHZhbHVlLmdhaW5cbiAgbm9kZS5zdGFydFZhbHVlID0gc3RhcnRWYWx1ZS5nYWluXG4gIG5vZGUuZW5kVmFsdWUgPSBlbmRWYWx1ZS5nYWluXG5cbiAgbm9kZS5zdGFydFZhbHVlLnZhbHVlID0gMFxuICBub2RlLmVuZFZhbHVlLnZhbHVlID0gMFxuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKG5vZGUsIHByb3BzKVxuICByZXR1cm4gbm9kZVxufVxuXG52YXIgcHJvcHMgPSB7XG5cbiAgYXR0YWNrOiB7IHZhbHVlOiAwLCB3cml0YWJsZTogdHJ1ZSB9LFxuICBkZWNheTogeyB2YWx1ZTogMCwgd3JpdGFibGU6IHRydWUgfSxcbiAgc3VzdGFpbjogeyB2YWx1ZTogMSwgd3JpdGFibGU6IHRydWUgfSxcbiAgcmVsZWFzZToge3ZhbHVlOiAwLCB3cml0YWJsZTogdHJ1ZSB9LFxuXG4gIGdldFJlbGVhc2VEdXJhdGlvbjoge1xuICAgIHZhbHVlOiBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIHRoaXMucmVsZWFzZVxuICAgIH1cbiAgfSxcblxuICBzdGFydDoge1xuICAgIHZhbHVlOiBmdW5jdGlvbihhdCl7XG4gICAgICB2YXIgdGFyZ2V0ID0gdGhpcy5fbXVsdGlwbGllci5nYWluXG4gICAgICB2YXIgc3RhcnRBbW91bnQgPSB0aGlzLl9zdGFydEFtb3VudC5nYWluXG4gICAgICB2YXIgZW5kQW1vdW50ID0gdGhpcy5fZW5kQW1vdW50LmdhaW5cblxuICAgICAgdGhpcy5fdm9sdGFnZS5zdGFydChhdClcbiAgICAgIHRoaXMuX2RlY2F5RnJvbSA9IHRoaXMuX2RlY2F5RnJvbSA9IGF0K3RoaXMuYXR0YWNrXG4gICAgICB0aGlzLl9zdGFydGVkQXQgPSBhdFxuXG4gICAgICB2YXIgc3VzdGFpbiA9IHRoaXMuc3VzdGFpblxuXG4gICAgICB0YXJnZXQuY2FuY2VsU2NoZWR1bGVkVmFsdWVzKGF0KVxuICAgICAgc3RhcnRBbW91bnQuY2FuY2VsU2NoZWR1bGVkVmFsdWVzKGF0KVxuICAgICAgZW5kQW1vdW50LmNhbmNlbFNjaGVkdWxlZFZhbHVlcyhhdClcblxuICAgICAgZW5kQW1vdW50LnNldFZhbHVlQXRUaW1lKDAsIGF0KVxuXG4gICAgICBpZiAodGhpcy5hdHRhY2spe1xuICAgICAgICB0YXJnZXQuc2V0VmFsdWVBdFRpbWUoMCwgYXQpXG4gICAgICAgIHRhcmdldC5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgxLCBhdCArIHRoaXMuYXR0YWNrKVxuXG4gICAgICAgIHN0YXJ0QW1vdW50LnNldFZhbHVlQXRUaW1lKDEsIGF0KVxuICAgICAgICBzdGFydEFtb3VudC5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgwLCBhdCArIHRoaXMuYXR0YWNrKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFyZ2V0LnNldFZhbHVlQXRUaW1lKDEsIGF0KVxuICAgICAgICBzdGFydEFtb3VudC5zZXRWYWx1ZUF0VGltZSgwLCBhdClcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuZGVjYXkpe1xuICAgICAgICB0YXJnZXQuc2V0VGFyZ2V0QXRUaW1lKHN1c3RhaW4sIHRoaXMuX2RlY2F5RnJvbSwgZ2V0VGltZUNvbnN0YW50KHRoaXMuZGVjYXkpKVxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBzdG9wOiB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uKGF0LCBpc1RhcmdldCl7XG4gICAgICBpZiAoaXNUYXJnZXQpe1xuICAgICAgICBhdCA9IGF0IC0gdGhpcy5yZWxlYXNlXG4gICAgICB9XG5cbiAgICAgIHZhciBlbmRUaW1lID0gYXQgKyB0aGlzLnJlbGVhc2VcbiAgICAgIGlmICh0aGlzLnJlbGVhc2Upe1xuXG4gICAgICAgIHZhciB0YXJnZXQgPSB0aGlzLl9tdWx0aXBsaWVyLmdhaW5cbiAgICAgICAgdmFyIHN0YXJ0QW1vdW50ID0gdGhpcy5fc3RhcnRBbW91bnQuZ2FpblxuICAgICAgICB2YXIgZW5kQW1vdW50ID0gdGhpcy5fZW5kQW1vdW50LmdhaW5cblxuICAgICAgICB0YXJnZXQuY2FuY2VsU2NoZWR1bGVkVmFsdWVzKGF0KVxuICAgICAgICBzdGFydEFtb3VudC5jYW5jZWxTY2hlZHVsZWRWYWx1ZXMoYXQpXG4gICAgICAgIGVuZEFtb3VudC5jYW5jZWxTY2hlZHVsZWRWYWx1ZXMoYXQpXG5cbiAgICAgICAgdmFyIGV4cEZhbGxvZmYgPSBnZXRUaW1lQ29uc3RhbnQodGhpcy5yZWxlYXNlKVxuXG4gICAgICAgIC8vIHRydW5jYXRlIGF0dGFjayAocmVxdWlyZWQgYXMgbGluZWFyUmFtcCBpcyByZW1vdmVkIGJ5IGNhbmNlbFNjaGVkdWxlZFZhbHVlcylcbiAgICAgICAgaWYgKHRoaXMuYXR0YWNrICYmIGF0IDwgdGhpcy5fZGVjYXlGcm9tKXtcbiAgICAgICAgICB2YXIgdmFsdWVBdFRpbWUgPSBnZXRWYWx1ZSgwLCAxLCB0aGlzLl9zdGFydGVkQXQsIHRoaXMuX2RlY2F5RnJvbSwgYXQpXG4gICAgICAgICAgdGFyZ2V0LmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKHZhbHVlQXRUaW1lLCBhdClcbiAgICAgICAgICBzdGFydEFtb3VudC5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgxLXZhbHVlQXRUaW1lLCBhdClcbiAgICAgICAgICBzdGFydEFtb3VudC5zZXRUYXJnZXRBdFRpbWUoMCwgYXQsIGV4cEZhbGxvZmYpXG4gICAgICAgIH1cblxuICAgICAgICBlbmRBbW91bnQuc2V0VGFyZ2V0QXRUaW1lKDEsIGF0LCBleHBGYWxsb2ZmKVxuICAgICAgICB0YXJnZXQuc2V0VGFyZ2V0QXRUaW1lKDAsIGF0LCBleHBGYWxsb2ZmKVxuICAgICAgfVxuXG4gICAgICB0aGlzLl92b2x0YWdlLnN0b3AoZW5kVGltZSlcbiAgICAgIHJldHVybiBlbmRUaW1lXG4gICAgfVxuICB9LFxuXG4gIG9uZW5kZWQ6IHtcbiAgICBnZXQ6IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gdGhpcy5fdm9sdGFnZS5vbmVuZGVkXG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgIHRoaXMuX3ZvbHRhZ2Uub25lbmRlZCA9IHZhbHVlXG4gICAgfVxuICB9XG5cbn1cblxudmFyIGZsYXQgPSBuZXcgRmxvYXQzMkFycmF5KFsxLDFdKVxuZnVuY3Rpb24gZ2V0Vm9sdGFnZShjb250ZXh0KXtcbiAgdmFyIHZvbHRhZ2UgPSBjb250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpXG4gIHZhciBidWZmZXIgPSBjb250ZXh0LmNyZWF0ZUJ1ZmZlcigxLCAyLCBjb250ZXh0LnNhbXBsZVJhdGUpXG4gIGJ1ZmZlci5nZXRDaGFubmVsRGF0YSgwKS5zZXQoZmxhdClcbiAgdm9sdGFnZS5idWZmZXIgPSBidWZmZXJcbiAgdm9sdGFnZS5sb29wID0gdHJ1ZVxuICByZXR1cm4gdm9sdGFnZVxufVxuXG5mdW5jdGlvbiBzY2FsZShub2RlKXtcbiAgdmFyIGdhaW4gPSBub2RlLmNvbnRleHQuY3JlYXRlR2FpbigpXG4gIG5vZGUuY29ubmVjdChnYWluKVxuICByZXR1cm4gZ2FpblxufVxuXG5mdW5jdGlvbiBnZXRUaW1lQ29uc3RhbnQodGltZSl7XG4gIHJldHVybiBNYXRoLmxvZyh0aW1lKzEpL01hdGgubG9nKDEwMClcbn1cblxuZnVuY3Rpb24gZ2V0VmFsdWUoc3RhcnQsIGVuZCwgZnJvbVRpbWUsIHRvVGltZSwgYXQpe1xuICB2YXIgZGlmZmVyZW5jZSA9IGVuZCAtIHN0YXJ0XG4gIHZhciB0aW1lID0gdG9UaW1lIC0gZnJvbVRpbWVcbiAgdmFyIHRydW5jYXRlVGltZSA9IGF0IC0gZnJvbVRpbWVcbiAgdmFyIHBoYXNlID0gdHJ1bmNhdGVUaW1lIC8gdGltZVxuICB2YXIgdmFsdWUgPSBzdGFydCArIHBoYXNlICogZGlmZmVyZW5jZVxuXG4gIGlmICh2YWx1ZSA8PSBzdGFydCkge1xuICAgICAgdmFsdWUgPSBzdGFydFxuICB9XG4gIGlmICh2YWx1ZSA+PSBlbmQpIHtcbiAgICAgIHZhbHVlID0gZW5kXG4gIH1cblxuICByZXR1cm4gdmFsdWVcbn1cbiJdfQ==
