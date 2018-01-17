// @flow

import type { Contact } from '../stores/ContactsStore';

import * as React from 'react';
import { observer } from 'mobx-react';
import FlatList from '../common/FlatList';
import BaseAvatar from '../common/avatars/BaseAvatar';
import ContactsStore from '../stores/ContactsStore';
import ListItem from '../common/ListItem';

type Props = {|
  ListHeaderComponent?: React.Node,
|};

@observer
class ContactsList extends React.Component<Props> {
  _keyExtractor = (contact: Contact): string => contact.recordID;

  _renderListItem = ({ item: contact }: { item: Contact }): React.Node => {
    const { givenName, familyName, phoneNumbers, thumbnailPath } = contact;
    const title = `${givenName || ''} ${familyName || ''}`;
    const phoneNumber = phoneNumbers.length ? phoneNumbers[0].number : '';

    return (
      <ListItem
        avatar={<BaseAvatar uri={thumbnailPath} />}
        title={title}
        item={contact}
        rightIcon={{ name: 'add' }}
        subtitle={phoneNumber}
      />
    );
  };

  render() {
    return (
      <FlatList
        data={ContactsStore.contacts}
        keyExtractor={this._keyExtractor}
        ListHeaderComponent={this.props.ListHeaderComponent}
        renderItem={this._renderListItem}
      />
    );
  }
}

export default ContactsList;
