const header = document.querySelector("header");

function changeNavbar() {
    const isLogIn = localStorage.getItem("access") !== null;
    const mypage = document.getElementById("mypage");
    const feed = document.getElementById("feed");
    const logout = document.getElementById("logout");
    const create = document.getElementById("create");
    const login = document.getElementById("login");
    const signup = document.getElementById("signup");

    if (isLogIn) {
        mypage.style.display = "block";
        logout.style.display = "block";
        create.style.display = "block";
        feed.style.display = "block";
        login.style.display = "none";
        signup.style.display = "none";
    } else {
        mypage.style.display = "none";
        logout.style.display = "none";
        create.style.display = "none";
        feed.style.display = "none";
        login.style.display = "block";
        signup.style.display = "block";
    }
}

async function injectNavbar() {
    let navbar = await fetch("/navbar.html").then((response) => {
        return response.text();
    });
    header.innerHTML = navbar;

    // 스크립트가 실행되지 않은 이유를 navbar.html에 적어놓았습니다.
    changeNavbar();
    // <script type="module" src="scripts/login.js"></script>
    // 이렇게 모듈 속성을 주면 다른 자바스크립트 파일의 함수나 변수를 가져올 수 있지만 비동기적으로 로드됩니다.
}

injectNavbar();
