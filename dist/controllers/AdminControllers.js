"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.AdminController = void 0;
const auth_1 = require("./../middlewares/auth");
const core_1 = require("@overnightjs/core");
const userModel_1 = require("../models/userModel");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
let AdminController = class AdminController {
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield userModel_1.User.find({ 'security.role': 'user' });
                res.json(users);
            }
            catch (error) {
                res.status(200).send("Erro retriving users");
            }
        });
    }
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.User.findById(req.params.id);
                if (!user) {
                    return res.status(401).send("User not found");
                }
                res.json(user);
            }
            catch (error) {
                res.status(401).send("Error retrieving user.");
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                const { first_name, last_name, phone_number, gender, job_title, company, skills, username, email, password, bio, website, social_links } = req.body;
                const user = yield userModel_1.User.findById(userId);
                if (!user) {
                    return res.status(404).json({ message: "User not found." });
                }
                if (!user.security || !user.basic_info || !user.professional_info || !user.social) {
                    return res.status(400).json({ message: "User data info is missing" });
                }
                if (first_name)
                    user.basic_info.first_name = first_name;
                if (last_name)
                    user.basic_info.last_name = last_name;
                if (phone_number)
                    user.basic_info.phone_number = phone_number;
                if (gender)
                    user.basic_info.gender = gender;
                if (username)
                    user.basic_info.username = username;
                if (email)
                    user.basic_info.email = email;
                if (job_title)
                    user.professional_info.job_title = job_title;
                if (company)
                    user.professional_info.company = company;
                if (skills)
                    user.professional_info.skills = skills;
                if (bio)
                    user.social.bio = bio;
                if (website)
                    user.social.website = website;
                if (social_links)
                    user.social.social_links = social_links;
                if (password) {
                    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
                    user.security.password_hash = hashedPassword;
                }
                yield user.save();
                res.status(200).json(user);
            }
            catch (error) {
                console.error("Error updating user:", error);
                res.status(400).json({ message: "Error updating user", error });
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield userModel_1.User.findByIdAndDelete(req.params.id);
                res.status(200).json({ message: 'User deleted' });
            }
            catch (error) {
                res.status(500).send("Error deleting user");
            }
        });
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, core_1.Get)('users'),
    (0, core_1.Middleware)(auth_1.auth),
    (0, core_1.Middleware)(auth_1.adminAuth),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUsers", null);
__decorate([
    (0, core_1.Get)('users/:id'),
    (0, core_1.Middleware)(auth_1.auth),
    (0, core_1.Middleware)(auth_1.adminAuth),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUser", null);
__decorate([
    (0, core_1.Put)('users/:id'),
    (0, core_1.Middleware)(auth_1.auth),
    (0, core_1.Middleware)(auth_1.adminAuth),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateUser", null);
__decorate([
    (0, core_1.Delete)('users/:id'),
    (0, core_1.Middleware)(auth_1.auth),
    (0, core_1.Middleware)(auth_1.adminAuth),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteUser", null);
exports.AdminController = AdminController = __decorate([
    (0, core_1.Controller)('api/admin')
], AdminController);
