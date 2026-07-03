import * as React from 'react';

import {
  EXTERNAL_LOGIN_ALREADY_LINKED_ERROR,
  EXTERNAL_PROVIDER_ALREADY_LINKED_ERROR,
  LAST_LOGIN_METHOD_ERROR,
} from '@brewskey/js-api';
import { useRouter } from 'expo-router';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons/static";

import { Button } from 'common/buttons/Button';
import { ListItem } from 'common/ListItem';
import { Section } from 'common/Section';
import { SectionContent } from 'common/SectionContent';
import { DeleteModal } from 'components/modals/DeleteModal';
import { useAuthSession } from 'hooks/context/AuthContext';
import { useAddSnackBarMessage } from 'hooks/context/SnackBarContext';
import {
  useGetManageInfo,
  useLinkApple,
  useLinkGoogle,
  useUnlinkLogin,
} from 'hooks/queries/AuthQueries';
import { COLORS, TYPOGRAPHY } from 'theme';
import { formatErrorForUser, getApiErrorCode } from 'utils/errorParsing';

import type { LinkResult, UserLoginInfo } from '@brewskey/js-api';

type ExternalProvider = 'Google' | 'Apple';

interface Props {
  onRefreshStateChange?: (params: {
    isRefreshing: boolean;
    onRefresh: () => void;
  }) => void;
}

interface UnlinkTarget {
  provider: ExternalProvider;
  login: UserLoginInfo;
}

type LinkedLogin = UserLoginInfo & {
  canUnlink: boolean;
};

const PROVIDER_LABEL: Record<ExternalProvider, string> = {
  Apple: 'Apple',
  Google: 'Google',
};

const styles = StyleSheet.create({
  actionButton: {
    marginHorizontal: 0,
    minWidth: 92,
    paddingHorizontal: 10,
  },
  actionButtonTitle: {
    fontSize: 14,
  },
  helperLink: {
    ...TYPOGRAPHY.small,
    color: COLORS.primary2,
    marginLeft: 8,
    marginTop: 6,
    textDecorationLine: 'underline',
  },
  icon: {
    marginRight: 8,
  },
  loadingText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textFaded,
  },
  localLoginSubtitle: {
    gap: 2,
  },
  localPasswordStatusRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statusCardContent: {
    flex: 1,
  },
  statusCardIcon: {
    marginRight: 10,
  },
  statusCard: {
    alignItems: 'flex-start',
    backgroundColor: COLORS.secondary2,
    borderColor: COLORS.secondary3,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    marginHorizontal: 12,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  statusCardTitle: {
    ...TYPOGRAPHY.small,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  statusText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textFaded,
  },
  statusTextLinked: {
    color: COLORS.successReadable,
  },
  pendingActionText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textFaded,
    marginHorizontal: 8,
  },
  rowTitle: {
    marginBottom: 4,
  },
});

const normalizeLogin = (login: unknown): UserLoginInfo | null => {
  if (typeof login === 'string') {
    return { loginProvider: login, providerKey: '' };
  }
  if (typeof login !== 'object' || login === null) {
    return null;
  }

  const loginRecord = login as Record<string, unknown>;

  const loginProvider = loginRecord.loginProvider ?? loginRecord.LoginProvider;
  if (typeof loginProvider !== 'string') {
    return null;
  }

  const providerKey = loginRecord.providerKey ?? loginRecord.ProviderKey;
  return {
    loginProvider,
    providerKey: typeof providerKey === 'string' ? providerKey : '',
  };
};

const isLocalLogin = (login: UserLoginInfo, localLoginProvider?: string) => {
  const loginProvider = login.loginProvider.toLowerCase();
  return (
    loginProvider === localLoginProvider?.toLowerCase() ||
    loginProvider === 'local'
  );
};

const findProviderLogin = (
  logins: UserLoginInfo[],
  provider: ExternalProvider,
) =>
  logins.find(
    (login) => login.loginProvider.toLowerCase() === provider.toLowerCase(),
  );

const isExternalProviderLogin = (login: UserLoginInfo) =>
  login.loginProvider.toLowerCase() === 'apple' ||
  login.loginProvider.toLowerCase() === 'google';

const LinkedAccountsSection: React.FC<Props> = ({ onRefreshStateChange }) => {
  const router = useRouter();
  const addSnackBarMessage = useAddSnackBarMessage();
  const { data: authSession } = useAuthSession();
  const manageInfoQuery = useGetManageInfo();
  const linkGoogleMutation = useLinkGoogle();
  const linkAppleMutation = useLinkApple();
  const unlinkLoginMutation = useUnlinkLogin();
  const [unlinkTarget, setUnlinkTarget] = React.useState<UnlinkTarget | null>(
    null,
  );
  const [setPasswordProvider, setSetPasswordProvider] =
    React.useState<ExternalProvider | null>(null);

  const manageInfo = manageInfoQuery.data;
  const logins = React.useMemo(() => {
    const manageLogins = (manageInfo?.logins ?? []) as unknown[];
    const sessionLogins = (authSession?.userLogins ?? []) as unknown[];
    const source = manageLogins.length > 0 ? manageLogins : sessionLogins;
    return source.flatMap((login) => {
      const normalizedLogin = normalizeLogin(login);
      return normalizedLogin ? [normalizedLogin] : [];
    });
  }, [authSession?.userLogins, manageInfo?.logins]);
  const hasLocalLogin = logins.some((login) =>
    isLocalLogin(login, manageInfo?.localLoginProvider),
  );
  const externalLoginCount = manageInfo
    ? logins.filter(isExternalProviderLogin).length
    : 0;
  const isLastConfirmedLoginProvider =
    manageInfo != null && !hasLocalLogin && externalLoginCount === 1;
  const shouldShowLoadError = manageInfoQuery.isError && logins.length === 0;
  const { isRefetching, refetch } = manageInfoQuery;

  React.useEffect(() => {
    onRefreshStateChange?.({
      isRefreshing: isRefetching,
      onRefresh: () => {
        refetch();
      },
    });
  }, [isRefetching, onRefreshStateChange, refetch]);

  const shouldShowSetPasswordLink =
    setPasswordProvider != null ||
    (manageInfo != null && !hasLocalLogin && externalLoginCount === 1);

  let localLoginStatusText = 'Loading account details...';
  if (manageInfo != null) {
    localLoginStatusText = hasLocalLogin ? 'Password set' : 'No password set';
  }
  const emailStatusText = authSession?.email ?? 'Email unavailable';

  const navigateToSetPassword = () => {
    router.navigate('/(tabs)/(menu)/set-password');
  };

  const showLinkSuccess = (
    provider: ExternalProvider,
    result: LinkResult | null,
  ) => {
    if (!result) {
      return;
    }
    addSnackBarMessage({
      content: result.merged
        ? `Linked your ${PROVIDER_LABEL[provider]} account and merged your other Brewskey profile.`
        : `Linked your ${PROVIDER_LABEL[provider]} account.`,
    });
  };

  const showError = (error: unknown) => {
    addSnackBarMessage({ content: formatErrorForUser(error) });
  };

  const showLinkError = (provider: ExternalProvider, error: unknown) => {
    const code = getApiErrorCode(error);
    if (code === EXTERNAL_PROVIDER_ALREADY_LINKED_ERROR) {
      addSnackBarMessage({
        content: `This Brewskey account already has a ${PROVIDER_LABEL[provider]} sign-in linked. Unlink the current ${PROVIDER_LABEL[provider]} account before linking a different one.`,
      });
      return;
    }

    if (code === EXTERNAL_LOGIN_ALREADY_LINKED_ERROR) {
      addSnackBarMessage({
        content: `That ${PROVIDER_LABEL[provider]} account is already linked to another Brewskey account. Sign in with that Brewskey account and unlink ${PROVIDER_LABEL[provider]} first, then try again.`,
      });
      return;
    }

    showError(error);
  };

  const linkGoogle = () => {
    linkGoogleMutation.mutate(undefined, {
      onError: (error) => showLinkError('Google', error),
      onSuccess: (result) => showLinkSuccess('Google', result),
    });
  };

  const linkApple = () => {
    linkAppleMutation.mutate(undefined, {
      onError: (error) => showLinkError('Apple', error),
      onSuccess: (result) => showLinkSuccess('Apple', result),
    });
  };

  const confirmUnlink = async () => {
    if (!unlinkTarget) {
      return;
    }

    const target = unlinkTarget;
    setUnlinkTarget(null);
    try {
      await unlinkLoginMutation.mutateAsync(target.login);
      setSetPasswordProvider(null);
      addSnackBarMessage({
        content: `Unlinked your ${PROVIDER_LABEL[target.provider]} account.`,
      });
    } catch (error) {
      if (getApiErrorCode(error) === LAST_LOGIN_METHOD_ERROR) {
        setSetPasswordProvider(target.provider);
        addSnackBarMessage({
          content: 'Set a password first so you can still sign in.',
        });
        return;
      }
      showError(error);
    }
  };

  const renderActionButton = (
    provider: ExternalProvider,
    login: LinkedLogin | undefined,
    isLastLoginProvider: boolean,
  ) => {
    const isProviderUnlinking =
      unlinkLoginMutation.isPending && unlinkTarget?.provider === provider;

    if (login) {
      if (!login.canUnlink) {
        return (
          <Text
            style={styles.pendingActionText}
            testID={`linked-account-${provider.toLowerCase()}-loading-action`}
          >
            Loading...
          </Text>
        );
      }

      return (
        <Button
          backgroundColor={COLORS.danger}
          color={COLORS.textInverse}
          disabled={isProviderUnlinking || isLastLoginProvider}
          loading={isProviderUnlinking}
          onPress={() => setUnlinkTarget({ provider, login })}
          style={styles.actionButton}
          testID={`linked-account-${provider.toLowerCase()}-unlink-button`}
          title="Unlink"
          titleStyle={styles.actionButtonTitle}
        />
      );
    }

    const isApple = provider === 'Apple';
    const mutation = isApple ? linkAppleMutation : linkGoogleMutation;
    return (
      <Button
        disabled={!mutation.isReady}
        loading={mutation.isPending}
        onPress={isApple ? linkApple : linkGoogle}
        style={styles.actionButton}
        testID={`linked-account-${provider.toLowerCase()}-link-button`}
        title={`Link ${PROVIDER_LABEL[provider]}`}
        titleStyle={styles.actionButtonTitle}
      />
    );
  };

  const renderProviderRow = (provider: ExternalProvider) => {
    const foundLogin = findProviderLogin(logins, provider);
    const login = foundLogin
      ? {
          ...foundLogin,
          canUnlink: foundLogin.providerKey.length > 0,
        }
      : undefined;
    const iconName = provider === 'Apple' ? 'apple' : 'google';
    const isLastLoginProvider = !!login && isLastConfirmedLoginProvider;
    let statusText = 'Not linked';
    if (login?.canUnlink) {
      statusText = 'Linked';
    } else if (login) {
      statusText = 'Linked. Loading account details...';
    }

    return (
      <ListItem
        chevron={false}
        key={provider}
        leftAvatar={
          <MaterialCommunityIcons
            color={COLORS.text}
            name={iconName}
            size={22}
            style={styles.icon}
          />
        }
        rightIcon={renderActionButton(provider, login, isLastLoginProvider)}
        subtitle={
          <View>
            <Text
              style={[
                styles.statusText,
                login?.canUnlink ? styles.statusTextLinked : null,
              ]}
            >
              {statusText}
            </Text>
          </View>
        }
        testID={`linked-account-${provider.toLowerCase()}-row`}
        title={PROVIDER_LABEL[provider]}
        titleStyle={styles.rowTitle}
      />
    );
  };

  const renderStatusCard = (message: string, testID: string) => (
    <Animated.View
      entering={FadeIn.duration(140)}
      exiting={FadeOut.duration(120)}
      layout={LinearTransition.duration(180)}
      style={styles.statusCard}
      testID={testID}
    >
      <MaterialCommunityIcons
        color={COLORS.primary2}
        name="information-outline"
        size={20}
        style={styles.statusCardIcon}
      />
      <View style={styles.statusCardContent}>
        <Text style={styles.statusCardTitle}>Info</Text>
        <Text style={styles.loadingText}>{message}</Text>
      </View>
    </Animated.View>
  );

  return (
    <Section bottomPadded testID="linked-accounts-section">
      <SectionContent paddedVertical={false}>
        {manageInfoQuery.isLoading
          ? renderStatusCard(
              'Loading linked login providers...',
              'linked-accounts-loading',
            )
          : null}
        {shouldShowLoadError
          ? renderStatusCard(
              'Unable to load linked login providers.',
              'linked-accounts-error',
            )
          : null}
        <ListItem
          chevron={false}
          leftAvatar={
            <MaterialCommunityIcons
              color={COLORS.text}
              name="email-lock"
              size={22}
              style={styles.icon}
            />
          }
          subtitle={
            <View style={styles.localLoginSubtitle}>
              <Text style={styles.statusText}>{emailStatusText}</Text>
              <View style={styles.localPasswordStatusRow}>
                <Text style={styles.statusText}>{localLoginStatusText}</Text>
                {shouldShowSetPasswordLink ? (
                  <Text
                    onPress={navigateToSetPassword}
                    style={styles.helperLink}
                    testID="linked-account-set-password-link"
                  >
                    Set a password first
                  </Text>
                ) : null}
              </View>
            </View>
          }
          testID="linked-account-local-row"
          title="Email & password"
          titleStyle={styles.rowTitle}
        />
        {Platform.OS === 'ios' && linkAppleMutation.isAvailable
          ? renderProviderRow('Apple')
          : null}
        {renderProviderRow('Google')}
      </SectionContent>
      <DeleteModal
        deleteButtonTitle="unlink"
        isVisible={unlinkTarget != null}
        message={
          unlinkTarget
            ? `You won't be able to sign in with ${PROVIDER_LABEL[unlinkTarget.provider]} anymore. You can always re-link it later.`
            : ''
        }
        onCancelButtonPress={() => setUnlinkTarget(null)}
        onDeleteButtonPress={confirmUnlink}
        testID="unlink-login-confirmation-modal"
        title={
          unlinkTarget ? `Unlink ${PROVIDER_LABEL[unlinkTarget.provider]}` : ''
        }
      />
    </Section>
  );
};

export { LinkedAccountsSection };
