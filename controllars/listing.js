import Listing from "../model/listing.js";
import * as maptilerClient from "@maptiler/client"; //map
maptilerClient.config.apiKey = "wEIVBOjXOmNk2wcmnpCk"; //map

export const index =  async (req, res, next) => {
  const { search } = req.query;
  let listings;
  if(search){
    listings = await Listing.find({
      $or: [
        { location: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } }
      ]
    });
  } else {
    listings = await Listing.find({});
  }
  res.render("listing/index.ejs", { listings, search });

};

export const renderNewForm = (req, res) => {
  // console.log(req.user);
  res.render('listing/new.ejs');
};

export const createRoute = async (req, res, next) => {
  const geoData = await maptilerClient.geocoding.forward(
    req.body.listing.location,
  );
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {url, filename}

  newListing.geometry = geoData.features[0].geometry

  let savedListing = await newListing.save();
  console.log(savedListing);
  
  req.flash("success", "New Listing Created");
  res.redirect(`/listings`);
};

export const showRoute = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate({
    path: "reviews", 
    populate: {
      path: "author"
    }}).populate("owner");
  if(!listing) {
    req.flash("error", "Listing not found!");
    res.redirect(`/listings`)
  }else{
    res.render('listing/show.ejs', { listing });
  } 
};

export let editRoute = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findById(id);

  if(!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect(`/listings`)
  }else{
    let originalImageUrl = listing.image.url
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/ar_1.0,c_fill,w_250/r_5")
    res.render('listing/edit.ejs', { listing , originalImageUrl});
  }
};

export let updateRoute = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing })
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename
    listing.image = {url, filename}
    await listing.save()
  }
  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`)
};

export let deleteRoute = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id)
  req.flash("success", "Listing Deleted");
  res.redirect('/listings')
};
