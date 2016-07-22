var audio = require('./audio.js')

$(document).foundation()


// ---------- init instrument ----------------
var notes,
    heldKeys = [],
    keymode = 0,
    gain = 5,
    timeout = false

$(document).ready(function() {
    notes = [0,203.91,386.31,590.22,701.96,905.87,1088.27,1200]
    $('#base-freq-input').attr('value',261.6255)
    $('#keyboard-mode-button').css('background-color','#026d63')
})


// ---------- keypress events ------------
// keydown starts a note, keyup stops a note
// heldKeys keeps track of which keys are currently held
// keycodes: a = 66, s = 83, d = 68, f = 70,
//           g = 71, h = 72,
//           j = 74, k = 75, l = 76, 
//           ; = 59 (firefox) and 186 (chrome)
$(document).keydown(function(e) {
    // check if note is currently held
    // allow gain switch events through
    if (heldKeys[e.which] && e.which != 71 && e.which != 72) {
        return
    }
    
    switch (e.which) {
        case 65:
            $('#voice-zero-button').css('background-color','#059a91')
            var cents = notes[0]
            audio.startVoice(0,cents)
            break
        case 83:
            $('#voice-one-button').css('background-color','#059a91')
            var cents = notes[1]
            audio.startVoice(1,cents)
            break
        case 68:
            $('#voice-two-button').css('background-color','#059a91')
            var cents = notes[2]
            audio.startVoice(2,cents)
            break
        case 70:
            $('#voice-three-button').css('background-color','#059a91')
            var cents = notes[3]
            audio.startVoice(3,cents)
            break
        case 71:
            if (gain > 0 && !timeout) {
                timeout = setInterval(function() {
                    gain -= 1
                    audio.setMixGain(gain / 500)
                    $('#gain').val(gain).change()
                    $('#dec-gain-switch').css('background-color','#5a5f61')
                }, 25)
            }
            break
        case 72:
            if (gain < 100 && !timeout) {
                timeout = setInterval(function() {
                    gain += 1
                    audio.setMixGain(gain / 500)
                    $('#gain').val(gain).change()
                    $('#inc-gain-switch').css('background-color','#5a5f61')
                }, 25)
            }
            break
        case 74:
            $('#voice-four-button').css('background-color','#059a91')
            var cents = notes[4]
            audio.startVoice(4,cents)
            break
        case 75:
            $('#voice-five-button').css('background-color','#059a91')
            var cents = notes[5]
            audio.startVoice(5,cents)
            break
        case 76:
            $('#voice-six-button').css('background-color','#059a91')
            var cents = notes[6]
            audio.startVoice(6,cents)
            break
        case 59:
        case 186:
            $('#voice-seven-button').css('background-color','#059a91')
            var cents = notes[7]
            audio.startVoice(7,cents)
            break
    }
    heldKeys[e.which] = true
});

$(document).keyup(function(e) {
    switch (e.which) {
        case 65:
            $('#voice-zero-button').css('background-color','#243640')
            audio.stopVoice(0)
            break
        case 83:
            $('#voice-one-button').css('background-color','#243640')
            audio.stopVoice(1)
            break
        case 68:
            $('#voice-two-button').css('background-color','#243640')
            audio.stopVoice(2)
            break
        case 70:
            $('#voice-three-button').css('background-color','#243640')
            audio.stopVoice(3)
            break
        case 71:
            $('#dec-gain-switch').css('background-color','#2c353a')
            clearInterval(timeout)
            timeout = false
            break
        case 72:
            $('#inc-gain-switch').css('background-color','#2c353a')
            clearInterval(timeout)
            timeout = false
            break
        case 74:
            $('#voice-four-button').css('background-color','#243640')
            audio.stopVoice(4)
            break
        case 75:
            $('#voice-five-button').css('background-color','#243640')
            audio.stopVoice(5)
            break
        case 76:
            $('#voice-six-button').css('background-color','#243640')
            audio.stopVoice(6)
            break
        case 59:
        case 186:
            $('#voice-seven-button').css('background-color','#243640')
            audio.stopVoice(7)
            break
    }
    heldKeys[e.which] = false
});


// ---------- click events ------------
// note starts on mousedown, then holds til mouseup
$('.key').mousedown(function() {
    $(this).css('background-color','#059a91')
    switch(this.id) {
        case "voice-zero-button":
            var cents = notes[0]
            audio.startVoice(0,cents)
            break
        case "voice-one-button":
            var cents = notes[1]
            audio.startVoice(1,cents)
            break
        case "voice-two-button":
            var cents = notes[2]
            audio.startVoice(2,cents)
            break
        case "voice-three-button":
            var cents = notes[3]
            audio.startVoice(3,cents)
            break
        case "voice-four-button":
            var cents = notes[4]
            audio.startVoice(4,cents)
            break
        case "voice-five-button":
            var cents = notes[5]
            audio.startVoice(5,cents)
            break
        case "voice-six-button":
            var cents = notes[6]
            audio.startVoice(6,cents)
            break
        case "voice-seven-button":
            var cents = notes[7]
            audio.startVoice(7,cents)
            break
    }
})

$('.key').mouseup(function() {
    $(this).css('background-color','#243640')
    switch(this.id) {
        case "voice-zero-button":
            audio.stopVoice(0)
            break
        case "voice-one-button":
            audio.stopVoice(1)
            break
        case "voice-two-button":
            audio.stopVoice(2)
            break
        case "voice-three-button":
            audio.stopVoice(3)
            break
        case "voice-four-button":
            audio.stopVoice(4)
            break
        case "voice-five-button":
            audio.stopVoice(5)
            break
        case "voice-six-button":
            audio.stopVoice(6)
            break
        case "voice-seven-button":
            audio.stopVoice(7)
            break
    }
})



// ---------- controls panel events ----------------
$('#controls').on('input moved.zf.slider', function() {
    gain = parseInt($('#gain').val())
    audio.setMixGain(gain / 500)
    audio.setAttack($("#attack").val() / 1000)
    audio.setDecay($("#decay").val() / 1000)
    audio.setSustain($("#sustain").val() / 100)
    audio.setRelease($("#release").val() / 1000)
})

$('#sine').on('click', function() {
    audio.setWaveform(this.id)
})

$('#triangle').on('click', function() {
    audio.setWaveform(this.id)
})

$('#square').on('click', function() {
    audio.setWaveform(this.id)
})

$('#sawtooth').on('click', function() {
    audio.setWaveform(this.id)
})

$('.keymode-button').on('click', function() {
    switch(this.id) {
        case 'keyboard-mode-button':
            keymode = 0
            setKeyboard(keymode); 
            $(this).css('background-color','#026d63')
            $('#degree-mode-button').css('background-color','#243640')
            $('#cents-mode-button').css('background-color','#243640')
            break;
        case 'degree-mode-button':
            keymode = 1
            setKeyboard(keymode); 
            $(this).css('background-color','#026d63')
            $('#keyboard-mode-button').css('background-color','#243640')
            $('#cents-mode-button').css('background-color','#243640')
            break;
        case 'cents-mode-button':
            keymode = 2
            setKeyboard(keymode); 
            $(this).css('background-color','#026d63')
            $('#degree-mode-button').css('background-color','#243640')
            $('#keyboard-mode-button').css('background-color','#243640')
            break;
        }
})

function setKeyboard(keymode) {
    switch(keymode) {
        case 0:
            $('#voice-zero-button').text('a')     
            $('#voice-one-button').text('s')     
            $('#voice-two-button').text('d')     
            $('#voice-three-button').text('f')     
            $('#voice-four-button').text('j')     
            $('#voice-five-button').text('k')     
            $('#voice-six-button').text('l')     
            $('#voice-seven-button').text(';')     
            break;
        case 1:
            $('#voice-zero-button').text('0')     
            $('#voice-one-button').text('1')     
            $('#voice-two-button').text('2')     
            $('#voice-three-button').text('3')     
            $('#voice-four-button').text('4')     
            $('#voice-five-button').text('5')     
            $('#voice-six-button').text('6')     
            $('#voice-seven-button').text('7')     
            break;
        case 2:
            $('#voice-zero-button').text(Math.round(notes[0]))     
            $('#voice-one-button').text(Math.round(notes[1]))     
            $('#voice-two-button').text(Math.round(notes[2]))     
            $('#voice-three-button').text(Math.round(notes[3]))     
            $('#voice-four-button').text(Math.round(notes[4]))     
            $('#voice-five-button').text(Math.round(notes[5]))   
            $('#voice-six-button').text(Math.round(notes[6]))     
            $('#voice-seven-button').text(Math.round(notes[7]))     
            break;
    }
}

// refresh slider handle when controls panel selected
// this is not ideal, but foundation is not updating when in another panel
$('#controls-label').on('click', function() {
    setTimeout(function() {$('#gain').change() }, 10)
})

$("#btnHiddenControls").on('click', function() {
    $("input:text").blur()
})

/*
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
*/


// ---------- retune panel events ------------
$('.tuning-selection').on('click', function() {
    switch(this.id) {
        case "5-4-3-2-lydian":
            retune([0,203.91,386.3137,590.2237,701.955,905.865,1088.2687,1200])
            break;
        case "6-5-3-2-dorian":
            retune([0,203.91,315.6413,519.5513,701.955,905.865,1017.5963,1200])
            break;
        case "7-6-3-2-trivalent":
            retune([0,203.91,266.8709,470.7809,701.955,905.865,968.8259,1200])
            break;
        case "11-9-3-2-arabic":
            retune([0,203.91,347.4079,551.3179,701.955,905.865,1048.3629,1200])
            break;
        case "13-11-3-2-dorian":
            retune([0,203.91,289.2097,493.1197,701.955,905.865,991.1647,1200])
            break;
        case "15-13-3-2-trivalent":
            retune([0,203.91,247.7411,451.6511,701.955,905.865,949.6961,1200])
            break;
        case "12-edo-major":
            retune([0,200,400,500,700,900,1100,1200])
            break;
        case "12-edo-minor":
            retune([0,200,300,500,700,800,1000,1200])
            break;
        case "12-edo-harmonic-minor":
            retune([0,200,300,500,700,800,1100,1200])
            break;
        case "7-edo":
            retune([0,171.429,342.857,514.286,685.714,857.143,1028.571,1200])
            break;
        default:
            break;
    }
})

function retune(centsArray) {
    //  retune
    for (i = 0; i < 8; i++) {
        notes[i] = centsArray[i]
    }

    // update keys if currently showing cents
    if (keymode == 2) {
        setKeyboard(keymode)
    }
}


// ---------- custom panel events ------------
$("#btnHiddenRetune").on('click', function() {
// $(".tuning-input").on('input', function() {
    notes[0] = $('#voice-zero-cents-input').val()
    notes[1] = $('#voice-one-cents-input').val()
    notes[2] = $('#voice-two-cents-input').val()
    notes[3] = $('#voice-three-cents-input').val()
    notes[4] = $('#voice-four-cents-input').val()
    notes[5] = $('#voice-five-cents-input').val()
    notes[6] = $('#voice-six-cents-input').val()
    notes[7] = $('#voice-seven-cents-input').val()

    // update keys if currently showing cents
    if (keymode == 2) {
        setKeyboard(keymode)
    }

    $("input:text").blur()
})

$("#base-freq-input").on('change', function() {
    audio.setBaseFreq($(this).val())
    $("input:text").blur()
})
