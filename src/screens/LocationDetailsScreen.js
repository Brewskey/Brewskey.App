// @flow

import type { EntityID, Location, LoadObject } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { LocationStore } from '../stores/DAOStores';
import { ScrollView, StyleSheet, Text } from 'react-native';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import Container from '../common/Container';
import HeaderNavigationButton from '../common/Header/HeaderNavigationButton';
import OverviewItem from '../common/OverviewItem';
import SectionContent from '../common/SectionContent';
import SectionHeader from '../common/SectionHeader';
import LoadingIndicator from '../common/LoadingIndicator';
import LoaderComponent from '../common/LoaderComponent';
import Header from '../common/Header';
import LocationMap from '../components/LocationMap';
import { NULL_STRING_PLACEHOLDER } from '../constants';
import { TYPOGRAPHY } from '../theme';

const styles = StyleSheet.create({
  description: {
    ...TYPOGRAPHY.paragraph,
    paddingHorizontal: 12,
  },
});

type InjectedProps = {|
  id: EntityID,
  navigation: Navigation,
|};

@flatNavigationParamsAndScreenProps
@observer
class LocationDetailsScreen extends InjectedComponent<InjectedProps> {
  @computed
  get _locationLoader(): LoadObject<Location> {
    return LocationStore.getByID(this.injectedProps.id);
  }

  render() {
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
}: LoadedLocationDetailsProps) => {
  const {
    city,
    description,
    geolocation,
    id,
    name,
    state,
    street,
    suite,
    zipCode,
  } = location;

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
        {geolocation && <LocationMap coordinates={geolocation.coordinates} />}
        <SectionHeader title="Address" />
        <SectionContent>
          <OverviewItem title="City" value={city} />
          <OverviewItem
            title="State"
            value={state || NULL_STRING_PLACEHOLDER}
          />
          <OverviewItem title="Street" value={street} />
          <OverviewItem title="Suite" value={suite} />
          <OverviewItem title="Zip code" value={zipCode.toString()} />
        </SectionContent>
        {description && [
          <SectionHeader key="header" title="Description" />,
          <SectionContent key="content">
            <Text style={styles.description}>{description}</Text>
          </SectionContent>,
        ]}
      </ScrollView>
    </Container>
  );
};

export default LocationDetailsScreen;
