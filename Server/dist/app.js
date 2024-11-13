"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./Config/db"));
const cors_1 = __importDefault(require("cors"));
const userRouter_1 = __importDefault(require("./Router/userRouter"));
const adminRouter_1 = __importDefault(require("./Router/adminRouter"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
dotenv_1.default.config();
(0, db_1.default)().then(() => console.log("Connected suuccessfullt SQL Database"));
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(express_1.default.static('public'));
app.use("/user", userRouter_1.default);
app.use("/admin", adminRouter_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
