import type { Contact } from '../stores/ContactsStore';

import * as React from 'react';
import type { ListRenderItemInfo } from 'react-native';
import { InfiniteData } from '@tanstack/react-query';

import List from '../common/List';
import BaseAvatar from '../common/avatars/BaseAvatar';
import ContactsStore from '../stores/ContactsStore';
import ListEmpty from '../common/ListEmpty';
import ListItem from '../common/ListItem';

type Props = {
  ListHeaderComponent?:
     
    | React.ComponentType<any>
     
    | React.ReactElement<any>
    | null
    | undefined;
};

const ContactsList: React.FC<Props> = ({ ListHeaderComponent }) => {
  const keyExtractor = React.useCallback((contact: Contact): string => contact.recordID, []);

  const renderListItem = React.useCallback(({
    item: contact,
  }: ListRenderItemInfo<Contact>): React.ReactElement => {
    const { givenName, familyName, phoneNumbers, thumbnailPath } = contact;
    const title = `${givenName || ''} ${familyName || ''}`;
    const phoneNumber = phoneNumbers.length ? phoneNumbers[0].number : '';

    return (
      <ListItem
        leftAvatar={<BaseAvatar uri={thumbnailPath || ''} rounded={true} size={45} />}
        title={title}
        item={contact}
        rightIcon={{ name: 'add' }}
        subtitle={phoneNumber}
      />
    );
  }, []);

  // Convert Contact[] to InfiniteData format expected by List
  const infiniteData: InfiniteData<Contact[]> = React.useMemo(() => ({
    pages: [ContactsStore.contacts],
    pageParams: [0],
  }), []);
  
  return (
    <List
      data={infiniteData}
      listType="flatList"
      keyExtractor={keyExtractor}
      ListEmptyComponent={<ListEmpty message="No contacts" />}
      ListHeaderComponent={ListHeaderComponent}
      renderItem={renderListItem}
    />
  );
};

export default ContactsList;
