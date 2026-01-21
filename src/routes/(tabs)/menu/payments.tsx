import * as React from 'react';
import type { CreditCardDetails } from '@brewskey/js-api';

import { Image, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { COLORS, TYPOGRAPHY } from '../../../theme';

import ErrorScreen from '../../../common/ErrorScreen';
import { withErrorBoundary } from '../../../common/ErrorBoundary';
import Container from '../../../common/Container';
import Header from '../../../common/Header';
import PaymentsScreenStore from '../../../stores/PaymentsScreenStore';
import Section from '../../../common/Section';
import CardForm from '../../../components/CardForm';
import LoadingIndicator from '../../../common/LoadingIndicator';
import IconButton from '../../../common/buttons/IconButton';
import StripeImage from '../../../resources/powered_by_stripe.png';
import SectionHeader from '../../../common/SectionHeader';

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

const PaymentsScreen: React.FC = () => {
  const { isLoading } = PaymentsScreenStore;
  const [creditCardDetails, setCreditCardDetails] = React.useState<CreditCardDetails | null>(null);

  React.useEffect(() => {
    PaymentsScreenStore.creditCardDetailsLoader
      .then((details) => setCreditCardDetails(details))
      .catch(() => setCreditCardDetails(null));
  }, []);

  let content = null;
  const header = <SectionHeader title="Payment default" testID="section-header-payment-default" />;

  if (isLoading) {
    content = (
      <Section>
        <LoadingIndicator />
      </Section>
    );
  } else if (creditCardDetails) {
    const { brand, expirationMonth, expirationYear, last4 } =
      creditCardDetails;
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
            name="close"
            onPress={PaymentsScreenStore.removeCard}
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
      <Header shouldShowBackButton testID="header-payments" title="Payment" />
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" testID="payments-content">
        <Section bottomPadded>{content}</Section>
        <Section>
          <Image source={StripeImage} style={styles.stripeImageStyle} />
        </Section>
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default withErrorBoundary(PaymentsScreen, <ErrorScreen shouldShowBackButton />);
