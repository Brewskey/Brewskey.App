import * as React from 'react';

import BaseAvatar from '../common/avatars/BaseAvatar';
import List from '../common/List';
import ListEmpty from '../common/ListEmpty';
import ListItem from '../common/ListItem';
import ContactsStore from '../stores/ContactsStore';

import type { InfiniteData } from '@tanstack/react-query';
import type { ListRenderItemInfo } from 'react-native';

import type { Contact } from '../stores/ContactsStore';

interface Props {
  ListHeaderComponent?:
    | React.ComponentType<any>
    | React.ReactElement<any>
    | null
    | undefined;
}

const ContactsList: React.FC<Props> = ({ ListHeaderComponent }) => {
  const keyExtractor = React.useCallback(
    (contact: Contact): string => contact.recordID,
    [],
  );

  const renderListItem = React.useCallback(
    ({ item: contact }: ListRenderItemInfo<Contact>): React.ReactElement => {
      const { givenName, familyName, phoneNumbers, thumbnailPath } = contact;
      const title = `${givenName || ''} ${familyName || ''}`;
      const phoneNumber = phoneNumbers.length ? phoneNumbers[0].number : '';

      return (
        <ListItem
          item={contact}
          rightIcon={{ name: 'add' }}
          subtitle={phoneNumber}
          title={title}
          leftAvatar={
            <BaseAvatar rounded size={45} uri={thumbnailPath || ''} />
          }
        />
      );
    },
    [],
  );

  // Convert Contact[] to InfiniteData format expected by List
  const infiniteData: InfiniteData<Contact[]> = React.useMemo(
    () => ({
      pages: [ContactsStore.contacts],
      pageParams: [0],
    }),
    [],
  );

  return (
    <List
      data={infiniteData}
      keyExtractor={keyExtractor}
      ListEmptyComponent={<ListEmpty message="No contacts" />}
      ListHeaderComponent={ListHeaderComponent}
      listType="flatList"
      renderItem={renderListItem}
    />
  );
};

export default ContactsList;
