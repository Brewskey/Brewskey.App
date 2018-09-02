// @flow

import { action, computed, observable } from 'mobx';
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
  @observable _contacts: Array<Contact> = [];

  // duplicate the contacts data because of weird crash on contacts list
  // when react-native debug mode disabled.
  @computed
  get contacts(): Array<Contact> {
    return this._contacts.slice();
  }

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
        this._setContacts(contacts);
      });
    });
  }

  @action
  _setContacts = (contacts: Array<Contact>) => {
    this._contacts = contacts;
  };
}

export default new ContactsStore();
