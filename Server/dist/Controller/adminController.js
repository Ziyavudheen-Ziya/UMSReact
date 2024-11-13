"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../Config/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.default = {
    adminLoginPost: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const emailMatch = email === process.env.ADMIN_EMAIL;
            const passwordMatch = password === process.env.ADMIN_PASSWORD;
            if (emailMatch && passwordMatch) {
                const adminJWT = jsonwebtoken_1.default.sign({ email }, String(process.env.JWT_KEY), {
                    expiresIn: '1h'
                });
                res.status(200).send({ success: true, adminJWT });
            }
            else {
                res.status(401).send({ success: false, message: "Invalid Credentials" });
            }
        }
        catch (error) {
            console.log(error);
        }
    }),
    adminDashboardData: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const query = `SELECT id, username, email, phone FROM users`;
            const dashboardData = yield db_1.client.query(query);
            res.status(200).send({ success: true, dashboardData: dashboardData === null || dashboardData === void 0 ? void 0 : dashboardData.rows });
        }
        catch (error) {
            res.status(500).send({ success: false, message: "Failed to fetch data from db" });
        }
    }),
    verifyAdmin: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { adminJWT } = req.body;
            const verifyJWT = jsonwebtoken_1.default.verify(adminJWT, String(process.env.JWT_KEY));
            if (verifyJWT.email !== process.env.ADMIN_EMAIL) {
                return res.status(401).send({ success: false, message: "AdminJWT failed to verified" });
            }
            res.status(200).send({ success: true, message: "Admin JWT verified successfulyy" });
        }
        catch (error) {
            if ((error === null || error === void 0 ? void 0 : error.message) === "Invalid signature") {
                res.status(401).send({ success: false, message: "Admin JWT failed to verify" });
            }
        }
    }),
    updatedUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { username, email, phone } = req.body;
            const query = `UPDATE users SET username = $1, email = $2, phone = $3 WHERE id = $4 RETURNING *`;
            const result = yield db_1.client.query(query, [username, email, phone, id]);
            if (result.rows.length > 0) {
                res.status(200).send({
                    success: true,
                    user: result.rows[0],
                });
            }
            else {
                res.status(404).send({ success: false, message: "User not found", imagePath: req.file.filename, });
            }
        }
        catch (error) {
            console.log("Error updating user:", error);
            res.status(500).send({ success: false, message: "Internal server error" });
        }
    }),
    deleteUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const query = `DELETE FROM users WHERE id=$1`;
            yield db_1.client.query(query, [id]);
            res.status(200).send({ success: true });
        }
        catch (error) {
        }
    }),
    addUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { username, email, phone, password } = req.body;
            const checkQuery = `SELECT * FROM users WHERE email = $1`;
            const existingUserResult = yield db_1.client.query(checkQuery, [email]);
            if (existingUserResult.rows.length > 0) {
                return res.status(200).send({
                    success: false,
                    message: "User with this email already exists",
                });
            }
            const encryptedPassword = yield bcrypt_1.default.hash(password, 10);
            const insertQuery = `INSERT INTO users (username, email, phone, password) 
                           VALUES ($1, $2, $3, $4) RETURNING id, username, email, phone`;
            const result = yield db_1.client.query(insertQuery, [username, email, phone, encryptedPassword]);
            if (result.rows.length > 0) {
                const newUser = result.rows[0];
                return res.status(200).send({ success: true, newUser });
            }
            else {
                throw new Error('Failed to insert new user');
            }
        }
        catch (error) {
            console.log("Error adding user:", error);
            if (error.code === "23505") {
                return res.status(200).send({ success: false, message: "Credentials already exist" });
            }
            else {
                return res.status(500).send({ success: false, message: error.message });
            }
        }
    })
};
