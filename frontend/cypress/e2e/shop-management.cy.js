describe('Shop Management', () => {
  beforeEach(() => {
    // Logowanie jako użytkownik
    cy.visit('/login');
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="password"]').type('testpass123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/');
  });

  it('should create a new shop', () => {
    cy.visit('/shop-create');
    
    // Wypełnij formularz sklepu
    cy.get('input[name="name"]').type('Test Shop');
    cy.get('textarea[name="description"]').type('Testowy sklep do testów');
    cy.get('select[name="category"]').select('Elektronika');
    cy.get('input[name="address"]').type('Testowa 123');
    cy.get('input[name="city"]').type('Warszawa');
    cy.get('input[name="postalCode"]').type('00-001');
    cy.get('input[name="phone"]').type('+48 123 456 789');
    cy.get('input[name="email"]').type('test@shop.pl');
    
    // Wybierz opcje dostawy
    cy.contains('Dostawa kurierem').click();
    cy.contains('Odbiór osobisty').click();
    
    // Wybierz metody płatności
    cy.contains('Płatność online').click();
    cy.contains('Płatność przy odbiorze').click();
    
    // Wyślij formularz
    cy.get('button[type="submit"]').click();
    
    // Sprawdź czy sklep został utworzony
    cy.url().should('include', '/shop-management');
    cy.contains('Test Shop').should('be.visible');
  });

  it('should add products to shop', () => {
    cy.visit('/my-products');
    
    // Sprawdź czy są sklepy
    cy.get('[data-testid="shop-tab"]').first().click();
    
    // Dodaj produkt
    cy.contains('Dodaj produkt').click();
    
    // Wypełnij formularz produktu
    cy.get('input[name="name"]').type('Test Product');
    cy.get('textarea[name="description"]').type('Testowy produkt');
    cy.get('input[name="price"]').type('99.99');
    cy.get('select[name="category"]').select('Elektronika');
    cy.get('input[name="brand"]').type('Test Brand');
    cy.get('input[name="stock"]').type('10');
    
    // Zapisz produkt
    cy.get('button[type="submit"]').click();
    
    // Sprawdź czy produkt został dodany
    cy.contains('Test Product').should('be.visible');
    cy.contains('99.99 zł').should('be.visible');
  });

  it('should edit product', () => {
    cy.visit('/my-products');
    
    // Znajdź produkt i kliknij edytuj
    cy.contains('Test Product').parent().contains('Edytuj').click();
    
    // Zmień cenę
    cy.get('input[name="price"]').clear().type('149.99');
    
    // Zapisz zmiany
    cy.get('button[type="submit"]').click();
    
    // Sprawdź czy zmiany zostały zapisane
    cy.contains('149.99 zł').should('be.visible');
  });

  it('should delete product', () => {
    cy.visit('/my-products');
    
    // Znajdź produkt i kliknij usuń
    cy.contains('Test Product').parent().contains('Usuń').click();
    
    // Potwierdź usunięcie
    cy.on('window:confirm', () => true);
    
    // Sprawdź czy produkt został usunięty
    cy.contains('Test Product').should('not.exist');
  });

  it('should view local products', () => {
    cy.visit('/local-products');
    
    // Sprawdź czy strona się ładuje
    cy.contains('Produkty lokalne').should('be.visible');
    
    // Sprawdź czy są statystyki
    cy.get('[data-testid="stats-bar"]').should('be.visible');
    
    // Sprawdź czy można filtrować
    cy.get('input[placeholder*="Szukaj"]').type('test');
    cy.get('select').first().select('Elektronika');
  });

  it('should navigate to shop from product', () => {
    cy.visit('/local-products');
    
    // Kliknij na informacje o sklepie
    cy.contains('🏪').first().click();
    
    // Sprawdź czy przeniosło do sklepu
    cy.url().should('include', '/shop/');
  });

  it('should contact shop from product', () => {
    cy.visit('/local-products');
    
    // Kliknij na kontakt ze sklepem
    cy.contains('Skontaktuj się').first().click();
    
    // Sprawdź czy przeniosło do wiadomości
    cy.url().should('include', '/messages');
  });
}); 