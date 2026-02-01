import * as React from 'react';

import { Image, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { IconButton } from 'common/buttons/IconButton';
import { Container } from 'common/Container';
import { withErrorBoundary } from 'common/ErrorBoundary';
import { ErrorScreen } from 'common/ErrorScreen';
import { Header } from 'common/Header';
import { LoadingIndicator } from 'common/LoadingIndicator';
import { Section } from 'common/Section';
import { SectionHeader } from 'common/SectionHeader';
import { CardForm } from 'components/CardForm';
import StripeImage from 'resources/powered_by_stripe.png';
import { PaymentsScreenStore } from 'stores/PaymentsScreenStore';
import { COLORS, TYPOGRAPHY } from 'theme';

import type { CreditCardDetails } from '@brewskey/js-api';

const paymentsScreenStore = new PaymentsScreenStore();

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
  const { isLoading } = paymentsScreenStore;
  const [creditCardDetails, setCreditCardDetails] =
    React.useState<CreditCardDetails | null>(null);

  React.useEffect(() => {
    paymentsScreenStore.creditCardDetailsLoader
      .then((details: CreditCardDetails) => setCreditCardDetails(details))
      .catch(() => setCreditCardDetails(null));
  }, []);

  let content = null;
  const header = (
    <SectionHeader
      testID="section-header-payment-default"
      title="Payment default"
    />
  );

  if (isLoading) {
    content = (
      <Section>
        <LoadingIndicator />
      </Section>
    );
  } else if (creditCardDetails) {
    const { brand, expirationMonth, expirationYear, last4 } = creditCardDetails;
    content = (
      <React.Fragment>
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
            onPress={paymentsScreenStore.removeCard}
          />
        </View>
      </React.Fragment>
    );
  } else {
    content = (
      <React.Fragment>
        {header}
        <CardForm style={styles.cardForm} />
      </React.Fragment>
    );
  }

  return (
    <Container>
      <Header shouldShowBackButton testID="header-payments" title="Payment" />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        testID="payments-content"
      >
        <Section bottomPadded>{content}</Section>
        <Section>
          <Image source={StripeImage} style={styles.stripeImageStyle} />
        </Section>
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default withErrorBoundary(
  PaymentsScreen,
  <ErrorScreen shouldShowBackButton />,
);
