import type { EntityID } from '@brewskey/js-api';

import * as React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import moment from 'moment';
import Modal from './Modal';
import Section from '../../common/Section';
import SectionContent from '../../common/SectionContent';
import SectionHeader from '../../common/SectionHeader';
import PourDetailsContent from '../PourDetailsContent';
import Button from '../../common/buttons/Button';
import IconButton from '../../common/buttons/IconButton';
import { COLORS } from '../../theme';
import { useGetPourById } from '../../hooks/queries/PourQueries';
import { useImperativeHandle } from 'react';
import { NULL_STRING_PLACEHOLDER } from '../../constants';

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

export type PourModalHandle = {
  closeModal(): void;
  openModal(): void;
  get isOpen(): boolean;
};

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
      isVisible={isVisible}
      onHideModal={handleClose}
      transparent={false}
      isTouchable={false}
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
            <SectionHeader title={beverageName} subtitle={subtitle} />
          </View>
        </Section>
        <ScrollView style={styles.scrollContent}>
          <Section>
            <SectionContent>
              <PourDetailsContent pour={pour.data} onClose={handleClose} />
            </SectionContent>
          </Section>
        </ScrollView>
        <Section>
          <View style={styles.bottomButton}>
            <Button
              title="Close"
              onPress={handleClose}
            />
          </View>
        </Section>
      </View>
    </Modal>
  );
});

export default PourModal;
