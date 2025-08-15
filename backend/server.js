import express from "express";
import cors from "cors";
import recipeRouter from "./routes/recipes.js";
import chatRouter from "./routes/chatbot.js";
import authRouter from "./routes/authentication.js";
import verifyToken from "./middleware/auth.js";

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/recipes", recipeRouter);
app.use("/chat", chatRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
});