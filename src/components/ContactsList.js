// @flow

import type { RenderItemProps } from 'react-native/Libraries/Lists/VirtualizedList';
import type { Contact } from '../stores/ContactsStore';

import * as React from 'react';
import { observer } from 'mobx-react';
import List from '../common/List';
import BaseAvatar from '../common/avatars/BaseAvatar';
import ContactsStore from '../stores/ContactsStore';
import ListEmpty from '../common/ListEmpty';
import ListItem from '../common/ListItem';

type Props = {|
  ListHeaderComponent?: ?(React.ComponentType<any> | React.Element<any>),
|};

@observer
class ContactsList extends React.Component<Props> {
  _keyExtractor = (contact: Contact): string => contact.recordID;

  _renderListItem = ({
    item: contact,
  }: RenderItemProps<Contact>): React.Node => {
    const { givenName, familyName, phoneNumbers, thumbnailPath } = contact;
    const title = `${givenName || ''} ${familyName || ''}`;
    const phoneNumber = phoneNumbers.length ? phoneNumbers[0].number : '';

    return (
      <ListItem
        leftAvatar={<BaseAvatar uri={thumbnailPath} />}
        title={title}
        item={contact}
        rightIcon={{ name: 'add' }}
        subtitle={phoneNumber}
      />
    );
  };

  render(): React.Node {
    return (
      <List
        data={ContactsStore.contacts}
        listType="flatList"
        keyExtractor={this._keyExtractor}
        ListEmptyComponent={<ListEmpty message="No contacts" />}
        ListHeaderComponent={this.props.ListHeaderComponent}
        renderItem={this._renderListItem}
      />
    );
  }
}

export default ContactsList;
