(()=>{

    let yOffset = 0;
    // scrollY값

    let currentSection = 0;
    // 현재 섹션
    let sectionYoffset = 0;



    const sectionSet =[
        // section-0의 정보
        {
            height : 0,
            hMultiple : 5,

            objs : {
                container : document.querySelector("#section-0"),
                // querySelector 도 변하지 않는 값인 경우가 많기 때문에
                // object 안에 할당해서 쓰는 경우가 대부분임

                // 클래스를 각각 지정해서 가져오는 방법 , querySelectorAll로 배열에 가져오는 방법

                messageA : document.querySelector(".section0-message.a"), // 띄어쓰기 주의하기 ! 띄어쓰면 후손셀렉터를 의미하게됨
                // 나란히 쓰면 section0-massage 클래스와 a클래스에 모두 해당하는 걸 의미
                messageB : document.querySelector(".section0-message.b"),
                messageC : document.querySelector(".section0-message.c"),
                messageD : document.querySelector(".section0-message.d")

            },
            // 자주 쓰일 값이니까 쓰기 편하게 객체에 할당함
            // section0, section1 그리고 그 안의 값들이 다 다르면서
            // 고유하기 때문에 object의 값으로 넣어주는 것
            vals : {
                messageA_fade_in : [0, 1, {start:0.03, end:0.12}],
                messageA_fade_out : [1, 0, {start:0.13 , end:0.23}],
            }
        },

        // section-1의 정보
        {
            height : 0,
            hMultiple : 3,

            objs : {
                container : document.querySelector("#section-1"),

            }

        },

    ];


    const setLayout = function()
    {
        // 초기 코드

        // console.log("window.innerHeight = " + window.innerHeight)
        // console.log("setLayout called");

        // section-0의 레이아웃을 설정한다
        // 윈도우의 높이 * sectionSet[0].hMultiple
        // sectionSet[0].height = window.innerHeight * sectionSet[0].hMultiple;
        // sectionSet[0].objs.container.style.height = `${sectionSet[0].height}px`;

        // 간단하게 for문으로 줄이기
        // for (let i = 0; i < sectionSet.length; i++)
        // {
            
        //     sectionSet[i].height = window.innerHeight * sectionSet[i].hMultiple;
        //     sectionSet[i].objs.container.style.height = `${sectionSet[i].height}px`;
        // }
        // console.log(sectionSet[0].height)
        // console.log(sectionSet[1].height)

        // --------------------------------------- 

        let height = 0;

        if (window.innerHeight < 500)
        {
            // 강제로 높이를 500으로 설정
            height = 500;
        }
        else{
            // height값을 window.innerHeight로 맞춰줌
            height = window.innerHeight;

        }

        for (let i = 0; i < sectionSet.length; i++)
        {
            // 위의 경우로 따온 height를 그대로 적용
            sectionSet[i].height = height * sectionSet[i].hMultiple;
            // console.log("적용된 높이 : " + sectionSet[i].height)
            sectionSet[i].objs.container.style.height = `${sectionSet[i].height}px`;
        }

    }

    setLayout();

    // 현재 섹션 구하는 함수
    // 방법 1
    const getCurrentSection1 = function()
    {
        // scroll값 = yOffset 
        let segment = [
            sectionSet[0].height
        ];
        // 섹션이 많아지면 섹션을 나누는 값이 많아지니까 배열이 필요해짐
        if (yOffset <= sectionSet[0].height)
        {
            section = 0;
        }
        else
        {
            section = 1;
        }

        return section;

    }

    // 방법 2

    const getCurrentSection2 = function()
    {
        // scroll값 = yOffset 
        let segment = [
            sectionSet[0].height,
            sectionSet[0].height + sectionSet[1].height
        ];
        // 섹션이 많아지면 섹션을 나누는 값이 많아지니까 배열이 필요해짐
        if (yOffset <= segment[0])
        {
            section = 0;
        }
        else if ((yOffset > segment[0]) && (yOffset <= segment[1]))
        {
            section = 1;
        }
        else
        {
            console.error("[ERROR]getCurrentSection()");
        }
        
        return section;

    }

    // body에 show-section아이디 현재섹션값 넣어주는 함수
    const setBodyID = function(section)
    {
        // querySelector로 가져올 수도 있지만 함수호출이기 때문에 그렇게 하면 느려짐
        document.body.setAttribute("id", `show-section${section}`)
        // id Attribute 중 show-section에 (currentSection)값을 넣어라
    }
    
    // local-nav를 global-nav의 height이상이 되면 fixed로 만들기

    const setLocalnavMenu = function()
    {
        if (yOffset > 44)
        {
            // local-nav를 fixed 시키기
            document.body.classList.add('local-nav-sticky')
        }
        else
        {
            // local-nav를 원래상태로 돌리기
            document.body.classList.remove('local-nav-sticky')
        }
    }

    // 이전섹션의 높이를 구하는 함수
    // 이해 제대로 하기 
    const getPrevSectionHeight = function ()
    {
        let prevHeight = 0;
        // section 0 일 때는 안 돌고 1일 때는 그 section의 height만 리턴함
        for (let i = 0; i < currentSection; i++)
        {
            prevHeight = prevHeight + sectionSet[i].height;
        }

        return prevHeight;
    }

    // opacity ratio 구하는 함수
    const calcValue = function(values)
    {
        let result = 0; // return할 값 초기화

        // 현재섹션의 높이 구하기
        const cur_height = sectionSet[currentSection].height;

        // [0, 1, {start:0.03, end:0.12}]
        let partStart = 0;
        let partEnd = 0;
        let partHeight = 0;
        let ratio = 0;

        // 애니메이션이 시작되는 지점
        partStart  = values[2].start * cur_height;
        // 애니메이션이 끝나는 지점
        partEnd    = values[2].end * cur_height;
        // 애니메이션이 구동되는 범위(길이)
        partHeight = partEnd - partStart;

        // if문으로 비율에 따른 opacity의 값 계산해서 리턴하기
        if (sectionYoffset < partStart)
        // 시작지점값보다 현재 yOffset이 작으면
        {
            result = values[0];
            // ex) 글자가 보이면 안 되는 구현이면 
            // opacity 0을 반환해서 안 보이게 하기

        }
        else if (sectionYoffset > partEnd)
        {
            result = values[1];
            // ex) 글자가 보이든 안 보이든 이미 끝까지 차오른 상태를 
            // opacity 0 or 1을 반환해서 유지시키기
            // (어짜피 그 다음과정에서 다시 사라지든 보이든 하게 되니까)

        }
        else 
        {
            // 비율 구하기 : 현재 yOffset에서 시작값을 뺀 값으로 
            // 애니메이션 총 길이값 나눠주기 
            ratio = (sectionYoffset - partStart) / partHeight;
            result = ((values[1] - values[0]) * ratio) + values[0];
            // opacity의 총 범위에 구한 비율을 곱하고 opacity의 시작값을
            // 더해서 애니메이션 비율과 opacity의 비율 맞춰주기
        }
        return result;
        // 현재 yOffset 비율에 맞춰진 opacity 비율을 result로 리턴

    }

    // 애니메이션 가동 함수 선언
    const playAnimation = function()
    {
        let opacity = 0;

        // 스크롤 비율 구하기(0-1사이의 값)
        // 현재 yOffset값을 현재 섹션의 총 길이로 나눠주기
        let scrollRate = sectionYoffset / sectionSet[currentSection].height;
        // 공통으로 필요한 값 변수에 할당해주기
        let values = sectionSet[currentSection].vals;
        let objects = sectionSet[currentSection].objs;

        // switch문으로 비율 가져오기
        // case에 따라 calcValue함수로 opacity값 계산할 수 있도록
        switch(currentSection)
        {
            case 0:
                if (scrollRate < 0.13) // messageA의 애니메이션 범위 1
                {
                    // fade-in 처리를 한다 
                    // [0, 1, {start:0.03, end:0.12}]

                    // calcValue함수로 구한 opacity의 비율을 opacity 변수에 할당
                    opacity = calcValue(sectionSet[currentSection].vals.messageA_fade_in);
                    // = opacity = calcValue(values.messageA_fade_in);

                    // style시트에 해당 섹션에 opacity값 넣어주기
                    sectionSet[currentSection].objs.messageA.style.opacity = opacity;
                    // = objects.messageA.style.opacity = opacity;

                }
                else if ((scrollRate >= 0.13) && (scrollRate < 0.25))
                // messageA의 애니메이션 범위 2
                {
                    // fade-out 처리를 한다
                    // [0, 1, {start:0.13, end:0.23}]
                    opacity = calcValue(values.messageA_fade_out);
                    objects.messageA.style.opacity = opacity;
                }
                // console.log("0번 섹션의 애니메이션이 돌고 있어요");
                break;
            case 1:
                console.log("1번 섹션의 애니메이션이 돌고 있어요");
                break;
            default:
                console.error("[ERROR} playAnimation()");
                break;
        }
    }


    ///////////////////// 이벤트 리스너 /////////////////////////////////////////////////

    window.addEventListener('scroll', ()=>{
        // 1. 레이아웃을 다시 잡는다
        yOffset = window.scrollY;
        // console.log("yOffset = " + yOffset);

        // 2. 현재 섹션값을 다시 가져온다
        currentSection = getCurrentSection2();
        // 이용한 함수로 대입해줌
        // console.log(`yOffset = ${yOffset}, section = ${currentSection}`);

        //sectionYoffset 을 구한다
        sectionYoffset = yOffset - getPrevSectionHeight();
        // yOffset - 이전섹션의 yOffset
        console.log(" sectionYoffset = " + sectionYoffset);

        // CSS 변경
        setBodyID(currentSection);
        setLocalnavMenu();

        playAnimation();
    });
    // 스크롤에 따라 걸리는 섹션을 구분해주는 이벤트리스너


    // 처음 로딩될 때 setLayout함수를 호출하고
    // 페이지의 모든 리소스가 로딩이 됐을 때 발생하는 이벤트
    window.addEventListener('load', ()=>
    {
        // 1.레이아웃을 잡는다
        setLayout();

        // 2. 스크롤값을 설정한다
        yOffset = window.scrollY;

        // 3. 현재 섹션값을 가져온다
        currentSection = getCurrentSection2();

        setBodyID(currentSection);
        setLocalnavMenu();

    });

    // 사이즈가 변경되면 setLayout함수를 다시 호출한다
    window.addEventListener('resize', ()=>
    {
        // console.log("setLayout resize called");

        // 레이아웃을 다시 잡는다
        setLayout();

        // 최상단이 바뀌지 않기 때문에 스크롤값과 현재 섹션값을 다시 설정할 필요는 X

    });

    // const $sec0 = document.querySelector("#section-0");
    // sectionSet[0].height = window.innerHeight * sectionSet[0].hMultiple;
    // console.log("innerHeight = " + window.innerHeight);
    // console.log("sectionSet[0] height = " + sectionSet[0].height);
    // $sec0.style.height = sectionSet[0].height + "px";


    // const $sec0 = document.querySelector("#section-0")
    // $sec0.style.height = sectionSet[0].height + "px";
    // px 이용시 모바일같은데선 이상할 수 있으니 상대적인 수치로 적용하는 게 좋음

})();