describe('Error Monitoring System', () => {
  beforeEach(() => {
    // Wyczyść localStorage przed każdym testem
    cy.clearLocalStorage();
    cy.visit('http://localhost:3000');
  });

  it('should capture JavaScript errors', () => {
    // Przechwyć błędy JavaScript
    cy.window().then((win) => {
      // Nasłuchuj na błędy
      cy.spy(win.console, 'error').as('consoleError');
      
      // Wykonaj błąd JavaScript
      win.eval(`
        setTimeout(() => {
          throw new Error('Test JavaScript Error from Cypress');
        }, 100);
      `);
    });

    // Sprawdź czy błąd został przechwycony
    cy.get('@consoleError').should('have.been.called');
    
    // Sprawdź localStorage
    cy.window().then((win) => {
      const errorQueue = JSON.parse(win.localStorage.getItem('errorQueue') || '[]');
      expect(errorQueue.length).to.be.greaterThan(0);
      
      const lastError = errorQueue[errorQueue.length - 1];
      expect(lastError.message).to.include('Test JavaScript Error from Cypress');
      expect(lastError.type).to.equal('javascript_error');
    });
  });

  it('should capture Promise rejections', () => {
    cy.window().then((win) => {
      cy.spy(win.console, 'error').as('consoleError');
      
      // Wykonaj Promise rejection
      win.eval(`
        setTimeout(() => {
          Promise.reject(new Error('Test Promise Rejection from Cypress'));
        }, 100);
      `);
    });

    cy.get('@consoleError').should('have.been.called');
    
    cy.window().then((win) => {
      const errorQueue = JSON.parse(win.localStorage.getItem('errorQueue') || '[]');
      expect(errorQueue.length).to.be.greaterThan(0);
      
      const lastError = errorQueue[errorQueue.length - 1];
      expect(lastError.message).to.include('Test Promise Rejection from Cypress');
      expect(lastError.type).to.equal('promise_rejection');
    });
  });

  it('should capture React errors via Error Boundary', () => {
    // Przejdź do strony z Error Boundary
    cy.visit('http://localhost:3000/error-dashboard');
    
    // Wykonaj błąd React
    cy.window().then((win) => {
      win.eval(`
        // Symuluj błąd React
        const errorEvent = new ErrorEvent('error', {
          message: 'Test React Error from Cypress',
          filename: 'test.js',
          lineno: 1,
          colno: 1
        });
        window.dispatchEvent(errorEvent);
      `);
    });

    // Sprawdź czy błąd został przechwycony
    cy.window().then((win) => {
      const errorQueue = JSON.parse(win.localStorage.getItem('errorQueue') || '[]');
      expect(errorQueue.length).to.be.greaterThan(0);
    });
  });

  it('should capture API errors', () => {
    // Przechwyć błędy sieciowe
    cy.intercept('GET', '/api/nonexistent', {
      statusCode: 404,
      body: { error: 'Not Found' }
    }).as('apiError');

    // Wykonaj żądanie do nieistniejącego endpointu
    cy.window().then((win) => {
      win.fetch('/api/nonexistent').catch(() => {
        // Błąd zostanie przechwycony przez system monitorowania
      });
    });

    cy.wait('@apiError');
    
    // Sprawdź czy błąd został przechwycony
    cy.window().then((win) => {
      const errorQueue = JSON.parse(win.localStorage.getItem('errorQueue') || '[]');
      expect(errorQueue.length).to.be.greaterThan(0);
    });
  });

  it('should display errors in dashboard', () => {
    // Wygeneruj kilka błędów
    cy.window().then((win) => {
      win.eval(`
        // Błąd 1
        setTimeout(() => {
          throw new Error('Dashboard Test Error 1');
        }, 100);
        
        // Błąd 2
        setTimeout(() => {
          throw new Error('Dashboard Test Error 2');
        }, 200);
        
        // Błąd 3
        setTimeout(() => {
          Promise.reject(new Error('Dashboard Test Error 3'));
        }, 300);
      `);
    });

    // Przejdź do dashboard
    cy.visit('http://localhost:3000/error-dashboard');
    
    // Poczekaj na załadowanie błędów
    cy.wait(1000);
    
    // Sprawdź czy dashboard wyświetla błędy
    cy.get('[data-testid="error-list"]').should('exist');
    cy.get('[data-testid="error-item"]').should('have.length.at.least', 1);
    
    // Sprawdź statystyki
    cy.get('[data-testid="stats-critical"]').should('exist');
    cy.get('[data-testid="stats-high"]').should('exist');
    cy.get('[data-testid="stats-medium"]').should('exist');
    cy.get('[data-testid="stats-low"]').should('exist');
  });

  it('should handle offline error queueing', () => {
    // Symuluj offline
    cy.window().then((win) => {
      cy.stub(win.navigator, 'onLine').value(false);
      
      // Wygeneruj błąd gdy offline
      win.eval(`
        setTimeout(() => {
          throw new Error('Offline Test Error');
        }, 100);
      `);
    });

    // Sprawdź czy błąd został dodany do kolejki
    cy.window().then((win) => {
      const errorQueue = JSON.parse(win.localStorage.getItem('errorQueue') || '[]');
      expect(errorQueue.length).to.be.greaterThan(0);
      
      const lastError = errorQueue[errorQueue.length - 1];
      expect(lastError.message).to.include('Offline Test Error');
    });
  });

  it('should send errors to backend API', () => {
    // Przechwyć żądania do API błędów
    cy.intercept('POST', '/api/errors', {
      statusCode: 201,
      body: { message: 'Error reported successfully' }
    }).as('reportError');

    // Wygeneruj błąd
    cy.window().then((win) => {
      win.eval(`
        setTimeout(() => {
          throw new Error('API Test Error');
        }, 100);
      `);
    });

    // Sprawdź czy żądanie zostało wysłane
    cy.wait('@reportError').then((interception) => {
      expect(interception.request.body).to.have.property('message');
      expect(interception.request.body.message).to.include('API Test Error');
      expect(interception.request.body).to.have.property('type');
      expect(interception.request.body).to.have.property('severity');
    });
  });

  it('should handle error boundary fallback UI', () => {
    // Przejdź do strony z Error Boundary
    cy.visit('http://localhost:3000/error-dashboard');
    
    // Wykonaj błąd, który powinien wywołać Error Boundary
    cy.window().then((win) => {
      win.eval(`
        // Symuluj błąd React, który wywoła Error Boundary
        const error = new Error('Error Boundary Test');
        const errorInfo = { componentStack: 'TestComponent' };
        
        // Wywołaj componentDidCatch
        if (win.errorReporter) {
          win.errorReporter.reportError({
            message: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            type: 'react_error',
            severity: 'high'
          });
        }
      `);
    });

    // Sprawdź czy Error Boundary wyświetlił się
    cy.get('[data-testid="error-boundary"]').should('exist');
    cy.contains('Wystąpił błąd').should('be.visible');
    cy.contains('Odśwież stronę').should('be.visible');
  });

  it('should filter errors by severity', () => {
    // Wygeneruj błędy o różnych ważnościach
    cy.window().then((win) => {
      win.eval(`
        // Błąd krytyczny
        setTimeout(() => {
          const error = new Error('Critical Error');
          error.severity = 'critical';
          throw error;
        }, 100);
        
        // Błąd wysoki
        setTimeout(() => {
          const error = new Error('High Error');
          error.severity = 'high';
          throw error;
        }, 200);
        
        // Błąd średni
        setTimeout(() => {
          const error = new Error('Medium Error');
          error.severity = 'medium';
          throw error;
        }, 300);
      `);
    });

    // Przejdź do dashboard
    cy.visit('http://localhost:3000/error-dashboard');
    cy.wait(1000);

    // Sprawdź filtry
    cy.get('[data-testid="filter-critical"]').click();
    cy.get('[data-testid="error-item"]').should('contain', 'Critical Error');
    
    cy.get('[data-testid="filter-high"]').click();
    cy.get('[data-testid="error-item"]').should('contain', 'High Error');
    
    cy.get('[data-testid="filter-medium"]').click();
    cy.get('[data-testid="error-item"]').should('contain', 'Medium Error');
  });

  it('should update error status', () => {
    // Wygeneruj błąd
    cy.window().then((win) => {
      win.eval(`
        setTimeout(() => {
          throw new Error('Status Update Test Error');
        }, 100);
      `);
    });

    // Przejdź do dashboard
    cy.visit('http://localhost:3000/error-dashboard');
    cy.wait(1000);

    // Kliknij na błąd aby zobaczyć szczegóły
    cy.get('[data-testid="error-item"]').first().click();
    
    // Zmień status na "resolved"
    cy.get('[data-testid="status-select"]').select('resolved');
    cy.get('[data-testid="update-status-btn"]').click();
    
    // Sprawdź czy status został zaktualizowany
    cy.get('[data-testid="error-status"]').should('contain', 'resolved');
  });

  it('should handle bulk operations', () => {
    // Wygeneruj kilka błędów
    cy.window().then((win) => {
      win.eval(`
        for (let i = 1; i <= 5; i++) {
          setTimeout(() => {
            throw new Error('Bulk Test Error ' + i);
          }, i * 100);
        }
      `);
    });

    // Przejdź do dashboard
    cy.visit('http://localhost:3000/error-dashboard');
    cy.wait(1000);

    // Zaznacz wszystkie błędy
    cy.get('[data-testid="select-all"]').click();
    
    // Wykonaj masową operację
    cy.get('[data-testid="bulk-resolve"]').click();
    
    // Sprawdź czy wszystkie błędy zostały oznaczone jako resolved
    cy.get('[data-testid="error-status"]').each(($el) => {
      cy.wrap($el).should('contain', 'resolved');
    });
  });
}); 