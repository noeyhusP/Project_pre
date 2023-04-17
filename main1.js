(()=>{

    // 공통 전역 변수 선언
    let yOffset = 0; // scroll좌표값
    let currentSection = 0; // 현재 섹션 값
    let sectionYoffset = 0;

    // 섹션 정보들 배열(정보값은 object로)으로 선언해두기

    const sectionSet = [
        {
            //section-0의 정보들
            height : 0,
            hMultiple : 5, // section-0의 일정 비율값

            objs : {
                container : document.querySelector("#section-0"),
                // id가 section-0인 영역 obj에 할당해서 선언해두기
                // 불변하면서 자주 쓰이는 값이기 때문에 obj로 할당

                messageA : document.querySelector(".section0-message.a"),
                messageB : document.querySelector(".section0-message.b"),
                messageC : document.querySelector(".section0-message.c"),
                messageD : document.querySelector(".section0-message.d")
            },
            vals : {
                // meassageA
                messageA_fade_in : [0, 1, {start:0.02, end:0.11}],
                messageA_fade_out : [1, 0, {start:0.12, end:0.21}],
                messageA_translate_in : [0, -20, {start:0.02, end:0.11}],
                messageA_translate_out : [-20, -40, {start:0.12, end:0.21}],


                // messageB
                messageB_fade_in : [0, 1, {start:0.25, end:0.34}],
                messageB_fade_out : [1, 0, {start:0.35, end:0.44}],
                messageB_translate_in : [0, -20, {start:0.25, end:0.34}],
                messageB_translate_out : [-20, -40, {start:0.35, end:0.44}],

                // messageC
                messageC_fade_in : [0, 1, {start:0.48, end:0.57}],
                messageC_fade_out : [1, 0, {start:0.58, end:0.67}],
                messageC_translate_in : [0, -20, {start:0.48, end:0.57}],
                messageC_translate_out : [-20, -40, {start:0.58, end:0.67}],

                // messageD
                messageD_fade_in : [0, 1, {start:0.71, end:0.80}],
                messageD_fade_out : [1, 0, {start:0.81, end:0.90}],
                messageD_translate_in : [0, -20, {start:0.71, end:0.80}],
                messageD_translate_out : [-20, -40, {start:0.81, end:0.90}],
            }
        },
        {
            //section-1의 정보들
            height : 0,
            hMultiple : 3, // section-1의 일정 비율값

            objs : {
                container : document.querySelector("#section-1")
            }
        }
    ];

    // 컨텐츠창의 레이아웃 값을 사용자가 이용하는 창 크기에 
    // 일정한 비율에 맞춰서 가져올 수 있도록 함수 설계
    const setLayout = function()
    {
        // height 값을 0으로 초기화
        let height = 0;

        if (window.innerHeight < 500)
        {
            // 컨텐츠창이 500 이하면 500으로 강제 설정
            height = 500;
        }
        else
        {
            // 500이하가 아닐 경우
            // height값을 window.innerHeight로 설정해줌
            height = window.innerHeight;
        }

        for (let i = 0; i < sectionSet.length; i++)
        {
            sectionSet[i].height = height * sectionSet[i].hMultiple;
            // sectionSet의 i번째 요소의 objs 에서 container 객체에 할당된
            // selector로 가서 그 selector의 stylesheet의 height 값에다가
            // 위에서 할당한 sectionSet[i].height 값을 px으로 집어넣어줌
            sectionSet[i].objs.container.style.height = `${sectionSet[i].height}px`;
        }
    }



    setLayout();
    // 함수 실행시켜주기

    // 현재 섹션 구하는 함수
    // 방법 1

    const getCurrentSection1 = function()
    {
        let segment = [sectionSet[0].height];
        // 나눠진 섹션의 값을 배열으로 할당해주기 (값이 많아질 경우를 생각해서)
        if (yOffset <= sectionSet[0].height)
        // yOffset, 즉 scroll값이 위에서 구해놓은 section-0의 height
        // 보다 작거나 같으면
        {
            section = 0; // 섹션 정보를 0으로 놓기
        }
        else
        {
            section = 1; // 그렇지 않은 경우 섹션 정보를 1으로 놓기
        }
        return section; 
    }

    // 현재 섹션 구하는 함수
    // 방법 2
    const getCurrentSection2 = function() 
    {
        let segment = [sectionSet[0].height, 
        sectionSet[0].height + sectionSet[1].height]
        // 섹션을 나누는 기준을 section-0의 height과 section-0과 1을 합친 값으로 할당

        if (yOffset <= segment[0])
        // yOffset, 즉 scroll값이 section[0]의 height보다 작거나 같을 때
        {
            section = 0;
        }
        else if ((yOffset > segment[0]) && (yOffset <= segment[1]))
        // yOffset이 section[0]의 height보다 크고
        // yOffset이 section[0]과 [1]의 height을 합친값보다 작거나 같을때
        {
            section = 1;
        }
        else 
        {
            // 있을 리 없는 상황이지만
            console.error("[ERROR]getCurrentSection()");
            // 혹시나 생긴다면 오류메세지 출력
        }
        return section;
    }

    // body에 show-section아이디 현재섹션값 넣어주는 함수
    const setBodyID = function(section)
    {
        document.body.setAttribute("id", `show-section${section}`)
    }

    // local-nav를 global-nav의 height이상이 되면 fixed로 설정
    const setLocalnavMenu = function()
    {
        if (yOffset > 44)
        {
            document.body.classList.add('local-nav-sticky')
        }
        else{
            document.body.classList.remove('local-nav-sticky')
        }
    }

    // 이전 섹션의 높이 구하는 함수
    const getPrevSectionHeight = function()
    {
        let prevHeight = 0;
        for (let i = 0; i < currentSection; i++)
        {
            prevHeight = prevHeight + sectionSet[i].height;
        }
        return prevHeight;
    }

    // opacity ratio 구하는 함수
    const calcValue = function(values)
    {
        let result = 0;

        const cur_height = sectionSet[currentSection].height;

        let partStart = 0;
        let partEnd = 0;
        let partHeight = 0;
        let ratio = 0;

        if (values.length === 2)
        {
            ratio = (sectionYoffset / cur_height);
            result = ((values[1] - values[0]) * ratio) + values[0];
        }
        else if (values.length === 3)
        {
            partStart = values[2].start * cur_height;
            partEnd = values[2].end * cur_height;
            partHeight = partEnd - partStart;

            if (sectionYoffset < partStart)
            {
                result = values[0];
            }
            else if (sectionYoffset > partEnd)
            {
                result = values[1];
            }
            else
            {
                ratio = (sectionYoffset - partStart) / partHeight;
                result = ((values[1] - values[0]) * ratio) + values[0];
            }
            return result;
        }
    }

    // 애니메이션 구동 함수 선언
    const playAnimation = function()
    {
        let opacity = 0;
        let transValue = 0;

        let scrollRate = sectionYoffset / sectionSet[currentSection].height;
        let values = sectionSet[currentSection].vals;
        let objects = sectionSet[currentSection].objs;

        switch(currentSection)
        {
            case 0:
                objects.messageA.style.opacity = 0;
                objects.messageB.style.opacity = 0;
                objects.messageC.style.opacity = 0;
                objects.messageD.style.opacity = 0;

                if (scrollRate < 0.12)
                {
                    opacity = calcValue(values.messageA_fade_in);
                    transValue = calcValue(values.messageA_translate_in);
                    objects.messageA.style.opacity = opacity;
                    objects.messageA.style.transform = `translateY(${transValue}%)`;

                }
                else if ((scrollRate >= 0.12) && (scrollRate < 0.23))
                {
                    opacity = calcValue(values.messageA_fade_out);
                    transValue = calcValue(values.messageA_translate_out);
                    objects.messageA.style.opacity = opacity;
                    objects.messageA.style.transform = `translateY(${transValue}%)`;
                }
                else if ((scrollRate >= 0.23) && (scrollRate < 0.35))
                {
                    opacity = calcValue(values.messageB_fade_in);
                    transValue = calcValue(values.messageB_translate_in);
                    objects.messageB.style.opacity = opacity;
                    objects.messageB.style.transform = `translateY(${transValue}%)`;
                }
                else if ((scrollRate >= 0.35) && (scrollRate < 0.46))
                {
                    opacity = calcValue(values.messageB_fade_out);
                    transValue = calcValue(values.messageB_translate_out);
                    objects.messageB.style.opacity = opacity;
                    objects.messageB.style.transform = `translateY(${transValue}%)`;
                }
                else if ((scrollRate >= 0.46) && (scrollRate < 0.58))
                {
                    opacity = calcValue(values.messageC_fade_in);
                    transValue = calcValue(values.messageC_translate_in);
                    objects.messageC.style.opacity = opacity;
                    objects.messageC.style.transform = `translateY(${transValue}%)`;
                }
                else if ((scrollRate >= 0.58) && (scrollRate < 0.69))
                {
                    opacity = calcValue(values.messageC_fade_out);
                    transValue = calcValue(values.messageC_translate_out);
                    objects.messageC.style.opacity = opacity;
                    objects.messageC.style.transform = `translateY(${transValue}%)`;
                }
                else if ((scrollRate >= 0.69) && (scrollRate < 0.81))
                {
                    opacity = calcValue(values.messageD_fade_in);
                    transValue = calcValue(values.messageD_translate_in);
                    objects.messageD.style.opacity = opacity;
                    objects.messageD.style.transform = `translateY(${transValue}%)`;
                }
                else if ((scrollRate >= 0.81) && (scrollRate < 0.92))
                {
                    opacity = calcValue(values.messageD_fade_out);
                    transValue = calcValue(values.messageD_translate_out);
                    objects.messageD.style.opacity = opacity;
                    objects.messageD.style.transform = `translateY(${transValue}%)`;
                }
                break;
            case 1:
                break;
            default:
                console.error("[ERROR]playAnimation()");
                break;

        }
    }


    /////////// Event Listener 설정 /////////

    // scroll값에 따라 섹션을 구분해줄 수 있도록 
    // scroll값을 받아 함수에 넣어주는 이벤트 리스너
    window.addEventListener('scroll',()=>{
        yOffset = window.scrollY;
        // yOffset값에 window y축 스크롤값을 배정

        currentSection = getCurrentSection1();

        // sectionYoffset값을 구한다
        sectionYoffset = yOffset - getPrevSectionHeight();

        // // 확인용 
        // console.log(`yOffset = ${yOffset}, section = ${currentSection}`);
        setBodyID(currentSection);
        setLocalnavMenu();
    
        playAnimation();
    });

    // 페이지의 모든 리소스가 로딩이 완료가 됐을 때 (첫로드,새로고침 등)
    // setLayout 함수 실행하는 이벤트 리스너
    window.addEventListener('load', ()=>
    {
        setLayout();
        yOffset = window.scrollY;
        currentSection = getCurrentSection1();

        setBodyID(currentSection);
        setLocalnavMenu();

    });

    // 페이지의 사이즈에 변화가 생겼을 때 setLayout 함수를
    // 재실행 해주는 이벤트 리스너 
    // (페이지 사이즈에 변화에 따라 그에 맞는 레이아웃 비율을 반영)
    window.addEventListener('resize', ()=>
    {
        setLayout();
    });
})(); // 즉시호출함수로 실행 돌려놓기