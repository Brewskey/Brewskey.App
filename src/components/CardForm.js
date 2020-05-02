// @flow

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
//import { PaymentCardTextField } from 'tipsi-stripe';
import PaymentsScreenStore from '../stores/PaymentsScreenStore';

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

type Props = {|
  style: Object,
|};

@observer
class CardForm extends React.Component<Props> {
  render() {
    return (
      <View style={this.props.style}>
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
  }
}

export default CardForm;
