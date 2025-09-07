const express = require('express');
const router = express.Router();
const { validateListing } = require('../schema.js');
let wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, isOwner } = require('../auth.js');
const listingController = require('../controllers/listings.js')
const multer = require('multer')
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });



//root route
router.get('', wrapAsync(listingController.index));

//new route
router.get('/new', isLoggedIn, (listingController.newPlace));

//create route
router.post('/addPlace', isLoggedIn, validateListing, upload.single('listing[image]'), wrapAsync(listingController.addPlace));


//edit route
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

//filter route
router.get('/filter', wrapAsync(listingController.filter));

//search
router.get('/search',wrapAsync(listingController.search));

router.route('/:id')
    .get(wrapAsync(listingController.show))
    .put(validateListing, upload.single('listing[image]'), wrapAsync(listingController.update))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.delete));

module.exports = router;