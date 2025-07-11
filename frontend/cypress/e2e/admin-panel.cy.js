describe('Admin Panel', () => {
  beforeEach(() => {
    // Zaloguj się jako admin
    cy.visit('http://localhost:3000')
    cy.get('input[type="email"]').type('FF@RRF.PL')
    cy.get('input[type="password"]').type('Admin123!')
    cy.get('button[type="submit"]').click()
    
    // Przejdź do panelu admina
    cy.visit('http://localhost:3000/admin-panel')
  })

  it('should display admin panel dashboard', () => {
    cy.get('h1').should('contain', 'Panel Administracyjny')
    cy.get('[data-testid="admin-dashboard"]').should('be.visible')
    cy.get('[data-testid="stats-cards"]').should('be.visible')
  })

  it('should display user management section', () => {
    cy.get('[data-testid="user-management"]').click()
    cy.get('[data-testid="users-table"]').should('be.visible')
    cy.get('[data-testid="user-search"]').should('be.visible')
  })

  it('should search and filter users', () => {
    cy.get('[data-testid="user-management"]').click()
    cy.get('[data-testid="user-search"]').type('admin')
    cy.get('[data-testid="search-button"]').click()
    
    // Sprawdź czy wyniki wyszukiwania się pojawiły
    cy.get('[data-testid="users-table"]').should('be.visible')
  })

  it('should edit user data', () => {
    cy.get('[data-testid="user-management"]').click()
    cy.get('[data-testid="edit-user-button"]').first().click()
    
    // Sprawdź czy formularz edycji się otworzył
    cy.get('[data-testid="edit-user-form"]').should('be.visible')
    cy.get('input[name="username"]').should('be.visible')
    cy.get('input[name="email"]').should('be.visible')
  })

  it('should export data in different formats', () => {
    cy.get('[data-testid="data-export"]').click()
    
    // Sprawdź opcje eksportu
    cy.get('[data-testid="export-json"]').should('be.visible')
    cy.get('[data-testid="export-csv"]').should('be.visible')
    cy.get('[data-testid="export-xml"]').should('be.visible')
    cy.get('[data-testid="export-excel"]').should('be.visible')
  })

  it('should export users data', () => {
    cy.get('[data-testid="data-export"]').click()
    cy.get('[data-testid="export-users-json"]').click()
    
    // Sprawdź czy eksport się rozpoczął
    cy.get('[data-testid="export-progress"]').should('be.visible')
  })

  it('should display system statistics', () => {
    cy.get('[data-testid="stats-users"]').should('be.visible')
    cy.get('[data-testid="stats-shops"]').should('be.visible')
    cy.get('[data-testid="stats-products"]').should('be.visible')
    cy.get('[data-testid="stats-locations"]').should('be.visible')
  })

  it('should manage shop data', () => {
    cy.get('[data-testid="shop-management"]').click()
    cy.get('[data-testid="shops-table"]').should('be.visible')
    cy.get('[data-testid="add-shop-button"]').should('be.visible')
  })

  it('should manage product data', () => {
    cy.get('[data-testid="product-management"]').click()
    cy.get('[data-testid="products-table"]').should('be.visible')
    cy.get('[data-testid="add-product-button"]').should('be.visible')
  })

  it('should manage location data', () => {
    cy.get('[data-testid="location-management"]').click()
    cy.get('[data-testid="locations-table"]').should('be.visible')
    cy.get('[data-testid="location-import"]').should('be.visible')
    cy.get('[data-testid="location-export"]').should('be.visible')
  })

  it('should display admin navigation menu', () => {
    cy.get('[data-testid="admin-nav"]').should('be.visible')
    cy.get('[data-testid="admin-nav"]').should('contain', 'Dashboard')
    cy.get('[data-testid="admin-nav"]').should('contain', 'Użytkownicy')
    cy.get('[data-testid="admin-nav"]').should('contain', 'Sklepy')
    cy.get('[data-testid="admin-nav"]').should('contain', 'Produkty')
    cy.get('[data-testid="admin-nav"]').should('contain', 'Lokalizacje')
    cy.get('[data-testid="admin-nav"]').should('contain', 'Eksport')
  })
}) 