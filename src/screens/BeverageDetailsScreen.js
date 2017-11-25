// @flow
/* eslint-disable react-native/no-inline-styles */

import type { Beverage, EntityID, LoadObject } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import DAOApi from 'brewskey.js-api';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import BeverageAvatar from '../common/avatars/BeverageAvatar';
import { observer } from 'mobx-react';
import { Text } from 'react-native';
import { Container, Row } from '../common/grid';
import loadDAOEntity from '../common/loadDAOEntity';
import withLoadingActivity from '../common/withLoadingActivity';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import Paper from '../common/Paper';
import ListItem from '../common/ListItem';

type InjectedProps = {|
  entityLoader: LoadObject<Beverage>,
  id: EntityID,
  navigation: Navigation,
|};

@flatNavigationParamsAndScreenProps
@observer
@loadDAOEntity(DAOApi.BeverageDAO)
@withLoadingActivity()
class BeverageDetailsScreen extends InjectedComponent<InjectedProps> {
  // todo find types for navigationOptions
  static navigationOptions = ({ navigation }: Object): Object => ({
    title:
      navigation.state.params.beverage && navigation.state.params.beverage.name,
  });

  componentDidMount() {
    // todo with this solution title on header appears after some lag :/
    const { entityLoader, navigation } = this.injectedProps;
    navigation.setParams({ beverage: entityLoader.getValueEnforcing() });
  }

  render() {
    const { entityLoader } = this.injectedProps;
    const {
      abv,
      availability,
      beverageType,
      description,
      glass,
      ibu,
      id,
      isOrganic,
      originalGravity,
      servingTemperature,
      srm,
      style,
      year,
    } = entityLoader.getValueEnforcing();

    return (
      <KeyboardAwareScrollView>
        <Container paddedVertical>
          <Row justifyContent="center" paddedBottom>
            <BeverageAvatar beverageId={id} rounded={false} size={300} />
          </Row>
          <Row paddedHorizontal paddedBottom>
            <Paper grow>
              <Text>{description}</Text>
            </Paper>
          </Row>
          <ListItem hideChevron rightTitle={beverageType} title="TYPE" />
          {year && (
            <ListItem hideChevron rightTitle={year.toString()} title="YEAR" />
          )}
          {availability && (
            <ListItem
              hideChevron
              rightTitle={availability.name}
              title="AVAILABILITY"
            />
          )}
          {abv !== null && (
            <ListItem hideChevron rightTitle={abv.toString()} title="ABV" />
          )}
          {ibu !== null && (
            <ListItem hideChevron rightTitle={ibu.toString()} title="IBU" />
          )}
          {originalGravity !== null && (
            <ListItem
              hideChevron
              rightTitle={originalGravity.toString()}
              title="OG"
            />
          )}
          {glass && (
            <ListItem hideChevron rightTitle={glass.name} title="GLASS" />
          )}
          {servingTemperature && (
            <ListItem
              hideChevron
              rightTitle={servingTemperature}
              title="SERVING TEMPERATURE"
            />
          )}
          {srm && (
            <ListItem
              hideChevron
              rightTitle={srm.name}
              // todo move to own component
              rightTitleContainerStyle={{
                alignItems: 'center',
                backgroundColor: `#${srm.hex}`,
                borderRadius: 15,
                flex: 0,
                height: 30,
                width: 30,
              }}
              rightTitleStyle={{ color: 'white' }}
              title="SRM"
            />
          )}
          {style && (
            <ListItem hideChevron rightTitle={style.name} title="STYLE" />
          )}
          <ListItem
            hideChevron
            rightTitle={isOrganic ? 'yes' : 'no'}
            title="ORGANIC"
          />
        </Container>
      </KeyboardAwareScrollView>
    );
  }
}

export default BeverageDetailsScreen;
