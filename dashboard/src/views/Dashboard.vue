<template>
  <div>
    <h3 class="text-gray-700 text-3xl font-medium">Dashboard</h3>

    <div class="mt-4">
      <div class="flex flex-wrap -mx-6">
        <div class="w-full px-6 sm:w-1/2 xl:w-1/3">
          <div
            class="flex items-center px-5 py-6 shadow-sm rounded-md bg-white"
          >
            <div class="p-3 rounded-full bg-indigo-600 bg-opacity-75">
              <svg class="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <div class="mx-5">
              <h4 class="text-2xl font-semibold text-gray-700">{{ logNum }}</h4>
              <div class="text-gray-500">Total Requests</div>
            </div>
          </div>
        </div>

        <div class="w-full mt-6 px-6 sm:w-1/2 xl:w-1/3 sm:mt-0">
          <div
            class="flex items-center px-5 py-6 shadow-sm rounded-md bg-white"
          >
            <div class="p-3 rounded-full bg-orange-600 bg-opacity-75">
              <svg class="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <div class="mx-5">
              <h4 class="text-2xl font-semibold text-gray-700">{{logNumFailed}}</h4>
              <div class="text-gray-500">Total Failed</div>
            </div>
          </div>
        </div>

        <div class="w-full mt-6 px-6 sm:w-1/2 xl:w-1/3 xl:mt-0">
          <div
            class="flex items-center px-5 py-6 shadow-sm rounded-md bg-white"
          >
            <div class="p-3 rounded-full bg-pink-600 bg-opacity-75">
              <svg class="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>

            <div class="mx-5">
              <h4 class="text-2xl font-semibold text-gray-700">{{ logFailRate }}</h4>
              <div class="text-gray-500">Fail Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8"></div>

    

    <div class="flex flex-col mt-8">
      <div class="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div
          class="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200"
        >
        <requests-table :items="requests"></requests-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import apiClient from '../services/apiClient';
import RequestsTable from '../components/RequestsTable.vue';

interface User {
  name: string;
  email: string;
  title: string;
  title2: string;
  status: string;
  role: string;
}

export default defineComponent({
  components: { RequestsTable },
  setup() {
    const testUser: User = {
      name: "John Doe",
      email: "john@example.com",
      title: "Software Engineer",
      title2: "Web dev",
      status: "Active",
      role: "Owner",
    };
    

    const users = ref<User[]>([...Array(20).keys()].map(() => testUser));
    let logNum = ref(0);
    let logNumFailed = ref(0);
    let logFailRate = ref('');
    let requests = ref([]);

    (async () => {
      //console.log('awa', (await apiClient.get('/stats')).data.data)
      let d = (await apiClient.get('/stats')).data.data
      logNum.value = d.num
      logNumFailed.value = d.failed
      logFailRate.value = d.failRate ? (d.failRate * 100)+'%' : '0%';
      requests.value = (await apiClient.get('/stats-items')).data.data
    })()
    

    return {
      users,
      logNum,
      logNumFailed,
      logFailRate,
      requests
    };
  },
});
</script>
