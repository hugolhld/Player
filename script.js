class Player
{
    constructor(_element)
    {
        this.element = _element
        this.audioElement = this.element.querySelector('.js-audio')
        this.setPlayPause()
        this.setSeekBar()
        this.setLoop()
        this.openPlaylist()
/*         this.setVolume()
 */    }

    setPlayPause()
    {
        const playElement = this.element.querySelector('.js-play')
        
        playElement.addEventListener('click', () =>
        {
            if(this.audioElement.paused){
                this.audioElement.play()
                this.element.querySelector('.btn-play').src = 'images/pause.svg'
            }
            else{
                this.audioElement.pause()
                this.element.querySelector('.btn-play').src = 'images/play-button.svg'
            }
        })

        this.audioElement.addEventListener('timeupdate', () => 
        {
            if(this.audioElement.ended == true)
            {
                this.element.querySelector('.btn-play').src = 'images/play-button.svg'
            }
        })
    }
    /* setVolume()
    {
        const volumeUpElement = this.element.querySelector('.js-volume-up')
        const volumeDownElement = this.element.querySelector('.js-volume-down')

        volumeDownElement.addEventListener('click', () => 
        {
            this.audioElement.volume = Math.max(this.audioElement.volume - 0.1, 0)
        })

        volumeUpElement.addEventListener('click', () => 
        {
            this.audioElement.volume = Math.min(this.audioElement.volume + 0.1, 1)
        })
    } */
    setSeekBar()
    {
        const seekBarElement = this.element.querySelector('.js-seek-bar')
        const fillElement = this.element.querySelector('.js-seek-bar-fill')
        const circleElement = this.element.querySelector('.seekbar-circle')
        let duration = this.audioElement.duration
        let currentTime = this.audioElement.currentTime
        
        this.audioElement.addEventListener('timeupdate', () => 
        {
            const ratio = this.audioElement.currentTime / this.audioElement.duration
            const translateRatio = ratio * fillElement.clientWidth 
            const actualTime = this.element.querySelector('.actual-time')
            const moduloTime = this.element.querySelector('.modulo-time')
            let minute = Math.floor(this.audioElement.currentTime/60)
            let minuteModulo = Math.floor((this.audioElement.duration - this.audioElement.currentTime) / 60)
            let second = Math.floor(this.audioElement.currentTime%60)
            let secondModulo = Math.floor((this.audioElement.duration - this.audioElement.currentTime) % 60) 
           
            if(second < 10){
                second = '0' + second
            }
            if(secondModulo < 10){
                secondModulo = '0' + secondModulo
            }
            if(minute < 10){
                minute = '0' + minute
            }
            if(minuteModulo < 10){
                minuteModulo = '0' + minuteModulo
            }

            fillElement.style.transform = `scaleX(${ratio})`
            circleElement.style.transform = `translateX(${translateRatio}px)`
            actualTime.innerHTML =  minute + `:` + second
            moduloTime.innerHTML = `-` + minuteModulo + `:` + secondModulo
            

        })

        seekBarElement.addEventListener('click', (_event) => 
        {
            const bounding = seekBarElement.getBoundingClientRect()
            const ratio = (_event.clientX - bounding.left)  / bounding.width
            const time = ratio * this.audioElement.duration
            this.audioElement.currentTime = time
        })

        /* tets */
        let time_drag = {}
            time_drag.isOver     = false
            time_drag.isDown     = false
            time_drag.last_pos   = 0
            time_drag.save_pos   = 0
            time_drag.count      = 0
            time_drag.moveX      = 0
        /* time drag detection */
        seekBarElement.addEventListener('click', function(e){
            e.preventDefault(); // disable link
        });
        
        seekBarElement.addEventListener('mouseenter',function(){
            time_drag.isOver   = true;
        });
        
        seekBarElement.addEventListener('mousedown',function(e){
            e.preventDefault();
            time_drag.isDown   = true;
            time_drag.save_pos = e.clientX - seekBarElement.getBoundingClientRect().left;
        });
        
        seekBarElement.addEventListener('mouseup',function(e){
            time_drag.isDown = false;
            time_drag.count  = 0;
        })
        
        seekBarElement.addEventListener('mouseleave',function(e){
            time_drag.isDown = false;
            time_drag.isOver = false;
            time_drag.count  = 0;
        });
  
  /* time drag event */
  seekBarElement.addEventListener('mousemove', function(e){
    if(time_drag.isDown && time_drag.isOver){
      if(time_drag.count == 0){
        time_drag.last_pos = time_drag.moveX;
        time_drag.count++;
      }
  
      var mouse_left   = e.clientX - seekBarElement.getBoundingClientRect().left,
          ratio        = (mouse_left/seekBarElement.getBoundingClientRect().width),
          time         = ratio * duration
      time_drag.moveX  = mouse_left - time_drag.save_pos;
      time_drag.moveX += time_drag.last_pos;
  
      /* keep button in container */
      if (time_drag.moveX < -10){
        time_drag.moveX = -10;
      }
      else if(time_drag.moveX > 750){
        time_drag.moveX = 750;
      }
      
      console.log(time_drag.moveX)
      circleElement.style.transition = 'transform .0s linear'
      circleElement.style.transform = `translateX(${time_drag.moveX}px)`
  
      fillElement.style.transition = 'transform .0s linear'
      fillElement.style.transform = `scaleX(${ratio})`
      currentTime = time;
    }
  });

    }

    setLoop()
    {
        const btnLoop = this.element.querySelector('.js-loop')
        const imgLoop = this.element.querySelector('.btn-loop')

        btnLoop.addEventListener('click', ()=>
        {
            if(this.audioElement.loop == true){
                this.audioElement.loop = false
                imgLoop.classList.remove("btn-active")
            }
            else{
                this.audioElement.loop = true
                imgLoop.classList.add("btn-active")
            }
        })
    }

    openPlaylist()
    {
        const btnOpen = this.element.querySelector('.exit')
        const playlistContainer = this.element.querySelector('.player-playlist')
        const singleContainer = this.element.querySelector('.player-single')
        const playerTranslate = this.element.querySelector('.player-translate')

        btnOpen.addEventListener('click', () =>
        {
                playerTranslate.classList.toggle('is-active')

                playerTranslate.addEventListener('webkitAnimationEnd',() =>
                    {
                        if(playerTranslate.classList.contains('is-active')){
                        singleContainer.style.visibility = 'hidden'
                        }
                    })
                playerTranslate.addEventListener('webkitAnimationEnd',() =>
                    {
                        if(!playerTranslate.classList.contains('is-active')){             
                        playlistContainer.style.visibility = 'hidden'
                        }
                    })
                playerTranslate.addEventListener('webkitAnimationStart',() =>
                    {
                        if(!playerTranslate.classList.contains('is-active')){
                        singleContainer.style.visibility = 'initial'
                        }
                    })
                playerTranslate.addEventListener('webkitAnimationStart',() =>
                    {
                        if(playerTranslate.classList.contains('is-active')){
                        playlistContainer.style.visibility = 'initial'
                        }
                    })
        })
    }
}

const player = new Player(document.querySelector('.js-player'))