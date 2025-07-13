const mongoose = require('mongoose');

const companyProfileSchema = new mongoose.Schema({
  // Podstawowe informacje
  name: { type: String, required: true },
  legalName: { type: String },
  description: { type: String, required: true },
  shortDescription: { type: String, maxlength: 200 },
  
  // Właściciel (powiązanie z użytkownikiem)
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Typ firmy
  companyType: {
    type: String,
    enum: ['startup', 'sme', 'corporation', 'nonprofit', 'government', 'freelance'],
    default: 'sme'
  },
  
  // Branża i kategorie
  industry: { type: String, required: true },
  subIndustry: { type: String },
  categories: [{ type: String }],
  tags: [{ type: String }],
  
  // Kontakt
  contact: {
    email: { type: String, required: true },
    phone: { type: String },
    website: { type: String },
    linkedin: { type: String },
    facebook: { type: String },
    twitter: { type: String },
    instagram: { type: String }
  },
  
  // Adres
  address: {
    street: { type: String },
    houseNumber: { type: String },
    postalCode: { type: String },
    city: { type: String, required: true },
    voivodeship: { type: String },
    county: { type: String },
    municipality: { type: String },
    country: { type: String, default: 'Polska' }
  },
  
  // Lokalizacja (koordynaty)
  location: {
    type: { type: String, default: 'Point' },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  
  // Media
  logo: { type: String },
  coverImage: { type: String },
  images: [{ type: String }],
  videos: [{ type: String }],
  
  // Informacje o firmie
  companyInfo: {
    foundedYear: { type: Number },
    employeeCount: { type: String, enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'] },
    revenue: { type: String, enum: ['<1M', '1M-10M', '10M-50M', '50M-100M', '100M+'] },
    headquarters: { type: String },
    specializations: [{ type: String }],
    certifications: [{ type: String }],
    awards: [{ type: String }]
  },
  
  // Usługi i produkty
  services: [{
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    price: { type: String },
    isActive: { type: Boolean, default: true }
  }],
  
  products: [{
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    price: { type: String },
    isActive: { type: Boolean, default: true }
  }],
  
  // Zespół
  team: [{
    name: { type: String, required: true },
    position: { type: String, required: true },
    photo: { type: String },
    bio: { type: String },
    linkedin: { type: String },
    isPublic: { type: Boolean, default: true }
  }],
  
  // Posty firmowe
  posts: [{
    title: { type: String, required: true },
    content: { type: String, required: true },
    images: [{ type: String }],
    tags: [{ type: String }],
    isPublic: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      content: { type: String },
      createdAt: { type: Date, default: Date.now }
    }]
  }],
  
  // Oferty pracy
  jobOffers: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    benefits: [{ type: String }],
    salary: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: 'PLN' },
      period: { type: String, enum: ['hourly', 'monthly', 'yearly'], default: 'monthly' }
    },
    location: { type: String },
    type: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship'], default: 'full-time' },
    isRemote: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Projekty i portfolio
  projects: [{
    name: { type: String, required: true },
    description: { type: String },
    client: { type: String },
    category: { type: String },
    images: [{ type: String }],
    technologies: [{ type: String }],
    startDate: { type: Date },
    endDate: { type: Date },
    isActive: { type: Boolean, default: true },
    url: { type: String }
  }],
  
  // Recenzje i referencje
  reviews: [{
    client: { type: String, required: true },
    position: { type: String },
    company: { type: String },
    rating: { type: Number, min: 1, max: 5, required: true },
    content: { type: String, required: true },
    project: { type: String },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Statystyki
  stats: {
    followers: { type: Number, default: 0 },
    postViews: { type: Number, default: 0 },
    profileViews: { type: Number, default: 0 },
    applications: { type: Number, default: 0 },
    projectsCompleted: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 }
  },
  
  // Status i weryfikacja
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'inactive', 'suspended', 'pending'], default: 'pending' },
  
  // SEO
  seo: {
    title: { type: String },
    description: { type: String },
    keywords: [{ type: String }],
    slug: { type: String, unique: true }
  },
  
  // Ustawienia
  settings: {
    allowMessages: { type: Boolean, default: true },
    allowReviews: { type: Boolean, default: true },
    allowJobApplications: { type: Boolean, default: true },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    }
  },
  
  // Powiązania
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CompanyProfile' }],
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CompanyProfile' }]
}, { timestamps: true });

// Indeksy
companyProfileSchema.index({ name: 'text', description: 'text', tags: 'text' });
companyProfileSchema.index({ 'location.coordinates': '2dsphere' });
companyProfileSchema.index({ industry: 1, isActive: 1 });
companyProfileSchema.index({ owner: 1 });
companyProfileSchema.index({ 'address.city': 1 });
companyProfileSchema.index({ companyType: 1 });

// Metoda do obliczania średniej oceny
companyProfileSchema.methods.updateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.stats.averageRating = 0;
    this.stats.totalReviews = 0;
  } else {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.stats.averageRating = totalRating / this.reviews.length;
    this.stats.totalReviews = this.reviews.length;
  }
  return this.save();
};

// Hook przed zapisem - generuj slug
companyProfileSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.seo.slug) {
    this.seo.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

module.exports = mongoose.model('CompanyProfile', companyProfileSchema); 