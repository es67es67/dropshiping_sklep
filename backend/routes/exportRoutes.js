const express = require('express');
const router = express.Router();
const Location = require('../models/locationModel');

// Endpoint do eksportu danych GUS
router.post('/gus-data', async (req, res) => {
  try {
    const { data, type } = req.body;
    
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Nieprawidłowe dane' 
      });
    }

    const results = [];
    const errors = [];

    for (const item of data) {
      try {
        // Mapuj dane w zależności od typu
        let locationData = {};
        
        switch (type) {
          case 'TERC':
            locationData = mapTercData(item);
            break;
          case 'SIMC':
            locationData = mapSimcData(item);
            break;
          case 'ULIC':
            locationData = mapUlicData(item);
            break;
          default:
            throw new Error(`Nieznany typ danych: ${type}`);
        }

        if (locationData.name && locationData.name.trim()) {
          // Sprawdź czy wpis już istnieje
          const existingLocation = await Location.findOne({ 
            type: locationData.type, 
            code: locationData.code 
          });
          
          if (existingLocation) {
            // Aktualizuj istniejący wpis
            Object.assign(existingLocation, locationData);
            await existingLocation.save();
            results.push(existingLocation._id);
          } else {
            // Dodaj nowy wpis
            const location = new Location(locationData);
            await location.save();
            results.push(location._id);
          }
        }
      } catch (error) {
        errors.push({
          item: item,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      imported: results.length,
      errors: errors.length,
      errorDetails: errors
    });

  } catch (error) {
    console.error('Błąd eksportu:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Funkcje mapowania danych
function mapTercData(row) {
  const wojewodztwo = row['WOJ'];
  const powiat = row['POW'];
  const gmina = row['GMI'];
  const nazwa = row['NAZWA'];
  
  let type = '';
  let code = '';
  
  if (powiat === '' && gmina === '') {
    type = 'województwo';
    code = wojewodztwo;
  } else if (gmina === '' && powiat !== '') {
    type = 'powiat';
    code = `${wojewodztwo}${powiat}`;
  } else if (gmina !== '') {
    type = 'gmina';
    code = `${wojewodztwo}${powiat}${gmina}`;
  }

  return {
    uniqueId: `terc_${code}`,
    name: nazwa.trim(),
    type: type,
    code: code,
    isActive: true,
    isVerified: true
  };
}

function mapSimcData(row) {
  const nazwa = row['NAZWA'];
  const symNumer = row['SYM'];
  const miejscowosc = row['RM'];
  
  // Tylko główne miejscowości
  if (miejscowosc !== '01') {
    return null;
  }

  return {
    uniqueId: `simc_${symNumer}`,
    name: nazwa.trim(),
    type: 'miejscowość',
    code: symNumer,
    isActive: true,
    isVerified: true
  };
}

function mapUlicData(row) {
  const nazwa = row['NAZWA_1'];
  const nazwa2 = row['NAZWA_2'];
  const cecha = row['CECHA'];
  const symUlic = row['SYM_UL'];
  
  let fullName = nazwa.trim();
  if (cecha && cecha.trim()) {
    fullName = `${cecha.trim()} ${fullName}`;
  }
  if (nazwa2 && nazwa2.trim()) {
    fullName += ` ${nazwa2.trim()}`;
  }

  return {
    uniqueId: `ulic_${symUlic}`,
    name: fullName,
    type: 'ulica',
    code: symUlic,
    isActive: true,
    isVerified: true
  };
}

// Endpoint do sprawdzenia statusu
router.get('/status', async (req, res) => {
  try {
    const stats = await Location.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await Location.countDocuments();

    res.json({
      success: true,
      total: total,
      byType: stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {})
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Endpoint do czyszczenia bazy
router.delete('/clear', async (req, res) => {
  try {
    await Location.deleteMany({});
    res.json({
      success: true,
      message: 'Baza danych wyczyszczona'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Endpoint do sprawdzenia duplikatów
router.get('/duplicates', async (req, res) => {
  try {
    const duplicates = await Location.aggregate([
      {
        $group: {
          _id: { type: '$type', code: '$code' },
          count: { $sum: 1 },
          ids: { $push: '$_id' }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      duplicates: duplicates,
      totalDuplicates: duplicates.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Endpoint do pobierania przykładowych wpisów
router.get('/sample', async (req, res) => {
  try {
    const sample = await Location.find({}).limit(5);
    res.json({
      success: true,
      sample
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Endpoint do listowania wpisów z paginacją i filtrem
router.get('/list', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const type = req.query.type || '';
    const filter = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (type) {
      filter.type = type;
    }
    
    const total = await Location.countDocuments(filter);
    const data = await Location.find(filter)
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(limit);
    res.json({ success: true, data, total, page, limit });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint do usuwania wpisu po ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Location.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint do aktualizacji wpisu po ID
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const updated = await Location.findByIdAndUpdate(id, update, { new: true });
    res.json({ success: true, updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint do dodawania nowego wpisu
router.post('/add', async (req, res) => {
  try {
    const locationData = req.body;
    if (!locationData.name || !locationData.type || !locationData.code) {
      return res.status(400).json({ 
        success: false, 
        error: 'Wymagane pola: name, type, code' 
      });
    }
    const location = new Location(locationData);
    await location.save();
    res.json({ success: true, id: location._id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint do statystyk
router.get('/stats', async (req, res) => {
  try {
    const stats = await Location.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const total = await Location.countDocuments();
    res.json({ success: true, stats, total });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint do eksportu CSV
router.get('/export-csv', async (req, res) => {
  try {
    const search = req.query.search || '';
    const type = req.query.type || '';
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } }
      ];
    }
    if (type) filter.type = type;
    
    const data = await Location.find(filter).sort({ name: 1 });
    
    if (data.length === 0) {
      return res.status(404).json({ success: false, error: 'Brak danych do eksportu' });
    }
    
    // Przygotuj CSV
    const keys = Object.keys(data[0].toObject());
    let csv = keys.join(';') + '\n';
    data.forEach(item => {
      const row = keys.map(key => {
        let val = item[key];
        if (typeof val === 'object' && val !== null) val = JSON.stringify(val);
        return `"${val || ''}"`;
      });
      csv += row.join(';') + '\n';
    });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=locations.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router; 