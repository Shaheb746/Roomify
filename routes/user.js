import express from 'express'
const router = express.Router()
import wrapAsync from '../utils/wrapAsync.js';
import passport from 'passport';
import { saveRedirectUrl } from '../middleware.js';
import { renderSignUp, userSignUp, renderUser, userLogin, userLogout } from '../controllars/user.js';

// signUp route
router.route('/signup')
.get(renderSignUp)
.post(wrapAsync(userSignUp))

// login route
router.route('/login')
.get(renderUser)
.post(saveRedirectUrl ,passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), userLogin)

// logout route
router.get("/logout", userLogout);


export default router;
