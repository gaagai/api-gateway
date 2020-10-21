<template>chart!3
    <canvas id="myChart"></canvas>
    Prop from parent: {{ aga.num }}
    <chart2></chart2>
    <br>
    Data: {{ data }}
    <ol class="list-disc">
        <li v-for="d in data">
            {{ d.val }}
        </li>
    </ol>
</template>
<script>
    import { defineComponent, ref } from "vue";
    //import Chart2 from './Chart2.vue';

    export default defineComponent({
        //components: { Chart2 },
        props: {
            aga: Object,
            data: Array
        },
        setup() {
            const text = 'ewfew1'

            return { text }
        }
    })

</script>