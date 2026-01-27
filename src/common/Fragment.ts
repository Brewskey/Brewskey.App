import { memo } from 'react';

import type { FC, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

const Fragment: FC<Props> = ({ children }): ReactNode => children ?? null;

export const FragmentMemo = memo(Fragment);
export { FragmentMemo as Fragment };
