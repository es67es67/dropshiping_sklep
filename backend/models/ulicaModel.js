const mongoose = require('mongoose');

const ulicaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        trim: true
    },
    cecha: {
        type: String,
        trim: true
    },
    nazwa1: {
        type: String,
        trim: true
    },
    nazwa2: {
        type: String,
        trim: true
    },
    stanNa: {
        type: String,
        trim: true
    },
    wojewodztwoCode: {
        type: String,
        required: true,
        trim: true
    },
    powiatCode: {
        type: String,
        required: true,
        trim: true
    },
    gminaCode: {
        type: String,
        required: true,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Indeksy dla szybkiego wyszukiwania
ulicaSchema.index({ code: 1 });
ulicaSchema.index({ name: 1 });
ulicaSchema.index({ wojewodztwoCode: 1 });
ulicaSchema.index({ powiatCode: 1 });
ulicaSchema.index({ gminaCode: 1 });
ulicaSchema.index({ isActive: 1 });

module.exports = mongoose.model('Ulica', ulicaSchema); 