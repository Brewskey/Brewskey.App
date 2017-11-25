// @flow

import * as React from 'react';
import { StyleSheet } from 'react-native';
import { getRandomInt } from '../utils';
import { ListItem as RNEListItem } from 'react-native-elements';
import StubAvatar from '../common/avatars/StubAvatar';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  subtitleContainerStyle: {
    backgroundColor: '#eee',
    marginLeft: 15,
  },
  subtitleStyle: {
    color: '#eee',
  },
  titleContainerStyle: {
    backgroundColor: '#eee',
    marginLeft: 15,
  },
  titleStyle: {
    color: '#eee',
  },
});

type Props = {
  containerStyle?: Object,
  showAvatar?: boolean,
};

class LoadingListItem extends React.PureComponent<Props> {
  _subtitleContainerWidth = `${getRandomInt(60, 80)}%`;
  _titleContainerWidth = `${getRandomInt(30, 50)}%`;

  render() {
    return (
      <RNEListItem
        {...this.props}
        avatar={this.props.showAvatar ? <StubAvatar size={45} rounded /> : null}
        hideChevron
        subtitle="none"
        subtitleContainerStyle={[
          styles.subtitleContainerStyle,
          { width: this._subtitleContainerWidth },
        ]}
        subtitleStyle={styles.subtitleStyle}
        title="none"
        titleContainerStyle={[
          styles.titleContainerStyle,
          {
            width: this._titleContainerWidth,
          },
        ]}
        titleStyle={styles.titleStyle}
        containerStyle={[styles.container, this.props.containerStyle]}
      />
    );
  }
}

export default LoadingListItem;
