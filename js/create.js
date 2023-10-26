// async function addStyleList() {
//     const stylesForm = document.getElementById("style");
//     const response = await getStyleList();
//     if (response.ok) {
//         const styles = await response.json();
//         for (const { id, name } of styles) {
//             let option = document.createElement("option");
//             option.value = id;
//             option.innerText = name;
//             stylesForm.appendChild(option);
//         }
//     }
// }

// addStyleList();
const images = [];
const imageList = document.getElementById("image-list");
let selectedIdx;

async function generateImage() {
    const prompt = document.getElementById("prompt").value;
    // 서버에 요청을 하면 서버가 포인트를 차감하고 api키와 번역된 프롬프트를 반환
    const preResponse = await prepareKarloAPI(prompt);
    if (!preResponse.ok) {
        const error = await preResponse.json();
        alert(error.detail);
        return;
    }
    const data = await preResponse.json();
    console.log(data.prompt);
    const response = await karloAPI(data.prompt, data.API_KEY);
    if (!response.ok) {
        const error = await response.json();
        alert(error.detail);
        return;
    }
    const content = await response.json();
    const image = content.images[0].image;
    images.push(image);
    const imageCard = `
    <div class="col">
        <div class="card" id="image${images.length - 1}" onclick="selectImage(${
        images.length - 1
    })">
            <img src="data:image/webp;base64,${image}" class="card-img-top" alt="">
            <div class="card-body">
                <p class="card-text">${prompt}</p>
            </div>
        </div>
    </div>`;
    imageList.insertAdjacentHTML("beforeend", imageCard);
}

function selectImage(idx) {
    if (selectedIdx !== undefined) {
        const selectedImage = imageList.querySelector(`#image${selectedIdx}`);
        selectedImage.classList.remove("border-success");
        selectedImage.classList.remove("border-4");
    }
    selectedIdx = idx;
    const selectedImage = imageList.querySelector(`#image${selectedIdx}`);
    selectedImage.classList.add("border-success");
    selectedImage.classList.add("border-4");
}

async function createQuiz() {
    const answer = document.getElementById("answer").value;
    const hint = document.getElementById("hint").value;
    const image = images[selectedIdx];

    data = {
        correct_answer: answer,
        hint: hint,
        image: image,
    };
    const response = await postQuiz(data);

    if (response.ok) {
        window.location.href = "/index.html";
    } else {
        const error = await response.json();
        console.log(error);
    }
}
