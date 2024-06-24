import ScrollMotion from "./scroll_motion.js";
import { isMobile, isDesktop, hasElementsNum, callByObserver } from "./scroll_function.js";

class ScrollIndex {
    defaults = {
        threshold: 0,
    }

    el;
    container;
    scrollMotion;
    imgSelector;
    absTop;
    absTop2;

    constructor(el, sceneElem, motionElem, options){

        this.scrollMotion = new ScrollMotion(sceneElem, motionElem, options);

        this.init(el, options);
    }
    
    init(el, options){
        this.defaults = {...this.defaults, ...options};
        this.el = el;
        this.container = document.querySelector(this.el);
        this.imgSelector = document.querySelectorAll('[data-src]');
        this.defaults.threshold = window.innerHeight * options.threshold;

        if (isDesktop()) {
            this.desktopFlag = true;
            this.mobileFlag = false;
        } else {
            this.desktopFlag = false;
            this.mobileFlag = true;
        }
    
        this.render();
        this.attachEvents();
        this.setObserver();
    }

    render(){
        this.setSwiper();

        this.scrollMotion.setAnimationListener((currentIndex) => {
            let currentYOffset = this.scrollMotion.yOffset - this.scrollMotion.defaults.prevScrollHeight;
            let scrollRatio = currentYOffset / this.scrollMotion.scrollSection[currentIndex].scrollHeight;

            // console.log('scrollRatio', scrollRatio);
    
            if(currentIndex === 0){
    
            }else if(currentIndex === 1){
            
            }else if(currentIndex === 2){
    
            }else if(currentIndex === 3){ 
    
            }else if(currentIndex === 4){             
    
            }else if(currentIndex === 5){             
                if(!this.scrollMotion.currentScene.querySelector('.monthly__scroll-x')) return false;

                if(this.scrollMotion.currentScene.getBoundingClientRect().top <= 0){
                    const scrollWidth = JSON.parse(this.scrollMotion.currentScene.querySelector('.monthly__scroll-x').dataset.width);
                    let deltaY = this.scrollMotion.defaults.yDirection == 'down' ? 1 : -1;

                    console.log('scrollX', this.scrollMotion.defaults.scrollX);

                    this.scrollMotion.currentScene.querySelector('.monthly__scroll-x').classList.add('monthly__sticky-elem');
                    this.scrollMotion.defaults.scrollX += deltaY * 60;  

                    if(!this.scrollMotion.defaults.stickyScollY){
                        this.scrollMotion.defaults.stickyScollY = this.scrollMotion.yOffset;
                        console.log('stickyScollY', this.scrollMotion.defaults.stickyScollY);
                    }
                                                        
                    if (this.scrollMotion.defaults.scrollX < 0) {
                        this.scrollMotion.defaults.scrollX = 0;
                    } else if (this.scrollMotion.defaults.scrollX > scrollWidth - window.innerWidth) {
                        this.scrollMotion.defaults.scrollX = scrollWidth - window.innerWidth;
                    }
                    
                    this.scrollMotion.currentScene.querySelector('.monthly__scroll-x').style.transform = `translateX(-${this.scrollMotion.defaults.scrollX}px)`;
        
                }else{
                    this.scrollMotion.currentScene.querySelector('.monthly__scroll-x').classList.remove('monthly__sticky-elem');
                }   
            }else if(currentIndex === 7){
                const stickyEl = this.scrollMotion.currentScene.querySelector('.monthly__cover-img');
                const stickyScaleWidth = JSON.parse(stickyEl.dataset.scaleWidth);
                const stickyScaleHeight = JSON.parse(stickyEl.dataset.scaleHeight);

                if(!this.absTop){
                    this.absTop = this.scrollMotion.yOffset + this.scrollMotion.currentScene.getBoundingClientRect().top;
                }

                let currentYOffset = (this.scrollMotion.yOffset + this.scrollMotion.defaults.threshold) - this.absTop;
                let scrollRatio = currentYOffset / this.scrollMotion.scrollSection[this.scrollMotion.currentIndex].scrollHeight;
                // console.log(`${this.scrollMotion.currentIndex} scrollRatio`, scrollRatio);

                stickyEl.parentElement.style.alignItems = 'flex-start';

                if (scrollRatio <= 0.82) {
                    stickyEl.style.width = `${this.scrollMotion.calcValues(stickyScaleWidth, currentYOffset)}%`;
                    stickyEl.style.height = `${this.scrollMotion.calcValues(stickyScaleHeight, currentYOffset)}vh`;
                    stickyEl.style.willChange = 'transform, width, height';
                    stickyEl.style.transformStyle = 'preserve-3d';
                }    
            }else if(currentIndex === 8){
                const stickyEl = this.scrollMotion.currentScene.querySelector('.monthly__cover-img');
                const stickyItem = stickyEl.querySelector('.monthly__img-item');
                const stickyTransform = JSON.parse(stickyItem.dataset.transform);

                if(!this.absTop2){
                    this.absTop2 = this.scrollMotion.yOffset + this.scrollMotion.currentScene.getBoundingClientRect().top;
                }

                let currentYOffset = (this.scrollMotion.yOffset + this.scrollMotion.defaults.threshold) - this.absTop2;
                let scrollRatio = currentYOffset / this.scrollMotion.scrollSection[this.scrollMotion.currentIndex].scrollHeight;
                // console.log(`${this.scrollMotion.currentIndex} scrollRatio`, scrollRatio);

                if (scrollRatio <= 0.26) {
                    stickyItem.style.transform = `translate3d(0px, -${this.scrollMotion.calcValues(stickyTransform, currentYOffset)}%, 0px)`;
                    stickyItem.style.willChange = 'transform, opacity';
                    stickyItem.style.transformStyle = 'preserve-3d';
                }
  
                const prevStickyEl = this.scrollMotion.scrollSection[this.scrollMotion.currentIndex-1].querySelector('.monthly__cover-img');
                if(prevStickyEl){
                    prevStickyEl.parentElement.style.alignItems = 'flex-end';
                    prevStickyEl.style.width = '100%';
                    prevStickyEl.style.height = '100vh';
                }
            }else if(currentIndex === 9){
                if(this.scrollMotion.currentScene.querySelector('.arrow-svg').classList.contains('show-in')){
                    const lineSvg = this.scrollMotion.currentScene.querySelector('.arrow-svg .line');
                    this.scrollMotion.playSvgAnimation(lineSvg, {repeat: false});

                    if(parseInt(window.getComputedStyle(lineSvg.querySelector('.path')).strokeDashoffset) < 1){
                        const arrowSvg = this.scrollMotion.currentScene.querySelector('.arrow-svg .arrow');
                        this.scrollMotion.playSvgAnimation(arrowSvg, {repeat: false});    
                    }
                }
            }
        });
    }

    attachEvents(){
        let that = this;
        let scrollRate = null;
        let scrollDepth = [25, 50, 75, 100];

        window.addEventListener('scroll', (e) => {
            window.dataLayer = window.dataLayer || [];
            let scrollRatio = (this.scrollMotion.yOffset / document.documentElement.scrollHeight) * 100;
            scrollDepth.map((depth) => {
                if(depth == scrollRatio.toFixed(0)){
                    console.log('scrolled....');
                    if(scrollRate !== depth){
                        dataLayer.push({
                            event: "custom_event_microsite",
                            "dynamic_param1": "custom_event",
                            "dynamic_param2": "MonthlyLG4",
                            "dynamic_param3": `Scroll Depth ${depth}%`,
                            "dynamic_param4": "",
                            "dynamic_param5": ""
                        });                          
                    }
                    scrollRate = depth;
                }
            });
        });
        window.addEventListener('resize', this.resize.bind(this));

        const monthlyVod = document.querySelectorAll('.monthly-vod');
        monthlyVod.length && [...monthlyVod].forEach((vod) => {
            that.setVodEvents(vod);
        })
    }

    update(){
        const monthlyVod = document.querySelectorAll('.monthly-vod');
        monthlyVod.length && [...monthlyVod].forEach((vod) => {
            this.updatePoster(vod);
        })
    }

    updatePoster(monthlyVideo){
        const video = monthlyVideo.querySelector('video');
        let posterImg = isMobile() ? video.getAttribute('poster').split('.png')[0] : video.getAttribute('poster').split('_mo')[0];
        if(isMobile()){
            video.setAttribute('poster', `${posterImg}_mo.png`);
        }else{
            video.setAttribute('poster', `${posterImg}.png`);
        }
    }

    setVodEvents(monthlyVideo){
        const video = monthlyVideo.querySelector('video');
        const playBtn = monthlyVideo.querySelector('.vod-play-btn');
        const ctaImgSrc = !!playBtn && playBtn.querySelector('img').src;        
        const posterImg = video.getAttribute('poster').split('.')[0];

        if(isMobile()){
            video.setAttribute('poster', `${posterImg}_mo.png`);
        }

        if(video.paused){
            monthlyVideo.classList.add('active');
        }

        monthlyVideo.addEventListener('mouseover', () => {
            !video.paused && monthlyVideo.classList.add('active');
        });
        monthlyVideo.addEventListener('mouseleave', () => {
            !video.paused && monthlyVideo.classList.remove('active');
        });
        playBtn.addEventListener('click', () => {           
            video.paused ? this.playVideo(video) : this.pauseVideo(video);

            if(isMobile()){
                setTimeout(() => {
                    monthlyVideo.classList.remove('active');
                }, 1500);
            }
        });
        // video.addEventListener('touchstart', () => {
        //     if(video.paused && monthlyVideo.classList.contains('active')) return false;
            
        //     monthlyVideo.classList.add('active');
        //     setTimeout(() => {
        //         monthlyVideo.classList.remove('active');
        //     }, 1500);
        // });

        video.onplay = (e) => {
            const srcStatus = ctaImgSrc.replace('play', 'pause');
            playBtn.querySelector('img').src = srcStatus;
            playBtn.querySelector('img').alt = 'pause';
        }
        video.onpause = (e) => {
            const srcStatus = ctaImgSrc.replace('pause', 'play');
            playBtn.querySelector('img').src = srcStatus;
            playBtn.querySelector('img').alt = 'play';
        }        
    }    

    resize () {
        if (isDesktop() && this.mobileFlag === true) {
            this.desktopFlag = true;
            this.mobileFlag = false;
            this.update();
            // console.log('desktop resize...');
        } else if (isMobile() && this.desktopFlag === true) {
            this.desktopFlag = false;
            this.mobileFlag = true;
            this.update();
            // console.log('mobile resize...');
        }
    }

    setSwiper(){
        [...hasElementsNum('.monthly-carousel')].forEach((el) => {
            const galleryCarousel = new Swiper(el, {
                loop: true,
                lazy: true,
                pagination: {
                    el: el.querySelector('.swiper-pagination'),
                    type: "fraction"
                },
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                },            
                on: {
                    init: function(){
                        const mobileSlide = el.querySelectorAll('.monthly__mobile');
                        (isMobile() && mobileSlide.length) && [...mobileSlide].forEach((slide) => {
                            slide.classList.add('swiper-slide');
                            this.update();
                        });                
                    },
                    sliderFirstMove: function(e){
                        const clickEvent = new Event('click');
                        const layerWrap = document.querySelector('.monthly-gallery-spot-layer.is-active');
                        layerWrap && layerWrap.querySelector('.monthly-gallery-spot-layer__close').dispatchEvent(clickEvent);
                    }
                }
            });
        });
    }

    setObserver(){  
        // 레이지로드 관찰
        this.imgSelector.length && [...this.imgSelector].forEach((selector) => {
            let config = {
                rootMargin: `0px 0px ${window.innerHeight}px 0px`, 
                threshold: 0                
            };
            callByObserver({target: selector, showCallback: this.setLazyload, keepObserver:false, options:config });
        });  
  
        // 동영상 관찰
        [...hasElementsNum('[data-observe]')].forEach((video) => {
           callByObserver({target: video, showCallback: this.playVideo, hideCallback: this.pauseVideo, keepObserver:true, options:{ rootMargin: '0px 0px 50px 0px', threshold: 0.4 } });
        });
     }

    setLazyload(image){
        image.src = image.dataset.src        
    }
  
     // 동영상 재생
    playVideo(video){
        const isPaused = video.paused;
        const videoSrc = video.querySelector('source');
  
        if (!videoSrc.getAttribute('src').length) {
           videoSrc.setAttribute('src', videoSrc.dataset.src);
  
           video.load();
           video.dataset.loaded = true
        }
  
        // 일시 정지 상태이면 영상을 실행한다
        isPaused && video.play();
    }
  
     // 동영상 일시정지
    pauseVideo(video){
        const isPaused = video.paused;
  
        if (!isPaused) {
           // 재생중이면 영상을 일시정지 한다.
           video.pause();
        }
    }    
}

window.scrollIndex = new ScrollIndex(
    '.monthly__container',
    '.monthly__scroll-section',
    '[data-effect]',
    { threshold: 0.95 }
);