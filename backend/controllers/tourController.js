import Tour from '../models/tourModel.js';

// GET ALL TOURS
export const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.findAll();
    res.status(200).json({
      success: true,
      count: tours.length,
      data: tours
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET SINGLE TOUR BY ID
export const getTourById = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findById(id);

    if (!tour) {
      return res.status(404).json({ success: false, message: "Package not found" });
    }

    res.status(200).json({ success: true, data: tour });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Example Controller Logic
export const getTourDetails = async (req, res) => {
    const { id } = req.params;
    const tour = await Tour.findById(id);
    if (tour) {
        res.json({ success: true, data: tour });
    } else {
        res.status(404).json({ success: false, message: "Tour not found" });
    }
};