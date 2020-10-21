
<script>
    import { defineComponent, ref } from "vue";
    
    import { Bar, mixins } from 'vue-chartjs'

    export default defineComponent({
        extends: Bar,
        mixins: [mixins.reactiveProp],
        mounted () {
            alert('mounted!')
            this.renderChart(this.data, this.options)
        },
        props: {
            data: Array
        },
        setup() {
            const text = 'ewfew1'

            return { text }
        }
    })

</script>