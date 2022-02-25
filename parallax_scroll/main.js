(() => {

	let yOffset = 0; // window.pageYOffset 대신 쓸 변수
	let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
	let currentScene = 0; // 현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)
	let enterNewScene = false; // 새로운 scene이 시작된 순간 true
	let acc = 0.2;
	let delayedYOffset = 0;
	let rafId;
	let rafState;
    const scrollElem = document.querySelector('.status_info .scroll');
    const sceneElem = document.querySelector('.status_info .scene');
    const ratioElem = document.querySelector('.status_info .ratio');

	const sceneInfo = [
        {
            // scene 0
            type: 'normal',
            scrollHeight: 0,        
			objs: {
				container: null
            },
        },
		{
			// scene 1
			type: 'sticky',
			heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
			scrollHeight: 0,
			objs: {
				container: null
            },
			values: {
				messageA_opacity_in: [0, 1, { start: 0.05, end: 0.2 }],
                messageA_translateY_in: [50, 0, { start: 0.05, end: 0.2 }],
                messageA_opacity_out: [1, 0, { start: 0.25, end: 0.7 }],
                messageA_translateY_out: [0, -400, { start: 0.25, end: 0.7 }],

				messageB_opacity_in: [0, 1, { start: 0.4, end: 0.5 }],
                messageB_translateY_in: [50, 0, { start: 0.4, end: 0.5 }],
                messageB_opacity_out: [1, 0, { start: 0.55, end: 0.7 }],
                messageB_translateY_out: [0, -120, { start: 0.55, end: 0.7 }],

				imgThumb_opacity_in: [0, 1, { start: 0.6, end: 0.7 }],
                boxA_translateY_in: [10, 0, { start: 0.6, end: 0.7 }],
				boxB_translateY_in: [-10, 0, { start: 0.6, end: 0.7 }],
			}
		},
		{
			// scene 2
			type: 'sticky',
			heightNum: 3, // type normal에서는 필요 없음
			scrollHeight: 0,
			objs: {
				container: null,
			},
			values: {
				messageA_translateY_in: [100, 0, { start: 0, end: 0.25 }],
				messageB_translateY_in: [100, 0, { start: 0, end: 0.25 }],
				messageC_translateY_in: [100, 0, { start: 0, end: 0.25 }],
				messageA_translateY_out: [0, -100, { start: 0.35, end: 1 }],
				messageB_translateY_out: [0, -100, { start: 0.35, end: 1 }],
				messageC_translateY_out: [0, -100, { start: 0.35, end: 1 }],
			},
			values2: {
				messageA_translateY_in: [100, 50, { start: 0, end: 0.5 }],
				messageB_translateY_in: [100, 50, { start: 0, end: 0.5 }],
				messageC_translateY_in: [100, 50, { start: 0, end: 0.5 }],
				messageA_translateY_out: [50, 0, { start: 0.6, end: 1 }],
				messageB_translateY_out: [50, 0, { start: 0.6, end: 1 }],
				messageC_translateY_out: [50, 0, { start: 0.6, end: 1 }],
			}
		},
		{
			// scene 3
			type: 'sticky',
			heightNum: 10,
			scrollHeight: 0,
			objs: {
				container: null
            },
			values: {
                imgPhoneA_translateY_in: [0, -86, { start: 0.02, end: 0.15 }],
				imgPhoneA_translateY_out: [-86, -200, { start: 0.3, end: 0.4 }],
				messageA_opacity_in: [0, 1, { start: 0.15, end: 0.2 }],
                messageA_translateX_in: [-50, 0, { start: 0.15, end: 0.2 }],
                messageA_translateY_out: [0, -100, { start: 0.3, end: 0.4 }],
				messageB_opacity_in: [0, 1, { start: 0.15, end: 0.2 }],
                messageB_translateX_in: [50, 0, { start: 0.15, end: 0.2 }],
                messageB_translateY_out: [0, -100, { start: 0.3, end: 0.4 }],
				descA_opacity_in: [0, 1, { start: 0.22, end: 0.25 }],
                descA_translateY_in: [50, 0, { start: 0.22, end: 0.25 }],
				descA_translateY_in: [0, -100, { start: 0.3, end: 0.4 }],

                imgPhoneB_translateY_in: [0, -86, { start: 0.32, end: 0.45 }],
				imgPhoneB_translateY_out: [-86, -200, { start: 0.7, end: 0.8 }],
				messageC_opacity_in: [0, 1, { start: 0.45, end: 0.5 }],
                messageC_translateX_in: [-50, 0, { start: 0.45, end: 0.5 }],
                messageC_translateY_out: [0, -100, { start: 0.7, end: 0.8 }],
				messageD_opacity_in: [0, 1, { start: 0.45, end: 0.5 }],
                messageD_translateX_in: [50, 0, { start: 0.45, end: 0.5 }],
                messageD_translateY_out: [0, -100, { start: 0.7, end: 0.8 }],
				descB_opacity_in: [0, 1, { start: 0.52, end: 0.55 }],
                descB_translateY_in: [50, 0, { start: 0.52, end: 0.55 }],
				descB_translateY_in: [0, -100, { start: 0.7, end: 0.8 }],                

                imgPhoneC_translateY_in: [0, -40, { start: 0.55, end: 0.68 }],
				imgPhoneC_translateY_out: [-40, -200, { start: 0.7, end: 0.85 }],

                imgPhoneD_translateY_in: [0, -2, { start: 0.68, end: 0.7 }],
				imgPhoneD_translateY_out: [-2, -175, { start: 0.7, end: 0.85 }],
            }
		},
		{
			// scene 4
			type: 'sticky',
			heightNum: 5,
			scrollHeight: 0,
			objs: {
				container: null
			},
			values: {
                imgPhoneA_translateY_in: [0, -86, { start: 0.02, end: 0.15 }],
				imgPhoneA_translateY_out: [-86, -200, { start: 0.55, end: 0.7 }],
				messageA_opacity_in: [0, 1, { start: 0.15, end: 0.2 }],
                messageA_translateX_in: [-50, 0, { start: 0.15, end: 0.2 }],
                messageA_translateY_out: [0, -100, { start: 0.55, end: 0.7 }],
				messageB_opacity_in: [0, 1, { start: 0.15, end: 0.2 }],
                messageB_translateX_in: [50, 0, { start: 0.15, end: 0.2 }],
                messageB_translateY_out: [0, -100, { start: 0.55, end: 0.7 }],
				descA_opacity_in: [0, 1, { start: 0.22, end: 0.25 }],
                descA_translateY_in: [50, 0, { start: 0.22, end: 0.25 }],
				descA_translateY_in: [0, -100, { start: 0.55, end: 0.7 }],
				imgMenuList_opacity_in: [0, 1, { start: 0.22, end: 0.25 }],
                imgMenuList_translateX_in: [0, -50, { start: 0.3, end: 0.5 }],                
			}
		},
		{
			// scene 5
			type: 'sticky',
			heightNum: 8,
			scrollHeight: 0,
			objs: {
				container: null
			},
			values: {
				messageA_opacity_in: [0, 1, { start: 0.05, end: 0.1 }],
                messageA_translateY_in: [50, 0, { start: 0.05, end: 0.1 }],
				openProcessA_opacity_in: [0, 1, { start: 0.12, end: 0.15 }],
                openProcessA_translateY_in: [50, 0, { start: 0.12, end: 0.15 }],
                lineA_width_in: [0, 200, { start: 0.18, end: 0.22 }],
				openProcessB_opacity_in: [0, 1, { start: 0.22, end: 0.25 }],
                openProcessB_translateY_in: [50, 0, { start: 0.22, end: 0.25 }],
                lineB_width_in: [0, 200, { start: 0.28, end: 0.32 }],
				openProcessC_opacity_in: [0, 1, { start: 0.32, end: 0.35 }],
                openProcessC_translateY_in: [50, 0, { start: 0.32, end: 0.35 }],
                lineC_width_in: [0, 200, { start: 0.38, end: 0.42 }],
				openProcessD_opacity_in: [0, 1, { start: 0.42, end: 0.45 }],
                openProcessD_translateY_in: [50, 0, { start: 0.42, end: 0.45 }],
                lineD_width_in: [0, 200, { start: 0.48, end: 0.52 }],      
			}
		}        
	];

	function checkMenu() {
		if (yOffset > 44) {
			document.body.classList.add('local-nav-sticky');
		} else {
			document.body.classList.remove('local-nav-sticky');
		}
	}

    function setObject(){
        sceneInfo.forEach((scene, i) => {
            scene.objs.container = document.querySelector('.scroll-section-'+i);

            if(scene.type === 'normal'){
                scene.objs.content = document.querySelector('.scroll-section-'+i+'.normal_elem');
            }

            if(i == 1){
                scene.objs.messageA = scene.objs.container.querySelector('.main_message.a');
                scene.objs.messageB = scene.objs.container.querySelector('.main_message.b');
                scene.objs.imgThumb = scene.objs.container.querySelector('.img_thumb');
                scene.objs.boxA = scene.objs.container.querySelector('.img_thumb .box.left');
                scene.objs.boxB = scene.objs.container.querySelector('.img_thumb .box.right');
            }
            if(i == 2){
                scene.objs.messageA = scene.objs.container.querySelector('.main_message.a');
                scene.objs.messageB = scene.objs.container.querySelector('.main_message.b');
                scene.objs.messageC = scene.objs.container.querySelector('.main_message.c');
            }            
            if(i == 3){
                scene.objs.imgPhoneA = scene.objs.container.querySelector('.img_phone.a');
                scene.objs.imgPhoneB = scene.objs.container.querySelector('.img_phone.b');
                scene.objs.imgPhoneC = scene.objs.container.querySelector('.img_phone.c');
                scene.objs.imgPhoneD = scene.objs.container.querySelector('.img_phone.d');              
                scene.objs.messageA = scene.objs.container.querySelector('.main_message.a');
                scene.objs.messageB = scene.objs.container.querySelector('.main_message.b');
                scene.objs.messageC = scene.objs.container.querySelector('.main_message.c');
                scene.objs.messageD = scene.objs.container.querySelector('.main_message.d');
                // scene.objs.descA = scene.objs.container.querySelector('.desc_message.a');
                // scene.objs.descB = scene.objs.container.querySelector('.main_message.b');
            }   
            if(i == 4){
                scene.objs.imgPhoneA = scene.objs.container.querySelector('.img_phone.a');
                scene.objs.imgMenuList = scene.objs.container.querySelector('.img_menu_list');
                scene.objs.messageA = scene.objs.container.querySelector('.main_message.a');
                scene.objs.messageB = scene.objs.container.querySelector('.main_message.b');
                // scene.objs.descA = scene.objs.container.querySelector('.desc_message.a');
            }               
            if(i == 5){             
                scene.objs.messageA = scene.objs.container.querySelector('.main_message');
                scene.objs.openProcessA = scene.objs.container.querySelector('.openning_process.a');
                scene.objs.lineA = scene.objs.container.querySelector('.openning_process.a .line');
                scene.objs.openProcessB = scene.objs.container.querySelector('.openning_process.b');
                scene.objs.lineB = scene.objs.container.querySelector('.openning_process.b .line');
                scene.objs.openProcessC = scene.objs.container.querySelector('.openning_process.c');
                scene.objs.lineC = scene.objs.container.querySelector('.openning_process.c .line');
                scene.objs.openProcessD = scene.objs.container.querySelector('.openning_process.d');
                scene.objs.lineD = scene.objs.container.querySelector('.openning_process.d .line');
            }                 
        })
    }

	function setLayout() {
		// 각 스크롤 섹션의 높이 세팅
		sceneInfo.forEach((scene, i) => {
            if(scene.type === 'sticky'){
                scene.scrollHeight = scene.heightNum * window.innerHeight;
            }else if(scene.type === 'normal'){
                scene.scrollHeight = scene.objs.container.offsetHeight;
            }
            scene.objs.container.style.height = `${scene.scrollHeight}px`;
        });

		yOffset = window.pageYOffset + window.innerHeight/2;

		let totalScrollHeight = 0;
		for (let i = 0; i < sceneInfo.length; i++) {
			totalScrollHeight += sceneInfo[i].scrollHeight;
			if (totalScrollHeight >= yOffset) {
				currentScene = i;
				break;
			}
		}
		document.body.setAttribute('id', `show-scene-${currentScene}`);

        showStatus();
	}

	function calcValues(values, currentYOffset) {
		let rv;
		// 현재 씬(스크롤섹션)에서 스크롤된 범위를 비율로 구하기
		const scrollHeight = sceneInfo[currentScene].scrollHeight;
		const scrollRatio = currentYOffset / scrollHeight;

		if (values.length === 3) {
			// start ~ end 사이에 애니메이션 실행
			const partScrollStart = values[2].start * scrollHeight;
			const partScrollEnd = values[2].end * scrollHeight;
			const partScrollHeight = partScrollEnd - partScrollStart;

			if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
				rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
			} else if (currentYOffset < partScrollStart) {
				rv = values[0];
			} else if (currentYOffset > partScrollEnd) {
				rv = values[1];
			}
		} else {
			rv = scrollRatio * (values[1] - values[0]) + values[0];
		}

		return rv;
	}

	function playAnimation() {
		const objs = sceneInfo[currentScene].objs;
		const values = sceneInfo[currentScene].values;
		const currentYOffset = yOffset - prevScrollHeight;
		const scrollHeight = sceneInfo[currentScene].scrollHeight;
		const scrollRatio = currentYOffset / scrollHeight;

		ratioElem.textContent = scrollRatio;

		switch (currentScene) {
			case 0:
				console.log('0 play');
				break;

			case 1:
				console.log('1 play');
				if (scrollRatio <= 0.22) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					//objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.52) {
					// in
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					//objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.72) {
					// in
					objs.imgThumb.style.opacity = calcValues(values.imgThumb_opacity_in, currentYOffset);
					objs.boxA.style.transform = `translate3d(0, ${calcValues(values.boxA_translateY_in, currentYOffset)}%, 0)`;
					objs.boxB.style.transform = `translate3d(0, ${calcValues(values.boxB_translateY_in, currentYOffset)}%, 0)`;
					objs.boxA.classList.remove('show');
					objs.boxB.classList.remove('show');
				} else {
					// out
					objs.boxA.classList.add('show');
					objs.boxB.classList.add('show');
				}

				break;

			case 2:
				console.log('2 play');
				if (scrollRatio < 0.27) {
					// in
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}vh, 0)`;
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}vh, 0)`;
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}vh, 0)`;
				} else {
					// out
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}vh, 0)`;
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}vh, 0)`;
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}vh, 0)`;
				}

				if (scrollRatio < 0.17) {
					objs.messageA.style.color = '#5c6278';
					objs.messageB.style.color = '#5c6278';
					objs.messageC.style.color = '#5c6278';
				} else if(scrollRatio >= 0.18 && scrollRatio < 0.34) {
					objs.messageA.style.color = '#fff';
					objs.messageB.style.color = '#5c6278';
					objs.messageC.style.color = '#5c6278';
				} else if(scrollRatio >= 0.35 && scrollRatio < 0.49) {
					objs.messageA.style.color = '#5c6278';
					objs.messageB.style.color = '#fff';
					objs.messageC.style.color = '#5c6278';
				} else if(scrollRatio >= 0.5 && scrollRatio < 0.64) {
					objs.messageA.style.color = '#5c6278';
					objs.messageB.style.color = '#5c6278';
					objs.messageC.style.color = '#fff';
				}else if(scrollRatio >= 0.65){
					objs.messageA.style.color = '#5c6278';
					objs.messageB.style.color = '#5c6278';
					objs.messageC.style.color = '#5c6278';
				}

				let stTimer2 = setTimeout(() => {
					objs.messageA.style.transition = 'all 1s';
					objs.messageB.style.transition = 'all 1s';
					objs.messageC.style.transition = 'all 1s';
					clearTimeout(stTimer2);
				}, 500)

				break;

			case 3:
				console.log('3 play');

				if (scrollRatio <= 0.25) {
					// in
					objs.imgPhoneA.style.transform = `translate3d(0, ${calcValues(values.imgPhoneA_translateY_in, currentYOffset)}vh, 0)`;
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateX_in, currentYOffset)}%, 0)`;
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateX_in, currentYOffset)}%, 0)`;
					// objs.descA.style.opacity = calcValues(values.descA_opacity_in, currentYOffset);
					// objs.descA.style.transform = `translate3d(0, ${calcValues(values.descA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.imgPhoneA.style.transform = `translate3d(0, ${calcValues(values.imgPhoneA_translateY_out, currentYOffset)}vh, 0)`;
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}vh, 0)`;
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}vh, 0)`;
					// objs.descA.style.transform = `translate3d(0, ${calcValues(values.descA_translateY_out, currentYOffset)}%, 0)`;
				}
				if (scrollRatio <= 0.55) {
					// in
					objs.imgPhoneB.style.transform = `translate3d(0, ${calcValues(values.imgPhoneB_translateY_in, currentYOffset)}vh, 0)`;
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateX_in, currentYOffset)}%, 0)`;
					objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
					objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateX_in, currentYOffset)}%, 0)`;
					// objs.descB.style.opacity = calcValues(values.descB_opacity_in, currentYOffset);
					// objs.descB.style.transform = `translate3d(0, ${calcValues(values.descB_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.imgPhoneB.style.transform = `translate3d(0, ${calcValues(values.imgPhoneB_translateY_out, currentYOffset)}vh, 0)`;
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}vh, 0)`;
					objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}vh, 0)`;
					// objs.descB.style.transform = `translate3d(0, ${calcValues(values.descB_translateY_out, currentYOffset)}%, 0)`;
				}
				if (scrollRatio <= 0.69) {
					// in
					objs.imgPhoneC.style.transform = `translate3d(0, ${calcValues(values.imgPhoneC_translateY_in, currentYOffset)}vh, 0)`;
				}else{
					// out
					objs.imgPhoneC.style.transform = `translate3d(0, ${calcValues(values.imgPhoneC_translateY_out, currentYOffset)}vh, 0)`;
				}
				if (scrollRatio <= 0.7) {
					// in
					objs.imgPhoneD.style.transform = `translate3d(0, ${calcValues(values.imgPhoneD_translateY_in, currentYOffset)}vh, 0)`;
				}else{
					// out
					objs.imgPhoneD.style.transform = `translate3d(0, ${calcValues(values.imgPhoneD_translateY_out, currentYOffset)}vh, 0)`;
				}
				break;

			case 4:
				console.log('4 play');

				if (scrollRatio <= 0.25) {
					// in
					objs.imgPhoneA.style.transform = `translate3d(0, ${calcValues(values.imgPhoneA_translateY_in, currentYOffset)}vh, 0)`;
				} else {
					// out
					objs.imgPhoneA.style.transform = `translate3d(0, ${calcValues(values.imgPhoneA_translateY_out, currentYOffset)}vh, 0)`;
				}
				if (scrollRatio <= 0.27) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateX_in, currentYOffset)}%, 0)`;
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateX_in, currentYOffset)}%, 0)`;
					// objs.descA.style.opacity = calcValues(values.descA_opacity_in, currentYOffset);
					// objs.descA.style.transform = `translate3d(0, ${calcValues(values.descA_translateY_in, currentYOffset)}%, 0)`;
					objs.imgMenuList.style.opacity = calcValues(values.imgMenuList_opacity_in, currentYOffset);
				} else {
					// out
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}vh, 0)`;
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}vh, 0)`;
					// objs.descA.style.transform = `translate3d(0, ${calcValues(values.descA_translateY_out, currentYOffset)}%, 0)`;
				}
				if (scrollRatio <= 0.52) {
					// in
					objs.imgMenuList.style.transform = `translate3d(0, ${calcValues(values.imgMenuList_translateX_in, currentYOffset)}%, 0)`;
				}
				break;	

			case 5:
				console.log('5 play');

				if (scrollRatio <= 0.55) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
					objs.openProcessA.style.opacity = calcValues(values.openProcessA_opacity_in, currentYOffset);
					objs.openProcessA.style.transform = `translate3d(0, ${calcValues(values.openProcessA_translateY_in, currentYOffset)}%, 0)`;
					objs.lineA.style.width = `${calcValues(values.lineA_width_in, currentYOffset)}px`;
					objs.openProcessB.style.opacity = calcValues(values.openProcessB_opacity_in, currentYOffset);
					objs.openProcessB.style.transform = `translate3d(0, ${calcValues(values.openProcessB_translateY_in, currentYOffset)}%, 0)`;
					objs.lineB.style.width = `${calcValues(values.lineB_width_in, currentYOffset)}px`;
					objs.openProcessC.style.opacity = calcValues(values.openProcessC_opacity_in, currentYOffset);
					objs.openProcessC.style.transform = `translate3d(0, ${calcValues(values.openProcessC_translateY_in, currentYOffset)}%, 0)`;
					objs.lineC.style.width = `${calcValues(values.lineC_width_in, currentYOffset)}px`;
					objs.openProcessD.style.opacity = calcValues(values.openProcessD_opacity_in, currentYOffset);
					objs.openProcessD.style.transform = `translate3d(0, ${calcValues(values.openProcessD_translateY_in, currentYOffset)}%, 0)`;
					objs.lineD.style.width = `${calcValues(values.lineD_width_in, currentYOffset)}px`;
					objs.openProcessA.classList.contains('active') && objs.openProcessA.classList.remove('active');
					objs.openProcessB.classList.contains('active') && objs.openProcessB.classList.remove('active');
					objs.openProcessC.classList.contains('active') && objs.openProcessC.classList.remove('active');
					objs.openProcessD.classList.contains('active') && objs.openProcessD.classList.remove('active');
				}
				if (scrollRatio >= 0.6 && scrollRatio < 0.68) {
					!objs.openProcessA.classList.contains('active') && objs.openProcessA.classList.add('active');
					objs.openProcessB.classList.contains('active') && objs.openProcessB.classList.remove('active');
					objs.openProcessC.classList.contains('active') && objs.openProcessC.classList.remove('active');
					objs.openProcessD.classList.contains('active') && objs.openProcessD.classList.remove('active');
				}else if (scrollRatio >= 0.68 && scrollRatio < 0.75) {
					objs.openProcessA.classList.contains('active') && objs.openProcessA.classList.remove('active');
					!objs.openProcessB.classList.contains('active') && objs.openProcessB.classList.add('active');
					objs.openProcessC.classList.contains('active') && objs.openProcessC.classList.remove('active');
					objs.openProcessD.classList.contains('active') && objs.openProcessD.classList.remove('active');
				}else if (scrollRatio >= 0.75 && scrollRatio < 0.83) {
					objs.openProcessA.classList.contains('active') && objs.openProcessA.classList.remove('active');
					objs.openProcessB.classList.contains('active') && objs.openProcessB.classList.remove('active');
					!objs.openProcessC.classList.contains('active') && objs.openProcessC.classList.add('active');
					objs.openProcessD.classList.contains('active') && objs.openProcessD.classList.remove('active');
				}else if (scrollRatio >= 0.83 && scrollRatio < 0.9) {
					objs.openProcessA.classList.contains('active') && objs.openProcessA.classList.remove('active');
					objs.openProcessB.classList.contains('active') && objs.openProcessB.classList.remove('active');
					objs.openProcessC.classList.contains('active') && objs.openProcessC.classList.remove('active');
					!objs.openProcessD.classList.contains('active') && objs.openProcessD.classList.add('active');
				}
				break;	
			}
	}

	function scrollLoop() {
		enterNewScene = false;
		prevScrollHeight = 0;

		for (let i = 0; i < currentScene; i++) {
			prevScrollHeight += sceneInfo[i].scrollHeight;
		}

		if (delayedYOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
			enterNewScene = true;
			currentScene++;
			document.body.setAttribute('id', `show-scene-${currentScene}`);
		}

		if (delayedYOffset < prevScrollHeight) {
			enterNewScene = true;
			// 브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지(모바일)
			if (currentScene === 0) return;
			currentScene--;
			document.body.setAttribute('id', `show-scene-${currentScene}`);
		}

		if (enterNewScene) return;

		playAnimation();
		showStatus();
	}

	function loop() {
		delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;

        // 일부 기기에서 페이지 끝으로 고속 이동하면 body id가 제대로 인식 안되는 경우를 해결
        // 페이지 맨 위로 갈 경우: scrollLoop와 첫 scene의 기본 캔버스 그리기 수행
        if (delayedYOffset < 1) {
            scrollLoop();
        }
        // 페이지 맨 아래로 갈 경우: 마지막 섹션은 스크롤 계산으로 위치 및 크기를 결정해야할 요소들이 많아서 1픽셀을 움직여주는 것으로 해결
        // if ((document.body.offsetHeight - window.innerHeight) - delayedYOffset < 1) {
        //     let tempYOffset = yOffset;
        //     scrollTo(0, tempYOffset - 1);
        // }

		rafId = requestAnimationFrame(loop);

		if (Math.abs(yOffset - delayedYOffset) < 1) {
			cancelAnimationFrame(rafId);
			rafState = false;
		}
	}

	function showStatus(){
		scrollElem.textContent = yOffset;
		sceneElem.textContent = currentScene;
	}

	window.addEventListener('load', () => {
		setObject();
        setLayout(); // 중간에 새로고침 시, 콘텐츠 양에 따라 높이 계산에 오차가 발생하는 경우를 방지하기 위해 before-load 클래스 제거 전에도 확실하게 높이를 세팅하도록 한번 더 실행

		// 중간에서 새로고침 했을 경우 자동 스크롤로 제대로 그려주기
        let tempYOffset = yOffset;
        let tempScrollCount = 0;
        if (tempYOffset > 0) {
            let siId = setInterval(() => {
                scrollTo(0, tempYOffset);
                tempYOffset += 5;

                if (tempScrollCount > 20) {
                    clearInterval(siId);
                }
                tempScrollCount++;
            }, 20);
        }

        window.addEventListener('scroll', () => {
            yOffset = window.pageYOffset + window.innerHeight/2;
            scrollLoop();
  			//checkMenu();

  			if (!rafState) {
  				rafId = requestAnimationFrame(loop);
  				rafState = true;
  			}
  		});

  		window.addEventListener('resize', () => {
  			setLayout();
  		});

  		// document.querySelector('.loading').addEventListener('transitionend', (e) => {
  		// 	document.body.removeChild(e.currentTarget);
  		// });

	});
})();
