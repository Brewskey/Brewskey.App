import * as React from 'react';
import { useImperativeHandle } from 'react';

import moment from 'moment';
import { ScrollView, StyleSheet, View } from 'react-native';

import Modal from './Modal';
import Button from '../../common/buttons/Button';
import IconButton from '../../common/buttons/IconButton';
import Section from '../../common/Section';
import SectionContent from '../../common/SectionContent';
import SectionHeader from '../../common/SectionHeader';
import { NULL_STRING_PLACEHOLDER } from '../../constants';
import { useGetKegById } from '../../hooks/queries/KegQueries';
import { COLORS } from '../../theme';
import KegDetailsContent from '../KegDetailsContent';

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

export interface KegModalHandle {
  closeModal: () => void;
  openModal: () => void;
  get isOpen(): boolean;
}

export const KegModal = React.forwardRef<
  KegModalHandle,
  { kegID: EntityID | null; isOpen?: boolean; onClose?: () => void }
>(({ kegID, isOpen = false, onClose }, ref) => {
  const [isVisible, setIsVisible] = React.useState<boolean>(isOpen);
  const keg = useGetKegById(kegID);

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
    if (kegID != null) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [kegID]);

  if (keg.data == null) {
    return null;
  }

  const { tapDate, floatedDate } = keg.data;
  const tappedDate = moment(tapDate).format('l');
  const floatedDateFormatted = floatedDate
    ? moment(floatedDate).format('l')
    : NULL_STRING_PLACEHOLDER;
  const subtitle = `Tapped: ${tappedDate} • Floated: ${floatedDateFormatted}`;

  return (
    <Modal
      isVisible={isVisible}
      onHideModal={handleClose}
      testID="keg-modal"
      transparent={false}
    >
      <View style={styles.container} testID="keg-modal-content">
        <Section>
          <View style={styles.headerContainer}>
            <View style={styles.closeButton}>
              <IconButton
                color={COLORS.text}
                name="close"
                onPress={handleClose}
                testID="button-close-keg-modal"
              />
            </View>
            <SectionHeader
              subtitle={subtitle}
              testID="section-header-keg-beverage"
              title={keg.data.beverage.name}
            />
          </View>
        </Section>
        <View style={styles.scrollContent}>
          <KegDetailsContent keg={keg.data} onClose={handleClose} />
        </View>
        <Section>
          <View style={styles.bottomButton}>
            <Button
              onPress={handleClose}
              testID="button-close-keg"
              title="Close"
            />
          </View>
        </Section>
      </View>
    </Modal>
  );
});

export default KegModal;
