import { useContext } from 'react';
import { GetStaticPropsContext } from 'next';
import NextDataHooksContext from './next-data-hooks-context';

type Unwrap<T> = T extends Promise<infer U> ? U : T;

const stub = () => {
  throw new Error(
    'Create data hook was run in the browser. See https://github.com/ricokahler/next-data-hooks#code-elimination'
  );
};

/**
 * Creates a data hook.
 *
 * @param key The key to uniquely identify this data hooks from other on the same page.
 * @param getData An async for data that will be called via `getStaticProps` in next.js
 * @return A hook that can be used in any component within the page's React tree
 */
function createDataHook<R>(
  key: string,
  getData: (variables: GetStaticPropsContext) => R | Promise<R>
) {
  function useData(): Unwrap<R> {
    const dataHooksContext = useContext(NextDataHooksContext);
    if (!dataHooksContext) {
      throw new Error(
        'Could not find `NextDataHooksContext`. Ensure `NextDataHooksProvider` is configured correctly.'
      );
    }
    return dataHooksContext[key];
  }

  return Object.assign(useData, {
    // After running it through the babel plugin, the `getData` arg will be
    // undefined in the browser
    getData: getData || stub,
    key,
  });
}

export default createDataHook;
