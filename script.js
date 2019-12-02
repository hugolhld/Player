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
        this.initPlaylist()
        this.setVolume()
   }

    setPlayPause()
    {
        const playElement = this.element.querySelector('.js-play')
        
        playElement.addEventListener('click', () =>
        {
            if(this.audioElement.paused){
                this.audioElement.play()
                this.element.querySelector('.btn-play').src = 'images/pause.svg'
                this.audioElement.classList.add('playing')
            }
            else{
                this.audioElement.pause()
                this.element.querySelector('.btn-play').src = 'images/play-button.svg'
                this.audioElement.classList.remove('playing')
            }
        })
    }
    setVolume()
    {
        /* const volumeUpElement = this.element.querySelector('.js-volume-up')
        const volumeDownElement = this.element.querySelector('.js-volume-down') */
        const volumeElement = this.element.querySelector('.js-volume-bar')
        const volumeFillElement = this.element.querySelector('.js-volume-fill')
        const volumeCircleElement = this.element.querySelector('.js-volume-circle')

        /* setVolume */

        volumeElement.addEventListener('click', (_event) => 
        {
            
            const bounding = volumeElement.getBoundingClientRect()
            const ratio = (_event.clientX - bounding.left)  / bounding.width
            const volume = 1 - ratio
            this.audioElement.volume = volume

            volumeCircleElement.style.transition = 'transform .0s linear'
            volumeCircleElement.style.transform = `translateX(${100 - (volume * volumeElement.clientWidth)}px)`
        
            volumeFillElement.style.transition = 'transform .0s linear'
            volumeFillElement.style.transform = `scaleX(${volume})`
        })

        /* Volume Drag */

       volumeElement.addEventListener('mousedown', (_event) =>
        {
            const bounding = volumeElement.getBoundingClientRect()
            const ratio = (_event.clientX - bounding.left) / bounding.width

            this.userIsDraggingSeekBar = true
            this.audioElement.volume = ratio
            volumeCircleElement.style.transition = 'transform .0s linear'
            volumeCircleElement.style.transform = `translateX(${ratio * volumeElement.clientWidth}px)`
        
            volumeFillElement.style.transition = 'transform .0s linear'
            volumeFillElement.style.transform = `scaleX(${1 - ratio})`

        } )

        volumeElement.addEventListener('mousemove', (_event) =>
        {
            if(this.userIsDraggingSeekBar)
            {
            const bounding = volumeElement.getBoundingClientRect()
            const ratio = (_event.clientX - bounding.left) / bounding.width

            volumeCircleElement.style.transition = 'transform .0s linear'
            volumeCircleElement.style.transform = `translateX(${ ratio * volumeElement.clientWidth}px)`
        
            volumeFillElement.style.transition = 'transform .0s linear'
            volumeFillElement.style.transform = `scaleX(${1 - ratio})`
            this.audioElement.volume = ratio 
            }
        } )

        volumeElement.addEventListener('click', (_event) =>
        {
            this.userIsDraggingSeekBar = false
            const bounding = volumeElement.getBoundingClientRect()
            const ratio = (_event.clientX - bounding.left) / bounding.width

            volumeCircleElement.style.transition = 'transform .0s linear'
            volumeCircleElement.style.transform = `translateX(${ratio * volumeElement.clientWidth}px)`
        
            volumeFillElement.style.transition = 'transform .0s linear'
            volumeFillElement.style.transform = `scaleX(${1-  ratio})`
            this.audioElement.volume = ratio
        } )
    }
    setSeekBar()
    {
        const seekBarElement = this.element.querySelector('.js-seek-bar')
        const fillElement = this.element.querySelector('.js-seek-bar-fill')
        const circleElement = this.element.querySelector('.js-seek-bar-circle')
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

        seekBarElement.addEventListener('mousedown', (_event) =>
        {
            const bounding = seekBarElement.getBoundingClientRect()
            const ratio = (_event.clientX - bounding.left) / bounding.width
            const time = ratio * this.audioElement.duration

            this.userIsDraggingSeekBar = true
            this.audioElement.currentTime = time

        } )

        seekBarElement.addEventListener('mousemove', (_event) =>
        {
            if(this.userIsDraggingSeekBar)
            {
            const bounding = seekBarElement.getBoundingClientRect()
            const ratio = (_event.clientX - bounding.left) / bounding.width
            const time = ratio * this.audioElement.duration

            this.audioElement.currentTime = time 
            }
        } )

        seekBarElement.addEventListener('click', (_event) =>
        {
            this.userIsDraggingSeekBar = false
            const bounding = seekBarElement.getBoundingClientRect()
            const ratio = (_event.clientX - bounding.left) / bounding.width
            const time = ratio * this.audioElement.duration

            this.videoElement.currentTime = time
        } )

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
        const singleAlbum = this.element.querySelector('.single-album')
        const playerTranslate = this.element.querySelector('.player-translate')

        btnOpen.addEventListener('click', () =>
        {
                playerTranslate.classList.toggle('is-active')

                if(playerTranslate.classList.contains('is-active'))
                {
                    this.element.querySelector('.js-exit').classList.add('animation-exit')
                    this.element.querySelector('.js-exit').classList.remove('animation-exit-back')
                }
                else
                {
                    this.element.querySelector('.js-exit').classList.remove('animation-exit')
                    this.element.querySelector('.js-exit').classList.add('animation-exit-back')
                }

                playerTranslate.addEventListener('webkitAnimationEnd',() =>
                    {
                        if(playerTranslate.classList.contains('is-active')){
                        singleAlbum.style.visibility = 'hidden'
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
                        singleAlbum.style.visibility = 'initial'
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

    initPlaylist()
    {
        const initPlaylist = _config => 
        {
        const sounds = []
        const titleActual = document.querySelector('.single-title')
        titleActual.innerText = _config[0].title + ' - ' +  _config[0].artist
        for(const _playlistConfig of _config)
        {
                const sound = {}
                sound.title = _playlistConfig
                sounds.push(sound)
                
                const playlistLi = document.querySelector('.playlist-li')
                sound.contianerElement = document.createElement("li")
                sound.titleElement = document.createElement('span')
                sound.favoriteElement = document.createElement('img')
                sound.titleElement.innerText = _playlistConfig.title + ' - ' +  _playlistConfig.artist
                sound.favoriteElement.setAttribute('src', 'images/favorite-none.svg')
                sound.favoriteElement.classList.add('single-favorite')
                playlistLi.appendChild(sound.contianerElement)
                sound.contianerElement.appendChild(sound.titleElement)
                sound.contianerElement.appendChild(sound.favoriteElement)

                sound.contianerElement.addEventListener('click', () => 
                {
                    this.audioElement.setAttribute('src', _playlistConfig.src);
                    titleActual.innerText = _playlistConfig.title + ' - ' +  _playlistConfig.artist
                    if(this.audioElement.classList.contains('playing'))
                    {
                        this.audioElement.play()
                    }
                    else
                    {
                        this.audioElement.pause()
                    }
                 })
            }

            /*  */

            const btnNext = this.element.querySelector('.js-next')
            const btnPrevious = this.element.querySelector('.js-previous')
            let indexMusic = 0
            btnNext.addEventListener('click',(_event) => 
            {
                if (indexMusic == _config.length - 1)
                {
                    indexMusic = 0
                    this.audioElement.setAttribute('src', _config[indexMusic].src);
                    titleActual.innerText = _config[indexMusic].title + ' - ' +  _config[indexMusic].artist
                }
                else
                {
                    indexMusic++
                    this.audioElement.setAttribute('src', _config[indexMusic].src);
                    titleActual.innerText = _config[indexMusic].title + ' - ' +  _config[indexMusic].artist
                }
               if (this.audioElement.classList.contains('playing'))
                {
                    this.audioElement.play();
                }
                else
                {
                    this.audioElement.pause();
                }
                if(btnRandom.classList.contains('random-active'))
                {
                    indexMusic = Math.floor(Math.random() * Math.floor(_config.length))
                    this.audioElement.setAttribute('src', _config[indexMusic].src);
                    titleActual.innerText = _config[indexMusic].title + ' - ' +  _config[indexMusic].artist
                }
            })
        
            btnPrevious.addEventListener('click',(_event) => 
            {
                if (indexMusic == 0)
                {
                    indexMusic = _config.length - 1
                    this.audioElement.setAttribute('src', _config[indexMusic].src);
                    titleActual.innerText = _config[indexMusic].title + ' - ' +  _config[indexMusic].artist
                }
                else
                {
                    indexMusic--
                    this.audioElement.setAttribute('src', _config[indexMusic].src);
                    titleActual.innerText = _config[indexMusic].title + ' - ' +  _config[indexMusic].artist
                }
                if (this.audioElement.classList.contains('playing'))
                {
                    this.audioElement.play();
                }
                else
                {
                    this.audioElement.pause();
                }
                if(btnRandom.classList.contains('random-active'))
                {
                    indexMusic = Math.floor(Math.random() * Math.floor(_config.length))
                    this.audioElement.setAttribute('src', _config[indexMusic].src);
                    titleActual.innerText = _config[indexMusic].title + ' - ' +  _config[indexMusic].artist
                }
            })

            const btnRandom = this.element.querySelector('.js-random')

            btnRandom.addEventListener('click', () =>
            {
                btnRandom.classList.toggle('random-active')
                btnRandom.classList.toggle('btn-active')
            })

            this.audioElement.addEventListener('ended', () => 
            {
                if(btnRandom.classList.contains('random-active'))
                {
                    indexMusic = Math.floor(Math.random() * Math.floor(_config.length))
                    this.audioElement.setAttribute('src', _config[indexMusic].src);
                    titleActual.innerText = _config[indexMusic].title + ' - ' +  _config[indexMusic].artist
                }

                if(!btnRandom.classList.contains('random-active') && this.audioElement.loop == false){
                    if(indexMusic == _config.length - 1)
                    {
                        indexMusic = 0
                        this.audioElement.setAttribute('src', _config[indexMusic].src);
                        titleActual.innerText = _config[indexMusic].title + ' - ' +  _config[indexMusic].artist
                    }
                    else
                    {
                        indexMusic ++
                        this.audioElement.setAttribute('src', _config[indexMusic].src);
                        titleActual.innerText = _config[indexMusic].title + ' - ' +  _config[indexMusic].artist
                    }
                }

                if (this.audioElement.classList.contains('playing'))
                {
                    this.audioElement.play();
                }
                else
                {
                    this.audioElement.pause();
                }

            })
        }

        

            window
                .fetch('config.json')
                .then(_reponse => _reponse.json())
                .then(initPlaylist)
            }
    }


const player = new Player(document.querySelector('.js-player'))
