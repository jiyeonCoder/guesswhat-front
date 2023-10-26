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
    if (exp !== undefined) {
        return false;
    }
    return Date.now() >= exp * 1000;
}

// 토큰 재발급
async function refreshAccessToken() {
    if (!isTokenExpired()) {
        return;
    }
    const refreshToken = localStorage.getItem("refresh");
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
        const payload = JSON.parse(atob(accessToken.split(".")[1])).exp;
        localStorage.setItem("access", accessToken);
        localStorage.setItem("exp", payload.exp);
        localStorage.setItem("user", payload.user_id);
    } else {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("exp");
        localStorage.removeItem("user");
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
    localStorage.removeItem("user");
    window.location.href = "/index.html";
}

async function postFollow(userId) {
    const accessToken = localStorage.getItem("access");
    const response = await fetch(
        `${backend_base_url}/accounts/follow/${userId}/`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );
    return response;
}

// 프롬프트 번역 및 api키 요청
async function prepareKarloAPI(prompt) {
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
            }),
        }
    );

    return response;
}

async function postQuiz(formData) {
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

// 글 수정하기

// 글 삭제 요청
async function deleteArticle(articleId) {
    const accessToken = localStorage.getItem("access");

    const response = await fetch(`${backend_base_url}/articles/${articleId}/`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response;
}
// 서버에서 작성된 글들을 불러오는 함수
async function getQuizzes() {
    const response = await fetch(`${backend_base_url}/quizzes/`);
    return response;
}

// 피드 글 불러오기
async function getFeedArticles() {
    const accessToken = localStorage.getItem("access");
    const response = await fetch(`${backend_base_url}/articles/feed/`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        alert("불러오는 것에 실패하였습니다.");
    }
}

// 작성글 불러오기
async function getUserArticles(userId) {
    const response = await fetch(
        `${backend_base_url}/articles/author/${userId}/`
    );

    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        alert("불러오는 것에 실패하였습니다.");
    }
}

// 상세페이지로 이동하는 함수
function articleDetail(articleId) {
    window.location.href = `${frontend_base_url}/article_detail.html?article_id=${articleId}`;
}

// 글 상세페이지 불러오기
async function getArticle(articleId) {
    const accessToken = localStorage.getItem("access");
    let response;
    if (accessToken) {
        response = await fetch(`${backend_base_url}/articles/${articleId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    } else {
        response = await fetch(`${backend_base_url}/articles/${articleId}`);
    }

    if (response.status == 200) {
        const response_json = await response.json();
        return response_json;
    } else {
        alert("불러오는 것에 실패하였습니다.");
    }
}

async function postLikesArticle(articleId) {
    const accessToken = localStorage.getItem("access");
    const response = await fetch(
        `${backend_base_url}/articles/${articleId}/likes/`,
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
async function getComments(articleId) {
    const response = await fetch(
        `${backend_base_url}/articles/${articleId}/comments/`
    );

    if (response.ok) {
        const response_json = await response.json();
        return response_json;
    }
}

// 댓글 작성
async function postComment(articleId, newComment) {
    let token = localStorage.getItem("access");
    const response = await fetch(
        `${backend_base_url}/articles/${articleId}/comments/`,
        {
            method: "POST",
            headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                content: newComment,
            }),
        }
    );

    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        const error = await response.json();
        alert(error.detail);
    }
}

async function postLikesComment(articleId, commentId) {
    const accessToken = localStorage.getItem("access");
    const response = await fetch(
        `${backend_base_url}/articles/${articleId}/comments/${commentId}/likes/`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );
    return response;
}

// 유저 정보 가져오기
async function getUserInfo(userId) {
    const accessToken = localStorage.getItem("access");
    if (userId) {
        const response = await fetch(
            `${backend_base_url}/accounts/${userId}/`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response;
    } else {
        const response = await fetch(`${backend_base_url}/accounts/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response;
    }
}

// 상품 리스트 가져오기
async function getProductList() {
    const response = await fetch(`${backend_base_url}/products/`);
    return response;
}

// 상품 상세정보
async function getProductDetail(productId) {
    const response = await fetch(`${backend_base_url}/products/${productId}`);
    return response;
}
