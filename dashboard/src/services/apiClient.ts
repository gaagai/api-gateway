import { axios } from '@bundled-es-modules/axios';

/*
export function useSidebar() {
  return {
    ...toRefs(state),
  };
}
*/

const instance = axios.create({
    baseURL: 'https://127.0.0.1:8080/',
    timeout: 1000,
    withCredentials: true
    //headers: {'X-Custom-Header': 'foobar'}
});

export default instance