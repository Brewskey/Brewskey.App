import type { EntityID } from '@brewskey/js-api';

import * as React from 'react';
import { ScrollView, View } from 'react-native';
import Modal from './Modal';
import Section from '../../common/Section';
import SectionContent from '../../common/SectionContent';
import SectionHeader from '../../common/SectionHeader';
import BeverageDetailsContent from '../../components/BeverageDetailsContent';
import Button from '../../common/buttons/Button';
import IconButton from '../../common/buttons/IconButton';
import { COLORS } from '../../theme';
import { useGetBeverageById } from '../../hooks/queries/BeverageQueries';
import { useImperativeHandle } from 'react';

export type BeverageModalHandle = {
  closeModal(): void;
  openModal(): void;
  get isOpen(): boolean;
};

export const BeverageModal = React.forwardRef<
  BeverageModalHandle,
  { beverageID: EntityID | null; isOpen?: boolean }
>(({ beverageID, isOpen = false }, ref) => {
  const [isVisible, setIsVisible] = React.useState<boolean>(isOpen);
  const beverage = useGetBeverageById(beverageID);

  useImperativeHandle(
    ref,
    () => ({
      closeModal() {
        setIsVisible(false);
      },
      openModal() {
        setIsVisible(true);
      },
      get isOpen() {
        return isVisible;
      },
    }),
    [isVisible, setIsVisible],
  );

  if (beverage.data == null) {
    return null;
  }

  return (
    <Modal
      isVisible={isVisible}
      onHideModal={() => setIsVisible(false)}
      transparent={false}
    >
      <ScrollView horizontal={false} style={{ marginVertical: 12 }}>
        <Section>
          <View
            style={{ position: 'absolute', top: 12, right: 0, zIndex: 100 }}
          >
            <IconButton
              color={COLORS.text}
              name="close"
              onPress={() => setIsVisible(false)}
            />
          </View>
          <SectionHeader title={beverage.data.name} />
          <SectionContent>
            <BeverageDetailsContent beverage={beverage.data} />
          </SectionContent>
          <Button
            title="Close"
            onPress={() => setIsVisible(false)}
            style={{ marginVertical: 12 }}
          />
        </Section>
      </ScrollView>
    </Modal>
  );
});

export default BeverageModal;
