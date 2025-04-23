// controllers/materialController.js
const Material = require('../models/materialModel');

// Default materials to seed if the collection is empty
const defaultMaterials = [
  { id: "cans", name: "Aluminum Cans", rate: "$1.21/kg", description: "Beverage/food cans", icon: "🥫", active: true },
  { id: "extrusions", name: "Extrusions", rate: "$1.43/kg", description: "Window/door frames", icon: "🪟", active: true },
  { id: "siding", name: "Siding & Gutters", rate: "$1.54/kg", description: "Home siding, gutters", icon: "🏠", active: true },
  { id: "industrial", name: "Industrial Scrap", rate: "$1.87/kg", description: "Machine parts, offcuts", icon: "⚙️", active: true },
  { id: "wheels", name: "Wheels & Rims", rate: "$1.65/kg", description: "Aluminum car wheels", icon: "🛞", active: true },
  { id: "mixed", name: "Mixed Aluminum", rate: "$1.32/kg", description: "Assorted items", icon: "🔄", active: true }
];


// --- Get all ACTIVE material types for the frontend selector ---
exports.getActiveMaterials = async (req, res, next) => {
    try {
        // Optional: Seed default materials if the collection is empty (good for first run)
        const count = await Material.countDocuments();
        if (count === 0) {
            console.log('No materials found in database, seeding default materials...');
            try {
                await Material.insertMany(defaultMaterials);
                console.log('Default materials seeded successfully.');
            } catch(seedError) {
                 console.error("Error seeding default materials:", seedError);
                 // Continue trying to fetch even if seeding failed, might exist from previous attempt
            }
        }

        // Fetch only active materials, sorted alphabetically by name
        const materials = await Material.find({ active: true }).sort({ name: 1 });
        res.status(200).json({ success: true, count: materials.length, data: materials });

    } catch (error) {
        console.error("Get Active Materials Error:", error);
        next(error); // Pass error to the global handler
    }
};

// --- Optional Admin Controllers for Materials (Add protectAdmin middleware in routes) ---

// Get ALL materials (including inactive) - Admin Only
exports.getAllMaterials = async (req, res, next) => {
    try {
        const materials = await Material.find().sort({ name: 1 });
        res.status(200).json({ success: true, count: materials.length, data: materials });
    } catch (error) {
        console.error("Get All Materials Error:", error);
        next(error);
    }
};

// Add a new material - Admin Only
exports.addMaterial = async (req, res, next) => {
    const { id, name, rate, description, icon, active } = req.body;
     if (!id || !name || !rate) {
        return res.status(400).json({ success: false, message: 'Material ID, Name, and Rate are required.' });
    }
    try {
        const newMaterial = new Material({ id, name, rate, description, icon, active });
        const savedMaterial = await newMaterial.save(); // <<< MUST AWAIT
        res.status(201).json({ success: true, message: 'Material added successfully.', data: savedMaterial });
    } catch (error) {
        console.error("Add Material Error:", error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: `Validation Failed: ${messages.join('. ')}` });
        }
         if (error.code === 11000) { // Duplicate key error
             return res.status(400).json({ success: false, message: `Material with ID '${id}' already exists.` });
         }
        next(error);
    }
};

// Update a material - Admin Only
exports.updateMaterial = async (req, res, next) => {
     const dbId = req.params.dbId; // Use the MongoDB _id for updating
     const allowedUpdates = ['name', 'rate', 'description', 'icon', 'active', 'id']; // Allow updating the 'id' field too if needed
     const updates = {};
     allowedUpdates.forEach(field => {
         if (req.body[field] !== undefined) {
             updates[field] = req.body[field];
         }
     });

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ success: false, message: 'No valid material data provided for update.' });
    }

    try {
        const updatedMaterial = await Material.findByIdAndUpdate(
            dbId,
            { $set: updates },
            { new: true, runValidators: true }
        );
        if (!updatedMaterial) {
            return res.status(404).json({ success: false, message: 'Material not found with the provided ID.' });
        }
        res.status(200).json({ success: true, message: 'Material updated successfully.', data: updatedMaterial });
    } catch (error) {
        console.error("Update Material Error:", error);
         if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: `Validation Failed: ${messages.join('. ')}` });
        }
         if (error.code === 11000) { // Duplicate key error (potentially on 'id' field if changed)
             return res.status(400).json({ success: false, message: `Update failed: Material ID '${updates.id}' may already exist.` });
         }
         if (error.name === 'CastError' && error.kind === 'ObjectId') {
             return res.status(400).json({ success: false, message: 'Invalid material database ID format.' });
         }
        next(error);
    }
};

// Delete/Deactivate a material - Admin Only
// (Consider soft delete by setting active=false instead of hard delete)
exports.deleteMaterial = async (req, res, next) => {
     const dbId = req.params.dbId; // Use the MongoDB _id
    try {
        // Option 1: Soft Delete (Recommended)
        const deactivatedMaterial = await Material.findByIdAndUpdate(dbId, { active: false }, { new: true });
         if (!deactivatedMaterial) {
            return res.status(404).json({ success: false, message: 'Material not found.' });
        }
         res.status(200).json({ success: true, message: 'Material deactivated successfully.', data: deactivatedMaterial });

        // Option 2: Hard Delete (Use with caution)
        /*
        const result = await Material.findByIdAndDelete(dbId);
        if (!result) {
            return res.status(404).json({ success: false, message: 'Material not found.' });
        }
        res.status(200).json({ success: true, message: 'Material deleted permanently.' });
        */
    } catch (error) {
        console.error("Delete Material Error:", error);
         if (error.name === 'CastError' && error.kind === 'ObjectId') {
             return res.status(400).json({ success: false, message: 'Invalid material database ID format.' });
         }
        next(error);
    }
};