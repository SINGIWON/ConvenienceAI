const API_KEY = "";

async function analyzeImage(base64Image) {

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: `
이 이미지에서 편의점 상품을 인식해서
상품명과 개수를 JSON으로 반환해.

형식:
[
  {"name":"상품명","count":숫자}
]

없으면 count 0 포함해서 모두 출력해.
`
                            },
                            {
                                inlineData: {
                                    mimeType: "image/jpeg",
                                    data: base64Image.split(",")[1]
                                }
                            }
                        ]
                    }
                ]
            })
        }
    );

    const data = await response.json();

    return data.candidates?.[0]?.content?.parts?.[0]?.text;
}