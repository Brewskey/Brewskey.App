import type { EntityID, Keg, KegMutator } from '@brewskey/js-api';

import * as React from 'react';
import DAOApi from '@brewskey/js-api';
import nullthrows from 'nullthrows';

import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary, withErrorBoundary } from '../common/ErrorBoundary';

import KegForm from '../components/KegForm';
import SnackBarStore from '../hooks/context/SnackBarContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StaticScreenProps } from '@react-navigation/native';
import {
  useCreateKeg,
  useFloatKeg,
  useGetKegByQuery,
  useUpdateKeg,
} from '../hooks/queries/KegQueries';
import { LoaderComponent } from '../common/LoaderComponent';

type Props = StaticScreenProps<{
  tapId: EntityID;
}>;

type ExtraProps = {
  onEditSubmit: (values: KegMutator) => Promise<void>;
  onFloatedSubmit: (values: KegMutator) => Promise<void>;
  onReplaceSubmit: (values: KegMutator) => Promise<void>;
  tapId: EntityID;
};

type LoadedComponentProps = ExtraProps & {
  value: Keg;
};

const LoadedComponent = ({
  onEditSubmit,
  onFloatedSubmit,
  onReplaceSubmit,
  tapId,
  value,
}: LoadedComponentProps) => (
  <KegForm
    keg={value}
    onFloatedSubmit={onFloatedSubmit}
    onReplaceSubmit={onReplaceSubmit}
    onSubmit={onEditSubmit}
    showReplaceButton
    submitButtonLabel="Update current keg"
    tapId={tapId}
  />
);

const EmptyComponent = ({
  onFloatedSubmit,
  onReplaceSubmit,
  tapId,
}: ExtraProps) => (
  <KegForm
    onFloatedSubmit={onFloatedSubmit}
    onSubmit={onReplaceSubmit}
    submitButtonLabel="Create keg"
    tapId={tapId}
  />
);

export const EditKegScreen: React.FC<Props> = withErrorBoundary(
  ({
    route: {
      params: { tapId },
    },
  }: Props) => {
    const createKeg = useCreateKeg();
    const updateKeg = useUpdateKeg();
    const floatKeg = useFloatKeg();
    const keg = useGetKegByQuery({
      filters: [DAOApi.createFilter('tap/id').equals(tapId)],
    });

    const onReplaceSubmit = async (values: KegMutator): Promise<void> => {
      await createKeg.mutateAsync(values);
      SnackBarStore.showMessage({ content: 'Keg replaced' });
    };

    const onEditSubmit = async (values: KegMutator): Promise<void> => {
      await updateKeg.mutateAsync(values);
      SnackBarStore.showMessage({ content: 'Current keg updated' });
    };

    const onFloatKegSubmit = async (values: KegMutator): Promise<void> => {
      await floatKeg.mutateAsync(values);
      SnackBarStore.showMessage({ content: 'Current keg floated' });
    };

    return (
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <LoaderComponent
          emptyComponent={EmptyComponent}
          loadedComponent={LoadedComponent}
          loader={this._kegLoader}
          onEditSubmit={this._onEditSubmit}
          onFloatedSubmit={this._onFloatKegSubmit}
          onReplaceSubmit={this._onReplaceSubmit}
          tapId={this.injectedProps.tapId}
          updatingComponent={LoadedComponent}
        />
      </KeyboardAwareScrollView>
    );
  },
  <ErrorScreen showBackButton />,
);

export default EditKegScreen;
