import Packages from "../models/packagesModel.js";

export const getAllPackages = async (req, res) => {
    try {
        const results = await Packages.getAll();
        
        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            message: "Database error",
            error: err.message
        });
    }
};