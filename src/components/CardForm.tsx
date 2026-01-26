import * as React from 'react';

import { StyleSheet, View } from 'react-native';

import type { StyleProp, ViewStyle } from 'react-native';

// import { PaymentCardTextField } from 'tipsi-stripe';
// Note: PaymentsScreenStore.addNewCard would be used here when PaymentCardTextField is uncommented

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

interface Props {
  style?: StyleProp<ViewStyle>;
}

const CardForm: React.FC<Props> = ({ style }) => (
  <View style={style}>
    {/* <PaymentCardTextField
        accessible={false}
        cvcPlaceholder="CVC"
        expirationPlaceholder="MM/YY"
        numberPlaceholder="XXXX XXXX XXXX XXXX"
        onParamsChange={PaymentsScreenStore.addNewCard}
        style={styles.field}
      /> */}
  </View>
);

export default CardForm;
