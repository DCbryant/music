var musicList = []
var currentIndex = 0
var clock
var audio = new Audio()
var volume = 0.4
audio.autoplay = true
audio.volume = volume
var $musicList = $('.music-list')
var $lis = $$('.music-list li')

getMusicList(function(list){
    musicList = list
    setPlaylist(list)
    loadMusic(musicList[currentIndex])
})

//生成播放列表
function setPlaylist(musiclist){
    frg = document.createDocumentFragment()
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
    $musicList.appendChild(frg)
}

// 播放歌曲，改变title auther 背景图
function loadMusic(musicObj){
    console.log('begin play',musicObj)
    $('.music-info .title').innerText = musicObj.title
    $('.music-info .auther').innerText = musicObj.auther
    $('.music-avater').style.backgroundImage = 'url(' + musicObj.img+ ')'
    $('.volume-bar .volume-now').style.width = volume * 100 + '%'
    audio.src = musicObj.src
    for(var i = 0; i < $musicList.children.length; i++){
        $musicList.children[i].classList.remove('playing')
    }
    $musicList.children[currentIndex].classList.add('playing')
   
}


// 展示时间
audio.ontimeupdate = function(){
    // 当前时间/总时间
    $('.music-progress .music-progress-now').style.width = (this.currentTime / this.duration) * 100 + '%'
}

// 将时间的显示逻辑放在onlpay这个事件
audio.onplay = function(){
    clock = setInterval(() => {
        var currentTime = formatTime(this.currentTime)
        var totalTime = formatTime(this.duration)
        $('.tool .current-time').innerText = currentTime
        $('.tool .total-time').innerText = '/' + totalTime
    })
}

// 转换时间戳格式
function formatTime(time){
    var min = Math.floor(time / 60)  
    var sec = Math.floor(time % 60) 
    sec = sec < 10 ? ('0' + sec) : sec;
    min = min < 10 ? ('0' + min) : min;
    time = min + ':' + sec
    return time
}

audio.onpause = function(){
    clearInterval(clock)
}

// 播放 暂停
$('.music-control .play').onclick = function(){
    if(audio.paused){
        audio.play()
        this.querySelector('.fa').classList.add('fa-pause')
        this.querySelector('.fa').classList.remove('fa-play')
    }else{
        audio.pause()
        this.querySelector('.fa').classList.add('fa-play')
        this.querySelector('.fa').classList.remove('fa-pause')
    }
}

// 向前向后播放
$('.music-control .forward').onclick = function(){
    currentIndex = ++currentIndex % musicList.length
    loadMusic(musicList[currentIndex])
}

$('.music-control .back').onclick = function(){
    currentIndex = (musicList.length + --currentIndex) % musicList.length
    loadMusic(musicList[currentIndex])
}


// 拖动进度条
$('.music-progress .bar').onclick = function(e){
    var percent = e.offsetX / parseInt(getComputedStyle(this,null).width)
    audio.currentTime = audio.duration * percent
}

// 拖动声音进度条
$('.volume-bar').onclick = function(e){
    var percent = e.offsetX / parseInt(getComputedStyle(this,null).width)
    audio.volume = percent
    this.querySelector('.volume-now').style.width = percent * 100 + '%'
}

$('.volume i').onclick = function(){
    if(audio.muted){
        audio.muted = false
        this.classList.add('fa-volume-up')
        this.classList.remove('fa-volume-down')
        $('.volume-bar .volume-now').style.width = volume * 100 + '%'
    }else{
        audio.muted = true
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
                currentIndex = i
            }
        }
        console.log(currentIndex)
        loadMusic(musicList[currentIndex])
    }
}



// 列表消失或展开
$('.menu').onclick = function(){
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
audio.onended = function(){
    currentIndex = (++currentIndex) % musicList.length
    loadMusic(musicList[currentIndex])
}

function $(selector){
    return document.querySelector(selector)
}
function $$(selector){
    return document.querySelectorAll(selector)
}

function getMusicList(cb){
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
}