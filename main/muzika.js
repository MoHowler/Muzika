let audio, volumeslider, seeking = false, seekto, dir, playlist, ext, canvasbackground, png, agent, is_shuffle,
shuffle_index, shuffle_order, shuffle_icon, repeatSong_icon;

function initAudioPlayer() {
  dir = "audio/";
  playlist = ["Bensound-Rumble", "Bensound-Acoustic Breeze", "Bensound-Extreme Action", "Bensound-Creative Minds",
  "Bensound-High Octane", "Bensound-A New Beginning", "Bensound-Sunny", "Bensound-Happy Rock",
  "Bensound-A Day to Remember", "Bensound-Buddy", "Bensound-Going Higher", "Bensound-Punky"];
  playlist_index = 0;
  cdir = "wave-images/";
  canvasbackground = ["0rumble.wi", "1acousticbreeze.wi", "2extremeaction.wi", "3creativeminds.wi", 
  "4highoctane.wi", "5anewbegining.wi", "6sunny.wi", "7happyrock.wi", "8adaytoremember.wi", "9buddy.wi",
  "10goinghigher.wi", "11punky.wi"];
  canvasbackground_index = playlist_index;
  png = ".png";
  let canvasbg = new Image();
  canvasbg.src = cdir + canvasbackground[0] + png;


  agent = navigator.userAgent.toLowerCase();
  if (agent.indexOf('firefox') != -1 || (agent.indexOf('opera') != -1) || (agent.indexOf('chrome')) != -1) {
    ext = ".mp3";
  }
  // Set object references
  let player = document.getElementById("audio-container");
  let glow = document.getElementById("glow");
  let timebox = document.getElementById("timebox");
  let playbtn = document.getElementById("playpause");
  let stopbtn = document.getElementById("stop");
  let nextbtn = document.getElementById("next");
  let prevbtn = document.getElementById("prev");
  let mutebtn = document.getElementById("on-off");
  let volumeslider = document.getElementById("volume");
  let curtimetext = document.getElementById("current-time");
  let durtimetext = document.getElementById("duration-time");
  let playlist_status = document.getElementById("songName");
  let closePlayer = document.getElementById("close-player");
  let audioPlayer = document.getElementById("audio-container");
  let repeatSong = document.getElementById("repeat-song");
  repeatSong_icon = repeatSong.getElementsByTagName("i")[0];
  let seekslider = document.getElementById("seekslider");
  let volumeUp = document.getElementById("up-volume");
  let volumeDown = document.getElementById("down-volume");
  let shufflebtn = document.getElementById("shuffle");
  shuffle_icon = shufflebtn.getElementsByTagName("i")[0];
  let sliderContainer = document.getElementsByClassName("slider-container");
  let title = window.document.title;
  let url = window.document.location.href;
  let canvas = document.getElementById('canvas');
  let ctx = canvas.getContext('2d');  
  canvas.width = canvas.clientWidth;
  playlist_status.innerHTML = "Muzika Audio-Player";
  
  //audio object
  audio = new Audio();
  audio.src = dir + playlist[0] + ext;
  audio.loop = false;
  is_shuffle = false;
  shuffle_index = 0;
  shuffle_order = [];

  //event listeners 
  shufflebtn.addEventListener("click", shuffle);
  playbtn.addEventListener("click", playPause);
  nextbtn.addEventListener("click", switchTrack);
  prevbtn.addEventListener("click", prevTrack);
  stopbtn.addEventListener("click", stop);
  mutebtn.addEventListener("click", mute);
  seekslider.addEventListener("mousedown", function (event) { seeking = true; seek(event); });
  seekslider.addEventListener("mousemove", function(event) { seek(event); });
  seekslider.addEventListener("mouseup", function () { seeking = false; });
  volumeslider.addEventListener("mousemove", setvolume);
  audio.addEventListener("timeupdate", function () { seektimeupdate(); });
  audio.addEventListener("ended", function () { switchTrack(); });
  closePlayer.addEventListener("click", closePlayerFunc);
  repeatSong.addEventListener("click", repeatSongFunc);
  volumeUp.addEventListener("click", volumeUpFunc);
  volumeDown.addEventListener("click", volumeDownFunc);

//keyboard shortcuts for operating the audio-player
  if (audio) {
    window.addEventListener('keydown', function(space) {
      let key = space.which || space.keyCode;
      if (key === 32 || key === 80) {
        space.preventDefault();
        playPause();
        } 
    });
  }
if (audio) {
    window.addEventListener('keyup', function(space) {
      let key = space.which || space.keyCode;
      if (key === 32) {
        space.preventDefault();
        } 
    });
  }
  if (audio) {
    window.addEventListener('keydown', function(skipevent) {
      let key = skipevent.which || skipevent.keyCode;
      if (key === 39) { // right arrow
        skipevent.preventDefault();
        audio.play() ? switchTrack(event) : audio.play();
        }
    });
  }
  if (audio) {
    window.addEventListener('keydown', function(prevevent) {
      let key = prevevent.which || prevevent.keyCode;
      if (key === 37) { // left arrow
        prevevent.preventDefault();
        audio.play() ? prevTrack() : audio.play();
        }
     });
   }
  if (audio) {
    window.addEventListener('keydown', function(incVolume) {
      let key = incVolume.which || incVolume.keyCode;
      if (key === 107 || key === 85) { // '+' or 'u'
        incVolume.preventDefault();
        volumeUpFunc();
      }
    });
  }
    if (audio) {
    window.addEventListener('keydown', function(decVolume) {
      let key = decVolume.which || decVolume.keyCode;
      if (key === 109 || key === 68) { //'-' or 'd'
        decVolume.preventDefault();
        volumeDownFunc();
      }
    });
  }
     if (audio) {
    window.addEventListener('keydown', function(muteVolume) {
      let key = muteVolume.which || muteVolume.keyCode;
      if (key === 77) { //  'm'
        muteVolume.preventDefault();
        mute();
      }
    });
  }
       if (audio) {
    window.addEventListener('keydown', function(stopAudio) {
      let key = stopAudio.which || StopAudio.keyCode;
      if (key === 83) { //  's'
        stopAudio.preventDefault();
       stop();
      }
    });
  }
       if (audio) {
    window.addEventListener('keydown', function(shuffleTracks) {
      let key = shuffleTracks.which || shuffleTracks.keyCode;
      if (key === 70) { //  'f'
        shuffleTracks.preventDefault();
        shuffle();
      }
    });
  }
       if (audio) {
    window.addEventListener('keydown', function(repeat) {
      let key = repeat.which || repeat.keyCode;
      if (key === 82) { //  'r'
       repeat.preventDefault();
       repeatSongFunc();
      }
    });
  }
      if (audio) {
    window.addEventListener('keydown', function(quitPlayer) {
      let key = quitPlayer.which || quitPlayer.keyCode;
      if (key === 81) { //  'Q'
       quitPlayer.preventDefault();
       closePlayerFunc();
      }
    });
  }

//swap facebook and linkedin with audius and soundcloud
//organise all share buttons into one querySelector
//organise each of the 4 share paths and iterate through using forEach()

const shareButtons = document.querySelectorAll('.share-btns');
const shareContainers = document.querySelectorAll('.share-btn-container');

shareButtons.forEach((button, i) => {
  button.addEventListener('click', () => { 
      togglesharePanel(shareContainers[i]);
      toggleshareBtns(shareButtons[i]);    
   })
})

function togglesharePanel(shareContainersRef) {
  shareContainersRef.classList.toggle('share-btn-container-active');
}

function toggleshareBtns(buttonRef) {
  buttonRef.classList.toggle('share-btns-active');
} 
  
//let postUrl = encodeURI(document.location.href);
//let postTitle = encodeURI("Check this song out" + ": ");
//let checkForParam = window.location.search;

const facebookBtn = document.querySelectorAll('.shareContainers, .facebook-btn');
facebookBtn.forEach((button, i) => {
  button.addEventListener('click', () => {
    console.log(button);
    console.log("sharing disabled, dummy track in use")
  })
})
const whatsappBtn = document.querySelectorAll('.shareContainers, .whatsapp-btn');
whatsappBtn.forEach((button, i) => {
  button.addEventListener('click', () => {
    console.log(button);
    console.log("sharing disabled, dummy track in use")
  })
})
const twitterBtn = document.querySelectorAll('.shareContainers, .twitter-btn');
twitterBtn.forEach((button, i) => {
  button.addEventListener('click', () => {
    console.log(button);
    console.log("sharing disabled, dummy track in use")
  })
})
const soundcloudBtn = document.querySelectorAll('.shareContainers, .soundcloud-btn');
soundcloudBtn.forEach((button, i) => {
  button.addEventListener('click', () => {
    console.log(button);
    console.log("sharing disabled, dummy track in use")
  })
})

 /*shareButtons.forEach((button, i) => {
  button.addEventListener('click', () => {
    if (navigator.share) {
      navigator.share ({
        title: '$[title]',
        url: '$url'
      }) .then (() => {
        console.log('share succsseful');
      })
        } else {
          togglesharePanel[i];
       }
    })
  })*/

//song-boxes > play buttons event listeners, applies 'active' to button(i) and songbox(j), i===j 
  const playButtons = document.querySelectorAll('.playbuttons');
  const songBoxes = document.querySelectorAll('.song-boxes');

  playButtons.forEach((button, i) => {
    button.addEventListener('click', () => {
      if (audio.src.endsWith("null")) {
        audio.src = dir + playlist[i] + ext;  
      }
    button.classList.add('play-btn-active');  
    button.innerHTML = "<i class = 'fa fa-pause-circle-o'></i>"
     songBoxes.forEach((songbox, j) => {
      songbox.classList.toggle('song-boxes-active', i === j);
     })
      if (playlist_index !== i) {
        audio.src = dir + playlist[i] + ext; 
        playlist_status.innerHTML = playlist[i];
        playlist_index = i;
    } else if ((!audio.paused) && playlist_index === i) {
        button.innerHTML = "<i class = 'fa fa-play-circle-o'></i>";
        playbtn.innerHTML = "<i class = 'fa fa-play'></i>";
     } else if ((audio.paused) && playlist_index === i) {
        button.innerHTML = "<i class = 'fa fa-pause-circle-o'></i>"; 
        playbtn.innerHTML = "<i class = 'fa fa-pause'></i>";
      }
    playPause();
  })
})

playButtons.forEach((button, i) => {
 audio.addEventListener('playing', () => {
  if  (playlist_index === i) {
    button.innerHTML = "<i class = 'fa fa-pause-circle-o'></i>"; 
    button.classList.add('play-btn-active');
  } else {
    button.innerHTML = "<i class = 'fa fa-play-circle-o'></i>"; 
    button.classList.remove('play-btn-active');
   }
 })
   songBoxes.forEach((songbox, j) => {
      audio.addEventListener('playing', () => {
        if (playlist_index === j) {
          songbox.classList.add('song-boxes-active');
       } else {
          songbox.classList.remove('song-boxes-active')
      }
    })
  })
})  

// Main Functions, Playback, Volume controls 
  function playPause() {
    if (audio.src.endsWith("null")) {
     audio.src = dir + playlist[playlist_index] + ext;
    }
    if (audio.paused) {
      playbtn.innerHTML = "<i class = 'fa fa-pause'></i>";
      playlist_status.innerHTML = playlist[playlist_index];
      glow.classList.remove('disable-animation');
      audio.play();
      ctx.globalAlpha = 1;
      canvasbackground_index = playlist_index;
      audioPlayer.style.display = "grid";
    } else {
      audio.pause();
      glow.classList.add("disable-animation");
      playbtn.innerHTML = "<i class = 'fa fa-play'></i>";
       playButtons.forEach((button) => {
         button.innerHTML ="<i class = 'fa fa-play-circle-o'></i>"
        })
      }
    }

  function stop() {
     playButtons.forEach((button) => {
     button.classList.remove('play-btn-active');  
     button.innerHTML ="<i class = 'fa fa-play-circle-o'></i>"
      songBoxes.forEach((songbox) => {
      songbox.classList.remove('song-boxes-active'); 
     })
  })
    audio.pause();
    audio.currentTime = 0;
    audio.src = null;
    shuffle_index = 0;
    ctx.globalAlpha = 0.1;
    playbtn.innerHTML = "<i class = 'fa fa-play'></i>";
    glow.classList.add("disable-animation");
    playlist_status.innerHTML = "Muzika Audio-Player";
    seekslider.value = 0;
    curtimetext.innerHTML = "00:00";
    durtimetext.innerHTML = "00:00";
  }

  function switchTrack(event) {
    if (is_shuffle) {
      shuffle_index++;
      if (shuffle_index >= (shuffle_order.length)) {
        shuffle_index = 0;
      }
      playlist_index = shuffle_order[shuffle_index];
    } else {
      if (playlist_index == (playlist.length - 1)) {
        playlist_index = 0;
      } else {
        playlist_index++;
      }
    }
    playButtons.forEach((button) => {
    button.classList.remove('play-btn-active');  
    button.innerHTML ="<i class = 'fa fa-play-circle-o'></i>"
      songBoxes.forEach((songbox) => {
      songbox.classList.toggle('song-boxes-active'); 
     })
  })
    ctx.globalAlpha = 1;
    playlist_status.innerHTML = playlist[playlist_index];
    audio.src = dir + playlist[playlist_index] + ext;
    audio.play();
    playbtn.innerHTML = "<i class = 'fa fa-pause'></i>";
    glow.classList.remove("disable-animation");
  }

  function prevTrack() {
    if (is_shuffle) {
      shuffle_index--;
      if (shuffle_index < 0) {
        shuffle_index = (shuffle_order.length - 1);
      }
      playlist_index = shuffle_order[shuffle_index];
    } else {
      if (playlist_index == 0) {
        playlist_index = (playlist.length - 1);
      } else {
        playlist_index--;
      }
    }
 playButtons.forEach((button) => {
  button.classList.remove('play-btn-active');  
  button.innerHTML = "<i class = 'fa fa-play-circle-o'></i>"
   songBoxes.forEach((songbox) => {
    songbox.classList.toggle('song-boxes-active');
    }) 
  })  
    ctx.globalAlpha = 0.99;
    playlist_status.innerHTML = playlist[playlist_index];
    audio.src = dir + playlist[playlist_index] + ext;
    audio.play();
    playbtn.innerHTML = "<i class = 'fa fa-pause'></i>";
    glow.classList.remove("disable-animation");
  }

  //repeat and shuffle functions
  function repeatSongFunc() {
    if (!audio.loop) {
      audio.loop = true;
      repeatSong_icon.classList.add("active");
    } else {
      audio.loop = false;
      repeatSong_icon.classList.remove("active");
    }
  }

  function shuffle() {
    if (!is_shuffle) {
      is_shuffle = true;
      shuffle_icon.classList.add("active");
      shuffle_index = 0;
      create_shuffle_order();
    } else {
      is_shuffle = false;
      shuffle_icon.classList.remove("active");
    }
  }

  function create_shuffle_order() {
    const start = 0;
    const end = playlist.length;

    shuffle_order = [];
    for (let i = start; i < end; i++) {
      shuffle_order.push(i);
    }

    // Fisher Yates Algorithm
    let idx = shuffle_order.length;
    while (idx > 0) {
      const randomIdx = Math.floor(Math.random() * idx);
      idx -= 1;

      // Swap the two elements
      const tmp = shuffle_order[idx];
      shuffle_order[idx] = shuffle_order[randomIdx];
      shuffle_order[randomIdx] = tmp;
    }//console.log(shuffle_order);
  }

  //sound control functions and initialization.
  audio.volume = 1;
  const volumeBtnMap = {
    up: 'fa fa-volume-up',
    down: 'fa fa-volume-down',
    mute: 'fas fa-volume-mute'
  }

  function setvolume() {
    audio.volume = volume.value / 100;
  }

  function volumeUpFunc() {
    if (audio.volume <= 0.9) {
      audio.volume += 0.1;
    } else if (volume > 0.9) {
      audio.volume = 1;
    }
    changeOnOffBtn();
    audio.muted = false;
  }

  function volumeDownFunc() {
    const volume = audio.volume;
    if (audio.volume > 0.2) {
      audio.volume -= 0.1;
    } else if (volume > 0) {
      audio.volume = 0;
    }
    changeOnOffBtn();
    audio.muted = false;
  }

  function changeOnOffBtn() {
    const volume = audio.volume;
    const btn = document.getElementById('mute');
    if (volume > 0 && volume <= 0.5) {
      btn.className = 'fa fa-volume-down';
    } else if (volume > 0.5) {
      btn.className = 'fa fa-volume-up';
    } else {
      btn.className = 'fas fa-volume-mute';
    }
  }

  function mute() {
    const volume = audio.volume;
    const btn = document.getElementById('mute');
    if (audio.muted) {
      audio.muted = false;
      changeOnOffBtn();
    } else {
      audio.muted = true;
      btn.className = 'fas fa-volume-mute';
    }
  }

  function closePlayerFunc() {
    audioPlayer.style.display = "none";
    stop();  
  }

  //audio time tracking
  function seektimeupdate() {
    let nt = audio.currentTime * (100 / audio.duration);
    if (isNaN(nt)) return;
    seekslider.value = nt;
    let curmins = Math.floor(audio.currentTime / 60);
    let cursecs = Math.floor(audio.currentTime - curmins * 60);
    let durmins = Math.floor(audio.duration / 60);
    let dursecs = Math.floor(audio.duration - durmins * 60);
    if (cursecs < 10) { cursecs = "0" + cursecs; }
    if (dursecs < 10) { dursecs = "0" + dursecs; }
    if (curmins < 10) { curmins = "0" + curmins; }
    if (durmins < 10) { durmins = "0" + durmins; }
    curtimetext.innerHTML = curmins + ":" + cursecs;
    durtimetext.innerHTML = durmins + ":" + dursecs;
  }

  function seek(event) {
    if (seeking) {
      let seek = {x: 0, y: 0,}
      seek.x = (event.clientX - player.offsetLeft) * (100 / seekslider.clientWidth);
      seek.ctx = (seek.x / 100) * audio.duration;
      seekto = seek.ctx;
      audio.currentTime = seekto;  
    }
  }

  //canvas section
  ctx.x = 0;
  let mouse = {x: 0, y: 0,}

  ctx.globalAlpha = 0.1;
  
  window.addEventListener('load', function(){sizeCanvas();});
  window.addEventListener('resize', function(){sizeCanvas();
  console.log(canvas.clientWidth);
  //console.log(window.innerWidth);
});


canvas.addEventListener('mousedown', function (event) {
     canvasSeek();
   });

canvas.addEventListener('mouseup', function (event) {
    seeking = false;
   });

function sizeCanvas() {
    if (window.innerWidth >= 1488) {
      canvas.width = 1471;
      canvas.clientWidth = canvas.width;
    } else {
      canvas.width = canvas.clientWidth;
    }
  }  

function canvasSeek() {
      if (seeking = true) {
      mouse.x = (event.x - player.offsetLeft) * (100 / canvas.width);
      ctx.x = (mouse.x / 100) * audio.duration;
      seekto = ctx.x;
      audio.currentTime = seekto;
    }
 }

  function drawCanvas() {
    ct = audio.currentTime * (100 / audio.duration);
    //if (isNaN(ctx.x)) return;
    ctx.x = (ct / 100) * canvas.width;
    seekto = ctx.x;
    canvasbg.src = cdir + canvasbackground[canvasbackground_index] + png;
    canvasbackground_index = playlist_index;
    ctx.drawImage(canvasbg, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(10, 5, 20, 0.8)";
    ctx.fillRect(0, 0, 0 + seekto, canvas.height);
    ctx.fillStyle = "rgba(250,250,250,1)";
    ctx.fillRect(ctx.x, 0, 1, 90);
    ctx.fillStyle = "rgba(12, 12, 15, 0.1)";
    ctx.fillRect(0, 0, seekto + canvas.width, canvas.height);
  }

  function canvasAnimate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(canvasAnimate);
    drawCanvas();
  }
  canvasAnimate();
}

window.addEventListener('load', initAudioPlayer);


