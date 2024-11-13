"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../Controller/userController"));
const multer_1 = require("../Service/multer");
const userRouter = (0, express_1.Router)();
userRouter.post('/signup', userController_1.default.signupPost);
userRouter.post('/login', userController_1.default.loginPost);
userRouter.post('/verifyUser', userController_1.default.verifyUser);
userRouter.post('/uploadImage', multer_1.upload.single('image'), userController_1.default.uploadImage);
userRouter.post('/fetchUserData', userController_1.default.fetchUserData);
exports.default = userRouter;
