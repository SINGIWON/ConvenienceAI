
const btn = document.getElementById("cameraBtn");
const preview = document.getElementById("preview");
const resultDiv = document.getElementById("result");

btn.addEventListener("click", async () => {

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment";

    input.onchange = async (event) => {
        const file = event.target.files[0];

        const reader = new FileReader();

        reader.onload = async (e) => {

            // 1. 이미지 보여주기
            preview.src = e.target.result;
            preview.style.display = "block";

            // 2. AI 분석 시작
            resultDiv.innerText = "AI 분석중...";

            const result = await analyzeImage(e.target.result);

            // 3. 결과 출력
            resultDiv.innerText = JSON.stringify(JSON.parse(result), null, 2);;
        };

        reader.readAsDataURL(file);
    };

    input.click();
});