// @flow

import type { QueryOptions, Pour } from 'brewskey.js-api';

import * as React from 'react';
import moment from 'moment';
import { observer } from 'mobx-react';
import ListItem from '../../common/ListItem';
import BeverageAvatar from '../../common/avatars/BeverageAvatar';
import BasePoursList from './BasePoursList';
import { NULL_STRING_PLACEHOLDER } from '../../constants';

type Props = {|
  queryOptions?: QueryOptions,
|};

@observer
class BeveragePoursList extends React.Component<Props> {
  // todo add pour amount rendering
  _renderListItem = (pour: Pour): React.Node => (
    <ListItem
      avatar={
        <BeverageAvatar beverageId={pour.beverage ? pour.beverage.id : ''} />
      }
      hideChevron
      item={pour}
      title={`${
        pour.beverage ? pour.beverage.name : NULL_STRING_PLACEHOLDER
      } – ${pour.ounces.toFixed(1)} oz`}
      subtitle={moment(pour.pourDate).fromNow()}
    />
  );

  render() {
    return (
      <BasePoursList
        queryOptions={this.props.queryOptions}
        renderListItem={this._renderListItem}
      />
    );
  }
}

export default BeveragePoursList;
