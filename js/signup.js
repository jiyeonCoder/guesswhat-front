const form = document.querySelector("#signup-form > form");
const button = form.querySelector("#button");
const fields = form.querySelectorAll("input");
const invalidFeedback = form.querySelectorAll(".invalid-feedback");

const password = form.querySelector("#password");
const confirmPassword = form.querySelector("#confirm-password");
const passwordMissMatch = form.querySelector("#password-missmatch");

confirmPassword.addEventListener("input", () => {
    if (password.value !== confirmPassword.value) {
        confirmPassword.setCustomValidity("password missmatch");
        confirmPassword.classList.add("is-invalid");
        passwordMissMatch.textContent = "비밀번호가 일치하지 않습니다.";
    } else {
        confirmPassword.setCustomValidity("");
        confirmPassword.classList.remove("is-invalid");
    }
});

button.addEventListener("click", async (event) => {
    const userObject = {};
    for (let i = 0; i < fields.length; i++) {
        if (i !== fields.length - 1) userObject[fields[i].id] = fields[i].value;
        invalidFeedback[
            i
        ].textContent = `${fields[i].id}은/는 필수 필드입니다.`;
    }
    form.classList.add("was-validated");
    if (!form.checkValidity()) {
        return;
    }
    const errors = await handleSignup(userObject);
    if (errors) {
        for (let i = 0; i < fields.length; i++) {
            if (fields[i].id in errors) {
                invalidFeedback[i].textContent = errors[fields[i].id][0];
                fields[i].classList.add("is-invalid");
            }
        }
    }
});
