const express = require('express');
const router = express.Router();
const Location = require('../models/locationModel');
const Terc = require('../models/tercModel');
const Simc = require('../models/simcModel');
const Ulic = require('../models/ulicModel');

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

// ========================================
// NOWE ENDPOINTY DLA OSOBNYCH TABEL
// ========================================

// Endpoint do sprawdzania czy rekord istnieje
router.post('/check-record', async (req, res) => {
  try {
    const { record, type } = req.body;
    
    if (!record || !type) {
      return res.status(400).json({
        success: false,
        error: 'Brak rekordu lub typu'
      });
    }

    let existingRecord = null;
    let isComplete = false;
    let recordId = null;

    switch (type) {
      case 'TERC':
        const tercCode = getTercCode(record);
        if (!tercCode) {
          return res.status(400).json({
            success: false,
            error: 'Nieprawidłowy kod TERC'
          });
        }
        existingRecord = await Terc.findOne({ code: tercCode });
        if (existingRecord) {
          isComplete = isTercComplete(existingRecord);
          recordId = existingRecord._id;
        }
        break;
        
      case 'SIMC':
        const simcCode = record.SYM || record.code;
        existingRecord = await Simc.findOne({ code: simcCode });
        if (existingRecord) {
          isComplete = isSimcComplete(existingRecord);
          recordId = existingRecord._id;
        }
        break;
        
      case 'ULIC':
        // Sprawdzamy duplikaty po nazwie i miejscowości (SIMC)
        const nazwa1 = record.NAZWA_1 || '';
        const nazwa2 = record.NAZWA_2 || '';
        const cecha = record.CECHA || '';
        const sym = record.SYM || '';
        
        let fullName = nazwa1.trim();
        if (cecha && cecha.trim()) {
          fullName = `${cecha.trim()} ${fullName}`;
        }
        if (nazwa2 && nazwa2.trim()) {
          fullName += ` ${nazwa2.trim()}`;
        }
        
        existingRecord = await Ulic.findOne({ name: fullName, simcCode: sym });
        if (existingRecord) {
          isComplete = isUlicComplete(existingRecord);
          recordId = existingRecord._id;
        }
        break;
        
      default:
        return res.status(400).json({
          success: false,
          error: 'Nieznany typ danych'
        });
    }

    res.json({
      success: true,
      exists: !!existingRecord,
      isComplete: isComplete,
      recordId: recordId
    });

  } catch (error) {
    console.error('Błąd sprawdzania rekordu:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Endpoint do sprawdzania czy rekord istnieje - sprawdza WSZYSTKIE pola kluczowe
router.post('/check-record-complete', async (req, res) => {
  try {
    const { record, type } = req.body;
    
    if (!record || !type) {
      return res.status(400).json({
        success: false,
        error: 'Brak rekordu lub typu'
      });
    }

    let existingRecord = null;
    let isComplete = false;
    let recordId = null;

    switch (type) {
      case 'TERC':
        const tercCode = getTercCode(record);
        if (!tercCode) {
          return res.status(400).json({
            success: false,
            error: 'Nieprawidłowy kod TERC'
          });
        }
        existingRecord = await Terc.findOne({ code: tercCode });
        if (existingRecord) {
          isComplete = isTercComplete(existingRecord);
          recordId = existingRecord._id;
        }
        break;
        
      case 'SIMC':
        const simcCode = record.SYM || record.code;
        existingRecord = await Simc.findOne({ code: simcCode });
        if (existingRecord) {
          isComplete = isSimcComplete(existingRecord);
          recordId = existingRecord._id;
        }
        break;
        
      case 'ULIC':
        // Dla ULIC sprawdzamy po nazwie i miejscowości (SIMC)
        const nazwa1 = record.NAZWA_1 || '';
        const nazwa2 = record.NAZWA_2 || '';
        const cecha = record.CECHA || '';
        const sym = record.SYM || '';
        
        let fullName = nazwa1.trim();
        if (cecha && cecha.trim()) {
          fullName = `${cecha.trim()} ${fullName}`;
        }
        if (nazwa2 && nazwa2.trim()) {
          fullName += ` ${nazwa2.trim()}`;
        }
        
        existingRecord = await Ulic.findOne({ name: fullName, simcCode: sym });
        if (existingRecord) {
          isComplete = isUlicComplete(existingRecord);
          recordId = existingRecord._id;
        }
        break;
        
      default:
        return res.status(400).json({
          success: false,
          error: 'Nieznany typ danych'
        });
    }

    res.json({
      success: true,
      exists: !!existingRecord,
      isComplete: isComplete,
      recordId: recordId
    });

  } catch (error) {
    console.error('Błąd sprawdzania rekordu (complete):', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Endpoint do eksportu danych GUS do osobnych tabel
router.post('/gus-data-separate', async (req, res) => {
  try {
    const { data, type } = req.body;
    
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Nieprawidłowe dane' 
      });
    }

    let inserted = 0;
    let updated = 0;
    let errors = 0;

    for (const item of data) {
      try {
        const action = item.action || 'insert';
        
        switch (type) {
          case 'TERC':
            await processTercRecord(item, action);
            break;
          case 'SIMC':
            await processSimcRecord(item, action);
            break;
          case 'ULIC':
            await processUlicRecord(item, action);
            break;
          default:
            throw new Error(`Nieznany typ danych: ${type}`);
        }

        if (action === 'insert') {
          inserted++;
        } else {
          updated++;
        }
      } catch (error) {
        console.error(`Błąd przetwarzania rekordu ${type}:`, error);
        errors++;
      }
    }

    res.json({
      success: true,
      inserted: inserted,
      updated: updated,
      errors: errors
    });

  } catch (error) {
    console.error('Błąd eksportu:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Endpoint do sprawdzenia statusu osobnych tabel
router.get('/status-separate', async (req, res) => {
  try {
    const tercCount = await Terc.countDocuments();
    const simcCount = await Simc.countDocuments();
    const ulicCount = await Ulic.countDocuments();

    res.json({
      success: true,
      terc: tercCount,
      simc: simcCount,
      ulic: ulicCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Endpoint do czyszczenia osobnych tabel
router.delete('/clear-separate', async (req, res) => {
  try {
    await Terc.deleteMany({});
    await Simc.deleteMany({});
    await Ulic.deleteMany({});
    
    res.json({
      success: true,
      message: 'Wszystkie tabele wyczyszczone'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Endpoint do sprawdzenia duplikatów w osobnych tabelach
router.get('/duplicates-separate', async (req, res) => {
  try {
    const [tercDuplicates, simcDuplicates, ulicDuplicates] = await Promise.all([
      Terc.aggregate([
        { $group: { _id: { type: '$type', code: '$code' }, count: { $sum: 1 } } },
        { $match: { count: { $gt: 1 } } }
      ]),
      Simc.aggregate([
        { $group: { _id: { type: '$type', code: '$code' }, count: { $sum: 1 } } },
        { $match: { count: { $gt: 1 } } }
      ]),
      Ulic.aggregate([
        { $group: { _id: { name: '$name', simcCode: '$simcCode' }, count: { $sum: 1 } } },
        { $match: { count: { $gt: 1 } } }
      ])
    ]);

    const allDuplicates = [
      ...tercDuplicates.map(d => ({ ...d, table: 'TERC' })),
      ...simcDuplicates.map(d => ({ ...d, table: 'SIMC' })),
      ...ulicDuplicates.map(d => ({ ...d, table: 'ULIC' }))
    ];

    res.json({
      success: true,
      duplicates: allDuplicates,
      totalDuplicates: allDuplicates.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Funkcje pomocnicze
function getTercCode(record) {
  const woj = record.WOJ || '';
  const pow = record.POW || '';
  const gmi = record.GMI || '';
  
  // Sprawdź czy mamy przynajmniej kod województwa
  if (!woj) {
    console.error('Brak kodu województwa w rekordzie:', record);
    return null;
  }
  
  if (pow === '' && gmi === '') {
    return woj;
  } else if (gmi === '' && pow !== '') {
    return woj + pow;
  } else if (gmi !== '') {
    return woj + pow + gmi;
  }
  
  // Fallback - zwróć kod województwa
  return woj;
}

function isTercComplete(record) {
  // Sprawdź wszystkie wymagane pola dla TERC
  const requiredFields = ['name', 'code', 'type'];
  const missingFields = requiredFields.filter(field => !record[field]);
  
  // Sprawdź format kodów
  if (record.wojewodztwoCode && !/^\d{2}$/.test(record.wojewodztwoCode)) {
    missingFields.push('nieprawidłowy kod województwa');
  }
  if (record.powiatCode && !/^\d{4}$/.test(record.powiatCode)) {
    missingFields.push('nieprawidłowy kod powiatu');
  }
  if (record.gminaCode && !/^\d{6}$/.test(record.gminaCode)) {
    missingFields.push('nieprawidłowy kod gminy');
  }
  
  // Sprawdź typ
  const validTypes = ['województwo', 'powiat', 'gmina'];
  if (!validTypes.includes(record.type)) {
    missingFields.push('nieprawidłowy typ');
  }
  
  // Sprawdź rodzaj (może być pusty, ale jeśli istnieje to powinien być string)
  if (record.rodzaj && typeof record.rodzaj !== 'string') {
    missingFields.push('nieprawidłowy rodzaj');
  }
  
  return missingFields.length === 0;
}

function isSimcComplete(record) {
  // Sprawdź wszystkie wymagane pola dla SIMC
  const requiredFields = ['name', 'code', 'wojewodztwoCode', 'powiatCode', 'gminaCode'];
  const missingFields = requiredFields.filter(field => !record[field]);
  
  // Sprawdź format kodów
  if (record.wojewodztwoCode && !/^\d{2}$/.test(record.wojewodztwoCode)) {
    missingFields.push('nieprawidłowy kod województwa');
  }
  if (record.powiatCode && !/^\d{4}$/.test(record.powiatCode)) {
    missingFields.push('nieprawidłowy kod powiatu');
  }
  if (record.gminaCode && !/^\d{6}$/.test(record.gminaCode)) {
    missingFields.push('nieprawidłowy kod gminy');
  }
  if (record.code && !/^\d{7}$/.test(record.code)) {
    missingFields.push('nieprawidłowy kod SIMC');
  }
  
  // Sprawdź typ
  if (record.type !== 'miejscowość') {
    missingFields.push('nieprawidłowy typ (powinien być "miejscowość")');
  }
  
  // Sprawdź rodzaj gminy (może być pusty, ale jeśli istnieje to powinien być string)
  if (record.rodzajGminy && typeof record.rodzajGminy !== 'string') {
    missingFields.push('nieprawidłowy rodzaj gminy');
  }
  
  return missingFields.length === 0;
}

function isUlicComplete(record) {
  // Sprawdź wszystkie wymagane pola dla ULIC
  const requiredFields = ['name', 'symUlic', 'sym'];
  const missingFields = requiredFields.filter(field => !record[field]);
  
  // Sprawdź format kodów
  if (record.wojewodztwoCode && !/^\d{2}$/.test(record.wojewodztwoCode)) {
    missingFields.push('nieprawidłowy kod województwa');
  }
  if (record.powiatCode && !/^\d{4}$/.test(record.powiatCode)) {
    missingFields.push('nieprawidłowy kod powiatu');
  }
  if (record.gminaCode && !/^\d{6}$/.test(record.gminaCode)) {
    missingFields.push('nieprawidłowy kod gminy');
  }
  if (record.symUlic && !/^\d{7}$/.test(record.symUlic)) {
    missingFields.push('nieprawidłowy kod ULIC');
  }
  if (record.simcCode && !/^\d{7}$/.test(record.simcCode)) {
    missingFields.push('nieprawidłowy kod SIMC');
  }
  
  // Sprawdź nazwa1 (główna nazwa)
  if (!record.nazwa1 || record.nazwa1.trim() === '') {
    missingFields.push('brak nazwy głównej (nazwa1)');
  }
  
  // Sprawdź nazwa2 (może być pusta, ale jeśli istnieje to powinna być string)
  if (record.nazwa2 && typeof record.nazwa2 !== 'string') {
    missingFields.push('nieprawidłowa nazwa dodatkowa (nazwa2)');
  }
  
  // Sprawdź cecha (może być pusta, ale jeśli istnieje to powinna być string)
  if (record.cecha && typeof record.cecha !== 'string') {
    missingFields.push('nieprawidłowa cecha');
  }
  
  // Sprawdź rodzaj (może być pusty, ale jeśli istnieje to powinien być string)
  if (record.rodzaj && typeof record.rodzaj !== 'string') {
    missingFields.push('nieprawidłowy rodzaj');
  }
  
  // Sprawdź typ ulicy
  const validTypes = ['ulica', 'plac', 'aleja', 'bulwar', 'rondo', 'skwer', 'park'];
  if (record.type && !validTypes.includes(record.type)) {
    missingFields.push('nieprawidłowy typ ulicy');
  }
  
  return missingFields.length === 0;
}

async function processTercRecord(item, action) {
  const tercData = mapTercDataToSeparate(item);
  
  // Jeśli dane są nieprawidłowe (null), pomiń rekord
  if (!tercData) {
    console.log('⚠️  Pominięto rekord TERC - błędy walidacji');
    return;
  }
  
  if (action === 'update' && item.existingId) {
    await Terc.findByIdAndUpdate(item.existingId, tercData);
  } else {
    const terc = new Terc(tercData);
    await terc.save();
  }
}

async function processSimcRecord(item, action) {
  const simcData = mapSimcDataToSeparate(item);
  
  // Jeśli dane są nieprawidłowe (null), pomiń rekord
  if (!simcData) {
    console.log('⚠️  Pominięto rekord SIMC - błędy walidacji');
    return;
  }
  
  if (action === 'update' && item.existingId) {
    await Simc.findByIdAndUpdate(item.existingId, simcData);
  } else {
    const simc = new Simc(simcData);
    await simc.save();
  }
}

async function processUlicRecord(item, action) {
  const ulicData = mapUlicDataToSeparate(item);
  
  // Zawsze przetwarzaj rekord - nie pomijaj żadnych
  
  if (action === 'update' && item.existingId) {
    await Ulic.findByIdAndUpdate(item.existingId, ulicData);
  } else {
    const ulic = new Ulic(ulicData);
    await ulic.save();
  }
}

function mapTercDataToSeparate(row) {
  const woj = row.WOJ || '';
  const pow = row.POW || '';
  const gmi = row.GMI || '';
  const nazwa = row.NAZWA || '';
  const rodzaj = row.RODZ || '';
  
  // KOMPLEKSOWA WALIDACJA - sprawdź wszystkie pola
  const validationErrors = [];
  
  // Sprawdź czy nazwa nie jest pusta
  if (!nazwa || nazwa.trim() === '') {
    validationErrors.push('Brak nazwy (NAZWA)');
  }
  
  // Sprawdź czy kod województwa jest poprawny
  if (!woj || woj.trim() === '') {
    validationErrors.push('Brak kodu województwa (WOJ)');
  } else if (!/^\d{2}$/.test(woj.trim())) {
    validationErrors.push('Nieprawidłowy kod województwa (WOJ)');
  }
  
  // Sprawdź kod powiatu (może być pusty dla województw)
  if (pow && pow.trim() !== '' && !/^\d{2}$/.test(pow.trim())) {
    validationErrors.push('Nieprawidłowy kod powiatu (POW)');
  }
  
  // Sprawdź kod gminy (może być pusty dla województw i powiatów)
  if (gmi && gmi.trim() !== '' && !/^\d{2}$/.test(gmi.trim())) {
    validationErrors.push('Nieprawidłowy kod gminy (GMI)');
  }
  
  // Sprawdź rodzaj (może być pusty, ale jeśli istnieje to powinien być string)
  if (rodzaj && typeof rodzaj !== 'string') {
    validationErrors.push('Nieprawidłowy rodzaj (RODZ)');
  }
  
  // Jeśli są błędy walidacji, zwróć null
  if (validationErrors.length > 0) {
    console.log(`⚠️  Pominięto rekord TERC - błędy walidacji: ${validationErrors.join(', ')}`);
    return null;
  }
  
  let type = '';
  let code = '';
  let wojewodztwoCode = '';
  let powiatCode = '';
  let gminaCode = '';
  
  if (pow === '' && gmi === '') {
    type = 'województwo';
    code = woj;
    wojewodztwoCode = woj;
  } else if (gmi === '' && pow !== '') {
    type = 'powiat';
    code = woj + pow;
    wojewodztwoCode = woj;
    powiatCode = woj + pow;
  } else if (gmi !== '') {
    type = 'gmina';
    code = woj + pow + gmi;
    wojewodztwoCode = woj;
    powiatCode = woj + pow;
    gminaCode = woj + pow + gmi;
  }

  return {
    name: nazwa.trim(),
    code: code,
    type: type,
    wojewodztwoCode: wojewodztwoCode,
    powiatCode: powiatCode,
    gminaCode: gminaCode,
    rodzaj: rodzaj,
    isActive: true,
    isVerified: true
  };
}

function mapSimcDataToSeparate(row) {
  const nazwa = row.NAZWA || '';
  const sym = row.SYM || '';
  const woj = row.WOJ || '';
  const pow = row.POW || '';
  const gmi = row.GMI || '';
  const rm = row.RM || '';
  const rodzajGmi = row.RODZ_GMI || '';
  
  // KOMPLEKSOWA WALIDACJA - sprawdź wszystkie pola
  const validationErrors = [];
  
  // Sprawdź czy nazwa nie jest pusta
  if (!nazwa || nazwa.trim() === '') {
    validationErrors.push('Brak nazwy (NAZWA)');
  }
  
  // Sprawdź czy kod województwa jest poprawny
  if (!woj || woj.trim() === '') {
    validationErrors.push('Brak kodu województwa (WOJ)');
  } else if (!/^\d{2}$/.test(woj.trim())) {
    validationErrors.push('Nieprawidłowy kod województwa (WOJ)');
  }
  
  // Sprawdź kod powiatu
  if (!pow || pow.trim() === '') {
    validationErrors.push('Brak kodu powiatu (POW)');
  } else if (!/^\d{2}$/.test(pow.trim())) {
    validationErrors.push('Nieprawidłowy kod powiatu (POW)');
  }
  
  // Sprawdź kod gminy
  if (!gmi || gmi.trim() === '') {
    validationErrors.push('Brak kodu gminy (GMI)');
  } else if (!/^\d{2}$/.test(gmi.trim())) {
    validationErrors.push('Nieprawidłowy kod gminy (GMI)');
  }
  
  // Sprawdź kod SIMC
  if (!sym || sym.trim() === '') {
    validationErrors.push('Brak kodu SIMC (SYM)');
  } else if (!/^\d{7}$/.test(sym.trim())) {
    validationErrors.push('Nieprawidłowy kod SIMC (SYM)');
  }
  
  // Sprawdź kod miejscowości
  if (!rm || rm.trim() === '') {
    validationErrors.push('Brak kodu miejscowości (RM)');
  } else if (!/^\d{2}$/.test(rm.trim())) {
    validationErrors.push('Nieprawidłowy kod miejscowości (RM)');
  }
  
  // Sprawdź rodzaj gminy (może być pusty, ale jeśli istnieje to powinien być string)
  if (rodzajGmi && typeof rodzajGmi !== 'string') {
    validationErrors.push('Nieprawidłowy rodzaj gminy (RODZ_GMI)');
  }
  
  // Tylko główne miejscowości (bez części)
  if (rm !== '01') {
    validationErrors.push('Pominięto część miejscowości (RM !== 01)');
  }
  
  // Jeśli są błędy walidacji, zwróć null
  if (validationErrors.length > 0) {
    console.log(`⚠️  Pominięto rekord SIMC - błędy walidacji: ${validationErrors.join(', ')}`);
    return null;
  }

  return {
    name: nazwa.trim(),
    code: sym,
    type: 'miejscowość',
    wojewodztwoCode: woj,
    powiatCode: woj + pow,
    gminaCode: woj + pow + gmi,
    tercCode: woj + pow + gmi,
    rodzajGminy: rodzajGmi,
    isActive: true,
    isVerified: true
  };
}

function mapUlicDataToSeparate(row) {
  // Zawsze pobierz wszystkie pola z CSV - zastąp puste pola wartością "brak"
  const nazwa1 = row.NAZWA_1 || 'brak';
  const nazwa2 = row.NAZWA_2 || 'brak';
  const cecha = row.CECHA || 'brak';
  const symUlic = row.SYM_UL || 'brak';
  const woj = row.WOJ || 'brak';
  const pow = row.POW || 'brak';
  const gmi = row.GMI || 'brak';
  const sym = row.SYM || 'brak';
  const rodzGmi = row.RODZ_GMI || 'brak';
  const stanNa = row.STAN_NA || 'brak';
  
  // Zbuduj pełną nazwę ulicy
  let fullName = nazwa1.trim();
  if (cecha && cecha.trim()) {
    fullName = `${cecha.trim()} ${fullName}`;
  }
  if (nazwa2 && nazwa2.trim()) {
    fullName += ` ${nazwa2.trim()}`;
  }

  // Określ typ ulicy na podstawie cechy
  let type = 'ulica';
  if (cecha) {
    const cechaLower = cecha.toLowerCase().trim();
    if (cechaLower.includes('pl.')) type = 'plac';
    else if (cechaLower.includes('al.')) type = 'aleja';
    else if (cechaLower.includes('bulw.')) type = 'bulwar';
    else if (cechaLower.includes('rondo')) type = 'rondo';
    else if (cechaLower.includes('skwer')) type = 'skwer';
    else if (cechaLower.includes('park')) type = 'park';
  }

  // ZAWSZE zwróć wszystkie pola z CSV, nawet jeśli są puste
  return {
    // Pola z CSV - ZAWSZE zapisuj wszystkie, nawet puste
    woj: woj,
    pow: pow,
    gmi: gmi,
    rodzGmi: rodzGmi,
    sym: sym,
    symUlic: symUlic,
    cecha: cecha,
    nazwa1: nazwa1,
    nazwa2: nazwa2,
    stanNa: stanNa,
    
    // Pola obliczane
    name: fullName,
    code: symUlic,
    type: type,
    wojewodztwoCode: woj,
    powiatCode: woj + pow,
    gminaCode: woj + pow + gmi,
    tercCode: woj + pow + gmi,
    simcCode: sym,
    rodzaj: cecha,
    
    // Status
    isActive: true,
    isVerified: true
  };
}

module.exports = router; 