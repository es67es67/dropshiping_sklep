const express = require('express');
const router = express.Router();
const companyProfileController = require('../controllers/companyProfileController');
const authMiddleware = require('../middleware/authMiddleware');

// Wszystkie routes wymagają autoryzacji
router.use(authMiddleware.authenticateToken);

// Podstawowe operacje CRUD
router.post('/', companyProfileController.createCompanyProfile);
router.get('/my', companyProfileController.getMyCompanyProfile);
router.get('/list', companyProfileController.getCompanyProfiles);
router.get('/search', companyProfileController.searchCompanies);
router.get('/stats/industry', companyProfileController.getIndustryStats);

// Operacje na konkretnym profilu
router.get('/:id', companyProfileController.getCompanyProfile);
router.put('/:id', companyProfileController.updateCompanyProfile);
router.delete('/:id', companyProfileController.deleteCompanyProfile);

// Interakcje społecznościowe
router.post('/:id/follow', companyProfileController.followCompany);

// Posty firmowe
router.post('/:id/posts', companyProfileController.addCompanyPost);

// Oferty pracy
router.post('/:id/jobs', companyProfileController.addJobOffer);
router.post('/:id/jobs/:jobId/apply', companyProfileController.applyForJob);

// Recenzje firm
router.post('/:id/reviews', companyProfileController.addCompanyReview);

module.exports = router; 