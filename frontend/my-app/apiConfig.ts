import dotenv from "dotenv";

dotenv.config();

const BASE_URL = process.env.API_URL || "https://tasker-api.perazzojoao.online/api/v2";
const BASE_FRONT_URL = "http://localhost:3000";

export { BASE_URL, BASE_FRONT_URL };
