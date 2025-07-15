const express = require('express');
const router = express.Router();
const companyProfileController = require('../controllers/companyProfileController');
const authMiddleware = require('../middleware/authMiddleware');

// Publiczne trasy (bez autoryzacji) - tylko do odczytu
router.get('/list', companyProfileController.getCompanyProfiles);
router.get('/search', companyProfileController.searchCompanies);
router.get('/search/teryt', companyProfileController.searchCompaniesByTeryt);
router.get('/radius', companyProfileController.getCompaniesInRadius);
router.get('/stats/industry', companyProfileController.getIndustryStats);

// Trasy wymagające autoryzacji
router.use(authMiddleware.authenticateToken);

// Podstawowe operacje CRUD (wymagają autoryzacji)
router.post('/', companyProfileController.createCompanyProfile);
router.get('/my', companyProfileController.getMyCompanyProfile);
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

// Publiczny endpoint na samym końcu, aby nie łapał /list, /search itd.
router.get('/:id', companyProfileController.getCompanyProfile);

module.exports = router; 