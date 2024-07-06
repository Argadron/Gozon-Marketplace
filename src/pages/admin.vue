<template>
<div v-if="sellerRequirement">
    <q-table title="Запросы на селлерку" :rows="sellerRequirement.result">
        <template v-slot:header>
            <q-tr>
                <q-th colspan="1">ID</q-th>
                <q-th colspan="1">ID пользователя</q-th>
                <q-th>Инициалы</q-th>
                <q-th>Телефон</q-th>
                <q-th>Почта</q-th>
                <q-th>Комментарий</q-th>
                <q-th>Компания</q-th>
                <q-th></q-th>
                <q-th></q-th>
            </q-tr>
        </template>
        <template v-slot:body="props">
            <tableTr @accept="accept" v-bind:sellerRequirement="props.row"/>
        </template>
    </q-table>
</div>
</template>


<script>
import requester from "src/boot/requester"
import tableTr from "./components/admin/sellerRequirement.vue"
import {ref} from "vue"
export default{
    components:{
        tableTr
    },
    data(){
        return{
            sellerRequirement:ref(null)
        }
    },
    async created(){
        this.sellerRequirement = await requester("GET",`seller-requirements/all?page=1&requirementsOnPage=50`)
        console.log(this.sellerRequirement)
        this.$forceUpdate()
    },
    methods:{
        async accept(event) {
            await requester("PUT","seller-requirements/closeRequirement",{
                ...event, description:'nonono'
            })
            location.reload()
        }
    }
}
</script>


<style>
table {
        width: 100%;
        border-collapse: collapse;
    }
    th {
        width: calc(100% / 5); /* Для пяти столбцов */
    }
</style>