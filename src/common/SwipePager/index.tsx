import * as React from 'react';

import PagerView from 'react-native-pager-view';

import type { StyleProp, ViewStyle } from 'react-native';
import type { PagerViewOnPageSelectedEvent } from 'react-native-pager-view';

export interface SwipePagerProps {
  currentIndex: number;
  onIndexChanged: (index: number) => void;
  children: React.ReactElement[];
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

// Native swipe pager. Treats `currentIndex` as the source of truth: external
// changes are pushed to the underlying PagerView via `setPage`, and swipe
// gestures bubble back out through `onIndexChanged`.
export const SwipePager: React.FC<SwipePagerProps> = ({
  currentIndex,
  onIndexChanged,
  children,
  style,
  testID,
}) => {
  const pagerRef = React.useRef<PagerView>(null);
  const lastReportedIndex = React.useRef(currentIndex);

  React.useEffect(() => {
    if (lastReportedIndex.current !== currentIndex) {
      pagerRef.current?.setPage(currentIndex);
      lastReportedIndex.current = currentIndex;
    }
  }, [currentIndex]);

  const handlePageSelected = (event: PagerViewOnPageSelectedEvent) => {
    const next = event.nativeEvent.position;
    lastReportedIndex.current = next;
    if (next !== currentIndex) {
      onIndexChanged(next);
    }
  };

  return (
    <PagerView
      ref={pagerRef}
      initialPage={currentIndex}
      onPageSelected={handlePageSelected}
      style={style}
      testID={testID}
    >
      {children}
    </PagerView>
  );
};
