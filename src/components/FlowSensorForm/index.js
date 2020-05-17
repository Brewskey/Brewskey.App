// @flow

import type { EntityID, FlowSensor, FlowSensorMutator } from 'brewskey.js-api';
import type { FormProps } from '../../common/form/types';
import type { FlowSensorItem } from './flowSensorItems';

import * as React from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react';
import FormValidationMessage from '../../common/form/FormValidationMessage';
import InjectedComponent from '../../common/InjectedComponent';
import Button from '../../common/buttons/Button';
import SectionContent from '../../common/SectionContent';
import { form, FormField } from '../../common/form';
import FlowSensorSwiperField from './FlowSensorSwiperField';
import GallonSliderField from './GallonSliderField';
import GallonTextField from './GallonTextField';
import FLOW_SENSOR_ITEMS from './flowSensorItems';

const DEFAULT_FLOW_SENSOR_ITEM = FLOW_SENSOR_ITEMS[0];

type Props = {
  flowSensor?: FlowSensor,
  onSubmit: (values: FlowSensorMutator) => void | Promise<any>,
  tapId: EntityID,
};

type InjectedProps = FormProps;

@form()
@observer
class FlowSensorForm extends InjectedComponent<InjectedProps, Props> {
  _onSubmit = () => this.injectedProps.handleSubmit(this.props.onSubmit);

  render(): React.Node {
    const { flowSensor = {}, tapId } = this.props;
    const { formError, invalid, submitting, values } = this.injectedProps;

    const selectedFlowSensorItem =
      FLOW_SENSOR_ITEMS.find(
        (flowSensorItem: FlowSensorItem): boolean =>
          flowSensorItem.value === values.flowSensorType,
      ) || DEFAULT_FLOW_SENSOR_ITEM;

    const isCustomSensor = selectedFlowSensorItem.value === 'Custom';

    const PulsesPerGallonComponent = isCustomSensor
      ? GallonTextField
      : GallonSliderField;

    const pulsesPerGallonFormat = isCustomSensor
      ? (value: number): string => value.toString()
      : undefined;

    const pulsesPerGallonInitialValue =
      flowSensor.pulsesPerGallon &&
      selectedFlowSensorItem.value === flowSensor.flowSensorType
        ? flowSensor.pulsesPerGallon
        : selectedFlowSensorItem.defaultPulses;

    return (
      <View>
        <FormField
          component={FlowSensorSwiperField}
          name="flowSensorType"
          initialValue={
            (flowSensor && flowSensor.flowSensorType) ||
            DEFAULT_FLOW_SENSOR_ITEM.value
          }
        />
        <FormField
          component={PulsesPerGallonComponent}
          defaultPulses={selectedFlowSensorItem.defaultPulses}
          disabled={submitting}
          format={pulsesPerGallonFormat}
          initialValue={pulsesPerGallonInitialValue}
          name="pulsesPerGallon"
          parse={(value: string | number): number => parseInt(value, 10)}
        />
        <FormField name="tapId" initialValue={tapId} />
        <FormField name="id" initialValue={flowSensor && flowSensor.id} />
        <FormValidationMessage>{formError}</FormValidationMessage>
        <SectionContent paddedVertical>
          <Button
            disabled={submitting || invalid}
            onPress={this._onSubmit}
            title="Set Sensor"
            loading={submitting}
          />
        </SectionContent>
      </View>
    );
  }
}

export default FlowSensorForm;
