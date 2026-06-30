const response = await fetch("https://convenience-ai.onrender.com/api/analyze", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        image: base64Image
    })
});
