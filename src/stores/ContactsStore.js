// @flow

import { action, observable } from 'mobx';
// eslint-disable-next-line
import { PermissionsAndroid } from 'react-native';

export type Contact = {|
  company: ?string,
  department: ?string,
  emailAddresses: Array<{ label: string, email: string }>,
  familyName: ?string,
  givenName: ?string,
  hasThumbnail: boolean,
  jobTitle: ?string,
  middleName: ?string,
  phoneNumbers: Array<{ label: string, number: string }>,
  postalAddresses: Array<{
    city: ?string,
    country: ?string,
    label: string,
    postCode: number,
    region: ?string,
    state: ?string,
  }>,
  prefix: ?string,
  recordID: string,
  suffix: ?string,
  thumbnailPath: ?string,
|};

class ContactsStore {
  @observable
  contacts: Array<Contact> = [];

  @action
  setContacts = (contacts: Array<Contact>) => {
    this.contacts = contacts;
  };
}

export default new ContactsStore();
