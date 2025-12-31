import dotenv from "dotenv";
import mongoose from 'mongoose';
import express from 'express';
dotenv.config();
const app = express();
const port = process.env.PORT;
import methodOverride from 'method-override';
import ejsMate from 'ejs-mate';
import listingRouter from "./routes/listing.js" //import listing routes 
import reviewRouter from "./routes/review.js" //import reviews routes
import userRouter from "./routes/user.js" //import user utes 
import ExpressError from './utils/ExpressError.js'; //
import session from 'express-session';
import MongoStore, { createWebCryptoAdapter } from 'connect-mongo'
import flash from 'connect-flash'
import passport from 'passport';
import LocalStrategy from "passport-local";
import User from "./model/user.js";

app.set('view engine', 'ejs');
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

// Connect to MongoDB

const URI = process.env.MONGO_URI
main().then(() => {
  console.log('Database connected');
}).catch(err => {
  console.error('Database connection error:', err);
});
async function main() {
  await mongoose.connect(URI);
}
const store = MongoStore.create({
  mongoUrl: URI,
  cryptoAdapter: createWebCryptoAdapter({
    secret: process.env.SESSION_SECRET,
  }),
  touchAfter: 24 * 3600
})
store.on("error", ()=>{
  console.log("Error in MONGO SESSION STORE!");
});
let sessionOptions = {
  store,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, //this is preven from IDOR
  }
};

app.use(session(sessionOptions));
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.get('/', (req, res) => {
  res.render('listing/root.ejs');
});

// login 
app.use("/", userRouter);
// listings
app.use("/listings", listingRouter);
// reviews
app.use("/listings/:id/reviews", reviewRouter);

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});
app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong!" } = err;
  res.status(status).render("error.ejs",{message})
})

// listen for requests
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  
});











