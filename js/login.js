const form = document.querySelector("#login-form > form");
const button = form.querySelector("#button");
const username = form.querySelector("#username");
const password = form.querySelector("#password");
const errorMessage = form.querySelector("#error-message");

button.addEventListener("click", async (event) => {
    form.classList.add("was-validated");
    if (!form.checkValidity()) {
        return;
    }
    const userInfo = {
        username: username.value,
        password: password.value,
    };
    const response = await handleLogin(userInfo);
    if (response.ok) {
        const data = await response.json();
        const refreshToken = data.refresh;
        const accessToken = data.access;
        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        localStorage.setItem("access", accessToken);
        localStorage.setItem("exp", payload.exp);
        localStorage.setItem("me", payload.user_id);
        localStorage.setItem("refresh", refreshToken);

        window.location.href = "/index.html";
    } else {
        const errors = await response.json();
        for (const key in errors) {
            errorMessage.textContent = errors[key];
            errorMessage.classList.remove("collapse");
        }
    }
});
