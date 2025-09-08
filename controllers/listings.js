const Listing = require('../models/listing.js');
const { cloudinary } = require('../cloudConfig.js');

module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render('listings/index.ejs', { allListings });
}

module.exports.newPlace = (req, res) => {
    res.render('listings/newPlace.ejs');
}

module.exports.show = async (req, res) => {
    const { id } = req.params;
    let mapToken = process.env.MAP_TOKEN;
    let listing = await Listing.findById(id);
    let [lat, lng] = listing.geometry.coordinates;
    let place = listing.location;

    let data = await Listing.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('owner');
    if (!data) {
        req.flash('error', 'Place does not exist !');
        res.redirect('/listings');
    } else {
        res.render('listings/show.ejs', { data, mapToken, lat, lng, place });
    }
}

module.exports.addPlace = async (req, res, next) => {
    const apiKey = process.env.MAP_TOKEN;
    const address = `${req.body.listing.location}`;

    let url = `https://www.mapquestapi.com/geocoding/v1/address?key=${apiKey}&location=${encodeURIComponent(address)}`;

    let coordinate;
    try {
        let response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let data = await response.json();
        console.log(data.results[0].locations[0].latLng);
        let { lat, lng } = data.results[0].locations[0].latLng;
        coordinate = {
            type: 'Point',
            coordinates: [lat, lng]
        }
    } catch (err) {
        console.error('Fetch error:', err);
    }

    url = req.file.path;
    let filename = req.file.filename;
    req.body.listing.reviews = [];
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { filename, url };
    newListing.geometry = coordinate;
    let info = await newListing.save();
    console.log(info);
    req.flash('success', `new place ${newListing.title} added !`);
    res.redirect('/listings');
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let info = await Listing.findById(id);
    if (!info) {
        req.flash('error', 'Place does not update if is not exist !');
        res.redirect('/listings');
    } else {
        res.render('listings/editInfo.ejs', { info });
    }
}

module.exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);

        if (!listing) {
            req.flash('error', 'Listing not found');
            return res.redirect('/listings');
        }
        Object.assign(listing, req.body.listing);

        if (req.file && req.file.path) {
            if (listing.image && listing.image.filename) {
                await cloudinary.uploader.destroy(listing.image.filename);
            }

            const { path: url, filename } = req.file;
            listing.image = { url, filename };
        }

        await listing.save();

        req.flash('success', `Place ${req.body.listing['title']} updated!`);
        res.redirect(`/listings/${id}`);
    } catch (err) {
        next(err);
    }
};



module.exports.delete = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);
    if (listing.image && listing.image.filename) {
        try {
            await cloudinary.uploader.destroy(listing.image.filename);
            console.log(`Cloudinary image ${listing.image.filename} deleted.`);
        } catch (err) {
            console.error('Cloudinary deletion failed:', err);
        }
    }
    await Listing.findByIdAndDelete(id);
    req.flash('success', `Place ${listing.title} deleted !`);
    res.redirect('/listings',);
}

module.exports.filter = async (req, res) => {
    const { category } = req.query;

    const filter = {};
    if (category) {
        filter.category = category;
    }
    const allListings = await Listing.find(filter);//{category:value}
    if (allListings.length === 0) {
        req.flash('error', 'No places found for this category');
        return res.redirect('/listings');
    }
    res.render('listings/index.ejs', { allListings });
}

module.exports.search = async (req, res) => {
    const { location } = req.query;

    const filter = {};
    if (location) {
        const trimmed = location.trim();
        filter.location = { $regex: trimmed, $options: 'i' };
    }
    const allListings = await Listing.find(filter)
    if(allListings.length){
        return res.render('listings/index.ejs', { allListings });
    }else{
        req.flash('error','No place found at this location !');
        return res.redirect('/listings')
    }
}