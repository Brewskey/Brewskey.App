import type { EntityID } from '@brewskey/js-api';

import * as React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 0,
    zIndex: 100,
  },
  scrollContent: {
    flex: 1,
  },
  bottomButton: {
    paddingVertical: 12,
  },
});

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
      <View style={styles.container}>
        <Section>
          <View style={styles.headerContainer}>
            <View style={styles.closeButton}>
              <IconButton
                color={COLORS.text}
                name="close"
                onPress={() => setIsVisible(false)}
              />
            </View>
            <SectionHeader title={beverage.data.name} />
          </View>
        </Section>
        <ScrollView style={styles.scrollContent}>
          <Section>
            <SectionContent>
              <BeverageDetailsContent beverage={beverage.data} />
            </SectionContent>
          </Section>
        </ScrollView>
        <Section>
          <View style={styles.bottomButton}>
            <Button
              title="Close"
              onPress={() => setIsVisible(false)}
            />
          </View>
        </Section>
      </View>
    </Modal>
  );
});

export default BeverageModal;
