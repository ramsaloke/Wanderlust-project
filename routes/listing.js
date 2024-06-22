const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");

const {isLoggedIn, isOwner,validateListing} = require("../middleware.js")




  

// Index Route

router.get("/", wrapAsync( async (req, res) => {
  
    let allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  }));

  
  //NEW ROUTE

  router.get("/new", isLoggedIn, (req,res)=>{
    if(!req.isAuthenticated()){
      req.flash("error","you must be logged in to make changes");
      return res.redirect("/listings");
    }
    res.render("listings/new.ejs");
  })  

  // Show route

  router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews").populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show", { listing });
}));


  
  

// Create route
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;  // Ensure owner is set to the logged-in user
  await newListing.save();
  req.flash("success", "New listing created");
  res.redirect("/listings");
}));




// edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync( async (req,res) =>{
  let {id} = req.params;
 let listing = await Listing.findById(id);
 if(!listing){
  req.flash("error", "Listing you requested for does not exist! ")
res.redirect("/listings");
}
 res.render("listings/edit", {listing});
}));


//UPDATE route

router.put("/:id",isLoggedIn,isOwner, validateListing, wrapAsync( async (req, res, next) => {
let {id} = req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  req.flash("success", "listing updated");
  req.redirect(`/listings/${id}`);
})
);

// delete route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync( async(req,res)=>{
  let {id} = req.params;
let deletedListing = await Listing.findByIdAndDelete(id);
console.log(deletedListing);
req.flash("success", "listing deleted")
res.redirect("/listings");
}));

module.exports = router;