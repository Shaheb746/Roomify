import User from '../model/user.js';


export const renderSignUp = (req, res)=>{
    res.render("users/signup.ejs")
}

export const userSignUp = async(req, res)=>{
    try{
        let {username, email, password} = req.body
        const newUser = new User({ email, username })
        const registereduser = await User.register(newUser, password)
        console.log(registereduser);
        req.login(registereduser, (err)=>{
            if (err) {
                return next(err)
            }
            req.flash("success", "welcome to wanderlust")
            res.redirect("/listings")
        })
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup")
    }
    
}

export const renderUser = (req, res) => {
    res.render("users/login.ejs")
}

export const userLogin = async (req, res) => {
    req.flash("success", "Login Successful")
    let redirectURL = res.locals.redirectUrl || "/listings";
    res.redirect(redirectURL)
}

export const userLogout = (req, res, next)=>{
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash("success", "Logged Out Successfully");
        res.redirect("/listings");
      });
}