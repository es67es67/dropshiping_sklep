describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  it('should display login form', () => {
    cy.get('[data-testid="login-form"]').should('be.visible')
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
  })

  it('should login successfully with admin credentials', () => {
    // Wypełnij formularz logowania
    cy.get('input[type="email"]').type('FF@RRF.PL')
    cy.get('input[type="password"]').type('Admin123!')
    cy.get('button[type="submit"]').click()

    // Sprawdź czy użytkownik jest zalogowany
    cy.url().should('not.include', '/login')
    cy.get('[data-testid="user-menu"]').should('be.visible')
    
    // Sprawdź czy panel admina jest dostępny
    cy.get('[data-testid="admin-panel-link"]').should('be.visible')
  })

  it('should show error for invalid credentials', () => {
    cy.get('input[type="email"]').type('invalid@email.com')
    cy.get('input[type="password"]').type('wrongpassword')
    cy.get('button[type="submit"]').click()

    // Sprawdź czy pojawił się błąd
    cy.get('[data-testid="error-message"]').should('be.visible')
    cy.url().should('include', '/login')
  })

  it('should navigate to admin panel after login', () => {
    // Zaloguj się
    cy.get('input[type="email"]').type('FF@RRF.PL')
    cy.get('input[type="password"]').type('Admin123!')
    cy.get('button[type="submit"]').click()

    // Przejdź do panelu admina
    cy.get('[data-testid="admin-panel-link"]').click()
    cy.url().should('include', '/admin-panel')
    
    // Sprawdź czy panel admina się załadował
    cy.get('[data-testid="admin-dashboard"]').should('be.visible')
  })
}) 