import * as React from 'react';

import { createFilter } from '@brewskey/js-api/dist/filters';
import { useLocalSearchParams } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { withErrorBoundary } from '../../../../../common/ErrorBoundary';
import { ErrorScreen } from '../../../../../common/ErrorScreen';
import { LoadingIndicator } from '../../../../../common/LoadingIndicator';
import { NotFoundScreen } from '../../../../../common/NotFoundScreen';
import { KegForm } from '../../../../../components/KegForm';
import { useAddSnackBarMessage } from '../../../../../hooks/context/SnackBarContext';
import {
  useCreateKeg,
  useFloatKeg,
  useGetKegByQuery,
  useUpdateKeg,
} from '../../../../../hooks/queries/KegQueries';

import type { EntityID, Keg, KegMutator } from '@brewskey/js-api';

interface ExtraProps {
  onEditSubmit: (values: KegMutator) => KegMutator | Promise<KegMutator>;
  onFloatedSubmit: (values: KegMutator) => KegMutator | Promise<KegMutator>;
  onReplaceSubmit: (values: KegMutator) => KegMutator | Promise<KegMutator>;
  tapId: EntityID;
}

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
    showReplaceButton
    keg={value}
    onFloatedSubmit={onFloatedSubmit}
    onReplaceSubmit={onReplaceSubmit}
    onSubmit={onEditSubmit}
    submitButtonLabel="Update current keg"
    tapId={tapId}
  />
);

const EmptyComponent = ({
  onEditSubmit,
  onFloatedSubmit,
  onReplaceSubmit,
  tapId,
}: ExtraProps) => (
  <KegForm
    onFloatedSubmit={onFloatedSubmit}
    onSubmit={onReplaceSubmit || onEditSubmit}
    submitButtonLabel="Create keg"
    tapId={tapId}
  />
);

const EditTapFeedRoute: React.FC = withErrorBoundary(
  () => {
    const { tapId } = useLocalSearchParams<{ tapId: string }>();
    const tapIdValue =
      typeof tapId === 'string' && !isNaN(Number(tapId))
        ? Number(tapId)
        : tapId;

    if (!tapIdValue) {
      return (
        <NotFoundScreen
          message="The tap you're looking for could not be found."
          title="Tap Not Found"
        />
      );
    }

    const createKeg = useCreateKeg();
    const updateKeg = useUpdateKeg();
    const floatKeg = useFloatKeg();
    const addSnackBarMessage = useAddSnackBarMessage();
    const { data: keg, isLoading } = useGetKegByQuery({
      filters: [createFilter('tap/id').equals(tapIdValue as EntityID)],
    });

    const onReplaceSubmit = async (values: KegMutator): Promise<KegMutator> => {
      await createKeg.mutateAsync(values);
      addSnackBarMessage({ content: 'Keg replaced' });
      return values;
    };

    const onEditSubmit = async (values: KegMutator): Promise<KegMutator> => {
      await updateKeg.mutateAsync(values);
      addSnackBarMessage({ content: 'Current keg updated' });
      return values;
    };

    const onFloatKegSubmit = async (
      values: KegMutator,
    ): Promise<KegMutator> => {
      await floatKeg.mutateAsync(values);
      addSnackBarMessage({ content: 'Current keg floated' });
      return values;
    };

    if (isLoading) {
      return (
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <LoadingIndicator testID="keg-form-loading" />
        </KeyboardAwareScrollView>
      );
    }

    if (!keg) {
      return (
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <EmptyComponent
            onEditSubmit={onReplaceSubmit}
            onFloatedSubmit={onFloatKegSubmit}
            onReplaceSubmit={onReplaceSubmit}
            tapId={tapIdValue as EntityID}
          />
        </KeyboardAwareScrollView>
      );
    }

    return (
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <LoadedComponent
          onEditSubmit={onEditSubmit}
          onFloatedSubmit={onFloatKegSubmit}
          onReplaceSubmit={onReplaceSubmit}
          tapId={tapIdValue as EntityID}
          value={keg}
        />
      </KeyboardAwareScrollView>
    );
  },
  <ErrorScreen shouldShowBackButton />,
);

export default EditTapFeedRoute;
