// @flow

import type { EntityID, Location, LoadObject } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { LocationStore } from '../stores/DAOStores';
import { ScrollView, StyleSheet, Text } from 'react-native';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import Container from '../common/Container';
import HeaderNavigationButton from '../common/Header/HeaderNavigationButton';
import SectionContent from '../common/SectionContent';
import SectionHeader from '../common/SectionHeader';
import LoadingIndicator from '../common/LoadingIndicator';
import LoaderComponent from '../common/LoaderComponent';
import Header from '../common/Header';
import LocationAddress from '../components/LocationAddress';
import { TYPOGRAPHY } from '../theme';

const styles = StyleSheet.create({
  description: {
    ...TYPOGRAPHY.paragraph,
  },
});

type InjectedProps = {|
  id: EntityID,
  navigation: Navigation,
|};

@errorBoundary(<ErrorScreen showBackButton />)
@flatNavigationParamsAndScreenProps
@observer
class LocationDetailsScreen extends InjectedComponent<InjectedProps> {
  @computed
  get _locationLoader(): LoadObject<Location> {
    return LocationStore.getByID(this.injectedProps.id);
  }

  render(): React.Node {
    return (
      <LoaderComponent
        loadedComponent={LoadedLocationDetails}
        loader={this._locationLoader}
        loadingComponent={LoadingLocationDetails}
      />
    );
  }
}

const LoadingLocationDetails = () => (
  <Container>
    <Header showBackButton />
    <LoadingIndicator />
  </Container>
);

type LoadedLocationDetailsProps = {
  value: Location,
};

const LoadedLocationDetails = ({
  value: location,
}: LoadedLocationDetails): React.Node => (
  const { description, id, name } = location;

  return (
    <Container>
      <Header
        rightComponent={
          <HeaderNavigationButton
            name="edit"
            params={{ id }}
            toRoute="editLocation"
          />
        }
        showBackButton
        title={name}
      />
      <ScrollView>
        <SectionHeader title="Address" />
        <SectionContent paddedHorizontal>
          <LocationAddress location={location} />
        </SectionContent>
        {description && [
          <SectionHeader key="header" title="Description" />,
          <SectionContent key="content" paddedHorizontal>
            <Text style={styles.description}>{description}</Text>
          </SectionContent>,
        ]}
      </ScrollView>
    </Container>
  );
};

export default LocationDetailsScreen;
