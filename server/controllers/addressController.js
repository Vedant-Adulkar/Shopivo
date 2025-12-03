const Address = require("../models/Address");

/**
 * Create a new address
 * POST /api/addresses
 */
exports.createAddress = async (req, res) => {
    try {
        const { fullName, phone, addressLine1, addressLine2, city, state, postalCode, country, addressType, isDefault } =
            req.body;

        // Validate required fields
        if (!fullName || !phone || !addressLine1 || !city || !state || !postalCode) {
            return res.status(400).json({ message: "All required address fields must be provided" });
        }

        // If setting as default, unset other default addresses
        if (isDefault) {
            await Address.updateMany({ user: req.user._id, isDefault: true }, { isDefault: false });
        }

        const address = await Address.create({
            user: req.user._id,
            fullName,
            phone,
            addressLine1,
            addressLine2,
            city,
            state,
            postalCode,
            country: country || "India",
            addressType: addressType || "home",
            isDefault: isDefault || false,
        });

        res.status(201).json({
            message: "Address created successfully",
            address,
        });
    } catch (error) {
        console.error("Create address error:", error);
        res.status(500).json({ message: "Failed to create address", error: error.message });
    }
};

/**
 * Get all addresses for authenticated user
 * GET /api/addresses
 */
exports.getUserAddresses = async (req, res) => {
    try {
        const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 }).lean();

        res.json({ addresses });
    } catch (error) {
        console.error("Get user addresses error:", error);
        res.status(500).json({ message: "Failed to fetch addresses", error: error.message });
    }
};

/**
 * Update address
 * PATCH /api/addresses/:id
 */
exports.updateAddress = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);

        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }

        // Check authorization
        if (address.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        const { fullName, phone, addressLine1, addressLine2, city, state, postalCode, country, addressType } = req.body;

        // Update fields
        if (fullName) address.fullName = fullName;
        if (phone) address.phone = phone;
        if (addressLine1) address.addressLine1 = addressLine1;
        if (addressLine2 !== undefined) address.addressLine2 = addressLine2;
        if (city) address.city = city;
        if (state) address.state = state;
        if (postalCode) address.postalCode = postalCode;
        if (country) address.country = country;
        if (addressType) address.addressType = addressType;

        await address.save();

        res.json({
            message: "Address updated successfully",
            address,
        });
    } catch (error) {
        console.error("Update address error:", error);
        res.status(500).json({ message: "Failed to update address", error: error.message });
    }
};

/**
 * Delete address
 * DELETE /api/addresses/:id
 */
exports.deleteAddress = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);

        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }

        // Check authorization
        if (address.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        await address.deleteOne();

        res.json({ message: "Address deleted successfully" });
    } catch (error) {
        console.error("Delete address error:", error);
        res.status(500).json({ message: "Failed to delete address", error: error.message });
    }
};

/**
 * Set address as default
 * PATCH /api/addresses/:id/default
 */
exports.setDefaultAddress = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);

        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }

        // Check authorization
        if (address.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        // Unset all other default addresses for this user
        await Address.updateMany({ user: req.user._id, isDefault: true }, { isDefault: false });

        // Set this address as default
        address.isDefault = true;
        await address.save();

        res.json({
            message: "Default address updated successfully",
            address,
        });
    } catch (error) {
        console.error("Set default address error:", error);
        res.status(500).json({ message: "Failed to set default address", error: error.message });
    }
};
