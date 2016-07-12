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

$('#delay').on('input',function(){
    audio.setDelay($("#delay").val() / 1000)
})

$('#sustain').on('input',function(){
    audio.setSutain($("#sustain").val() / 100)
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
            audio.stopVoice(5);
            break
        case 75:
            audio.stopVoice(6);
            break
        case 76:
            audio.stopVoice(7);
            break
        case 59:
        case 186:
            audio.stopVoice(8);
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
    $('#voice-two-pitch').attr("value","495")
    $('#voice-three-pitch').attr("value","528")
    $('#voice-four-pitch').attr("value","594")
    $('#voice-five-pitch').attr("value","660")
    $('#voice-six-pitch').attr("value","742.5")
    $('#voice-seven-pitch').attr("value","792")
    $('#voice-eight-pitch').attr("value","880")
}

function initControls() {
    $('#gain').attr("value","5")
    $('#attack').attr("value","100")
    $('#release').attr("value","100")
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

// ---------- Controls --------------
function setMixGain(gain) {
    mixAmp.gain.value = gain
}

function setAttack(attack) {
    ampEnvAttack = attack
}

function setDelay(delay) {
    ampEnvDelay = delay
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
exports.setDelay = setDelay
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Vzci9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImpzL2FwcC5qcyIsImpzL2F1ZGlvLmpzIiwibm9kZV9tb2R1bGVzL2Fkc3IvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgYXVkaW8gPSByZXF1aXJlKCcuL2F1ZGlvLmpzJylcblxuJChkb2N1bWVudCkuZm91bmRhdGlvbigpXG5cbi8vIEdhaW4gaW5wdXQgZXZlbnQgY2hhbmdlcyBsZXZlbCBmcm9tIDAgdG8gMSBcbiQoJyNnYWluJykub24oJ2lucHV0JyxmdW5jdGlvbigpe1xuICAgIGF1ZGlvLnNldE1peEdhaW4oJChcIiNnYWluXCIpLnZhbCgpIC8gNTApXG59KVxuXG4kKCcjYXR0YWNrJykub24oJ2lucHV0JyxmdW5jdGlvbigpe1xuICAgIGF1ZGlvLnNldEF0dGFjaygkKFwiI2F0dGFja1wiKS52YWwoKSAvIDEwMDApXG59KVxuXG4kKCcjZGVsYXknKS5vbignaW5wdXQnLGZ1bmN0aW9uKCl7XG4gICAgYXVkaW8uc2V0RGVsYXkoJChcIiNkZWxheVwiKS52YWwoKSAvIDEwMDApXG59KVxuXG4kKCcjc3VzdGFpbicpLm9uKCdpbnB1dCcsZnVuY3Rpb24oKXtcbiAgICBhdWRpby5zZXRTdXRhaW4oJChcIiNzdXN0YWluXCIpLnZhbCgpIC8gMTAwKVxufSlcblxuJCgnI3JlbGVhc2UnKS5vbignaW5wdXQnLGZ1bmN0aW9uKCl7XG4gICAgYXVkaW8uc2V0UmVsZWFzZSgkKFwiI3JlbGVhc2VcIikudmFsKCkgLyAxMDAwKVxufSlcblxuXG4vLyAtLS0tLS0tLS0tIGtleXByZXNzIGV2ZW50cyAtLS0tLS0tLS0tLS1cbi8vIGtleWRvd24gc3RhcnRzIG5vdGVzLCBrZXl1cCBzdG9wcyBub3RlXG4vLyBoZWxkS2V5cyBrZWVwcyB0cmFjayBvZiB3aGljaCBrZXlzIGFyZSBjdXJyZW50bHkgaGVsZFxuLy8ga2V5Y29kZXM6IGEgPSA2NiwgcyA9IDgzLCBkID0gNjgsIGYgPSA3MCxcbi8vICAgICAgICAgICBqID0gNzQsIGsgPSA3NSwgbCA9IDc2LCBcbi8vICAgICAgICAgICA7ID0gNTkgKGZpcmVmb3gpIGFuZCAxODYgKGNocm9tZSlcblxudmFyIGhlbGRLZXlzID0gW11cblxuJChkb2N1bWVudCkua2V5ZG93bihmdW5jdGlvbihlKSB7XG4gICAgLy8gY2hlY2sgaWYga2V5IGlzIGN1cnJlbnRseSBwcmVzc2VkXG4gICAgaWYgKGhlbGRLZXlzW2Uud2hpY2hdKSB7XG4gICAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHN3aXRjaCAoZS53aGljaCkge1xuICAgICAgICBjYXNlIDY1OlxuICAgICAgICAgICAgdmFyIGZyZXEgPSAkKCcjdm9pY2Utb25lLXBpdGNoJykudmFsKClcbiAgICAgICAgICAgIGF1ZGlvLnN0YXJ0Vm9pY2UoMSxmcmVxKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA4MzpcbiAgICAgICAgICAgIHZhciBmcmVxID0gJCgnI3ZvaWNlLXR3by1waXRjaCcpLnZhbCgpXG4gICAgICAgICAgICBhdWRpby5zdGFydFZvaWNlKDIsZnJlcSlcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgNjg6XG4gICAgICAgICAgICB2YXIgZnJlcSA9ICQoJyN2b2ljZS10aHJlZS1waXRjaCcpLnZhbCgpXG4gICAgICAgICAgICBhdWRpby5zdGFydFZvaWNlKDMsZnJlcSlcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgNzA6XG4gICAgICAgICAgICB2YXIgZnJlcSA9ICQoJyN2b2ljZS1mb3VyLXBpdGNoJykudmFsKClcbiAgICAgICAgICAgIGF1ZGlvLnN0YXJ0Vm9pY2UoNCxmcmVxKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA3NDpcbiAgICAgICAgICAgIHZhciBmcmVxID0gJCgnI3ZvaWNlLWZpdmUtcGl0Y2gnKS52YWwoKVxuICAgICAgICAgICAgYXVkaW8uc3RhcnRWb2ljZSg1LGZyZXEpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDc1OlxuICAgICAgICAgICAgdmFyIGZyZXEgPSAkKCcjdm9pY2Utc2l4LXBpdGNoJykudmFsKClcbiAgICAgICAgICAgIGF1ZGlvLnN0YXJ0Vm9pY2UoNixmcmVxKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA3NjpcbiAgICAgICAgICAgIHZhciBmcmVxID0gJCgnI3ZvaWNlLXNldmVuLXBpdGNoJykudmFsKClcbiAgICAgICAgICAgIGF1ZGlvLnN0YXJ0Vm9pY2UoNyxmcmVxKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA1OTpcbiAgICAgICAgY2FzZSAxODY6XG4gICAgICAgICAgICB2YXIgZnJlcSA9ICQoJyN2b2ljZS1laWdodC1waXRjaCcpLnZhbCgpXG4gICAgICAgICAgICBhdWRpby5zdGFydFZvaWNlKDgsZnJlcSlcbiAgICAgICAgICAgIGJyZWFrXG4gICAgfVxuICAgIGhlbGRLZXlzW2Uud2hpY2hdID0gdHJ1ZVxufSk7XG5cbiQoZG9jdW1lbnQpLmtleXVwKGZ1bmN0aW9uKGUpIHtcbiAgICBzd2l0Y2ggKGUud2hpY2gpIHtcbiAgICAgICAgY2FzZSA2NTpcbiAgICAgICAgICAgIGF1ZGlvLnN0b3BWb2ljZSgxKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA4MzpcbiAgICAgICAgICAgIGF1ZGlvLnN0b3BWb2ljZSgyKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA2ODpcbiAgICAgICAgICAgIGF1ZGlvLnN0b3BWb2ljZSgzKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA3MDpcbiAgICAgICAgICAgIGF1ZGlvLnN0b3BWb2ljZSg0KVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA3NDpcbiAgICAgICAgICAgIGF1ZGlvLnN0b3BWb2ljZSg1KTtcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgNzU6XG4gICAgICAgICAgICBhdWRpby5zdG9wVm9pY2UoNik7XG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDc2OlxuICAgICAgICAgICAgYXVkaW8uc3RvcFZvaWNlKDcpO1xuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA1OTpcbiAgICAgICAgY2FzZSAxODY6XG4gICAgICAgICAgICBhdWRpby5zdG9wVm9pY2UoOCk7XG4gICAgICAgICAgICBicmVha1xuICAgIH1cbiAgICBoZWxkS2V5c1tlLndoaWNoXSA9IGZhbHNlXG59KTtcblxuXG4vLyAtLS0tLS0tLS0tIGNsaWNrIGV2ZW50cyAtLS0tLS0tLS0tLS1cbi8vIG5vdGUgc3RhcnRzIG9uIG1vdXNlZG93biwgdGhlbiBob2xkcyB0aWwgbW91c2V1cFxuJCgnLmtleScpLm1vdXNlZG93bihmdW5jdGlvbigpIHtcbiAgICBzd2l0Y2godGhpcy5pZCkge1xuICAgICAgICBjYXNlIFwidm9pY2Utb25lXCI6XG4gICAgICAgICAgICB2YXIgZnJlcSA9ICQoJyN2b2ljZS1vbmUtcGl0Y2gnKS52YWwoKVxuICAgICAgICAgICAgYXVkaW8uc3RhcnRWb2ljZSgxLGZyZXEpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIFwidm9pY2UtdHdvXCI6XG4gICAgICAgICAgICB2YXIgZnJlcSA9ICQoJyN2b2ljZS10d28tcGl0Y2gnKS52YWwoKVxuICAgICAgICAgICAgYXVkaW8uc3RhcnRWb2ljZSgyLGZyZXEpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIFwidm9pY2UtdGhyZWVcIjpcbiAgICAgICAgICAgIHZhciBmcmVxID0gJCgnI3ZvaWNlLXRocmVlLXBpdGNoJykudmFsKClcbiAgICAgICAgICAgIGF1ZGlvLnN0YXJ0Vm9pY2UoMyxmcmVxKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSBcInZvaWNlLWZvdXJcIjpcbiAgICAgICAgICAgIHZhciBmcmVxID0gJCgnI3ZvaWNlLWZvdXItcGl0Y2gnKS52YWwoKVxuICAgICAgICAgICAgYXVkaW8uc3RhcnRWb2ljZSg0LGZyZXEpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIFwidm9pY2UtZml2ZVwiOlxuICAgICAgICAgICAgdmFyIGZyZXEgPSAkKCcjdm9pY2UtZml2ZS1waXRjaCcpLnZhbCgpXG4gICAgICAgICAgICBhdWRpby5zdGFydFZvaWNlKDUsZnJlcSlcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgXCJ2b2ljZS1zaXhcIjpcbiAgICAgICAgICAgIHZhciBmcmVxID0gJCgnI3ZvaWNlLXNpeC1waXRjaCcpLnZhbCgpXG4gICAgICAgICAgICBhdWRpby5zdGFydFZvaWNlKDYsZnJlcSlcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgXCJ2b2ljZS1zZXZlblwiOlxuICAgICAgICAgICAgdmFyIGZyZXEgPSAkKCcjdm9pY2Utc2V2ZW4tcGl0Y2gnKS52YWwoKVxuICAgICAgICAgICAgYXVkaW8uc3RhcnRWb2ljZSg3LGZyZXEpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIFwidm9pY2UtZWlnaHRcIjpcbiAgICAgICAgICAgIHZhciBmcmVxID0gJCgnI3ZvaWNlLWVpZ2h0LXBpdGNoJykudmFsKClcbiAgICAgICAgICAgIGF1ZGlvLnN0YXJ0Vm9pY2UoOCxmcmVxKVxuICAgICAgICAgICAgYnJlYWtcbiAgICB9XG59KVxuXG4kKCcua2V5JykubW91c2V1cChmdW5jdGlvbigpIHtcbiAgICBzd2l0Y2godGhpcy5pZCkge1xuICAgICAgICBjYXNlIFwidm9pY2Utb25lXCI6XG4gICAgICAgICAgICBhdWRpby5zdG9wVm9pY2UoMSlcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgXCJ2b2ljZS10d29cIjpcbiAgICAgICAgICAgIGF1ZGlvLnN0b3BWb2ljZSgyKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSBcInZvaWNlLXRocmVlXCI6XG4gICAgICAgICAgICBhdWRpby5zdG9wVm9pY2UoMylcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgXCJ2b2ljZS1mb3VyXCI6XG4gICAgICAgICAgICBhdWRpby5zdG9wVm9pY2UoNClcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgXCJ2b2ljZS1maXZlXCI6XG4gICAgICAgICAgICBhdWRpby5zdG9wVm9pY2UoNSlcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgXCJ2b2ljZS1zaXhcIjpcbiAgICAgICAgICAgIGF1ZGlvLnN0b3BWb2ljZSg2KVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSBcInZvaWNlLXNldmVuXCI6XG4gICAgICAgICAgICBhdWRpby5zdG9wVm9pY2UoNylcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgXCJ2b2ljZS1laWdodFwiOlxuICAgICAgICAgICAgYXVkaW8uc3RvcFZvaWNlKDgpXG4gICAgICAgICAgICBicmVha1xuICAgIH1cbn0pXG5cblxuLy8gLS0tLS0tLS0tLSB1dGlsaXRpZXMgLS0tLS0tLS0tLS0tXG4vLyBibHVyIGV2ZW50IHRoYXQgZmlyZXMgb24gYW55IGlucHV0OnRleHQgZW50ZXJcbiQoXCIjYnRuSGlkZGVuXCIpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICQoXCJpbnB1dDp0ZXh0XCIpLmJsdXIoKVxufSlcbiIsInZhciBBRFNSID0gcmVxdWlyZSgnYWRzcicpXG5cbmNvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KClcblxuLy8gZGVjbGFyZSBnbG9iYWxzXG52YXIgdm9pY2VzID0gW10sXG4gICAgbWl4QW1wID0gY29udGV4dC5jcmVhdGVHYWluKCksXG4gICAgYW1wRW52QXR0YWNrID0gMC4xLFxuICAgIGFtcEVudkRlbGF5ID0gMC4wLFxuICAgIGFtcEVudlN1c3RhaW4gPSAxLjAsXG4gICAgYW1wRW52UmVsZWFzZSA9IDAuMVxuXG4vLyAtLS0tLS0tLS0tIGluaXQgaW5zdHJ1bWVudCAtLS0tLS0tLS0tLS0tLS0tXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICBpbml0VHVuaW5nKClcbiAgICBpbml0Q29udHJvbHMoKVxufSlcblxuZnVuY3Rpb24gaW5pdFR1bmluZygpIHtcbiAgICAkKCcjdm9pY2Utb25lLXBpdGNoJykuYXR0cihcInZhbHVlXCIsXCI0NDBcIilcbiAgICAkKCcjdm9pY2UtdHdvLXBpdGNoJykuYXR0cihcInZhbHVlXCIsXCI0OTVcIilcbiAgICAkKCcjdm9pY2UtdGhyZWUtcGl0Y2gnKS5hdHRyKFwidmFsdWVcIixcIjUyOFwiKVxuICAgICQoJyN2b2ljZS1mb3VyLXBpdGNoJykuYXR0cihcInZhbHVlXCIsXCI1OTRcIilcbiAgICAkKCcjdm9pY2UtZml2ZS1waXRjaCcpLmF0dHIoXCJ2YWx1ZVwiLFwiNjYwXCIpXG4gICAgJCgnI3ZvaWNlLXNpeC1waXRjaCcpLmF0dHIoXCJ2YWx1ZVwiLFwiNzQyLjVcIilcbiAgICAkKCcjdm9pY2Utc2V2ZW4tcGl0Y2gnKS5hdHRyKFwidmFsdWVcIixcIjc5MlwiKVxuICAgICQoJyN2b2ljZS1laWdodC1waXRjaCcpLmF0dHIoXCJ2YWx1ZVwiLFwiODgwXCIpXG59XG5cbmZ1bmN0aW9uIGluaXRDb250cm9scygpIHtcbiAgICAkKCcjZ2FpbicpLmF0dHIoXCJ2YWx1ZVwiLFwiNVwiKVxuICAgICQoJyNhdHRhY2snKS5hdHRyKFwidmFsdWVcIixcIjEwMFwiKVxuICAgICQoJyNyZWxlYXNlJykuYXR0cihcInZhbHVlXCIsXCIxMDBcIilcbiAgICBtaXhBbXAuZ2Fpbi52YWx1ZSA9IDAuMVxufVxuXG5cbi8vIC0tLS0tLS0tLS0gc3RhcnQgYW5kIHN0b3Agdm9pY2VzLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBzdGFydFZvaWNlKG4sZnJlcSkge1xuICAgIC8vIGNoZWNrIGZvciByZXRyaWdnZXJcbiAgICBpZiAodm9pY2VzW25dKSB7XG4gICAgICAgIHZvaWNlc1tuXS5vc2Muc3RvcCgpXG4gICAgfVxuXG4gICAgLy8gaW5zdGFudGlhdGUgYW5kIHN0YXJ0IHZvaWNlIFxuICAgIHZvaWNlc1tuXSA9IG5ldyBWb2ljZShtaXhBbXApXG4gICAgdm9pY2VzW25dLnBsYXkoZnJlcSlcbn1cblxuZnVuY3Rpb24gc3RvcFZvaWNlKG4pIHtcbiAgICB2b2ljZXNbbl0uc3RvcCgpXG59XG5cblxuLy8gLS0tLS0tLS0tLSBWb2ljZSBjbGFzcyAtLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBWb2ljZShtaXhBbXApIHtcbiAgICB0aGlzLm9zYyA9IGNvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpXG4gICAgdGhpcy5vc2NBbXAgPSBjb250ZXh0LmNyZWF0ZUdhaW4oKVxuICAgIHRoaXMuYW1wRW52ID0gQURTUihjb250ZXh0KVxuXG4gICAgdGhpcy5wbGF5ID0gZnVuY3Rpb24oZnJlcXVlbmN5KSB7XG4gICAgICAgIHRoaXMub3NjLnR5cGUgPSAndHJpYW5nbGUnXG4gICAgICAgIHRoaXMub3NjLmZyZXF1ZW5jeS52YWx1ZSA9IGZyZXF1ZW5jeVxuICAgICAgICBjb25zb2xlLmxvZyhmcmVxdWVuY3kpXG5cbiAgICAgICAgdGhpcy5vc2NBbXAuZ2FpbiA9IDBcblxuICAgICAgICB0aGlzLmFtcEVudi5hdHRhY2sgPSBhbXBFbnZBdHRhY2tcbiAgICAgICAgdGhpcy5hbXBFbnYuZGVsYXkgPSBhbXBFbnZEZWxheVxuICAgICAgICB0aGlzLmFtcEVudi5zdXN0YWluID0gYW1wRW52U3VzdGFpblxuICAgICAgICB0aGlzLmFtcEVudi5yZWxlYXNlID0gYW1wRW52UmVsZWFzZVxuICAgICAgICB0aGlzLmFtcEVudi5lbmRWYWx1ZSA9IDAuMFxuICAgIFxuICAgICAgICAvLyByb3V0aW5nXG4gICAgICAgIHRoaXMub3NjLmNvbm5lY3QodGhpcy5vc2NBbXApXG4gICAgICAgIHRoaXMub3NjQW1wLmNvbm5lY3QobWl4QW1wKVxuICAgICAgICB0aGlzLmFtcEVudi5jb25uZWN0KHRoaXMub3NjQW1wLmdhaW4pXG4gICAgICAgIG1peEFtcC5jb25uZWN0KGNvbnRleHQuZGVzdGluYXRpb24pXG5cbiAgICAgICAgdGhpcy5hbXBFbnYuc3RhcnQoY29udGV4dC5jdXJyZW50VGltZSlcbiAgICAgICAgdGhpcy5vc2Muc3RhcnQoY29udGV4dC5DdXJyZW50VGltZSkgICAgICAgICAgXG4gICAgfVxuXG4gICAgdGhpcy5zdG9wID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzdG9wQXQgPSB0aGlzLmFtcEVudi5zdG9wKGNvbnRleHQuY3VycmVudFRpbWUgKyBhbXBFbnZSZWxlYXNlKVxuICAgICAgICAvLyB0aGlzLm9zYy5zdG9wKHN0b3BBdClcbiAgICAgICAgdGhpcy5vc2NBbXAuZ2Fpbi5zZXRUYXJnZXRBdFRpbWUoMC4wLCBjb250ZXh0LmN1cnJlbnRUaW1lICsgYW1wRW52UmVsZWFzZSwgYW1wRW52UmVsZWFzZSowLjUpXG4gICAgfVxufVxuXG4vLyAtLS0tLS0tLS0tIENvbnRyb2xzIC0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBzZXRNaXhHYWluKGdhaW4pIHtcbiAgICBtaXhBbXAuZ2Fpbi52YWx1ZSA9IGdhaW5cbn1cblxuZnVuY3Rpb24gc2V0QXR0YWNrKGF0dGFjaykge1xuICAgIGFtcEVudkF0dGFjayA9IGF0dGFja1xufVxuXG5mdW5jdGlvbiBzZXREZWxheShkZWxheSkge1xuICAgIGFtcEVudkRlbGF5ID0gZGVsYXlcbn1cblxuZnVuY3Rpb24gc2V0U3VzdGFpbihzdXN0YWluKSB7XG4gICAgYW1wRW52U3VzdGFpbiA9IHN1c3RhaW5cbn1cblxuZnVuY3Rpb24gc2V0UmVsZWFzZShyZWxlYXNlKSB7XG4gICAgYW1wRW52UmVsZWFzZSA9IHJlbGVhc2Vcbn1cblxuLy8gLS0tLS0tLS0tLSBFeHBvcnRzIC0tLS0tLS0tLS0tLS0tXG5leHBvcnRzLnN0YXJ0Vm9pY2UgPSBzdGFydFZvaWNlXG5leHBvcnRzLnN0b3BWb2ljZSA9IHN0b3BWb2ljZVxuZXhwb3J0cy5zZXRNaXhHYWluID0gc2V0TWl4R2FpblxuZXhwb3J0cy5zZXRBdHRhY2sgPSBzZXRBdHRhY2tcbmV4cG9ydHMuc2V0RGVsYXkgPSBzZXREZWxheVxuZXhwb3J0cy5zZXRTdXN0YWluID0gc2V0U3VzdGFpblxuZXhwb3J0cy5zZXRSZWxlYXNlID0gc2V0UmVsZWFzZVxuIiwibW9kdWxlLmV4cG9ydHMgPSBBRFNSXG5cbmZ1bmN0aW9uIEFEU1IoYXVkaW9Db250ZXh0KXtcbiAgdmFyIG5vZGUgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpXG5cbiAgdmFyIHZvbHRhZ2UgPSBub2RlLl92b2x0YWdlID0gZ2V0Vm9sdGFnZShhdWRpb0NvbnRleHQpXG4gIHZhciB2YWx1ZSA9IHNjYWxlKHZvbHRhZ2UpXG4gIHZhciBzdGFydFZhbHVlID0gc2NhbGUodm9sdGFnZSlcbiAgdmFyIGVuZFZhbHVlID0gc2NhbGUodm9sdGFnZSlcblxuICBub2RlLl9zdGFydEFtb3VudCA9IHNjYWxlKHN0YXJ0VmFsdWUpXG4gIG5vZGUuX2VuZEFtb3VudCA9IHNjYWxlKGVuZFZhbHVlKVxuXG4gIG5vZGUuX211bHRpcGxpZXIgPSBzY2FsZSh2YWx1ZSlcbiAgbm9kZS5fbXVsdGlwbGllci5jb25uZWN0KG5vZGUpXG4gIG5vZGUuX3N0YXJ0QW1vdW50LmNvbm5lY3Qobm9kZSlcbiAgbm9kZS5fZW5kQW1vdW50LmNvbm5lY3Qobm9kZSlcblxuICBub2RlLnZhbHVlID0gdmFsdWUuZ2FpblxuICBub2RlLnN0YXJ0VmFsdWUgPSBzdGFydFZhbHVlLmdhaW5cbiAgbm9kZS5lbmRWYWx1ZSA9IGVuZFZhbHVlLmdhaW5cblxuICBub2RlLnN0YXJ0VmFsdWUudmFsdWUgPSAwXG4gIG5vZGUuZW5kVmFsdWUudmFsdWUgPSAwXG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMobm9kZSwgcHJvcHMpXG4gIHJldHVybiBub2RlXG59XG5cbnZhciBwcm9wcyA9IHtcblxuICBhdHRhY2s6IHsgdmFsdWU6IDAsIHdyaXRhYmxlOiB0cnVlIH0sXG4gIGRlY2F5OiB7IHZhbHVlOiAwLCB3cml0YWJsZTogdHJ1ZSB9LFxuICBzdXN0YWluOiB7IHZhbHVlOiAxLCB3cml0YWJsZTogdHJ1ZSB9LFxuICByZWxlYXNlOiB7dmFsdWU6IDAsIHdyaXRhYmxlOiB0cnVlIH0sXG5cbiAgZ2V0UmVsZWFzZUR1cmF0aW9uOiB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gdGhpcy5yZWxlYXNlXG4gICAgfVxuICB9LFxuXG4gIHN0YXJ0OiB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uKGF0KXtcbiAgICAgIHZhciB0YXJnZXQgPSB0aGlzLl9tdWx0aXBsaWVyLmdhaW5cbiAgICAgIHZhciBzdGFydEFtb3VudCA9IHRoaXMuX3N0YXJ0QW1vdW50LmdhaW5cbiAgICAgIHZhciBlbmRBbW91bnQgPSB0aGlzLl9lbmRBbW91bnQuZ2FpblxuXG4gICAgICB0aGlzLl92b2x0YWdlLnN0YXJ0KGF0KVxuICAgICAgdGhpcy5fZGVjYXlGcm9tID0gdGhpcy5fZGVjYXlGcm9tID0gYXQrdGhpcy5hdHRhY2tcbiAgICAgIHRoaXMuX3N0YXJ0ZWRBdCA9IGF0XG5cbiAgICAgIHZhciBzdXN0YWluID0gdGhpcy5zdXN0YWluXG5cbiAgICAgIHRhcmdldC5jYW5jZWxTY2hlZHVsZWRWYWx1ZXMoYXQpXG4gICAgICBzdGFydEFtb3VudC5jYW5jZWxTY2hlZHVsZWRWYWx1ZXMoYXQpXG4gICAgICBlbmRBbW91bnQuY2FuY2VsU2NoZWR1bGVkVmFsdWVzKGF0KVxuXG4gICAgICBlbmRBbW91bnQuc2V0VmFsdWVBdFRpbWUoMCwgYXQpXG5cbiAgICAgIGlmICh0aGlzLmF0dGFjayl7XG4gICAgICAgIHRhcmdldC5zZXRWYWx1ZUF0VGltZSgwLCBhdClcbiAgICAgICAgdGFyZ2V0LmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKDEsIGF0ICsgdGhpcy5hdHRhY2spXG5cbiAgICAgICAgc3RhcnRBbW91bnQuc2V0VmFsdWVBdFRpbWUoMSwgYXQpXG4gICAgICAgIHN0YXJ0QW1vdW50LmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKDAsIGF0ICsgdGhpcy5hdHRhY2spXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YXJnZXQuc2V0VmFsdWVBdFRpbWUoMSwgYXQpXG4gICAgICAgIHN0YXJ0QW1vdW50LnNldFZhbHVlQXRUaW1lKDAsIGF0KVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5kZWNheSl7XG4gICAgICAgIHRhcmdldC5zZXRUYXJnZXRBdFRpbWUoc3VzdGFpbiwgdGhpcy5fZGVjYXlGcm9tLCBnZXRUaW1lQ29uc3RhbnQodGhpcy5kZWNheSkpXG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIHN0b3A6IHtcbiAgICB2YWx1ZTogZnVuY3Rpb24oYXQsIGlzVGFyZ2V0KXtcbiAgICAgIGlmIChpc1RhcmdldCl7XG4gICAgICAgIGF0ID0gYXQgLSB0aGlzLnJlbGVhc2VcbiAgICAgIH1cblxuICAgICAgdmFyIGVuZFRpbWUgPSBhdCArIHRoaXMucmVsZWFzZVxuICAgICAgaWYgKHRoaXMucmVsZWFzZSl7XG5cbiAgICAgICAgdmFyIHRhcmdldCA9IHRoaXMuX211bHRpcGxpZXIuZ2FpblxuICAgICAgICB2YXIgc3RhcnRBbW91bnQgPSB0aGlzLl9zdGFydEFtb3VudC5nYWluXG4gICAgICAgIHZhciBlbmRBbW91bnQgPSB0aGlzLl9lbmRBbW91bnQuZ2FpblxuXG4gICAgICAgIHRhcmdldC5jYW5jZWxTY2hlZHVsZWRWYWx1ZXMoYXQpXG4gICAgICAgIHN0YXJ0QW1vdW50LmNhbmNlbFNjaGVkdWxlZFZhbHVlcyhhdClcbiAgICAgICAgZW5kQW1vdW50LmNhbmNlbFNjaGVkdWxlZFZhbHVlcyhhdClcblxuICAgICAgICB2YXIgZXhwRmFsbG9mZiA9IGdldFRpbWVDb25zdGFudCh0aGlzLnJlbGVhc2UpXG5cbiAgICAgICAgLy8gdHJ1bmNhdGUgYXR0YWNrIChyZXF1aXJlZCBhcyBsaW5lYXJSYW1wIGlzIHJlbW92ZWQgYnkgY2FuY2VsU2NoZWR1bGVkVmFsdWVzKVxuICAgICAgICBpZiAodGhpcy5hdHRhY2sgJiYgYXQgPCB0aGlzLl9kZWNheUZyb20pe1xuICAgICAgICAgIHZhciB2YWx1ZUF0VGltZSA9IGdldFZhbHVlKDAsIDEsIHRoaXMuX3N0YXJ0ZWRBdCwgdGhpcy5fZGVjYXlGcm9tLCBhdClcbiAgICAgICAgICB0YXJnZXQubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUodmFsdWVBdFRpbWUsIGF0KVxuICAgICAgICAgIHN0YXJ0QW1vdW50LmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKDEtdmFsdWVBdFRpbWUsIGF0KVxuICAgICAgICAgIHN0YXJ0QW1vdW50LnNldFRhcmdldEF0VGltZSgwLCBhdCwgZXhwRmFsbG9mZilcbiAgICAgICAgfVxuXG4gICAgICAgIGVuZEFtb3VudC5zZXRUYXJnZXRBdFRpbWUoMSwgYXQsIGV4cEZhbGxvZmYpXG4gICAgICAgIHRhcmdldC5zZXRUYXJnZXRBdFRpbWUoMCwgYXQsIGV4cEZhbGxvZmYpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3ZvbHRhZ2Uuc3RvcChlbmRUaW1lKVxuICAgICAgcmV0dXJuIGVuZFRpbWVcbiAgICB9XG4gIH0sXG5cbiAgb25lbmRlZDoge1xuICAgIGdldDogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiB0aGlzLl92b2x0YWdlLm9uZW5kZWRcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24odmFsdWUpe1xuICAgICAgdGhpcy5fdm9sdGFnZS5vbmVuZGVkID0gdmFsdWVcbiAgICB9XG4gIH1cblxufVxuXG52YXIgZmxhdCA9IG5ldyBGbG9hdDMyQXJyYXkoWzEsMV0pXG5mdW5jdGlvbiBnZXRWb2x0YWdlKGNvbnRleHQpe1xuICB2YXIgdm9sdGFnZSA9IGNvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKClcbiAgdmFyIGJ1ZmZlciA9IGNvbnRleHQuY3JlYXRlQnVmZmVyKDEsIDIsIGNvbnRleHQuc2FtcGxlUmF0ZSlcbiAgYnVmZmVyLmdldENoYW5uZWxEYXRhKDApLnNldChmbGF0KVxuICB2b2x0YWdlLmJ1ZmZlciA9IGJ1ZmZlclxuICB2b2x0YWdlLmxvb3AgPSB0cnVlXG4gIHJldHVybiB2b2x0YWdlXG59XG5cbmZ1bmN0aW9uIHNjYWxlKG5vZGUpe1xuICB2YXIgZ2FpbiA9IG5vZGUuY29udGV4dC5jcmVhdGVHYWluKClcbiAgbm9kZS5jb25uZWN0KGdhaW4pXG4gIHJldHVybiBnYWluXG59XG5cbmZ1bmN0aW9uIGdldFRpbWVDb25zdGFudCh0aW1lKXtcbiAgcmV0dXJuIE1hdGgubG9nKHRpbWUrMSkvTWF0aC5sb2coMTAwKVxufVxuXG5mdW5jdGlvbiBnZXRWYWx1ZShzdGFydCwgZW5kLCBmcm9tVGltZSwgdG9UaW1lLCBhdCl7XG4gIHZhciBkaWZmZXJlbmNlID0gZW5kIC0gc3RhcnRcbiAgdmFyIHRpbWUgPSB0b1RpbWUgLSBmcm9tVGltZVxuICB2YXIgdHJ1bmNhdGVUaW1lID0gYXQgLSBmcm9tVGltZVxuICB2YXIgcGhhc2UgPSB0cnVuY2F0ZVRpbWUgLyB0aW1lXG4gIHZhciB2YWx1ZSA9IHN0YXJ0ICsgcGhhc2UgKiBkaWZmZXJlbmNlXG5cbiAgaWYgKHZhbHVlIDw9IHN0YXJ0KSB7XG4gICAgICB2YWx1ZSA9IHN0YXJ0XG4gIH1cbiAgaWYgKHZhbHVlID49IGVuZCkge1xuICAgICAgdmFsdWUgPSBlbmRcbiAgfVxuXG4gIHJldHVybiB2YWx1ZVxufVxuIl19
