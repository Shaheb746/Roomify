import express from 'express'
const router = express.Router()
import wrapAsync from '../utils/wrapAsync.js';
import { isLoggedIn, isOwner, validateListing } from '../middleware.js';
import { createRoute, deleteRoute, editRoute, index, renderNewForm, showRoute, updateRoute } from '../controllars/listing.js';
// cloud Storage
import multer from 'multer';
import {storage} from '../cloudConfig.js'
const upload = multer({ storage });

router.route('/')
.get(wrapAsync(index)) // create route
.post(isLoggedIn, upload.single('listing[image]'), validateListing ,  wrapAsync(createRoute)) // listings route 


// new route
router.get('/new', isLoggedIn, renderNewForm)


router.route('/:id')
.get(wrapAsync(showRoute))// show route
.put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing ,wrapAsync(updateRoute))// update route
.delete(isLoggedIn, wrapAsync(deleteRoute)) // delete route

// edit route
router.get('/:id/edit', isLoggedIn, wrapAsync(editRoute));


export default router;
