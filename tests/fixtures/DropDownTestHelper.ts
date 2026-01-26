import { Page } from '@playwright/test';

class DropDownTestHelperInternal {
  constructor(private readonly page: Page, private readonly dropdownTestId: string) {
  }

  async select(optionIndex: number) {
    if (!(await this.modal.isVisible())) {
      await this.input.click();
    }

    await this.getItemByIndex(optionIndex).click();
  }

  get input() {
    return this.page.getByTestId(this.dropdownTestId);
  }

  get search() {
    return this.modal.getByTestId(`${this.dropdownTestId}-search`);
  }

  get modal() {
    return this.page.getByTestId(`${this.dropdownTestId}-modal`);
  }

  getItemByIndex(index: number) {
    return this.modal.getByTestId(`option-${index}`);
  }


  async scrollToItemByIndex(index: number): Promise<void> {
    await this.getItemByIndex(index).scrollIntoViewIfNeeded();
  }

}

export class DropDownTestHelper {
  constructor(private readonly page: Page) {
  }

  create(dropdownTestId: string): DropDownTestHelperInternal {
    return new DropDownTestHelperInternal(this.page, dropdownTestId);
  }
}