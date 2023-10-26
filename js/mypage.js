window.onload = async () => {
    const urlParms = new URLSearchParams(window.location.search);
    const userId = urlParms.get("user_id") || localStorage.getItem("me");
    await loadUserInfo(userId);
    await loadRankingList(userId);
};

async function loadUserInfo(userId) {
    const response = await getUserInfo(userId);
    const data = await response.json();
    if (!response.ok) {
        return;
    }
    const email = document.getElementById("email");
    const nickname = document.getElementById("nickname");
    const point = document.getElementById("point");

    email.textContent = data.email;
    nickname.textContent = data.nickname;
    point.textContent = data.point;

    const tbody = document.querySelector("#point-log > tbody");
    const cost = {
        hint: "-5",
        likes: "+1",
        quiz: "+10",
        create: "-1",
    };
    const action = {
        hint: "힌트 사용",
        likes: "좋아요 받음",
        quiz: "퀴즈 맞춤",
        create: "이미지 생성",
    };
    const trList = [];
    data.history_logs.forEach((log) => {
        trList.push(
            `<tr>
                <th scope="row">${log.created_at}</th>
                <td>${action[log.action]}</td>
                <td>${cost[log.action]}</td>
                <td>${log.point}</td>
            </tr>`
        );
    });
    tbody.innerHTML = trList.join("");
}
async function loadRankingList(userId) {
    const response = await getRankingList(userId);
    const data = await response.json();
    if (!response.ok) {
        return;
    }
    const rankingList = document.querySelector("#myranking > tbody");
    data.forEach((player) => {
        if (player.id == userId) {
            rankingList.innerHTML += `<tr class="table-active">
                <th scope="row">${player.rank}</th>
                <td>${player.nickname}</td>
                <td>${player.point}</td>
                </tr>
            `;
        } else {
            rankingList.innerHTML += `<tr>
                <th scope="row">${player.rank}</th>
                <td>${player.nickname}</td>
                <td>${player.point}</td>
                </tr>
            `;
        }
    });
}
