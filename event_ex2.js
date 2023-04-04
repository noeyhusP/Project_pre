// DOM구조가 다 만들어지거든 ()=>{}를 실행 시켜라는 명령을 등록
// 변수 많음 ㅎ..
// 그러므로 DOMContentLoaded 가급적 쓰지 않기
document.addEventListener('DOMContentLoaded', ()=>{
    
    const h1Element = document.querySelector("h1");
    const btnChange = document.querySelector("button");

    console.log("h1Element = " + h1Element);
    console.log("btnChange = " + btnChange);
    // <script src="./event_ex2.js"></script> 로 head에 넣어봤자 
    // 둘 다 Null이 나올 수 밖에 없음 (h1, button이 아직 안 만들어졌기 때문에)
    // html 태그끼리는 병렬 진행 가능 / 나머지는 다 병렬 진행 불가

    let bFlagHello = true;  
    btnChange.addEventListener("click",()=> 
    {
        if (bFlagHello === true)
        {
            h1Element.textContent = "Welcome";
            bFlagHello = false;

        }
        else
        {
            h1Element.textContent = "Hello";
            bFlagHello = true;}
    });
})();
