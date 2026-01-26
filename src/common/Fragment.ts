import * as React from 'react';

interface Props {
  children?: React.ReactNode;
}

const Fragment: React.FC<Props> = async ({ children }) => children ?? null;

export default React.memo(Fragment);
