import * as React from 'react';
import { useImperativeHandle } from 'react';

import { ScrollView, StyleSheet, View } from 'react-native';

import { Modal } from './Modal';
import { Button } from '../../common/buttons/Button';
import { IconButton } from '../../common/buttons/IconButton';
import { Section } from '../../common/Section';
import { SectionContent } from '../../common/SectionContent';
import { SectionHeader } from '../../common/SectionHeader';
import { useGetBeverageById } from '../../hooks/queries/BeverageQueries';
import { COLORS } from '../../theme';
import { BeverageDetailsContent } from '../BeverageDetailsContent';

import type { EntityID } from '@brewskey/js-api';

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

export interface BeverageModalHandle {
  closeModal: () => void;
  openModal: () => void;
  get isOpen(): boolean;
}

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
            <Button onPress={() => setIsVisible(false)} title="Close" />
          </View>
        </Section>
      </View>
    </Modal>
  );
});
