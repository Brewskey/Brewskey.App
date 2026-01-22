import type {
  EntityID,
  FlowSensor,
  FlowSensorMutator,
  FlowSensorType,
} from '@brewskey/js-api';
import type { FlowSensorItem } from './flowSensorItems';

import * as React from 'react';
import { View } from 'react-native';

import SectionContent from '../../common/SectionContent';
import FlowSensorSwiperField from './FlowSensorSwiperField';
import GallonSliderField from './GallonSliderField';
import { GallonTextField } from './GallonTextField';
import FLOW_SENSOR_ITEMS from './flowSensorItems';
import { useForm } from 'react-hook-form';
import { Form } from '../../common/form/Form';
import { SubmitButton } from '../../common/form/SubmitButton';
import { FormValidationMessage } from '../../common/form/FormValidationMessage';

const DEFAULT_FLOW_SENSOR_ITEM = FLOW_SENSOR_ITEMS[0];

type Props = {
  flowSensor?: FlowSensor;
  onSubmit: (values: FlowSensorMutator) => void | Promise<void>;
  tapId: EntityID;
};

export const FlowSensorForm: React.FC<Props> = ({
  onSubmit,
  flowSensor,
  tapId,
}) => {
  const initialFlowSensorType = flowSensor?.flowSensorType ?? FLOW_SENSOR_ITEMS[0].value;
  const initialFlowSensorItem = FLOW_SENSOR_ITEMS.find(
    (item: FlowSensorItem): boolean => item.value === initialFlowSensorType,
  ) || DEFAULT_FLOW_SENSOR_ITEM;

  const form = useForm<FlowSensorMutator>({
    defaultValues: {
      tapId,
      id: flowSensor?.id,
      flowSensorType: initialFlowSensorType,
      pulsesPerGallon: flowSensor?.pulsesPerGallon ?? initialFlowSensorItem.defaultPulses,
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
          name="pulsesPerGallon"
          defaultPulses={selectedFlowSensorItem.defaultPulses}
        />
        <SectionContent paddedVertical>
          <SubmitButton onSubmit={onSubmit} testID="submit-button-save" title="Set Sensor" disabled={!isFormReady} />
        </SectionContent>
      </View>
    </Form>
  );
};

export default FlowSensorForm;
