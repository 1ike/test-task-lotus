import { getHeader } from '../support/app.po';

describe('react', () => {
  beforeEach(() => cy.visit('/'));

  it('should display Room header', () => {
    // Custom command example, see `../support/commands.ts` file
    // cy.login('my-email@something.com', 'myPassword');

    cy.intercept('GET', '/api/rooms', []).as('getRooms');
    cy.wait('@getRooms');

    // Function helper example, see `../support/app.po.ts` file
    getHeader().contains('Комнаты для торгов');
  });
});
