describe('user happy path', () => {
  it('default screen is the login screen', () => {
    cy.visit('http://localhost:3000/');
    cy.url().should('include', 'localhost:3000/login');
  });

  it('click register because we dont have an account', () => {
    cy.visit('http://localhost:3000/login');
    cy.contains('Don\'t have an account?').find('a').click();
    cy.get('[placeholder="Full Name"]').focus().type('John Doe');
    cy.get('[placeholder="name@example.com"]').focus().type('rand@email.com');
    cy.get('[placeholder="Password"]').focus().type('randPassword');
    cy.get('[placeholder="ConfirmPassword"]').focus().type('randPassword');
    cy.get('button[type="submit"]').click();
  });

  it('login successfully', () => {
    cy.visit('http://localhost:3000/login');
    cy.wait(1000);
    cy.get('[placeholder="name@example.com"]').focus().type('random@email.com');
    cy.get('[placeholder="Password"]').focus().type('randomPassword');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', 'localhost:3000/dashboard');
  })

  it('create presentation', () => {
    cy.contains('New Presentation').click();
  })
})