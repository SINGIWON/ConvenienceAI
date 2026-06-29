async function analyzeImage(base64Image) {
    const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image })
    });

    const data = await response.json();
    return data.result;
}