<template>chart!3
    <canvas id="myChart"></canvas>
    Prop from parent: {{ aga.num }}
    
    <br>
    Data: {{ data }}
    <ol class="list-disc">
        <li v-for="d in data">
            {{ d.val }}
        </li>
    </ol>
    <input class="form-input" type="text" v-model="num" />
    <button class="form-input" @click="randomize">Randomize!</button>

    <button class="form-input" @click="getUsers">Get users!</button>
</template>
<script lang="ts">
    import { defineComponent, ref, watchEffect, watch, getCurrentInstance, onMounted } from "vue";
    //import Chart2 from './Chart2.vue';
    import Chart from 'chart.js';

    import { axios } from '@bundled-es-modules/axios';

    export default defineComponent({
        //components: { Chart2 },
        props: {
            aga: Object,
            data: Array
        },
        
        setup(props, context) {

            const num = ref(5)
            let { chart, updateChart } = useChart(9)
            const randomize = () => {
                //let g = Math.random() * 100
                console.log('NUM:', num)
                updateChart(num.value)
            }
            console.log('NUM after init:', num.value)
            onMounted(() => {
                console.log('mounted composition api!')
                //initChart()
            })

            const users = ref([])

            const getUsers = async () => {
                try {
                    console.log('GET USERS!')
                    const { response } = await axios.get('http://127.0.0.1:8080/dash');
                    users = response.data
                } catch (error) {
                    console.log(Object.keys(error));
                }
            }; 
            
            //watchEffect(() => { console.log('watcher', chart); updateChart(chart) } )

            return { num, randomize, getUsers }
        }
    })


    function useChart(o, a) {
        console.log('first:', o, 'second:', a)
        let chart = ref(null)
        const chop = ref(5)
        console.log('chop right after init:', chop)
        const initChart = () => {
            var ctx = document.getElementById('myChart').getContext('2d');
            chart = new Chart(ctx, {
                // The type of chart we want to create
                type: 'line',

                // The data for our dataset
                data: {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    datasets: [{
                        label: 'My First dataset',
                        backgroundColor: 'rgb(255, 99, 132)',
                        borderColor: 'rgb(255, 99, 132)',
                        data: [0, 10, 5, 2, 20, 30, 45]
                    }]
                },

                // Configuration options go here
                options: {}
            });
        }

        const updateChart = (num) => {
            console.log('update chart!', chart)
            chart.data.datasets[0].data = [3,num,2,5,5,Math.random()*10,10,17,Math.random()*30]
            chart.update()
        }

        onMounted(() => {
            console.log('mount inside chart!')
            initChart()
        })

        watch(chop, (c, prevC) => {
            console.log('WATCH!')
            //updateChart(chart, c)
        })

        return { chart, initChart, updateChart }
    }

</script>