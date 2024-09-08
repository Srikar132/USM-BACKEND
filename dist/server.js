"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AdminControllers_1 = require("./controllers/AdminControllers");
const UserController_1 = require("./controllers/UserController");
const express_1 = __importDefault(require("express"));
const core_1 = require("@overnightjs/core");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
class AppServer extends core_1.Server {
    constructor() {
        super();
        this.app.use(express_1.default.json());
        this.app.use((0, cors_1.default)());
        this.setupDatabase();
        this.setupControllers();
    }
    setupDatabase() {
        const mongoURL = process.env.MONGO_URL || 'mongodb+srv://bunnyking828:sGfTbvMWAc1cKK7t@cluster0.qcx5r.mongodb.net/user-management-system';
        mongoose_1.default.connect(mongoURL).then(() => console.log("mongodb is connected"))
            .catch((err) => console.log("mongodb connection failed ", err));
    }
    setupControllers() {
        const userController = new UserController_1.UserController();
        const adminController = new AdminControllers_1.AdminController();
        this.addControllers([userController, adminController]);
    }
    start(port) {
        this.app.listen(port, () => {
            console.log(`server is running on the port ${port}`);
        });
    }
}
const appServer = new AppServer();
appServer.start(8000);
