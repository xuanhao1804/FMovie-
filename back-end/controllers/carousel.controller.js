const db = require("../models");
const mongoose = require("mongoose");
const Carousel = db.carousel;

const getCarousels = async (req, res) => {
  try {
    const carousels = await Carousel.find().populate('movie');
    res.json(carousels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addCarousel = async (req, res) => {
  const { title, imageUrl, movie, status, displayOrder, startDate, endDate, linkType, linkUrl, description } = req.body;
  const newCarousel = new Carousel({ title, imageUrl, movie, status, displayOrder, startDate, endDate, linkType, linkUrl, description });

  try {
    const savedCarousel = await newCarousel.save();
    res.status(201).json(savedCarousel);
  } catch (error) {
    console.error('Error saving carousel:', error); // Log lỗi chi tiết
    res.status(400).json({ message: error.message });
  }
};

const updateCarousel = async (req, res) => {
  const { title, imageUrl, movie, status, displayOrder, startDate, endDate, linkType, linkUrl, description } = req.body;

  try {
    const updatedCarousel = await Carousel.findByIdAndUpdate(
      req.params.id,
      { title, imageUrl, movie, status, displayOrder, startDate, endDate, linkType, linkUrl, description },
      { new: true }
    );
    res.json(updatedCarousel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCarousel = async (req, res) => {
  try {
    await Carousel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Carousel deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCarousels, addCarousel, updateCarousel, deleteCarousel };
