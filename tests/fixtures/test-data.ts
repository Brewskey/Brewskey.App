import { faker } from '@faker-js/faker';

import type { Account, EntityID } from '@brewskey/js-api';

let idCounter = 1;

function generateId(): EntityID {
  return idCounter++;
}

/**
 * Account-shaped view of a real seeded user. The auth response only carries
 * id/userName/email — this fills the remaining Account fields with defaults
 * for specs that read `authenticatedUser.user.*`.
 */
export function createMockUser(overrides?: Partial<Account>): Account {
  const id = generateId();
  return {
    id,
    userName: faker.internet.username(),
    email: faker.internet.email(),
    emailConfirmed: true,
    fullName: faker.person.fullName(),
    phoneNumber: faker.phone.number(),
    phoneNumberConfirmed: false,
    accessFailedCount: 0,
    banned: false,
    lockoutEnabled: false,
    lockoutEndDateUtc: null,
    logins: null,
    roles: null,
    twoFactorEnabled: false,
    createdDate: faker.date.past(),
    ...overrides,
  };
}
