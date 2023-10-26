function changeNavbar() {
    const isLoggedIn = localStorage.getItem("access") !== null;
    const mypage = document.getElementById("mypage");
    const logout = document.getElementById("logout");
    const create = document.getElementById("create");
    const login = document.getElementById("login");
    const signup = document.getElementById("signup");

    if (isLoggedIn) {
        mypage.style.display = "block";
        logout.style.display = "block";
        create.style.display = "block";
        login.style.display = "none";
        signup.style.display = "none";
    } else {
        mypage.style.display = "none";
        logout.style.display = "none";
        create.style.display = "none";
        login.style.display = "block";
        signup.style.display = "block";
    }
}

async function injectNavbar() {
    const header = document.querySelector("header");
    let navbar = await fetch("/navbar.html").then((response) => {
        return response.text();
    });
    header.innerHTML = navbar;
    changeNavbar();
}

injectNavbar();
