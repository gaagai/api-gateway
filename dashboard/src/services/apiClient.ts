import { axios } from '@bundled-es-modules/axios';

/*
export function useSidebar() {
  return {
    ...toRefs(state),
  };
}
*/

const instance = axios.create({
    baseURL: 'http://127.0.0.1:58596/',
    timeout: 1000,
    //headers: {'X-Custom-Header': 'foobar'}
});

export default instance