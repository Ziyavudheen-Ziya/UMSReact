"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = __importDefault(require("../Controller/adminController"));
const adminRouter = (0, express_1.Router)();
adminRouter.post('/login', adminController_1.default.adminLoginPost);
adminRouter.post('/getDashboardData', adminController_1.default.adminDashboardData);
adminRouter.post('/verifyAdmin', adminController_1.default.verifyAdmin);
adminRouter.put('/updateUser/:id', adminController_1.default.updatedUser);
adminRouter.delete('/delete/:id', adminController_1.default.deleteUser);
adminRouter.post('/add', adminController_1.default.addUser);
exports.default = adminRouter;
