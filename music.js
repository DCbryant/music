
!(function(){
    function Music(selector){
        var self = this
        this.ct = $(selector)
        this.getMusicList(function(list){
            self.musicList = list
            self.setPlaylist(list)
            self.loadMusic(self.musicList[self.currentIndex])
        })
        this.init()
        this.bind()
    }
    
    // 私有函数
    function $(selector){
        return document.querySelector(selector)
    }

    function $$(selector){
        return document.querySelectorAll(selector)
    }

    // 格式化时间戳
    function formatTime(time){
        var min = Math.floor(time / 60)  
        var sec = Math.floor(time % 60) 
        sec = sec < 10 ? ('0' + sec) : sec;
        min = min < 10 ? ('0' + min) : min;
        time = min + ':' + sec
        return time
    }

    Music.prototype = {
        constructor:Music,
        init:function(){
            this.musicList = []
            this.currentIndex = 0
            this.clock
            this.audio = new Audio()
            this.volume = 0.4
            this.audio.autoplay = true
            this.audio.volume = this.volume
            this.$musicList = $('.music-list')
            this.$lis = $$('.music-list li')
        },
        bind:function(){
            var self = this
            // 展示时间
            this.audio.ontimeupdate = function(){
                // 当前时间/总时间
                $('.music-progress .music-progress-now').style.width = (this.currentTime / this.duration) * 100 + '%'
            }

            // 将时间的显示逻辑放在onlpay这个事件
            this.audio.onplay = function(){
                self.clock = setInterval(() => {
                    var currentTime = formatTime(this.currentTime)
                    var totalTime = formatTime(this.duration)
                    $('.tool .current-time').innerText = currentTime
                    $('.tool .total-time').innerText = '/' + totalTime
                },1000)
                $('.music-avater').style.animationPlayState = 'running'
            }

            this.audio.onpause = function(){
                clearInterval(self.clock)
                $('.music-avater').style.animationPlayState = 'paused'
            }

            // 播放 暂停
            $('.music-control .play').onclick = function(){
                if(self.audio.paused){
                    self.audio.play()
                    this.querySelector('.fa').classList.add('fa-pause')
                    this.querySelector('.fa').classList.remove('fa-play')
                }else{
                    self.audio.pause()
                    this.querySelector('.fa').classList.add('fa-play')
                    this.querySelector('.fa').classList.remove('fa-pause')
                }
            }

            // 向前向后播放
            $('.music-control .forward').onclick = function(){
                self.currentIndex = ++self.currentIndex % self.musicList.length
                console.log(self.musicList)
                self.loadMusic(self.musicList[self.currentIndex])
            }

            $('.music-control .back').onclick = function(){
                self.currentIndex = (self.musicList.length + --self.currentIndex) % self.musicList.length
                self.loadMusic(self.musicList[self.currentIndex])
            }


            // 拖动进度条
            $('.music-progress .bar').onclick = function(e){
                var percent = e.offsetX / parseInt(getComputedStyle(this,null).width)
                self.audio.currentTime = self.audio.duration * percent
            }

            // 拖动声音进度条
            $('.volume-bar').onclick = function(e){
                var percent = e.offsetX / parseInt(getComputedStyle(this,null).width)
                self.audio.volume = percent
                this.querySelector('.volume-now').style.width = percent * 100 + '%'
            }

            $('.volume i').onclick = function(){
                if(self.audio.muted){
                    self.audio.muted = false
                    this.classList.add('fa-volume-up')
                    this.classList.remove('fa-volume-down')
                    $('.volume-bar .volume-now').style.width = self.volume * 100 + '%'
                }else{
                    self.audio.muted = true
                    this.classList.remove('fa-volume-up')
                    this.classList.add('fa-volume-down')
                    $('.volume-bar .volume-now').style.width = 0
                }
            }

            // 事件代理       
            $('.music-list').onclick = function(e){
                var target = e.target
                if(target.tagName.toLowerCase() === 'li'){
                    for(var i=0;i<this.children.length;i++){
                        if(this.children[i] === e.target){
                            self.currentIndex = i
                        }
                    }
                    console.log(self.currentIndex)
                    self.loadMusic(self.musicList[self.currentIndex])
                }
            }

            // 列表消失或展开
            $('.menu').onclick = function(e){
                e.stopPropagation()
                if($('.music-list').classList.contains('fade')){
                    $('.music-list').classList.remove('fade')
                    // fa-sort-amount-desc
                    this.querySelector('i').classList.add('fa-sort-amount-desc')
                    this.querySelector('i').classList.remove('fa-bars')
                }else{
                    $('.music-list').classList.add('fade')
                    this.querySelector('i').classList.remove('fa-sort-amount-desc')
                    this.querySelector('i').classList.add('fa-bars')
                }
            }


            // 播放结束自动播放
            this.audio.onended = function(){
                self.currentIndex = (++self.currentIndex) % self.musicList.length
                self.loadMusic(musicList[currentIndex])
            }
        },
        getMusicList:function(cb){
            var xhr = new XMLHttpRequest()
            xhr.open('GET','./music.json',true)
            xhr.onload = function(){
                if((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304){
                    console.log(JSON.parse(this.responseText))
                    cb(JSON.parse(this.responseText))
                }else{
                    console.log('获取数据失败')
                }
            }
            xhr.onerror = function(){
                console.log('error')
            }
            xhr.send()
        },
        setPlaylist: function(musiclist){
            var frg = document.createDocumentFragment()
            musiclist.forEach(function(musicObj){
                var li = document.createElement('li')
                var h3 = document.createElement('h3')
                h3.innerText = musicObj.title
                var div = document.createElement('div')
                div.innerText = musicObj.auther
                li.appendChild(h3)
                li.appendChild(div)
        
                frg.appendChild(li)
            })
            this.$musicList.appendChild(frg)
        },
        // 播放歌曲，改变title auther 背景图
        loadMusic:function(musicObj){
            console.log('begin play',musicObj)
            $('.music-info .title').innerText = musicObj.title
            $('.music-info .auther').innerText = musicObj.auther
            $('.music-avater').style.backgroundImage = 'url(' + musicObj.img+ ')'
            $('.volume-bar .volume-now').style.width = this.volume * 100 + '%'
            this.audio.src = musicObj.src
            for(var i = 0; i < this.$musicList.children.length; i++){
                this.$musicList.children[i].classList.remove('playing')
            }
            this.$musicList.children[this.currentIndex].classList.add('playing')   
        }
    }

    window.Music = Music
})()

var music = new Music('.musicbox')


