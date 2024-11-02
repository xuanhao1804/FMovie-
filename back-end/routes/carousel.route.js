const express = require('express');
const CarouselController = require('../controllers/carousel.controller');
const CarouselRouter = express.Router();

CarouselRouter.get('/get-all', CarouselController.getCarousels);
CarouselRouter.post('/create', CarouselController.addCarousel);
CarouselRouter.put('/update/:id', CarouselController.updateCarousel);
CarouselRouter.delete('/delete/:id', CarouselController.deleteCarousel);

module.exports = CarouselRouter;
