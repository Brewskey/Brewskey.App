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
  const form = useForm<FlowSensorMutator>({
    defaultValues: {
      tapId,
      id: flowSensor?.id,
      flowSensorType: FLOW_SENSOR_ITEMS[0].value,
      pulsesPerGallon: DEFAULT_FLOW_SENSOR_ITEM.defaultPulses,
    },
  });
  const { watch, setValue } = form;
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
        <FlowSensorSwiperField
          name="flowSensorType"
          onChange={function (value: FlowSensorType): void {
            setValue(
              'pulsesPerGallon',
              FLOW_SENSOR_ITEMS.find(
                (flowSensorItem: FlowSensorItem): boolean =>
                  flowSensorItem.value === value,
              )!.defaultPulses,
            );
          }}
        />
        <PulsesPerGallonComponent
          name="pulsesPerGallon"
          defaultPulses={selectedFlowSensorItem.defaultPulses}
        />
        <SectionContent paddedVertical>
          <SubmitButton onSubmit={onSubmit} title="Set Sensor" />
        </SectionContent>
      </View>
    </Form>
  );
};

export default FlowSensorForm;
