const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path"); 
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

main().then(() => {
  console.log("Connected to DB");
}).catch((err) => {
  console.log("DB Connection Error:", err);
});

async function main() {
  await mongoose.connect(MONGO_URL, );
}

app.get("/", (req, res) => {
  res.send("Hello, I am working");
});


// Index Route

app.get("/listings", wrapAsync( async (req, res) => {
  
    let allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  }));

  
  //NEW ROUTE

  app.get("/listings/new", (req,res)=>{
    res.render("listings/new")
  })  

  // Show route

  app.get("/listings/:id", wrapAsync( async(req,res)=>{
    let {id} = req.params;
   let listing = await Listing.findById(id);
   res.render("listings/show",{listing})
  }));

  // create route

  app.post("/listings", wrapAsync( async(req,res,next)=>{
   
    
      const newListing =  new Listing(req.body.listing);
      await newListing.save();
      res.redirect("/listings")
 
  }));

  

 // edit route
  app.get("/listings/:id/edit", wrapAsync( async (req,res) =>{
    let {id} = req.params;
   let listing = await Listing.findById(id);
   res.render("listings/edit", {listing});
  }));


  //UPDATE route

app.put("/listings/:id", wrapAsync( async (req, res, next) => {
  let { id } = req.params;
  let { title, description, location, country, price, image } = req.body.listing;

  let newL = await Listing.findByIdAndUpdate(id, {
      title: title,
      description: description,
      location: location,
      country: country,
      price: price,
      'image.filename': image.filename,
      'image.url': image.url
  }, { new: true });

  console.log(newL);
  res.redirect(`/listings/${id}`);
}));

  

  //delete route

  app.delete("/listings/:id", wrapAsync( async(req,res)=>{
    let {id} = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
  }));

  app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
  })

  app.use((err,req,res,next)=>{
  let {statusCode=500 , message="something went wrong"} = err;
  res.status(statusCode).render("Error.ejs", {message});
  // res.status(statusCode).send(message);
  })
    
  

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
