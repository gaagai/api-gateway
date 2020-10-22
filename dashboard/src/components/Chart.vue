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
    <input class="form-input" type="text" v-model="chop" />
    <button class="form-input" @click="updateChart">Randomize!</button>
</template>
<script lang="ts">
    import { defineComponent, ref, watchEffect, watch, getCurrentInstance, onMounted } from "vue";
    //import Chart2 from './Chart2.vue';
    import Chart from 'chart.js';

    export default defineComponent({
        //components: { Chart2 },
        props: {
            aga: Object,
            data: Array
        },
        
        setup(props, context) {
            
            const { chart, chop, initChart, updateChart } = useChart()

            onMounted(() => {
                console.log('mounted composition api!')
                //initChart()
            })

            console.log('chop:', chop)
            
            //watchEffect(() => { console.log('watcher', chart); updateChart(chart) } )

            return { chart, chop, updateChart }
        }
    })


    function useChart() {
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

        const updateChart = (chart, chop) => {
            console.log('update chart!', chart)
            chart.data.datasets[0].data = [3,chop,2,5,5,Math.random()*10,10,17,Math.random()*30]
            chart.update()
        }

        onMounted(() => {
            console.log('mount inside chart!')
            initChart()
        })

        watch(chop, (c, prevC) => {
            updateChart(chart, c)
        })

        return { chart, chop, initChart, updateChart }
    }

</script>