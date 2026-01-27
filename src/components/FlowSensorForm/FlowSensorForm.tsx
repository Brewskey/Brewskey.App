import * as React from 'react';

import { useForm } from 'react-hook-form';
import { View } from 'react-native';

import { FLOW_SENSOR_ITEMS } from './flowSensorItems';
import { FlowSensorSwiperField } from './FlowSensorSwiperField';
import { GallonSliderField } from './GallonSliderField';
import { GallonTextField } from './GallonTextField';
import { Form } from '../../common/form/Form';
import { FormValidationMessage } from '../../common/form/FormValidationMessage';
import { SubmitButton } from '../../common/form/SubmitButton';
import { SectionContent } from '../../common/SectionContent';

import type {
  EntityID,
  FlowSensor,
  FlowSensorMutator,
  FlowSensorType,
} from '@brewskey/js-api';

import type { FlowSensorItem } from './flowSensorItems';

const DEFAULT_FLOW_SENSOR_ITEM = FLOW_SENSOR_ITEMS[0];

interface Props {
  flowSensor?: FlowSensor;
  onSubmit: (values: FlowSensorMutator) => void | Promise<void>;
  tapId: EntityID;
}

export const FlowSensorForm: React.FC<Props> = ({
  onSubmit,
  flowSensor,
  tapId,
}) => {
  const initialFlowSensorType =
    flowSensor?.flowSensorType ?? FLOW_SENSOR_ITEMS[0].value;
  const initialFlowSensorItem =
    FLOW_SENSOR_ITEMS.find(
      (item: FlowSensorItem): boolean => item.value === initialFlowSensorType,
    ) || DEFAULT_FLOW_SENSOR_ITEM;

  const form = useForm<FlowSensorMutator>({
    defaultValues: {
      tapId,
      id: flowSensor?.id,
      flowSensorType: initialFlowSensorType,
      pulsesPerGallon:
        flowSensor?.pulsesPerGallon ?? initialFlowSensorItem.defaultPulses,
    },
  });
  const { watch, setValue } = form;

  // Ensure form is ready before accessing formState
  const isFormReady = form.formState != null;
  const flowSensorType = watch('flowSensorType');
  const selectedFlowSensorItem =
    FLOW_SENSOR_ITEMS.find(
      (flowSensorItem: FlowSensorItem): boolean =>
        flowSensorItem.value === flowSensorType,
    ) || DEFAULT_FLOW_SENSOR_ITEM;
  const isCustomSensor = selectedFlowSensorItem.value === 'Custom';

  const PulsesPerGallonComponent = isCustomSensor
    ? GallonTextField
    : GallonSliderField;

  return (
    <Form form={form}>
      <View>
        <FormValidationMessage />
        <FlowSensorSwiperField
          name="flowSensorType"
          onChange={function (value: FlowSensorType): void {
            setValue(
              'pulsesPerGallon',
              FLOW_SENSOR_ITEMS.find(
                (flowSensorItem: FlowSensorItem): boolean =>
                  flowSensorItem.value === value,
              )!.defaultPulses,
              { shouldDirty: true },
            );
          }}
        />
        <PulsesPerGallonComponent
          defaultPulses={selectedFlowSensorItem.defaultPulses}
          name="pulsesPerGallon"
        />
        <SectionContent paddedVertical>
          <SubmitButton
            disabled={!isFormReady}
            onSubmit={onSubmit}
            testID="submit-button-save"
            title="Set Sensor"
          />
        </SectionContent>
      </View>
    </Form>
  );
};
