const Error = require('../models/errorModel');
const ErrorGroup = require('../models/errorGroupModel');
const { saveError, generateErrorHash, determineSeverity } = require('../middleware/errorHandler');

// Pobierz listę błędów z filtrowaniem
const getErrors = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      severity,
      status,
      url,
      userId,
      startDate,
      endDate,
      sortBy = 'timestamp',
      sortOrder = 'desc'
    } = req.query;

    // Buduj filtr
    const filter = {};
    
    if (type) filter.type = type;
    if (severity) filter.severity = severity;
    if (status) filter.status = status;
    if (url) filter.url = { $regex: url, $options: 'i' };
    if (userId) filter.userId = userId;
    
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    // Wykonaj zapytanie
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const errors = await Error.find(filter)
      .populate('groupId')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Error.countDocuments(filter);

    res.json({
      errors,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Błąd podczas pobierania błędów:', error);
    res.status(500).json({ error: 'Błąd podczas pobierania błędów' });
  }
};

// Pobierz szczegóły błędu
const getErrorById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const error = await Error.findById(id).populate('groupId');
    
    if (!error) {
      return res.status(404).json({ error: 'Błąd nie został znaleziony' });
    }
    
    res.json({ error });
  } catch (error) {
    console.error('Błąd podczas pobierania szczegółów błędu:', error);
    res.status(500).json({ error: 'Błąd podczas pobierania szczegółów błędu' });
  }
};

// Zgłoś nowy błąd
const reportError = async (req, res) => {
  try {
    const errorData = req.body;
    
    // Walidacja wymaganych pól
    if (!errorData.message) {
      return res.status(400).json({ error: 'Message jest wymagane' });
    }
    
    // Ustaw domyślne wartości
    errorData.id = errorData.id || `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    errorData.timestamp = errorData.timestamp || new Date().toISOString();
    errorData.type = errorData.type || 'unknown';
    errorData.severity = errorData.severity || determineSeverity({ message: errorData.message }, errorData.type);
    errorData.url = errorData.url || req.get('Referer') || 'unknown';
    errorData.userAgent = errorData.userAgent || req.get('User-Agent');
    errorData.userId = errorData.userId || req.user?.id || 'anonymous';
    
    // Generuj hash
    errorData.hash = generateErrorHash(errorData.message, errorData.stack);
    
    // Zapisz błąd
    const savedError = await saveError(errorData);
    
    res.status(201).json({
      message: 'Błąd został zgłoszony',
      errorId: savedError.id,
      groupId: savedError.groupId
    });
  } catch (error) {
    console.error('Błąd podczas zgłaszania błędu:', error);
    res.status(500).json({ error: 'Błąd podczas zgłaszania błędu' });
  }
};

// Aktualizuj status błędu
const updateErrorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, assignedTo } = req.body;
    
    const error = await Error.findById(id);
    
    if (!error) {
      return res.status(404).json({ error: 'Błąd nie został znaleziony' });
    }
    
    if (status) {
      error.status = status;
      if (status === 'resolved') {
        error.resolvedAt = new Date();
      }
    }
    
    if (notes) {
      await error.addNote(notes, req.user?.id || 'system');
    }
    
    if (assignedTo) {
      error.assignedTo = assignedTo;
    }
    
    await error.save();
    
    res.json({ message: 'Status błędu został zaktualizowany', error });
  } catch (error) {
    console.error('Błąd podczas aktualizacji statusu błędu:', error);
    res.status(500).json({ error: 'Błąd podczas aktualizacji statusu błędu' });
  }
};

// Pobierz statystyki błędów
const getErrorStats = async (req, res) => {
  try {
    const { hours = 24 } = req.query;
    
    const stats = await Error.getErrorStats();
    const errorsByType = await Error.getErrorsByType();
    const errorsByUrl = await Error.getErrorsByUrl();
    
    // Statystyki z ostatnich X godzin
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    const recentErrors = await Error.countDocuments({ timestamp: { $gte: cutoff } });
    
    res.json({
      stats: stats[0] || {},
      errorsByType,
      errorsByUrl,
      recentErrors,
      timeRange: `${hours} godzin`
    });
  } catch (error) {
    console.error('Błąd podczas pobierania statystyk błędów:', error);
    res.status(500).json({ error: 'Błąd podczas pobierania statystyk błędów' });
  }
};

// Pobierz listę grup błędów
const getErrorGroups = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      severity,
      status,
      sortBy = 'lastSeen',
      sortOrder = 'desc'
    } = req.query;

    // Buduj filtr
    const filter = {};
    
    if (type) filter.type = type;
    if (severity) filter.severity = severity;
    if (status) filter.status = status;

    // Wykonaj zapytanie
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const groups = await ErrorGroup.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await ErrorGroup.countDocuments(filter);

    res.json({
      groups,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Błąd podczas pobierania grup błędów:', error);
    res.status(500).json({ error: 'Błąd podczas pobierania grup błędów' });
  }
};

// Pobierz szczegóły grupy błędów
const getErrorGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const group = await ErrorGroup.findById(id);
    
    if (!group) {
      return res.status(404).json({ error: 'Grupa błędów nie została znaleziona' });
    }
    
    // Pobierz błędy z tej grupy
    const errors = await Error.find({ groupId: id })
      .sort({ timestamp: -1 })
      .limit(50)
      .lean();
    
    res.json({ group, errors });
  } catch (error) {
    console.error('Błąd podczas pobierania szczegółów grupy błędów:', error);
    res.status(500).json({ error: 'Błąd podczas pobierania szczegółów grupy błędów' });
  }
};

// Aktualizuj status grupy błędów
const updateErrorGroupStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, assignedTo, priority } = req.body;
    
    const group = await ErrorGroup.findById(id);
    
    if (!group) {
      return res.status(404).json({ error: 'Grupa błędów nie została znaleziona' });
    }
    
    if (status) {
      group.status = status;
      if (status === 'resolved') {
        group.resolvedAt = new Date();
      }
    }
    
    if (notes) {
      await group.addNote(notes, req.user?.id || 'system');
    }
    
    if (assignedTo) {
      group.assignedTo = assignedTo;
    }
    
    if (priority) {
      group.priority = priority;
    }
    
    await group.save();
    
    res.json({ message: 'Status grupy błędów został zaktualizowany', group });
  } catch (error) {
    console.error('Błąd podczas aktualizacji statusu grupy błędów:', error);
    res.status(500).json({ error: 'Błąd podczas aktualizacji statusu grupy błędów' });
  }
};

// Pobierz statystyki grup błędów
const getErrorGroupStats = async (req, res) => {
  try {
    const stats = await ErrorGroup.getGroupStats();
    const groupsByType = await ErrorGroup.getGroupsByType();
    const trendingGroups = await ErrorGroup.getTrendingGroups();
    
    res.json({
      stats: stats[0] || {},
      groupsByType,
      trendingGroups
    });
  } catch (error) {
    console.error('Błąd podczas pobierania statystyk grup błędów:', error);
    res.status(500).json({ error: 'Błąd podczas pobierania statystyk grup błędów' });
  }
};

// Usuń błąd
const deleteError = async (req, res) => {
  try {
    const { id } = req.params;
    
    const error = await Error.findByIdAndDelete(id);
    
    if (!error) {
      return res.status(404).json({ error: 'Błąd nie został znaleziony' });
    }
    
    res.json({ message: 'Błąd został usunięty' });
  } catch (error) {
    console.error('Błąd podczas usuwania błędu:', error);
    res.status(500).json({ error: 'Błąd podczas usuwania błędu' });
  }
};

// Usuń grupę błędów
const deleteErrorGroup = async (req, res) => {
  try {
    const { id } = req.params;
    
    const group = await ErrorGroup.findByIdAndDelete(id);
    
    if (!group) {
      return res.status(404).json({ error: 'Grupa błędów nie została znaleziona' });
    }
    
    // Usuń wszystkie błędy z tej grupy
    await Error.deleteMany({ groupId: id });
    
    res.json({ message: 'Grupa błędów została usunięta' });
  } catch (error) {
    console.error('Błąd podczas usuwania grupy błędów:', error);
    res.status(500).json({ error: 'Błąd podczas usuwania grupy błędów' });
  }
};

// Bulk actions
const bulkUpdateErrors = async (req, res) => {
  try {
    const { errorIds, action, value } = req.body;
    
    if (!errorIds || !Array.isArray(errorIds) || errorIds.length === 0) {
      return res.status(400).json({ error: 'Lista ID błędów jest wymagana' });
    }
    
    let updateData = {};
    
    switch (action) {
      case 'status':
        updateData.status = value;
        if (value === 'resolved') {
          updateData.resolvedAt = new Date();
        }
        break;
      case 'assignedTo':
        updateData.assignedTo = value;
        break;
      default:
        return res.status(400).json({ error: 'Nieprawidłowa akcja' });
    }
    
    const result = await Error.updateMany(
      { _id: { $in: errorIds } },
      updateData
    );
    
    res.json({
      message: `${result.modifiedCount} błędów zostało zaktualizowanych`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Błąd podczas masowej aktualizacji błędów:', error);
    res.status(500).json({ error: 'Błąd podczas masowej aktualizacji błędów' });
  }
};

module.exports = {
  getErrors,
  getErrorById,
  reportError,
  updateErrorStatus,
  getErrorStats,
  getErrorGroups,
  getErrorGroupById,
  updateErrorGroupStatus,
  getErrorGroupStats,
  deleteError,
  deleteErrorGroup,
  bulkUpdateErrors
}; 