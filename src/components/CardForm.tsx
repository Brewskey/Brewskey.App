import * as React from 'react';

import { View } from 'react-native';

import type { StyleProp, ViewStyle } from 'react-native';

// import { PaymentCardTextField } from 'tipsi-stripe';
// Note: PaymentsScreenStore.addNewCard would be used here when PaymentCardTextField is uncommented
// Styles for PaymentCardTextField: field { backgroundColor, borderColor, borderRadius, borderWidth, color, overflow, width }

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

export { CardForm };
