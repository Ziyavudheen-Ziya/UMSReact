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
const db_1 = require("../Config/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.default = {
    signupPost: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // const validate = signupValidator(req.body)
            // if(!validate){
            //      res.status(400).send({success:false,message:"InvalidData"});
            // }
            const { username, email, phone, password } = req.body;
            const checkQuery = `SELECT * FROM users WHERE email = $1 OR username = $2`;
            const checkResult = yield db_1.client.query(checkQuery, [email, username]);
            if (checkResult.rows.length > 0) {
                return res.status(403).send({
                    success: false,
                });
            }
            try {
                const encryptedPassword = bcrypt_1.default.hashSync(password, 10);
                const query = `INSERT INTO users (username,email,phone,password) VALUES ($1, $2, $3, $4)`;
                yield db_1.client.query(query, [username, email, phone, encryptedPassword]);
                const userJWT = jsonwebtoken_1.default.sign({ email }, String(process.env.JWT_KEY), {
                    expiresIn: "1h",
                });
                return res.status(200).send({ success: true, userJWT });
            }
            catch (error) {
                if (error.code === '23505') {
                    return res.status(403)
                        .send({ success: false, message: "Credentials already exists" });
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    }),
    loginPost: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const query = `SELECT email, password FROM users WHERE email = $1`;
            const result = yield db_1.client.query(query, [email]);
            const user = result.rows[0];
            const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).send({ success: false, message: "Invalid email or password" });
            }
            const userJWT = jsonwebtoken_1.default.sign({ email }, String(process.env.JWT_KEY), {
                expiresIn: '1h'
            });
            res.status(200).send({ success: true, message: "Login successfully ", userJWT });
        }
        catch (error) {
            res.status(500).send({ success: false, message: "Internal server error" });
        }
    }),
    verifyUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userJWT } = req.body;
            const verifyJWT = jsonwebtoken_1.default.verify(userJWT, String(process.env.JWT_KEY));
            return res
                .status(200)
                .send({ success: true, message: "User JWT verified successfully" });
        }
        catch (error) {
            if ((error === null || error === void 0 ? void 0 : error.message) === 'Invalid signature') {
                res
                    .status(401)
                    .send({ success: false, message: "User JWT failed to verify" });
            }
        }
    }),
    uploadImage: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(req.file.filename);
            const { userJWT } = req.body;
            const { email } = jsonwebtoken_1.default.verify(userJWT, String(process.env.JWT_KEY));
            const query = `UPDATE users SET image = $1 WHERE email = $2`;
            let imagePath = yield db_1.client.query(query, [req.file.filename, email]);
            res.status(200).send({ success: true, imagePath: imagePath });
        }
        catch (error) {
            console.log(error);
        }
    }),
    fetchUserData: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userJWT } = req.body;
            console.log("fatchUser Data is comming");
            const { email } = jsonwebtoken_1.default.verify(userJWT, String(process.env.JWT_KEY));
            const query = `SELECT username,email,phone,image FROM users WHERE email=$1`;
            const result = yield db_1.client.query(query, [email]);
            const userData = result.rows[0];
            console.log("userdat is comming", userData);
            res.status(200).send({ success: true, userData });
        }
        catch (error) {
            console.log(error);
        }
    }),
};
