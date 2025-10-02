import OfferModel from "../../../DB/models/offer.model.js"; 


// ====== CREATE OFFER ======
export const createOffer = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "Admin") {
      return res.status(403).json({ message: "Only admins can create offers" });
    }

    const { title, discountType, discountValue, appliesTo, packageId, startDate, endDate } = req.body;

 
    const now = new Date();
    if (new Date(endDate) < now) {
      return res.status(400).json({ message: "Cannot create an offer that has already ended" });
    }


    let overlapFilter = {
      isActive: true,
      $or: [
        { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } }
      ]
    };

    if (appliesTo === "package") {
      overlapFilter.appliesTo = "package";
      overlapFilter.packageId = packageId;
    } else if (appliesTo === "all") {
      overlapFilter.appliesTo = "all";
    }

    const overlappingOffer = await OfferModel.findOne(overlapFilter);

    if (overlappingOffer) {
      return res.status(400).json({
        message:
          appliesTo === "package"
            ? "A package-specific offer already exists during this period"
            : "A general offer already exists during this period",
        offer: overlappingOffer,
      });
    }

 
    const offerData = { ...req.body, createdBy: req.user._id, updatedBy: req.user._id };
    const newOffer = new OfferModel(offerData);
    await newOffer.save();

    res.status(201).json({ message: "success", offer: newOffer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ====== UPDATE OFFER ======
export const updateOffer = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "Admin") {
      return res.status(403).json({ message: "Only admins can update offers" });
    }

    const { id } = req.params;

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body is required" });
    }

    const { appliesTo, packageId, startDate, endDate } = req.body;

    const existingOffer = await OfferModel.findById(id);
    if (!existingOffer) {
      return res.status(404).json({ message: "Offer not found" });
    }

  
    const now = new Date();
    if (endDate && new Date(endDate) < now) {
      return res.status(400).json({ message: "Cannot update an offer that has already ended" });
    }

 
    if (appliesTo === "package" && packageId && startDate && endDate) {
      const overlappingOffer = await OfferModel.findOne({
        _id: { $ne: id },
        appliesTo: "package",
        packageId,
        $or: [
          { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } }
        ],
      });

      if (overlappingOffer) {
        return res.status(400).json({
          message: "A package-specific offer already exists during this period",
          offer: overlappingOffer,
        });
      }
    }

    if (appliesTo === "all" && startDate && endDate) {
      const overlappingGlobalOffer = await OfferModel.findOne({
        _id: { $ne: id },
        appliesTo: "all",
        $or: [
          { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } }
        ],
      });

      if (overlappingGlobalOffer) {
        return res.status(400).json({
          message: "A global offer already exists during this period",
          offer: overlappingGlobalOffer,
        });
      }
    }

  
    const updatedOffer = await OfferModel.findByIdAndUpdate(
      id,
      { ...req.body, updatedBy: req.user._id },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: "success", offer: updatedOffer });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ====== DISABLE OFFER ======
export const disableOffer = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "Admin") return res.status(403).json({ message: "Only admins can disable offers" });

    const { id } = req.params;
    const offer = await OfferModel.findById(id);
    if (!offer) return res.status(404).json({ message: "Offer not found" });
    if (!offer.isActive) return res.status(400).json({ message: "Offer is already disabled" });

    offer.isActive = false;
    await offer.save();

    res.status(200).json({ message: "success", offer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const enableOffer = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "Admin") 
      return res.status(403).json({ message: "Only admins can enable offers" });

    const { id } = req.params;
    const offer = await OfferModel.findById(id);
    if (!offer) return res.status(404).json({ message: "Offer not found" });
    if (offer.isActive) return res.status(400).json({ message: "Offer is already active" });

    const now = new Date();
    if (offer.endDate && offer.endDate < now) {
      return res.status(400).json({ message: "Cannot enable an offer that has already expired" });
    }

    offer.isActive = true;
    await offer.save();

    res.status(200).json({ message: "success", offer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ====== LIST OFFERS ======
export const listOffers = async (req, res) => {
  try {
    const { isActive, packageId, activeNow } = req.query;
    let filter = {};

    
    if (packageId) filter.packageId = packageId;

    
    if (activeNow === "true") {
      const now = new Date();
      filter.isActive = true;
      filter.startDate = { $lte: now };
      filter.endDate = { $gte: now };
    } else {
      
      if (isActive === "true") filter.isActive = true;
      else if (isActive === "false") filter.isActive = false;
    }

    
    const offers = await OfferModel.find(filter).sort({ createdAt: -1 });

   
    res.status(200).json({
      message: "success",
      count: offers.length,
      offers,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ====== GET OFFER BY ID ======
export const getOfferById = async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await OfferModel.findById(id);
    if (!offer) return res.status(404).json({ message: "Offer not found" });

    res.status(200).json({ offer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};