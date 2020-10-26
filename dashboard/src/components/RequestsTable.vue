<template>


    <table class="min-w-full">
        <thead>
          <tr>
            <th
              class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
            >
              Url of request
            </th>
            <th
              class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
            >
              Started at
            </th>
            <th
              class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
            >
              Response details
            </th>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50"></th>
          </tr>
        </thead>

        <tbody class="bg-white">
          <tr v-for="(item, index) in items" :key="index">
            <td
              class="px-6 py-4 whitespace-no-wrap border-b border-gray-200"
            >
              <div class="flex items-center">
                <div class="">
                  <div
                    class="h-3 w-3 rounded-full " :class="item.response_status > 299 ? 'bg-red-600' : 'bg-green-600'"
                    
                  />
                </div>

                <div class="ml-4">
                  <div class="text-sm leading-5 font-medium text-gray-900">
                    {{ item.response_status }} {{ item.response_status_message }}
                  </div>
                  <div class="text-sm leading-5 text-gray-500">
                    {{ item.url }}
                  </div>
                </div>
              </div>
            </td>

            <td
              class="px-6 py-4 whitespace-no-wrap border-b border-gray-200"
            >
              <div class="text-sm leading-5 text-gray-900">
                {{ item.target_host }}{{item.url}}
              </div>
              <div class="text-sm leading-5 text-gray-500">
                
              </div>
            </td>

            <td
              class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm text-gray-500"
            >
              <!-- <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                ></span> -->
                {{ item.started_at }}
              
            </td>

            <td
              class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500"
            >
            {{ item.response_headers }}
            <div class="text-black">
                {{ item.response_body }}
            </div>
            
            </td>

            <td
              class="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-200 text-sm leading-5 font-medium"
            >
            <router-link to="/cards" class="text-indigo-600 hover:text-indigo-900">
              View
            </router-link>
              
            </td>
          </tr>
        </tbody>
      </table>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        items: Array
    },
    setup() {

    }
})

</script>