window.onload = async () => {
    const urlParms = new URLSearchParams(window.location.search);
    const userId = urlParms.get("user_id") || localStorage.getItem("me");
    await loadUserInfo(userId);
    await loadRankingList(userId);
};

// async function handleFollow() {
//     if (userId) {
//         const response = await postFollow(userId);
//         if (response.ok) {
//             const data = await response.json();
//             const followers = document.getElementById("followers");
//             followers.textContent = data.followers_count;
//         }
//     } else {
//         alert("다른 사람만 팔로우 가능합니다.");
//     }
// }

async function loadUserInfo(userId) {
    const response = await getUserInfo(userId);
    const data = await response.json();
    if (!response.ok) {
        return;
    }
    const email = document.getElementById("email");
    const nickname = document.getElementById("nickname");
    const point = document.getElementById("point");
    const histroyLogs = document.getElementById("historyLogs");
    // const following = document.getElementById("following");
    // const followers = document.getElementById("followers");

    email.textContent = data.email;
    nickname.textContent = data.nickname;
    point.textContent = data.point;
    console.log(point);
    // following.textContent = data.following_count;
    // followers.textContent = data.followers_count;

    // const styleContent = document.getElementById("styles");

    // data.styles.forEach((styleObj) => {
    //     const userStyle = document.createElement("div");
    //     userStyle.textContent = styleObj.name;
    //     styleContent.appendChild(userStyle);
    // });

    data.history_logs.forEach((log) => {
        const userlog = document.createElement("div");
        const action = document.createElement("p");
        const message =
            log.action == "hint"
                ? "힌트사용으로 점수를 -5점 잃었습니다"
                : log.action == "like"
                ? "좋아요를 받아 점수를 1점 얻었습니다"
                : log.action == "quiz"
                ? "문제를 맞춰 점수를 10점 얻었습니다"
                : (log.action = "create")
                ? "글작성요청으로 점수를 1점 잃었습니다"
                : "이건뭐죠?";
        //  이거 History모델의 choice들 조정하면 되는데 제가 뻘짓했네요;;
        action.innerText = message;
        userlog.appendChild(action);
        const createdAt = document.createElement("p");
        createdAt.innerText = log.created_at;
        userlog.appendChild(createdAt);
        const point = document.createElement("p");
        point.innerText = log.point;
        userlog.appendChild(point);
        histroyLogs.append(userlog);
    });
}
async function loadRankingList(userId) {
    const response = await getRankingList(userId);
    const data = await response.json();
    if (!response.ok) {
        return;
    }
    const rankingList = document.getElementById("myranking");
    console.log(data);
    data.forEach((player) => {
        console.log(player);
        const playerInfo = document.createElement("p");
        playerInfo.innerText = `닉네임:${player['nickname']},포인트:${player['point']},등수:${player['rank']}`;
        rankingList.appendChild(playerInfo);
    });
    return;
}

// async function loadAuthorArticles() {
//     const articles = await getUserArticles(userId);

//     const articleList = document.getElementById("article-list");

//     articles.forEach((article) => {
//         const newCol = document.createElement("div");
//         newCol.setAttribute("class", "col");
//         newCol.classList.add("text-center");
//         newCol.setAttribute("onclick", `articleDetail(${article.id})`);

//         const newCard = document.createElement("div");
//         newCard.setAttribute("class", "card");
//         newCard.classList.add("col");
//         newCard.setAttribute("id", article.id);
//         newCol.appendChild(newCard);

//         const newCardHeader = document.createElement("div");
//         newCardHeader.setAttribute("class", "card-header");
//         newCard.appendChild(newCardHeader);

//         const newCardtitle = document.createElement("h5");
//         newCardtitle.setAttribute("class", "card-title");
//         newCardtitle.innerText = article.title;
//         newCardHeader.appendChild(newCardtitle);

//         const articleImage = document.createElement("img");
//         articleImage.setAttribute("class", "card-img-top");
//         articleImage.classList.add();

//         if (article.image) {
//             articleImage.setAttribute(
//                 "src",
//                 `${backend_base_url}${article.image}`
//             );
//         } else {
//             articleImage.setAttribute(
//                 "src",
//                 "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMzA1MjdfMTE1%2FMDAxNjg1MTk1MjQ0MjAz.iIaJDy9Yp3NiRG9PHd4uI_za1f1HKO7J5o6Q3wATqzcg.l8Pem3MI699fPi3SGH2l7e_rgr8tjthQbCFGuPX6Ig4g.JPEG.loveyoujuwon7354%2FIMG_3273.jpg&type=a340"
//             );
//         }

//         newCard.appendChild(articleImage);

//         const newCardbody = document.createElement("div");
//         newCardbody.setAttribute("class", "card-body");
//         newCard.appendChild(newCardbody);

//         articleList.appendChild(newCol);
//     });
// }
