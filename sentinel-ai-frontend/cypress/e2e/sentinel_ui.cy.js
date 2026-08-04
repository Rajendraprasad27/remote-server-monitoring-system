describe('Sentinel AI Frontend E2E Testing', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('Loads Login Page', () => {
    cy.get('[data-testid="email-input"]').should('be.visible');
    cy.get('[data-testid="password-input"]').should('be.visible');
    cy.get('[data-testid="login-button"]').should('be.visible');
  });

  it('Login works and dashboard loads', () => {
    cy.get('[data-testid="email-input"]').type('admin@sentinel.ai');
    cy.get('[data-testid="password-input"]').type('password');
    cy.get('[data-testid="login-button"]').click();

    cy.get('[data-testid="dashboard-title"]', { timeout: 10000 })
      .should('be.visible');
  });

  it('Navigate to Alerts page', () => {
    cy.get('[data-testid="email-input"]').type('admin@sentinel.ai');
    cy.get('[data-testid="password-input"]').type('password');
    cy.get('[data-testid="login-button"]').click();

    cy.get('[data-testid="nav-alerts"]').click();
    cy.contains('System Alerts').should('be.visible');
  });

  it('Navigate to Analytics page', () => {
    cy.get('[data-testid="email-input"]').type('admin@sentinel.ai');
    cy.get('[data-testid="password-input"]').type('password');
    cy.get('[data-testid="login-button"]').click();

    cy.get('[data-testid="nav-analytics"]').click();
    cy.contains('Predictive Analytics').should('be.visible');
  });

  it('Logout works correctly', () => {
    cy.get('[data-testid="email-input"]').type('admin@sentinel.ai');
    cy.get('[data-testid="password-input"]').type('password');
    cy.get('[data-testid="login-button"]').click();

    cy.get('[data-testid="logout-button"]').click();
    cy.get('[data-testid="login-button"]').should('be.visible');
  });

});
