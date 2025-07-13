const mongoose = require('mongoose');
const User = require('../models/userModel');

class ABTestingService {
  constructor() {
    this.activeTests = new Map();
    this.userAssignments = new Map();
    this.results = new Map();
  }

  // Inicjalizacja testów A/B
  initializeTests() {
    // Test 1: Rekomendacje produktów
    this.createTest('product_recommendations', {
      name: 'Test Rekomendacji Produktów',
      description: 'Testowanie różnych algorytmów rekomendacji',
      variants: {
        A: { name: 'Personalized (40%) + Collaborative (30%) + Content (30%)', weight: 0.33 },
        B: { name: 'Personalized (60%) + Collaborative (20%) + Content (20%)', weight: 0.33 },
        C: { name: 'Personalized (20%) + Collaborative (40%) + Content (40%)', weight: 0.34 }
      },
      metrics: ['click_rate', 'purchase_rate', 'revenue_per_user'],
      duration: 30, // dni
      startDate: new Date(),
      isActive: true
    });

    // Test 2: Układ strony głównej
    this.createTest('homepage_layout', {
      name: 'Test Układu Strony Głównej',
      description: 'Testowanie różnych układów strony głównej',
      variants: {
        A: { name: 'Standard Layout', weight: 0.5 },
        B: { name: 'Grid Layout', weight: 0.5 }
      },
      metrics: ['bounce_rate', 'time_on_page', 'conversion_rate'],
      duration: 14,
      startDate: new Date(),
      isActive: true
    });

    // Test 3: CTA Buttons
    this.createTest('cta_buttons', {
      name: 'Test Przycisków CTA',
      description: 'Testowanie różnych tekstów przycisków',
      variants: {
        A: { name: 'Kup Teraz', weight: 0.25 },
        B: { name: 'Dodaj do Koszyka', weight: 0.25 },
        C: { name: 'Sprawdź Cenę', weight: 0.25 },
        D: { name: 'Zamów Teraz', weight: 0.25 }
      },
      metrics: ['click_rate', 'conversion_rate'],
      duration: 21,
      startDate: new Date(),
      isActive: true
    });

    // Test 4: Ceny produktów
    this.createTest('pricing_strategy', {
      name: 'Test Strategii Cenowej',
      description: 'Testowanie różnych strategii cenowych',
      variants: {
        A: { name: 'Standard Pricing', weight: 0.5 },
        B: { name: 'Dynamic Pricing', weight: 0.5 }
      },
      metrics: ['purchase_rate', 'average_order_value', 'revenue'],
      duration: 45,
      startDate: new Date(),
      isActive: true
    });

    // Test 5: System lojalnościowy
    this.createTest('loyalty_system', {
      name: 'Test Systemu Lojalnościowego',
      description: 'Testowanie różnych programów lojalnościowych',
      variants: {
        A: { name: 'Punkty za zakupy', weight: 0.33 },
        B: { name: 'Rabaty procentowe', weight: 0.33 },
        C: { name: 'Darmowa dostawa', weight: 0.34 }
      },
      metrics: ['repeat_purchase_rate', 'customer_lifetime_value', 'retention_rate'],
      duration: 60,
      startDate: new Date(),
      isActive: true
    });
  }

  // Tworzenie nowego testu
  createTest(testId, config) {
    this.activeTests.set(testId, {
      id: testId,
      ...config,
      participants: new Map(),
      results: {
        A: { impressions: 0, conversions: 0, revenue: 0 },
        B: { impressions: 0, conversions: 0, revenue: 0 },
        C: { impressions: 0, conversions: 0, revenue: 0 },
        D: { impressions: 0, conversions: 0, revenue: 0 }
      }
    });
  }

  // Przypisanie użytkownika do wariantu
  assignUserToVariant(userId, testId) {
    const test = this.activeTests.get(testId);
    if (!test || !test.isActive) {
      return 'A'; // Domyślny wariant
    }

    // Sprawdź czy użytkownik już jest przypisany
    const existingAssignment = this.userAssignments.get(`${userId}_${testId}`);
    if (existingAssignment) {
      return existingAssignment;
    }

    // Przypisz użytkownika do wariantu na podstawie wag
    const random = Math.random();
    let cumulativeWeight = 0;
    
    for (const [variant, config] of Object.entries(test.variants)) {
      cumulativeWeight += config.weight;
      if (random <= cumulativeWeight) {
        this.userAssignments.set(`${userId}_${testId}`, variant);
        this.trackImpression(userId, testId, variant);
        return variant;
      }
    }

    // Fallback do pierwszego wariantu
    const firstVariant = Object.keys(test.variants)[0];
    this.userAssignments.set(`${userId}_${testId}`, firstVariant);
    this.trackImpression(userId, testId, firstVariant);
    return firstVariant;
  }

  // Śledzenie wyświetlenia (impression)
  trackImpression(userId, testId, variant) {
    const test = this.activeTests.get(testId);
    if (test && test.results[variant]) {
      test.results[variant].impressions++;
      
      // Zapisz uczestnika testu
      test.participants.set(userId, {
        variant,
        joinedAt: new Date(),
        impressions: 1,
        conversions: 0,
        revenue: 0
      });
    }
  }

  // Śledzenie konwersji
  trackConversion(userId, testId, variant, value = 0) {
    const test = this.activeTests.get(testId);
    if (test && test.results[variant]) {
      test.results[variant].conversions++;
      test.results[variant].revenue += value;

      // Aktualizuj dane uczestnika
      const participant = test.participants.get(userId);
      if (participant) {
        participant.conversions++;
        participant.revenue += value;
        participant.lastConversionAt = new Date();
      }
    }
  }

  // Śledzenie kliknięcia
  trackClick(userId, testId, variant) {
    const test = this.activeTests.get(testId);
    if (test) {
      const participant = test.participants.get(userId);
      if (participant) {
        participant.clicks = (participant.clicks || 0) + 1;
        participant.lastClickAt = new Date();
      }
    }
  }

  // Pobieranie wariantu dla użytkownika
  getUserVariant(userId, testId) {
    return this.assignUserToVariant(userId, testId);
  }

  // Pobieranie wyników testu
  getTestResults(testId) {
    const test = this.activeTests.get(testId);
    if (!test) {
      return null;
    }

    const results = {};
    let totalImpressions = 0;
    let totalConversions = 0;
    let totalRevenue = 0;

    // Oblicz statystyki dla każdego wariantu
    for (const [variant, data] of Object.entries(test.results)) {
      const conversionRate = data.impressions > 0 ? (data.conversions / data.impressions) * 100 : 0;
      const revenuePerImpression = data.impressions > 0 ? data.revenue / data.impressions : 0;
      const revenuePerConversion = data.conversions > 0 ? data.revenue / data.conversions : 0;

      results[variant] = {
        name: test.variants[variant]?.name || variant,
        impressions: data.impressions,
        conversions: data.conversions,
        revenue: data.revenue,
        conversionRate: conversionRate.toFixed(2),
        revenuePerImpression: revenuePerImpression.toFixed(2),
        revenuePerConversion: revenuePerConversion.toFixed(2)
      };

      totalImpressions += data.impressions;
      totalConversions += data.conversions;
      totalRevenue += data.revenue;
    }

    // Oblicz statystyki ogólne
    const overallConversionRate = totalImpressions > 0 ? (totalConversions / totalImpressions) * 100 : 0;
    const overallRevenuePerImpression = totalImpressions > 0 ? totalRevenue / totalImpressions : 0;

    return {
      testId,
      name: test.name,
      description: test.description,
      isActive: test.isActive,
      startDate: test.startDate,
      duration: test.duration,
      totalImpressions,
      totalConversions,
      totalRevenue,
      overallConversionRate: overallConversionRate.toFixed(2),
      overallRevenuePerImpression: overallRevenuePerImpression.toFixed(2),
      variants: results,
      participants: test.participants.size,
      statisticalSignificance: this.calculateStatisticalSignificance(test.results)
    };
  }

  // Obliczanie istotności statystycznej
  calculateStatisticalSignificance(results) {
    const variants = Object.keys(results).filter(v => results[v].impressions > 0);
    if (variants.length < 2) return null;

    // Prosty test chi-kwadrat dla konwersji
    const control = variants[0];
    const controlRate = results[control].conversions / results[control].impressions;
    
    const significance = {};
    
    for (let i = 1; i < variants.length; i++) {
      const variant = variants[i];
      const variantRate = results[variant].conversions / results[variant].impressions;
      
      // Oblicz p-value (uproszczone)
      const difference = Math.abs(variantRate - controlRate);
      const pooledRate = (results[control].conversions + results[variant].conversions) / 
                        (results[control].impressions + results[variant].impressions);
      
      const standardError = Math.sqrt(
        pooledRate * (1 - pooledRate) * 
        (1 / results[control].impressions + 1 / results[variant].impressions)
      );
      
      const zScore = difference / standardError;
      const pValue = this.calculatePValue(zScore);
      
      significance[variant] = {
        better: variantRate > controlRate,
        pValue: pValue.toFixed(4),
        significant: pValue < 0.05,
        improvement: ((variantRate - controlRate) / controlRate * 100).toFixed(2)
      };
    }

    return significance;
  }

  // Obliczanie p-value (uproszczone)
  calculatePValue(zScore) {
    // Uproszczona funkcja normalna
    return Math.exp(-0.5 * zScore * zScore) / Math.sqrt(2 * Math.PI);
  }

  // Pobieranie wszystkich aktywnych testów
  getActiveTests() {
    const activeTests = [];
    for (const [testId, test] of this.activeTests) {
      if (test.isActive) {
        activeTests.push({
          id: testId,
          name: test.name,
          description: test.description,
          variants: Object.keys(test.variants).length,
          participants: test.participants.size,
          startDate: test.startDate,
          duration: test.duration
        });
      }
    }
    return activeTests;
  }

  // Zatrzymanie testu
  stopTest(testId) {
    const test = this.activeTests.get(testId);
    if (test) {
      test.isActive = false;
      test.endDate = new Date();
    }
  }

  // Usunięcie testu
  removeTest(testId) {
    this.activeTests.delete(testId);
    // Usuń przypisania użytkowników
    for (const key of this.userAssignments.keys()) {
      if (key.includes(testId)) {
        this.userAssignments.delete(key);
      }
    }
  }

  // Eksport wyników testu
  exportTestResults(testId, format = 'json') {
    const results = this.getTestResults(testId);
    if (!results) return null;

    switch (format) {
      case 'json':
        return JSON.stringify(results, null, 2);
      case 'csv':
        return this.convertToCSV(results);
      case 'html':
        return this.convertToHTML(results);
      default:
        return results;
    }
  }

  // Konwersja do CSV
  convertToCSV(results) {
    let csv = 'Variant,Impressions,Conversions,Revenue,Conversion Rate,Revenue per Impression\n';
    
    for (const [variant, data] of Object.entries(results.variants)) {
      csv += `${data.name},${data.impressions},${data.conversions},${data.revenue},${data.conversionRate}%,${data.revenuePerImpression}\n`;
    }
    
    return csv;
  }

  // Konwersja do HTML
  convertToHTML(results) {
    return `
      <html>
        <head>
          <title>A/B Test Results - ${results.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .winner { background-color: #d4edda; }
          </style>
        </head>
        <body>
          <h1>${results.name}</h1>
          <p>${results.description}</p>
          <table>
            <tr>
              <th>Wariant</th>
              <th>Wyświetlenia</th>
              <th>Konwersje</th>
              <th>Przychód</th>
              <th>Stopa Konwersji</th>
              <th>Przychód/Wyświetlenie</th>
            </tr>
            ${Object.entries(results.variants).map(([variant, data]) => `
              <tr>
                <td>${data.name}</td>
                <td>${data.impressions}</td>
                <td>${data.conversions}</td>
                <td>${data.revenue}</td>
                <td>${data.conversionRate}%</td>
                <td>${data.revenuePerImpression}</td>
              </tr>
            `).join('')}
          </table>
        </body>
      </html>
    `;
  }

  // Automatyczne zatrzymanie wygasłych testów
  cleanupExpiredTests() {
    const now = new Date();
    for (const [testId, test] of this.activeTests) {
      if (test.isActive && test.startDate) {
        const daysSinceStart = (now - test.startDate) / (1000 * 60 * 60 * 24);
        if (daysSinceStart >= test.duration) {
          this.stopTest(testId);
          console.log(`Test ${testId} został automatycznie zatrzymany po ${test.duration} dniach`);
        }
      }
    }
  }
}

module.exports = new ABTestingService(); 