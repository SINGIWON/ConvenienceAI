import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

// 모든 요청 로그
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
});

// CORS
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
}));

app.options("*", cors());

app.use(express.json({ limit: "10mb" }));

const API_KEY = process.env.GEMINI_API_KEY;

app.post("/api/analyze", async (req, res) => {
    console.log("POST /api/analyze 시작");

    try {
        if (!req.body.image) {
            console.log("이미지 없음");
            return res.status(400).json({ error: "image missing" });
        }

        const image = req.body.image;

        console.log("Gemini 요청 시작");

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            {
                                text: "이미지를 분석해서 JSON으로 반환해줘."
                            },
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

        console.log("Gemini 응답 코드:", response.status);

        const data = await response.json();

        console.log("Gemini 응답:", JSON.stringify(data));

        res.json({
            result: data.candidates?.[0]?.content?.parts?.[0]?.text ?? "no result"
        });

    } catch (err) {
        console.error("SERVER ERROR");
        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }
});

app.get("/", (req, res) => {
    res.send("ConvenienceAI Server Running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});