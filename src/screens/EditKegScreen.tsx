import type { EntityID, Keg, KegMutator } from '@brewskey/js-api';

import * as React from 'react';
import { createFilter } from '@brewskey/js-api/dist/filters';

import ErrorScreen from '../common/ErrorScreen';
import { withErrorBoundary } from '../common/ErrorBoundary';

import KegForm from '../components/KegForm';
import { useAddSnackBarMessage } from '../hooks/context/SnackBarContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  useCreateKeg,
  useFloatKeg,
  useGetKegByQuery,
  useUpdateKeg,
} from '../hooks/queries/KegQueries';
import LoadingIndicator from '../common/LoadingIndicator';

// Type that works with both StaticScreenProps and MaterialTopTabScreenProps
// We only use route.params.tapId, so this minimal type works for both navigation types
// Making route optional to satisfy ScreenComponentType which can accept ComponentType<{}>
type Props = {
  route?: {
    params: { tapId: EntityID };
  } & Record<string, unknown>;
  navigation?: unknown;
};

type ExtraProps = {
  onEditSubmit: (values: KegMutator) => KegMutator | Promise<KegMutator>;
  onFloatedSubmit: (values: KegMutator) => KegMutator | Promise<KegMutator>;
  onReplaceSubmit: (values: KegMutator) => KegMutator | Promise<KegMutator>;
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

export const EditKegScreen: React.FC<Props> = withErrorBoundary(
  (props: Props) => {
    const tapId = props.route?.params?.tapId;
    if (!tapId) {
      return null;
    }
    const createKeg = useCreateKeg();
    const updateKeg = useUpdateKeg();
    const floatKeg = useFloatKeg();
    const addSnackBarMessage = useAddSnackBarMessage();
    const { data: keg, isLoading } = useGetKegByQuery({
      filters: [createFilter('tap/id').equals(tapId)],
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

    const onFloatKegSubmit = async (values: KegMutator): Promise<KegMutator> => {
      await floatKeg.mutateAsync(values);
      addSnackBarMessage({ content: 'Current keg floated' });
      return values;
    };

    if (isLoading) {
      return (
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <LoadingIndicator />
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
          tapId={tapId}
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
          tapId={tapId}
          value={keg}
        />
      </KeyboardAwareScrollView>
    );
  },
  <ErrorScreen showBackButton />,
);

export default EditKegScreen;
