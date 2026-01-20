import { test, expect } from '../../fixtures/test-fixtures';
import { mockNewUserState } from '../../fixtures/entity-fixtures';

test('should complete full NUX flow', async ({ page, nuxPage }) => {
  // Set up explicit data: new user going through complete NUX flow
  await mockNewUserState(page);

  // Step 1: Location
  await nuxPage.gotoLocationStep();
  
  await expect(page).toHaveURL(/.*nux.*location/i);
});
