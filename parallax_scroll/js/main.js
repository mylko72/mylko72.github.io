const ui = {};

((_ui) => {
    const sceneInfo = [
        {
            // 0
            type: 'sticky',
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-section-0 .main-message.a'),
                canvas: document.querySelector('#video-canvas-0'),
                context: document.querySelector('#video-canvas-0').getContext('2d'),
                videoImages: []
            },
            values: {
                videoImageCount:211,        // 비디오에서 추출한 이미지 갯수
                imageSequence: [0, 210],    // 재생할 이미지시퀀스 배열
                messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
                messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
                messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
                messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
            }
        },
        {
            // 1
            type: 'sticky',
            heightNum: 5, // type normal에서는 필요 없음
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-1'),
            }
        },
        {
            // 2
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-2'),
            },
        },
        {
            // 3
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-3'),
            }
        }
    ];

    let yOffset = 0; // window.pageYOffset 대신 쓸 변수
    let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
    let currentScene = 0; // 현재 활성화된 Scene(scroll-section)
    let enterNewScene = false; // 새로운 scene이 시작된 순간 true

    function setLayout() {
        // 각 스크롤 섹션의 높이 세팅
        for (let i = 0; i < sceneInfo.length; i++) {
            if (sceneInfo[i].type === 'sticky') {
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            } else if (sceneInfo[i].type === 'normal') {
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.content.offsetHeight + window.innerHeight * 0.5;
            }
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
        }

        yOffset = window.pageYOffset;

        let totalScrollHeight = 0;
        for (let i = 0; i < sceneInfo.length; i++) {
            totalScrollHeight += sceneInfo[i].scrollHeight;
            //totalScrollHeight가 현재 스크롤 위치(window.pageYOffset)보다 클때가 현재 활성화된 스크롤 섹션
            if (totalScrollHeight >= yOffset) {
                currentScene = i;
                break;
            }
        }
        document.body.setAttribute('id', `show-scene-${currentScene}`);   
        
        const heightRatio = window.innerHeight / 1080;
        sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
    }

    function setCanvasImages(){
        let imgElem;
        let number;
        for(let i=0; i<sceneInfo[0].values.videoImageCount; i++){
            imgElem = new Image();
            if(i<10){
                number = `00${i}`;
            }else if(i>=10&&i<100){
                number = `0${i}`;
            }else{
                number = i;
            }
            imgElem.src = `./images/through_the_night_00${number}-min.jpg`;
            sceneInfo[0].objs.videoImages.push(imgElem);
        }
    }

    function scrollLoop() {
        enterNewScene = false;
        prevScrollHeight = 0;	
        for (let i = 0; i < currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }
        // console.log('prevScrollHeight', prevScrollHeight);

        // 현재 스크롤 위치가 이전 스크롤 높이와 현재 스크롤 섹션의 높이를 더한 값보다 클 때 currentScene은  증가
        if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {   
            enterNewScene = true;
            currentScene++
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }
    
        // 스크롤 위치가 이전 스크롤 높이보다 작아지면 currentScene은 감소
        if (yOffset < prevScrollHeight) {
            enterNewScene = true;
           // 브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지(모바일)
           if (currentScene === 0) return;
           currentScene--;
           document.body.setAttribute('id', `show-scene-${currentScene}`);
        }  

        console.log(`현재 스크롤섹션은 ${currentScene}`)

        if (enterNewScene) return;

        playAnimation();
    }

    function calcValues(props, currentYOffset){
        let rv;

        //현재 스크롤섹션에서 스크롤된 범위를 비율로 구하기
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;

        // props의 타이밍속성이 3번째 있는지 분기처리
        if (props.length === 3) {
            // start ~ end 사이에 애니메이션 실행
            const partScrollStart = props[2].start * scrollHeight;
            const partScrollEnd = props[2].end * scrollHeight;
            const partScrollHeight = partScrollEnd - partScrollStart;

            if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
                rv = (currentYOffset - partScrollStart) / partScrollHeight * (props[1] - props[0]) + props[0];
            } else if (currentYOffset < partScrollStart) {
                rv = props[0];
            } else if (currentYOffset > partScrollEnd) {
                rv = props[1];
            }
        } else {
            // scrollRatio는 0에서 1까지이며 전달된 props의 값에 따라 비율에 따른 범위를 구하는 공식
            rv = scrollRatio * (props[1] - props[0]) + props[0];
        }
    
        return rv
    }

    function playAnimation() {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset - prevScrollHeight;
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;
    
        switch (currentScene) {
            case 0:
                // console.log('0 play');
                let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
                objs.context.drawImage(objs.videoImages[sequence], 0, 0);

                if (scrollRatio <= 0.22) {
                    // in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values. messageA_translateY_in, currentYOffset)}%, 0)`;
                }else{
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
                }
                
                break;
    
            case 1:
                // console.log('2 play');
                break;
    
            case 2:
                // console.log('3 play');
                break;
        }
    }

    window.addEventListener('load', () => {
        setLayout(); // 중간에 새로고침 시, 콘텐츠 양에 따라 높이를 세팅하도록 실행
        sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);
    })

    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset;
        scrollLoop();
    });

    window.addEventListener('resize', setLayout);

    setLayout();
    setCanvasImages();

  })(ui);