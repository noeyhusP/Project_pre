(()=>{

    let yOffset = 0;
    // scrollY값

    let currentSection = 0;
    // 현재 섹션

    const sectionSet =[
        // section-0의 정보
        {
            height : 0,
            hMultiple : 5,

            objs : {
                container : document.querySelector("#section-0"),
                // querySelector 도 변하지 않는 값인 경우가 많기 때문에
                // object 안에 할당해서 쓰는 경우가 대부분임

            }
            // 자주 쓰일 값이니까 쓰기 편하게 객체에 할당함
            // section0, section1 그리고 그 안의 값들이 다 다르면서
            // 고유하기 때문에 object의 값으로 넣어주는 것

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

    const setBodyID = function(section)
    {
        // querySelector로 가져올 수도 있지만 함수호출이기 때문에 그렇게 하면 느려짐
        document.body.setAttribute("id", `show-section${section}`)
        // id Attribute 에 show-section(i)값을 넣어라
        // 제대로 이해하기 !!!
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
    ///////////////////// 이벤트 리스너 /////////////////////////////////////////////////

    window.addEventListener('scroll', ()=>{
        // 1. 레이아웃을 다시 잡는다
        yOffset = window.scrollY;
        // console.log("yOffset = " + yOffset);

        // 2. 현재 섹션값을 다시 가져온다
        currentSection = getCurrentSection2();
        // 이용한 함수로 대입해줌
        // console.log(`yOffset = ${yOffset}, section = ${currentSection}`);

        setBodyID(currentSection);
        setLocalnavMenu();
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