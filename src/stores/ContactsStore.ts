export type Contact = {
  company: string | null | undefined;
  department: string | null | undefined;
  emailAddresses: Array<{
    label: string;
    email: string;
  }>;
  familyName: string | null | undefined;
  givenName: string | null | undefined;
  hasThumbnail: boolean;
  jobTitle: string | null | undefined;
  middleName: string | null | undefined;
  phoneNumbers: Array<{
    label: string;
    number: string;
  }>;
  postalAddresses: Array<{
    city: string | null | undefined;
    country: string | null | undefined;
    label: string;
    postCode: number;
    region: string | null | undefined;
    state: string | null | undefined;
  }>;
  prefix: string | null | undefined;
  recordID: string;
  suffix: string | null | undefined;
  thumbnailPath: string | null | undefined;
};

class ContactsStore {
  contacts: Array<Contact> = [];

  setContacts = (contacts: Array<Contact>) => {
    this.contacts = contacts;
  };
}

export default new ContactsStore();
