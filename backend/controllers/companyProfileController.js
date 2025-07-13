const CompanyProfile = require('../models/companyProfileModel');
const User = require('../models/userModel');
const Notification = require('../models/notificationModel');

// Utwórz profil firmy
exports.createCompanyProfile = async (req, res) => {
  try {
    const {
      name, legalName, description, shortDescription, companyType,
      industry, subIndustry, categories, tags, contact, address,
      location, logo, coverImage, images, videos, companyInfo,
      services, products, team, seo, settings
    } = req.body;

    // Sprawdź czy użytkownik już ma profil firmy
    const existingProfile = await CompanyProfile.findOne({ owner: req.userId });
    if (existingProfile) {
      return res.status(400).json({ error: 'Użytkownik może mieć tylko jeden profil firmy' });
    }

    const companyProfile = new CompanyProfile({
      owner: req.userId,
      name,
      legalName,
      description,
      shortDescription,
      companyType,
      industry,
      subIndustry,
      categories: categories || [],
      tags: tags || [],
      contact,
      address,
      location,
      logo,
      coverImage,
      images: images || [],
      videos: videos || [],
      companyInfo,
      services: services || [],
      products: products || [],
      team: team || [],
      seo,
      settings
    });

    await companyProfile.save();

    // Pobierz profil z danymi właściciela
    const populatedProfile = await CompanyProfile.findById(companyProfile._id)
      .populate('owner', 'username firstName lastName avatar');

    res.status(201).json(populatedProfile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Pobierz profil firmy
exports.getCompanyProfile = async (req, res) => {
  try {
    const { id } = req.params;
    
    const companyProfile = await CompanyProfile.findById(id)
      .populate('owner', 'username firstName lastName avatar')
      .populate('followers', 'username firstName lastName avatar')
      .populate('team');

    if (!companyProfile) {
      return res.status(404).json({ error: 'Profil firmy nie został znaleziony' });
    }

    // Zwiększ licznik wyświetleń
    companyProfile.stats.profileViews += 1;
    await companyProfile.save();

    res.json(companyProfile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Pobierz profil firmy użytkownika
exports.getMyCompanyProfile = async (req, res) => {
  try {
    const companyProfile = await CompanyProfile.findOne({ owner: req.userId })
      .populate('owner', 'username firstName lastName avatar')
      .populate('followers', 'username firstName lastName avatar')
      .populate('team');

    if (!companyProfile) {
      return res.status(404).json({ error: 'Nie znaleziono profilu firmy' });
    }

    res.json(companyProfile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Aktualizuj profil firmy
exports.updateCompanyProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const companyProfile = await CompanyProfile.findById(id);
    if (!companyProfile) {
      return res.status(404).json({ error: 'Profil firmy nie został znaleziony' });
    }

    // Sprawdź czy użytkownik jest właścicielem
    if (companyProfile.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Brak uprawnień do edycji tego profilu' });
    }

    // Aktualizuj profil
    Object.keys(updateData).forEach(key => {
      if (key !== '_id' && key !== 'owner' && key !== 'createdAt' && key !== 'updatedAt') {
        companyProfile[key] = updateData[key];
      }
    });

    await companyProfile.save();

    const updatedProfile = await CompanyProfile.findById(id)
      .populate('owner', 'username firstName lastName avatar')
      .populate('followers', 'username firstName lastName avatar')
      .populate('team');

    res.json(updatedProfile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Usuń profil firmy
exports.deleteCompanyProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const companyProfile = await CompanyProfile.findById(id);
    if (!companyProfile) {
      return res.status(404).json({ error: 'Profil firmy nie został znaleziony' });
    }

    // Sprawdź czy użytkownik jest właścicielem
    if (companyProfile.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Brak uprawnień do usunięcia tego profilu' });
    }

    await CompanyProfile.findByIdAndDelete(id);
    res.json({ message: 'Profil firmy został usunięty' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lista profili firm
exports.getCompanyProfiles = async (req, res) => {
  try {
    const { page = 1, limit = 10, industry, companyType, city, search } = req.query;
    const skip = (page - 1) * limit;

    let query = { isActive: true, status: 'active' };

    // Filtry
    if (industry) query.industry = industry;
    if (companyType) query.companyType = companyType;
    if (city) query['address.city'] = new RegExp(city, 'i');
    if (search) {
      query.$text = { $search: search };
    }

    const companyProfiles = await CompanyProfile.find(query)
      .populate('owner', 'username firstName lastName avatar')
      .sort({ 'stats.followers': -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await CompanyProfile.countDocuments(query);

    res.json({
      companyProfiles,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalProfiles: total
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obserwuj firmę
exports.followCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const companyProfile = await CompanyProfile.findById(id);
    if (!companyProfile) {
      return res.status(404).json({ error: 'Profil firmy nie został znaleziony' });
    }

    const isFollowing = companyProfile.followers.includes(req.userId);
    
    if (isFollowing) {
      // Przestań obserwować
      companyProfile.followers = companyProfile.followers.filter(
        follower => follower.toString() !== req.userId
      );
      companyProfile.stats.followers -= 1;
    } else {
      // Zacznij obserwować
      companyProfile.followers.push(req.userId);
      companyProfile.stats.followers += 1;

      // Powiadomienie dla właściciela firmy
      const notification = new Notification({
        recipient: companyProfile.owner,
        type: 'company_follow',
        title: 'Nowy obserwujący',
        message: `Użytkownik zaczął obserwować Twoją firmę`,
        relatedData: {
          companyId: companyProfile._id,
          followerId: req.userId
        }
      });
      await notification.save();
    }

    await companyProfile.save();

    res.json({ 
      isFollowing: !isFollowing,
      followersCount: companyProfile.stats.followers
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Dodaj post firmowy
exports.addCompanyPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, images, tags } = req.body;

    const companyProfile = await CompanyProfile.findById(id);
    if (!companyProfile) {
      return res.status(404).json({ error: 'Profil firmy nie został znaleziony' });
    }

    // Sprawdź czy użytkownik jest właścicielem
    if (companyProfile.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Brak uprawnień do dodawania postów' });
    }

    const newPost = {
      title,
      content,
      images: images || [],
      tags: tags || [],
      publishedAt: new Date()
    };

    companyProfile.posts.unshift(newPost);
    await companyProfile.save();

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Dodaj ofertę pracy
exports.addJobOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const jobOfferData = req.body;

    const companyProfile = await CompanyProfile.findById(id);
    if (!companyProfile) {
      return res.status(404).json({ error: 'Profil firmy nie został znaleziony' });
    }

    // Sprawdź czy użytkownik jest właścicielem
    if (companyProfile.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Brak uprawnień do dodawania ofert pracy' });
    }

    const newJobOffer = {
      ...jobOfferData,
      createdAt: new Date()
    };

    companyProfile.jobOffers.unshift(newJobOffer);
    await companyProfile.save();

    res.status(201).json(newJobOffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Aplikuj na ofertę pracy
exports.applyForJob = async (req, res) => {
  try {
    const { id, jobId } = req.params;
    const { coverLetter, resume } = req.body;

    const companyProfile = await CompanyProfile.findById(id);
    if (!companyProfile) {
      return res.status(404).json({ error: 'Profil firmy nie został znaleziony' });
    }

    const jobOffer = companyProfile.jobOffers.id(jobId);
    if (!jobOffer) {
      return res.status(404).json({ error: 'Oferta pracy nie została znaleziona' });
    }

    if (!jobOffer.isActive) {
      return res.status(400).json({ error: 'Oferta pracy nie jest już aktywna' });
    }

    // Sprawdź czy użytkownik już aplikował
    if (jobOffer.applications.includes(req.userId)) {
      return res.status(400).json({ error: 'Już aplikowałeś na tę ofertę' });
    }

    jobOffer.applications.push(req.userId);
    companyProfile.stats.applications += 1;
    await companyProfile.save();

    // Powiadomienie dla właściciela firmy
    const notification = new Notification({
      recipient: companyProfile.owner,
      type: 'job_application',
      title: 'Nowa aplikacja na ofertę pracy',
      message: `Nowa aplikacja na stanowisko: ${jobOffer.title}`,
      relatedData: {
        companyId: companyProfile._id,
        jobId: jobId,
        applicantId: req.userId
      }
    });
    await notification.save();

    res.json({ message: 'Aplikacja została wysłana' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Dodaj recenzję firmy
exports.addCompanyReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { client, position, company, rating, content, project } = req.body;

    const companyProfile = await CompanyProfile.findById(id);
    if (!companyProfile) {
      return res.status(404).json({ error: 'Profil firmy nie został znaleziony' });
    }

    // Sprawdź czy użytkownik nie jest właścicielem
    if (companyProfile.owner.toString() === req.userId) {
      return res.status(400).json({ error: 'Nie możesz recenzować własnej firmy' });
    }

    const newReview = {
      client,
      position,
      company,
      rating,
      content,
      project,
      createdAt: new Date()
    };

    companyProfile.reviews.push(newReview);
    await companyProfile.updateAverageRating();
    await companyProfile.save();

    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Pobierz statystyki branż
exports.getIndustryStats = async (req, res) => {
  try {
    const stats = await CompanyProfile.aggregate([
      { $match: { isActive: true, status: 'active' } },
      {
        $group: {
          _id: '$industry',
          count: { $sum: 1 },
          avgFollowers: { $avg: '$stats.followers' },
          avgRating: { $avg: '$stats.averageRating' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Wyszukaj firmy
exports.searchCompanies = async (req, res) => {
  try {
    const { q, industry, location, companyType } = req.query;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = { isActive: true, status: 'active' };

    if (q) {
      query.$text = { $search: q };
    }
    if (industry) query.industry = industry;
    if (location) query['address.city'] = new RegExp(location, 'i');
    if (companyType) query.companyType = companyType;

    const companies = await CompanyProfile.find(query)
      .populate('owner', 'username firstName lastName avatar')
      .sort({ 'stats.followers': -1, 'stats.averageRating': -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await CompanyProfile.countDocuments(query);

    res.json({
      companies,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalCompanies: total
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 