// @flow

import { action, observable } from 'mobx';
// eslint-disable-next-line
import { PermissionsAndroid } from 'react-native';
import Contacts from 'react-native-contacts';

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
  @observable contacts: Array<Contact> = [];

  constructor() {
    // todo separate logic for ios
    // https://github.com/rt2zz/react-native-contacts/issues/218
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      message: 'This app would like to view your contacts.',
      title: 'Contacts',
    }).then(() => {
      Contacts.getAll((error, contacts) => {
        if (error) {
          return;
        }
        this.setContacts(contacts);
      });
    });
  }

  @action
  setContacts = (contacts: Array<Contact>) => {
    this.contacts = contacts;
  };
}

export default new ContactsStore();
