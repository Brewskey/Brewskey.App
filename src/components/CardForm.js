// @flow

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { PaymentCardTextField } from 'tipsi-stripe';

const styles = StyleSheet.create({
  field: {
    backgroundColor: '#FFFFFF',
    borderColor: '#000000',
    borderRadius: 5,
    borderWidth: 1,
    color: '#449aeb',
    overflow: 'hidden',
    width: 300,
  },
});

class CardForm extends React.Component<{}> {
  render() {
    return (
      <View>
        <PaymentCardTextField
          accessible={false}
          cvcPlaceholder="CVC"
          expirationPlaceholder="MM/YY"
          numberPlaceholder="XXXX XXXX XXXX XXXX"
          style={styles.field}
        />
      </View>
    );
  }
}

export default CardForm;
