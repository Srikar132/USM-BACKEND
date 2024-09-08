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
exports.UserController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const core_1 = require("@overnightjs/core");
const userModel_1 = require("../models/userModel");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../middlewares/auth");
let UserController = class UserController {
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { first_name, last_name, phone_number, gender, job_title, company, skills, username, email, password, bio, website, social_links } = req.body;
                const existingUser = yield userModel_1.User.findOne({ "basic_info.email": email });
                if (existingUser) {
                    return res.status(400).json({ message: `User already exists with email ${email}` });
                }
                const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
                const user = new userModel_1.User({
                    basic_info: {
                        first_name,
                        last_name,
                        username,
                        email,
                        phone_number,
                        gender
                    },
                    security: {
                        password_hash: hashedPassword
                    },
                    professional_info: {
                        job_title,
                        company,
                        skills
                    },
                    social: {
                        bio,
                        website,
                        social_links
                    }
                });
                yield user.save();
                res.status(200).json({ message: 'User registered successfully' });
            }
            catch (error) {
                console.error("Error registering user:", error);
                res.status(400).json({ message: 'Error registering user', error });
            }
        });
    }
    loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const { email, password } = req.body;
                const user = yield userModel_1.User.findOne({ "basic_info.email": email });
                if (!user) {
                    return res.status(401).json({ message: "Invalid Credentials" });
                }
                if (!user.security || !user.basic_info || !user.professional_info) {
                    return res.status(400).json({ message: "User data info is missing" });
                }
                const checkPassword = yield bcryptjs_1.default.compare(password, user.security.password_hash);
                if (!checkPassword) {
                    return res.status(400).json({ message: "Incorrect Password" });
                }
                // Update last login time
                user.security.last_login = new Date();
                yield user.save();
                const token = jsonwebtoken_1.default.sign({
                    _id: user._id,
                    username: user.basic_info.username,
                    email: user.basic_info.email,
                    first_name: user.basic_info.first_name,
                    last_name: user.basic_info.last_name,
                    phone_number: user.basic_info.phone_number,
                    gender: user.basic_info.gender,
                    role: user.security.role,
                    last_login: user.security.last_login,
                    account_status: user.security.account_status,
                    job_title: user.professional_info.job_title,
                    company: user.professional_info.company,
                    skills: user.professional_info.skills,
                    bio: ((_a = user.social) === null || _a === void 0 ? void 0 : _a.bio) || '',
                    website: ((_b = user.social) === null || _b === void 0 ? void 0 : _b.website) || '',
                    social_links: ((_c = user.social) === null || _c === void 0 ? void 0 : _c.social_links) || [],
                    account_created_at: user.security.account_created_at
                }, process.env.JWT_SECRET, { expiresIn: "1h" });
                return res.status(200).json({ token, message: "User logged in successfully" });
            }
            catch (error) {
                console.error("Login error:", error);
                res.status(400).json({ message: "Error logging in", error });
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
                res.status(200).json({ message: "updated successfully" });
            }
            catch (error) {
                console.error("Error updating user:", error);
                res.status(400).json({ message: "Error updating user", error });
            }
        });
    }
    getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                const user = yield userModel_1.User.findById(req.user._id);
                if (!user) {
                    res.status(400).json({ message: "user not fount" });
                }
                res.status(200).json(user);
            }
            catch (error) {
                console.error("Error retrieving profile:", error);
                res.status(500).send("Error retrieving profile");
            }
        });
    }
};
exports.UserController = UserController;
__decorate([
    (0, core_1.Post)('register'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "register", null);
__decorate([
    (0, core_1.Post)('login'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "loginUser", null);
__decorate([
    (0, core_1.Put)('update/:id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, core_1.Get)('profile'),
    (0, core_1.Middleware)(auth_1.auth),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getProfile", null);
exports.UserController = UserController = __decorate([
    (0, core_1.Controller)('api/users')
], UserController);
