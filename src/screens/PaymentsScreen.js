// @flow

import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { Image, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { COLORS, TYPOGRAPHY } from '../theme';
import { observer } from 'mobx-react/native';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Header from '../common/Header';
import PaymentsScreenStore from '../stores/PaymentsScreenStore';
import Section from '../common/Section';
import CardForm from '../components/CardForm';
import LoadingIndicator from '../common/LoadingIndicator';
import IconButton from '../common/buttons/IconButton';
import StripeImage from '../resources/powered_by_stripe.png';
import SectionHeader from '../common/SectionHeader';

const styles = StyleSheet.create({
  cardContainer: {
    alignItems: 'stretch',
    flex: 1,
    flexDirection: 'row',
    padding: 16,
  },
  cardExpirationText: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textFaded,
    marginRight: 8,
  },
  cardForm: {
    alignSelf: 'center',
    margin: 16,
  },
  cardText: {
    ...TYPOGRAPHY.secondary,
    flexGrow: 1,
  },
  stripeImageStyle: { alignSelf: 'flex-end', marginRight: 16, marginTop: 16 },
});

type InjectedProps = {|
  navigation: Navigation,
|};

@errorBoundary(<ErrorScreen showBackButton />)
@observer
class PaymentsScreen extends InjectedComponent<InjectedProps> {
  _onDeletePaymentPress = () => {};

  render() {
    const { creditCardDetailsLoader, isLoading } = PaymentsScreenStore;
    const creditCardDetails = creditCardDetailsLoader.getValue();

    let content = null;
    const header = <SectionHeader title="Payment default" />;

    if (isLoading) {
      content = (
        <Section>
          <LoadingIndicator />
        </Section>
      );
    } else if (creditCardDetails) {
      const {
        brand,
        expirationMonth,
        expirationYear,
        last4,
      } = creditCardDetails;
      content = (
        <>
          {header}
          <View style={styles.cardContainer}>
            <Text style={styles.cardText}>
              {brand} {last4}
            </Text>
            <Text style={styles.cardExpirationText}>
              {expirationMonth}/{expirationYear}
            </Text>
            <IconButton
              color={COLORS.text}
              name="md-close"
              onPress={PaymentsScreenStore.removeCard}
              type="ionicon"
            />
          </View>
        </>
      );
    } else {
      content = (
        <>
          {header}
          <CardForm style={styles.cardForm} />
        </>
      );
    }

    return (
      <Container>
        <Header showBackButton title="Payment" />
        <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
          <Section bottomPadded>{content}</Section>
          <Section>
            <Image source={StripeImage} style={styles.stripeImageStyle} />
          </Section>
        </KeyboardAwareScrollView>
      </Container>
    );
  }
}

export default PaymentsScreen;
