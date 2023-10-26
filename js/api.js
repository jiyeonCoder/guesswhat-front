const frontend_base_url = "http://127.0.0.1:5500";
const backend_base_url = "http://127.0.0.1:8000";

// 회원가입
async function handleSignup(userObject) {
    const response = await fetch(`${backend_base_url}/accounts/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(userObject),
    });
    if (response.ok) {
        console.log("success");
        window.location.href = "/login.html";
    } else {
        console.log("fail");
        const data = await response.json();
        return data;
    }
}

// 로그인
async function handleLogin(userInfo) {
    const response = await fetch(`${backend_base_url}/accounts/token/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(userInfo),
    });
    return response;
}

// 토큰 만료 확인
function isTokenExpired() {
    const exp = localStorage.getItem("exp");
    if (!exp) {
        return false;
    }
    return Date.now() >= exp * 1000;
}

// 토큰 재발급
async function refreshAccessToken() {
    if (!isTokenExpired()) return;
    const refreshToken = localStorage.getItem("refresh");
    if (!refreshToken) {
        return;
    }
    const response = await fetch(
        `${backend_base_url}/accounts/token/refresh/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                refresh: refreshToken,
            }),
        }
    );
    if (response.ok) {
        const data = await response.json();
        const accessToken = data.access;
        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        localStorage.setItem("access", accessToken);
        localStorage.setItem("exp", payload.exp);
        localStorage.setItem("me", payload.user_id);
    } else {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("exp");
        localStorage.removeItem("me");
        window.location.href = "/login.html";
    }
}

refreshAccessToken();

// 로그아웃
async function handleLogout() {
    const refreshToken = localStorage.getItem("refresh");
    if (!refreshToken) return;
    const response = await fetch(
        `${backend_base_url}/accounts/token/blacklist/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                refresh: refreshToken,
            }),
        }
    );
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("exp");
    localStorage.removeItem("me");
    window.location.href = "/index.html";
}

// 프롬프트 번역 및 api키 요청
async function prepareKarloAPI(prompt) {
    refreshAccessToken();
    const accessToken = localStorage.getItem("access");
    const response = await fetch(`${backend_base_url}/quizzes/image/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            prompt: prompt,
        }),
    });
    return response;
}

async function karloAPI(prompt, APIKey) {
    const negativeList = [
        "low quality",
        "draft",
        "amateur",
        "cut off",
        "cropped",
        "object out of frame",
        "out of frame",
        "body out of frame",
        "bad anatomy",
        "distortion",
        "disfigured",
    ];
    const response = await fetch(
        "https://api.kakaobrain.com/v2/inference/karlo/t2i",
        {
            method: "POST",
            headers: {
                Authorization: `KakaoAK ${APIKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: prompt,
                return_type: "base64_string",
                negative_prompt: negativeList.join(),
            }),
        }
    );

    return response;
}

// 퀴즈 생성 요청
async function postQuiz(data) {
    refreshAccessToken();
    const accessToken = localStorage.getItem("access");

    const response = await fetch(`${backend_base_url}/quizzes/`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    return response;
}

// 퀴즈 삭제 요청
async function deleteQuiz(quizId) {
    refreshAccessToken();
    const accessToken = localStorage.getItem("access");

    const response = await fetch(`${backend_base_url}/quizzes/${quizId}/`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response;
}
// 서버에서 작성된 모든 퀴즈
async function getQuizzes() {
    const response = await fetch(`${backend_base_url}/quizzes/`);
    return response;
}

// 상세페이지로 이동
function quizDetail(quizId) {
    window.location.href = `${frontend_base_url}/detail.html?quiz_id=${quizId}`;
}

// 퀴즈 상세페이지
async function getQuizDetail(quizId) {
    refreshAccessToken();
    const accessToken = localStorage.getItem("access");
    if (accessToken) {
        const response = await fetch(`${backend_base_url}/quizzes/${quizId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response;
    } else {
        const response = await fetch(`${backend_base_url}/quizzes/${quizId}`);
        return response;
    }
}

async function postLikesQuiz(quizId) {
    refreshAccessToken();
    const accessToken = localStorage.getItem("access");
    const response = await fetch(
        `${backend_base_url}/quizzes/${quizId}/likes/`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );
    return response;
}

async function getHint(quizId) {
    refreshAccessToken();
    const accessToken = localStorage.getItem("access");
    const response = await fetch(
        `${backend_base_url}/quizzes/${quizId}/hint/`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );
    return response;
}

// 댓글 불러오기
async function getComments(quizId) {
    const response = await fetch(
        `${backend_base_url}/quizzes/${quizId}/comments/`
    );

    return response;
}

// 댓글 작성
async function postComment(quizId, newComment) {
    refreshAccessToken();
    const accessToken = localStorage.getItem("access");
    const response = await fetch(
        `${backend_base_url}/quizzes/${quizId}/comments/`,
        {
            method: "POST",
            headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                content: newComment,
            }),
        }
    );
    return response;
}

// 유저 정보 가져오기
async function getUserInfo(userId) {
    if (userId) {
        const response = await fetch(`${backend_base_url}/accounts/${userId}/`);
        return response;
    } else {
        const response = await fetch(`${backend_base_url}/accounts/`);
        return response;
    }
}

async function getRankingList(userId) {
    refreshAccessToken();
    const accessToken = localStorage.getItem("access");
    if (userId) {
        const response = await fetch(
            `${backend_base_url}/accounts/${userId}/ranking/`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response;
    } else {
        const response = await fetch(`${backend_base_url}/accounts/ranking/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response;
    }
}
