import * as React from 'react';

type Props = {
  children?: React.ReactNode
};

const Fragment: React.FC<Props> = ({ children }) => {
  return children ?? null;
};

export default React.memo(Fragment);
