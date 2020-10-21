<template>
    <h3 class="text-gray-700 text-3xl font-medium">Api Page {{ gopa }}</h3>
    <h4>{{ info.data2 }}</h4>
    <chart :aga="{num: 223}" :data="info"></chart>
    {{ gg }}
    <input type="text" class="form-input rounded-md" v-model="info[1].val" />
    <button @click="submit" class="px-6 py-3 bg-red-600 rounded-md text-white font-medium tracking-wide hover:bg-red-500 ml-3">Click me</button>
</template>
  
<script lang="ts">
import { defineComponent, ref } from 'vue';
import Chart from '../components/Chart.vue';

console.log(Chart)
export default defineComponent({
    components: { Chart },
    data() {
        return { gg: 33 }
    },
    setup() {
      const gopa = ref(2)
      const info = ref([{
          val: 'nona'
      }, {
          val: 'second'
      }])
      return { gopa, info }
  },
  methods: {
    submit() {
        
        this.info[1].val='reset'
    },
    alert() {
        this.gopa++
        console.log(this.gopa)
        console.log('alert!')
    }
  }
  
})
</script>