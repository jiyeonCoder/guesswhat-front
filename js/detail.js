window.onload = async function () {
    const urlParms = new URLSearchParams(window.location.search);
    const quizId = urlParms.get("quiz_id");

    await loadQuizDetail(quizId);
    await loadCommentList(quizId);
};

async function loadQuizDetail(quizId) {
    const me = localStorage.getItem("me");
    const response = await getQuizDetail(quizId);
    if (!response.ok) {
        const error = await response.json();
        alert(error.detail);
    }
    const quiz = await response.json();
    const answerBlind = document.getElementById("answer-blind");
    const quizDeleteBtn = document.getElementById("quiz-delete");

    for (let i = 0; i < quiz.answer_len; i++) {
        answerBlind.innerHTML += `<span class="badge rounded-circle text-bg-info">*</span>`;
    }
    const author = document.getElementById("author");

    const cardImage = document.getElementById("image");
    const image = document.createElement("img");
    image.setAttribute("src", `${backend_base_url}${quiz.image}`);
    cardImage.appendChild(image);

    const likesBtn = document.getElementById("likes");
    if (quiz.is_liked) {
        likesBtn.classList.add("btn-primary");
        likesBtn.disabled = true;
    } else {
        likesBtn.classList.add("btn-outline-primary");
    }
    likesBtn.setAttribute("onclick", `likesQuiz(${quizId})`);
    const likesCnt = likesBtn.querySelector("span");
    likesCnt.textContent = quiz.likes_count;

    author.setAttribute("href", `/mypage.html?user_id=${quiz.author.id}`);
    author.textContent = quiz.author.nickname;

    const hintBtn = document.getElementById("hint");
    hintBtn.setAttribute("onclick", `showHint(${quizId})`);

    const commentsCount = document.getElementById("comments-count");
    commentsCount.textContent = quiz.comments_count;

    const submitCommentBtn = document.getElementById("submit-comment");
    submitCommentBtn.setAttribute("onclick", `submitComment(${quizId})`);

    if (me != quiz.author.id) {
        quizDeleteBtn.disabled = true;
    } else {
        submitCommentBtn.disabled = true;
    }
}

async function likesQuiz(quizId) {
    const likesBtn = document.getElementById("likes");
    const likesCnt = likesBtn.querySelector("span");
    const response = await postLikesQuiz(quizId);
    if (!response.ok) {
        const error = await response.json();
        alert(error.detail);
        return;
    }
    const data = await response.json();
    likesCnt.textContent = data.likes_count;
    likesBtn.classList.remove("btn-outline-primary");
    likesBtn.classList.add("btn-primary");
    likesBtn.disabled = true;
}

async function showHint(quizId) {
    const response = await getHint(quizId);
    if (!response.ok) {
        const error = await response.json();
        alert(error.detail);
        return;
    }
    const hintBtn = document.getElementById("hint");
    const data = await response.json();
    hintBtn.textContent = data.hint;
    hintBtn.disabled = true;
}

async function loadCommentList(quizId) {
    const response = await getComments(quizId);
    if (!response.ok) {
        const error = await response.json();
        alert(error.detail);
        return;
    }
    const data = await response.json();
    const commentList = document.getElementById("comment-list");
    commentList.innerHTML = "";
    if (data.answer) {
        const answer = data.answer;
        commentList.innerHTML += `
        <li class="media d-flex mb-3 rounded-3 border border-success border-2 p-2">
            <div class="media-body">
                <h6 class="mt-0 mb-2"><a href="/mypage.html?user_id=${answer.author.id}">${answer.author.nickname}</a></h6>
                <strong>${answer.content}</strong>
                <span class="badge rounded-pill text-bg-success">정답!</span>
                
                <small class="text-muted">${answer.created_at}</small>
            </div>
        </li>`;
    }
    const comments = data.comments;
    comments.forEach((comment) => {
        commentList.innerHTML += `
        <li class="media d-flex mb-3 rounded-3 border border-secondary border-2 p-2">
        <div class="media-body">
            <h6 class="mt-0 mb-2"><a href="/mypage.html?user_id=${comment.author.id}">${comment.author.nickname}</a></h6>
            <strong>${comment.content}</strong>
            <small class="text-muted">${comment.created_at}</small>
        </div>
        </li>`;
    });
}

// 댓글 등록
async function submitComment(quizId) {
    const commentElement = document.getElementById("new-comment");
    const newComment = commentElement.value;
    commentElement.value = "";
    const response = await postComment(quizId, newComment);
    if (!response.ok) {
        const error = await response.json();
        alert(error.detail);
        return;
    }
    loadCommentList(quizId);
}
