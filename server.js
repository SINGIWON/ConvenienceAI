import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.options("*", cors());

app.use(express.json({ limit: "10mb" }));

const API_KEY = process.env.GEMINI_API_KEY;

app.post("/api/analyze", async (req, res) => {
    try {
        const image = req.body.image;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: "이미지 분석해서 JSON으로 반환" },
                            {
                                inline_data: {
                                    mime_type: "image/jpeg",
                                    data: image.split(",")[1]
                                }
                            }
                        ]
                    }]
                })
            }
        );

        const data = await response.json();

        res.setHeader("Access-Control-Allow-Origin", "*");

        res.json({
            result: data.candidates?.[0]?.content?.parts?.[0]?.text || "no result"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "server error" });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});