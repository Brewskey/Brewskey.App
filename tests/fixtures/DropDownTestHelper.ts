import { Page } from '@playwright/test';

class DropDownTestHelperInternal {
  constructor(
    private readonly page: Page,
    private readonly dropdownTestId: string,
  ) {}

  async select(optionIndex: number) {
    if (!(await this.modal.isVisible())) {
      await this.input.click();
    }

    // Scroll option into view so click succeeds (dropdown options can be outside viewport)
    await this.scrollToItemByIndex(optionIndex);
    const option = this.getItemByIndex(optionIndex);
    // Prefer real click so React/TouchableOpacity onPress fires (e.g. location dropdown).
    // If element stays "outside viewport" (e.g. modal list), fall back to dispatchEvent.
    try {
      await option.click({ timeout: 5000 });
    } catch {
      await option.dispatchEvent('click');
    }
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
    const option = this.getItemByIndex(index);
    await option.scrollIntoViewIfNeeded();
    // Modal dropdowns often have their own scroll container; ensure option is in view
    await option.evaluate((el) => {
      const scrollParent =
        el.parentElement?.closest('[style*="overflow"]') ?? el.parentElement;
      if (scrollParent && 'scrollTop' in scrollParent) {
        const rect = el.getBoundingClientRect();
        const parentRect = scrollParent.getBoundingClientRect();
        if (rect.bottom > parentRect.bottom) {
          (scrollParent as Element & { scrollTop: number }).scrollTop +=
            rect.bottom - parentRect.bottom;
        }
        if (rect.top < parentRect.top) {
          (scrollParent as Element & { scrollTop: number }).scrollTop +=
            rect.top - parentRect.top;
        }
      }
      el.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });
  }
}

export class DropDownTestHelper {
  constructor(private readonly page: Page) {}

  create(dropdownTestId: string): DropDownTestHelperInternal {
    return new DropDownTestHelperInternal(this.page, dropdownTestId);
  }
}
