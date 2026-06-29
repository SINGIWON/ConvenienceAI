
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
            
            const smallImage = await resizeImage(e.target.result, 800);
            const result = await analyzeImage(smallImage);
            
            // 3. 결과 출력
            resultDiv.innerText = result;
        };

        reader.readAsDataURL(file);
    };

    input.click();
});

function resizeImage(base64, maxSize = 800) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = base64;

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxSize) {
                    height *= maxSize / width;
                    width = maxSize;
                }
            } else {
                if (height > maxSize) {
                    width *= maxSize / height;
                    height = maxSize;
                }
            }

            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(img, 0, 0, width, height);

            resolve(canvas.toDataURL("image/jpeg", 0.7));
        };
    });
}