import type { Beverage, EntityID } from '@brewskey/js-api';

import * as React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import BeverageAvatar from '../../common/avatars/BeverageAvatar';
import BeverageModal, { BeverageModalHandle } from '../modals/BeverageModal';
import { useGetBeverages } from '../../hooks/queries/BeverageQueries';
import { useGetPoursByBeverageIds } from '../../hooks/queries/PourQueries';
import { Card } from '@rneui/themed';
import { LoaderComponent } from '../../common/LoaderComponent';
import { createFilter } from '@brewskey/js-api/dist/filters';
import { InfiniteData } from '@tanstack/react-query';
import { useAuthContext } from '../../hooks/context/AuthContext';

type Props = {
  userID: EntityID;
};

type LoadedProps = {
  value: {
    beverages: InfiniteData<Beverage[]>;
    beverageTotals: Map<EntityID, number>;
  };
};

const AllBeveragesHScrollLoaded: React.FC<LoadedProps> = (props) => {
  const [currentBeverageId, setCurrentBeverageId] =
    React.useState<EntityID | null>(null);

  const modalRef = React.useRef<BeverageModalHandle>(null);

  const { beverages, beverageTotals } = props.value;
  const allBeverages = beverages.pages.flat();
  if (allBeverages.length === 0 || beverageTotals == null) {
    return null;
  }

  const sortedBeverages = allBeverages.sort(
    (a, b) => (beverageTotals.get(b.id) ?? 0) - (beverageTotals.get(a.id) ?? 0),
  );

  return (
    <ScrollView horizontal style={{ paddingBottom: 16, marginLeft: 12 }}>
      {sortedBeverages.map((beverage: Beverage) => (
        <TouchableOpacity
          key={beverage.id}
          onPress={() => {
            setCurrentBeverageId(beverage.id);
            modalRef.current?.openModal();
          }}
        >
          <Card
            containerStyle={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 4,
              marginLeft: 0,
              width: 120,
            }}
          >
            <View
              style={{
                alignSelf: 'center',
                width: 70,
              }}
            >
              <BeverageAvatar beverageId={beverage.id} size={70} />
            </View>
            <View style={{ flex: 1, alignContent: 'stretch' }}>
              <Text
                numberOfLines={3}
                style={{ flexGrow: 1, marginTop: 8, textAlign: 'center' }}
              >
                {beverage.name}
              </Text>
              <Text
                style={{
                  alignSelf: 'flex-end',
                  fontSize: 12,
                  marginTop: 12,
                }}
              >
                {(beverageTotals.get(beverage.id) ?? 0).toFixed(0)} oz poured
              </Text>
            </View>
          </Card>
        </TouchableOpacity>
      ))}
      <BeverageModal beverageID={currentBeverageId} ref={modalRef} />
    </ScrollView>
  );
};

export type AllBeveragesHScrollHandle = {
  refresh(): void;
};
export const AllBeveragesHScroll = React.forwardRef<
  AllBeveragesHScrollHandle,
  Props
>(({ userID }, ref) => {
  const [session] = useAuthContext();
  const beverages = useGetBeverages({
    filters: [
      createFilter('Pours').any(`pour: pour/owner/id eq '${userID}'`),
      createFilter('Pours').any('pour: pour/isDeleted eq false'),
    ],
  });
  const beverageTotals = useGetPoursByBeverageIds(
    beverages.data?.pages.flat().map((beverage) => beverage.id),
    session?.id,
  );

  React.useImperativeHandle(
    ref,
    () => ({
      refresh() {
        beverages.refetch();
        beverageTotals.refetch();
      },
    }),
    [beverages, beverageTotals],
  );

  const queries = { beverages, beverageTotals };

  return (
    <LoaderComponent
      loadedComponent={AllBeveragesHScrollLoaded}
      queries={queries}
    />
  );
});
