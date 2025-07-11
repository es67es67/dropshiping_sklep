describe('Layout Customization', () => {
  beforeEach(() => {
    // Zaloguj się przed testami
    cy.visit('http://localhost:3000')
    cy.get('input[type="email"]').type('FF@RRF.PL')
    cy.get('input[type="password"]').type('Admin123!')
    cy.get('button[type="submit"]').click()
    
    // Przejdź do panelu zmiany wyglądu
    cy.visit('http://localhost:3000/layout-customization')
  })

  it('should display layout customization page', () => {
    cy.get('h1').should('contain', 'Dostosowywanie wyglądu')
    cy.get('[data-testid="layout-tabs"]').should('be.visible')
    cy.get('[data-testid="layout-grid"]').should('be.visible')
    cy.get('[data-testid="theme-grid"]').should('be.visible')
  })

  it('should change layout selection', () => {
    // Sprawdź domyślny layout
    cy.get('[data-testid="layout-modern"]').should('have.class', 'selected')
    
    // Wybierz inny layout
    cy.get('[data-testid="layout-classic"]').click()
    cy.get('[data-testid="layout-classic"]').should('have.class', 'selected')
    cy.get('[data-testid="layout-modern"]').should('not.have.class', 'selected')
  })

  it('should change theme selection', () => {
    // Sprawdź domyślny motyw
    cy.get('[data-testid="theme-default"]').should('have.class', 'selected')
    
    // Wybierz inny motyw
    cy.get('[data-testid="theme-ocean"]').click()
    cy.get('[data-testid="theme-ocean"]').should('have.class', 'selected')
    cy.get('[data-testid="theme-default"]').should('not.have.class', 'selected')
  })

  it('should save layout settings', () => {
    // Zmień layout i motyw
    cy.get('[data-testid="layout-compact"]').click()
    cy.get('[data-testid="theme-sunset"]').click()
    
    // Zapisz ustawienia
    cy.get('button').contains('Zapisz ustawienia').click()
    
    // Sprawdź czy pojawił się komunikat sukcesu
    cy.get('[data-testid="success-message"]').should('be.visible')
    cy.get('[data-testid="success-message"]').should('contain', 'zostały zapisane')
  })

  it('should test custom colors', () => {
    // Wybierz niestandardowy kolor
    cy.get('[data-testid="color-green"]').click()
    cy.get('[data-testid="color-green"]').should('have.class', 'selected')
    
    // Zapisz ustawienia
    cy.get('button').contains('Zapisz ustawienia').click()
    cy.get('[data-testid="success-message"]').should('be.visible')
  })

  it('should reset settings', () => {
    // Zmień ustawienia
    cy.get('[data-testid="layout-elegant"]').click()
    cy.get('[data-testid="theme-midnight"]').click()
    
    // Resetuj ustawienia
    cy.get('button').contains('Resetuj').click()
    
    // Sprawdź czy wróciły domyślne ustawienia
    cy.get('[data-testid="layout-modern"]').should('have.class', 'selected')
    cy.get('[data-testid="theme-default"]').should('have.class', 'selected')
  })

  it('should switch between portal and shop tabs', () => {
    // Sprawdź domyślną zakładkę
    cy.get('[data-testid="tab-portal"]').should('have.class', 'active')
    
    // Przełącz na zakładkę sklepu
    cy.get('[data-testid="tab-shop"]').click()
    cy.get('[data-testid="tab-shop"]').should('have.class', 'active')
    cy.get('[data-testid="tab-portal"]').should('not.have.class', 'active')
  })
}) 