// dom elements 

let barsBtn = document.querySelector("i.fa-bars")
let title = document.querySelector(".music-name");
let videoSrc = document.querySelector("video source");
let video = document.querySelector("video");
let prevBtn = document.querySelector(".controls .fa-arrow-left");
let nextBtn = document.querySelector(".controls .fa-arrow-right");
let playBtn = document.querySelector(".controls .insert");
let menuList = document.querySelector(".menu ul");
let volumHigh = document.querySelector(".volum");
let expand = document.querySelector(".full-screen");
let menu = document.querySelector(".menu");
let inputFile = document.querySelector("input.select-music");
let inputRange = document.querySelector("input[type='range'].value-range");
let videoDurationInput = document.querySelector(".video-duration");
let startTime = document.querySelector(".start-time");
let fullTime = document.querySelector(".full-time");

// helper variables

let allVideos = []
let all_li = []

// triggers

videoDurationInput.setAttribute("value", video.currentTime);
videoDurationInput.setAttribute("max", video.duration);
startTime.textContent = video.currentTime;
fullTime.textContent = video.duration || 0

// events
playBtn.addEventListener("click", stopPlay)
inputFile.addEventListener("change", getFiles)
barsBtn.addEventListener("click", toggleMenu);
prevBtn.addEventListener("click", handlePrev);
nextBtn.addEventListener("click", handleNext);
volumHigh.addEventListener("click", handleVolum);
inputRange.addEventListener("input", handleChangeVolum);
expand.addEventListener("click", handleFullScreen);
videoDurationInput.addEventListener("input", handleDurationChange)

// functions 

// toggle menu

function toggleMenu() {
    menu.classList.toggle("active")
}

function stopPlay() {
    if (video.getAttribute("src") === "") {
        alert("Please select src")
        return;
    }

    if (playBtn.classList.contains("fa-pause")) {
        playBtn.classList.remove("fa-pause");
        playBtn.classList.add("fa-play");
        video.pause();
    } else {
        playBtn.classList.add("fa-pause");
        playBtn.classList.remove("fa-play");
        video.play();
    }

    handleTimes();
}

// get files and insert it

function getFiles(event) {
    let selectedFile = event.target.files[0];
    let reader = new FileReader();

    title.textContent = selectedFile.name

    reader.onload = function (event) {
        video.src = event.target.result;
        insertVideosInArr({
            name: selectedFile.name,
            src: event.target.result
        })

        insertUI(allVideos);
        insertActiveElement(all_li[allVideos.length - 1]);

        stopPlay()

    };

    reader.readAsDataURL(selectedFile);
}

// save videos in array

function insertVideosInArr(obj, data) {

    let findEl = allVideos.find(el => el.name === obj.name);
    if (!findEl) {
        allVideos.push(obj)
    }

}

// draw ui

function insertUI(data) {
    let lists = "";
    data.forEach(element => {
        lists += `<li onclick="playVideo(this)" name=${element.name} src=${element.src} class='listItem'>${element.name}</li>`
    });

    menuList.innerHTML = lists;
    all_li = document.getElementsByClassName("listItem");
}

// play video on click list item

function playVideo(element) {
    let src = element.getAttribute("src");
    video.src = src;
    stopPlay();
    removeActive(all_li)
    insertActiveElement(element)
}

// handlePrev

let index = 0
function handlePrev() {
    let videoSrc = video.getAttribute("src");

    let findCurrentVideoIndex = allVideos.findIndex(el => el.src == videoSrc);
    index = findCurrentVideoIndex;
    if (findCurrentVideoIndex === 0) {
        index = allVideos.length - 1
    } else {
        index--
    }

    video.src = allVideos[index].src
    title.textContent = allVideos[index].name;
    stopPlay()
    removeActive(all_li)
    insertActiveElement(all_li[index])

}

function handleNext() {
    let videoSrc = video.getAttribute("src");
    let findCurrentVideoIndex = allVideos.findIndex(el => el.src == videoSrc);
    index = findCurrentVideoIndex;
    if (findCurrentVideoIndex === allVideos.length - 1) {
        index = 0
    } else {
        index++
    }

    video.src = allVideos[index].src
    title.textContent = allVideos[index].name;
    stopPlay()
    removeActive(all_li)
    insertActiveElement(all_li[index])
}
// add active for li
function insertActiveElement(element) {
    element.classList.add("active")
}

// remove active from all li
function removeActive(lists) {
    Array.from(lists).forEach(li => li.classList.remove("active"))
}

// organize time
function handleTimes() {

    let timer = setInterval(() => {
        videoDurationInput.setAttribute("value", Math.floor(video.currentTime));
        videoDurationInput.setAttribute("max", Math.floor(video.duration));
        startTime.textContent = (video.currentTime > 60 ? video.currentTime / 60 : video.currentTime).toFixed(1);
        fullTime.textContent = (video.duration / 60 || 0).toFixed(1)
        if (video.currentTime == video.duration) {
            clearInterval(timer);
        }
    }, 1000)
}


function handleDurationChange() {
    video.currentTime = Math.floor(this.value);;
    startTime.textContent = Math.floor(this.value);
    const timer = setInterval(() => {
        this.value = Math.floor(video.currentTime);

        if (video.currentTime == video.duration) {
            videoDurationInput.setAttribute("value", 0)
            clearInterval(timer);
        }
    }, 1000)
}


function handleFullScreen() {
    if (video.requestFullscreen) {
        video.requestFullscreen();
    }
}

// show input of sound
function handleVolum() {
    inputRange.classList.toggle("show")
}

// control volum of sound

function handleChangeVolum() {

    if (this.value === "0") {
        volumHigh.classList.add("fa-volume-xmark");
        video.volume = 0
    } else {
        volumHigh.classList.remove("fa-volume-xmark");
        video.volume = this.value
    }
}

