import * as React from 'react';
import { useImperativeHandle } from 'react';

import moment from 'moment';
import { ScrollView, StyleSheet, View } from 'react-native';

import { NULL_STRING_PLACEHOLDER } from '@/constants';
import { Button } from 'common/buttons/Button';
import { IconButton } from 'common/buttons/IconButton';
import { Section } from 'common/Section';
import { SectionContent } from 'common/SectionContent';
import { SectionHeader } from 'common/SectionHeader';
import { Modal } from 'components/modals/Modal';
import { PourDetailsContent } from 'components/PourDetailsContent';
import { useGetPourById } from 'hooks/queries/PourQueries';
import { COLORS } from 'theme';

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

export interface PourModalHandle {
  closeModal: () => void;
  openModal: () => void;
  get isOpen(): boolean;
}

export const PourModal = React.forwardRef<
  PourModalHandle,
  { pourID: EntityID | null; isOpen?: boolean; onClose?: () => void }
>(({ pourID, isOpen = false, onClose }, ref) => {
  const [isVisible, setIsVisible] = React.useState<boolean>(isOpen);
  const pour = useGetPourById(pourID);

  const handleClose = React.useCallback(() => {
    setIsVisible(false);
    onClose?.();
  }, [onClose]);

  useImperativeHandle(
    ref,
    () => ({
      closeModal() {
        handleClose();
      },
      openModal() {
        setIsVisible(true);
      },
      get isOpen() {
        return isVisible;
      },
    }),
    [isVisible, handleClose],
  );

  React.useEffect(() => {
    if (pourID != null) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [pourID]);

  if (pour.data == null) {
    return null;
  }

  const beverageName = pour.data.beverage?.name || NULL_STRING_PLACEHOLDER;
  const pourDate = moment(pour.data.pourDate).format('l');
  const subtitle = `${pourDate} • ${pour.data.ounces.toFixed(1)} oz`;

  return (
    <Modal
      isTouchable={false}
      isVisible={isVisible}
      onHideModal={handleClose}
      transparent={false}
    >
      <View style={styles.container}>
        <Section>
          <View style={styles.headerContainer}>
            <View style={styles.closeButton}>
              <IconButton
                color={COLORS.text}
                name="close"
                onPress={handleClose}
              />
            </View>
            <SectionHeader subtitle={subtitle} title={beverageName} />
          </View>
        </Section>
        <ScrollView style={styles.scrollContent}>
          <Section>
            <SectionContent>
              <PourDetailsContent onClose={handleClose} pour={pour.data} />
            </SectionContent>
          </Section>
        </ScrollView>
        <Section>
          <View style={styles.bottomButton}>
            <Button onPress={handleClose} title="Close" />
          </View>
        </Section>
      </View>
    </Modal>
  );
});
