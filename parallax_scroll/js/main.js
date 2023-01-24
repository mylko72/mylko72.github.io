const ui = {};

((_ui) => {
    const sceneInfo = [
        {
            // 0
            type: 'sticky',
            heightNum: 8, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-section-0 .main-message.a'),
                messageB: document.querySelector('#scroll-section-0 .main-message.b'),     
                messageC: document.querySelector('#scroll-section-0 .main-message.c'),     
                messageD: document.querySelector('#scroll-section-0 .main-message.d'),       
                bgMain: document.querySelector('#scroll-section-0 .bg-main'),                                          
                canvas: document.querySelector('#video-canvas-0'),
                context: document.querySelector('#video-canvas-0').getContext('2d'),
                videoImages: []
            },
            values: {
                videoImageCount:211,        // 비디오에서 추출한 이미지 갯수
                imageSequence: [0, 210],    // 재생할 이미지시퀀스 배열
                canvas_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
                canvas_opacity_out: [1, 0, { start: 0.9, end: 1 }],   
                messageA_opacity_out: [1, 0, { start: 0.35, end: 0.4 }],
                messageA_translateY_out: [0, -20, { start: 0.35, end: 0.4 }],                
				messageB_opacity_in: [0, 1, { start: 0.45, end: 0.52 }],
				messageB_translateY_in: [30, 0, { start: 0.45, end: 0.52 }],
				messageB_opacity_out: [1, 0, { start: 0.55, end: 0.6 }],                
				messageB_translateY_out: [0, -20, { start: 0.55, end: 0.6 }],                
				messageC_opacity_in: [0, 1, { start: 0.65, end: 0.72 }],     
				messageC_translateY_in: [30, 0, { start: 0.65, end: 0.72 }],                           
				messageC_opacity_out: [1, 0, { start: 0.75, end: 0.8 }],    
				messageC_translateY_out: [0, -20, { start: 0.75, end: 0.8 }],   
				messageD_opacity_in: [0, 1, { start: 0.85, end: 0.92 }],     
				messageD_translateY_in: [30, 0, { start: 0.85, end: 0.92}],                           
				messageD_opacity_out: [1, 0, { start: 0.95, end: 0.99 }],    
				messageD_translateY_out: [0, -20, { start: 0.95, end: 0.99 }],                                                                
            }           
        },
        {
            // 1
            type: 'normal',
            heightNum: 5, // type normal에서는 필요 없음
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-1'),
                content: document.querySelector('#scroll-section-1 .content')
            }
        },
        {
            // 2
            type: 'sticky',
            heightNum: 4,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-2'),
                messageA: document.querySelector('#scroll-section-2 .main-message.a'),
                messageB: document.querySelector('#scroll-section-2 .main-message.b'),     
                messageC: document.querySelector('#scroll-section-2 .main-message.c'),     
                messageD: document.querySelector('#scroll-section-2 .main-message.d'),                       
            },
			values: {
				messageA_translateY_in: [100, 0, { start: 0, end: 0.25 }],
				messageB_translateY_in: [100, 0, { start: 0, end: 0.25 }],
				messageC_translateY_in: [100, 0, { start: 0, end: 0.25 }],
                messageD_translateY_in: [100, 0, { start: 0, end: 0.25 }],
				messageA_translateY_out: [0, -100, { start: 0.7, end: 1 }],
				messageB_translateY_out: [0, -100, { start: 0.7, end: 1 }],
				messageC_translateY_out: [0, -100, { start: 0.7, end: 1 }],
                messageD_translateY_out: [0, -100, { start: 0.7, end: 1 }],
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
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.content.offsetHeight;
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

            number = i < 10 ? `00${i}` : i>=10&&i<100 ? `0${i}` : i;

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

        console.log('scrollRatio', scrollRatio)
    
        switch (currentScene) {
            case 0:
                // console.log('0 play');

                let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
                objs.context.drawImage(objs.videoImages[sequence], 0, 0);  
                

                if (scrollRatio <= 0.22) {
                    // in
                    objs.canvas.parentElement.style.opacity = calcValues(values.canvas_opacity_in, currentYOffset);
                //     objs.messageA.style.transform = `translate3d(0, ${calcValues(values. messageA_translateY_in, currentYOffset)}%, 0)`;
                }else{                                      
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
                }

				if (scrollRatio <= 0.53) {
					// in
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.73) {
					// in
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
				}  
                
				if (scrollRatio <= 0.93) {
					// in
					objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
					objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
					objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
				}                   
                
				if (scrollRatio > 0.87) {
					// out
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentYOffset);
 				}                
                break;
    
            case 1:
                // console.log('2 play');  
                sceneInfo[2].objs.container.querySelectorAll('.main-message').forEach((message) => {
                    message.classList.remove('sticky-elem')
                })
                break;
            case 2:
                // console.log('3 play');
                let mainMessage = sceneInfo[2].objs.container.querySelectorAll('.main-message');
                mainMessage.forEach((message) => {
                    message.classList.add('sticky-elem')
                })

			    if (scrollRatio > 0.74) {
					// in
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}vh, 0)`;
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}vh, 0)`;
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}vh, 0)`;
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}vh, 0)`;		
                }else{
                    // out
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}vh, 0)`;
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}vh, 0)`;
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}vh, 0)`;
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}vh, 0)`;		
                }

                if(scrollRatio < 0.1){
                    objs.messageA.style.color = '#5c6278';
                }else if(scrollRatio >= 0.1 && scrollRatio < 0.34) {
					objs.messageA.style.color = '#fff';
					objs.messageB.style.color = '#5c6278';
					objs.messageC.style.color = '#5c6278';
					objs.messageD.style.color = '#5c6278';                    
				} else if(scrollRatio >= 0.35 && scrollRatio < 0.49) {
					objs.messageA.style.color = '#5c6278';
					objs.messageB.style.color = '#fff';
					objs.messageC.style.color = '#5c6278';
                    objs.messageD.style.color = '#5c6278';
				} else if(scrollRatio >= 0.5 && scrollRatio < 0.64) {
					objs.messageA.style.color = '#5c6278';
					objs.messageB.style.color = '#5c6278';
					objs.messageC.style.color = '#fff';
                    objs.messageD.style.color = '#5c6278';
				}else if(scrollRatio >= 0.65){
					objs.messageA.style.color = '#5c6278';
					objs.messageB.style.color = '#5c6278';
					objs.messageC.style.color = '#5c6278';
                    objs.messageD.style.color = '#fff';
				}

				// let stTimer2 = setTimeout(() => {
				// 	objs.messageA.style.transition = 'all 1s';
				// 	objs.messageB.style.transition = 'all 1s';
				// 	objs.messageC.style.transition = 'all 1s';
				// 	clearTimeout(stTimer2);
				// }, 500)

                break;
        }
    }

    window.addEventListener('load', () => {
        setLayout(); // 중간에 새로고침 시, 콘텐츠 양에 따라 높이를 세팅하도록 실행
        sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);
        sceneInfo[0].objs.messageA.classList.add('show');
    })

    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset;
        scrollLoop();
    });

    window.addEventListener('resize', setLayout);

    setLayout();
    setCanvasImages();

  })(ui);