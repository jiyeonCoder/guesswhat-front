async function loadQuizzes() {
    const response = await getQuizzes();
    if (!response.ok) {
        const error = await response.json();
        alert(error.detail);
    }
    const quizzes = await response.json();
    const quizList = document.getElementById("quiz-list");

    quizzes.forEach((quiz) => {
        const newCol = document.createElement("div");
        newCol.setAttribute("class", "col");
        newCol.classList.add("text-center");
        newCol.setAttribute("onclick", `articleDetail(${quiz.id})`);

        const newCard = document.createElement("div");
        newCard.setAttribute("class", "card");
        newCard.classList.add("col");
        newCard.setAttribute("id", quiz.id);
        newCol.appendChild(newCard);

        const newCardHeader = document.createElement("div");
        newCardHeader.setAttribute("class", "card-header");
        newCard.appendChild(newCardHeader);

        const newCardtitle = document.createElement("h5");
        newCardtitle.setAttribute("class", "card-title");
        newCardtitle.innerText = quiz.author.nickname;
        newCardHeader.appendChild(newCardtitle);

        const articleImage = document.createElement("img");
        articleImage.setAttribute("class", "card-img-top");
        articleImage.classList.add();

        if (quiz.image) {
            articleImage.setAttribute(
                "src",
                `${backend_base_url}${quiz.image}`
            );
        } else {
            articleImage.setAttribute(
                "src",
                "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMzA1MjdfMTE1%2FMDAxNjg1MTk1MjQ0MjAz.iIaJDy9Yp3NiRG9PHd4uI_za1f1HKO7J5o6Q3wATqzcg.l8Pem3MI699fPi3SGH2l7e_rgr8tjthQbCFGuPX6Ig4g.JPEG.loveyoujuwon7354%2FIMG_3273.jpg&type=a340"
            );
        }

        newCard.appendChild(articleImage);

        const newCardbody = document.createElement("div");
        newCardbody.setAttribute("class", "card-body");
        newCard.appendChild(newCardbody);
        const newCardText = document.createElement("div");

        quizList.appendChild(newCol);
    });
}

loadQuizzes();

// 작성된 글들 스타일 별로 나누고 조회순으로 보기
// window.onload = async function loadArticles() {
//     const articles = await getArticles();

//     const matchingStyleArticles = [];
//     const nonMatchingStyleArticles = [];

//     articles.sort((a, b) => b.views - a.views);

//     articles.forEach(article => {
//         if (isStyleMatch(article)) {
//             matchingStyleArticles.push(article);
//         } else {
//             nonMatchingStyleArticles.push(article);
//         }
//     });

//     const matchingStyleList = document.getElementById("matchingStyleList");
//     const nonMatchingStyleList = document.getElementById("nonMatchingStyleList");

//     matchingStyleArticles.forEach(article => {
//         const articleCard = createArticleCard(article);
//         matchingStyleList.appendChild(articleCard);
//     });

//     nonMatchingStyleArticles.forEach(article => {
//         const articleCard = createArticleCard(article);
//         nonMatchingStyleList.appendChild(articleCard);
//     });
// }

// 스타일과 논스타일을 조회순으로 나누고 해당 스타일의 카드에 넣어 보여줌
// function createArticleCard(article) {
//     const newCol = document.createElement("div");
//     newCol.setAttribute("class", "col");
// newCol.setAttribute("onclick", "articleDetail()")

//     const newCard = document.createElement("div");
//     newCard.setAttribute("class", "card");
//     newCard.setAttribute("id", article.pk);

//     newCol.appendChild(newCard);

//     const articleImage = document.createElement("img");
//     articleImage.setAttribute("class", "card-img-top");

//     if (article.image) {
//         articleImage.setAttribute("src", `${backend_base_url}${article.image}`);
//     } else {
//         articleImage.setAttribute("src", "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMzA1MjdfMTE1%2FMDAxNjg1MTk1MjQ0MjAz.iIaJDy9Yp3NiRG9PHd4uI_za1f1HKO7J5o6Q3wATqzcg.l8Pem3MI699fPi3SGH2l7e_rgr8tjthQbCFGuPX6Ig4g.JPEG.loveyoujuwon7354%2FIMG_3273.jpg&type=a340");
//     }

//     newCard.appendChild(articleImage);

//     const newCardbody = document.createElement("div");
//     newCardbody.setAttribute("class", "card-body");
//     newCard.appendChild(newCardbody);

//     const newCardtitle = document.createElement("h5");
//     newCardtitle.setAttribute("class", "card-title");
//     newCardtitle.innerText = article.newCardtitle;
//     newCardbody.appendChild(newCardtitle);

//     return newCol;
// }
