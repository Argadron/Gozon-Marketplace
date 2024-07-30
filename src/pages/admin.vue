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
            <sellerRequirement @accept="accept" v-bind:sellerRequirement="props.row"/>
        </template>
    </q-table>
</div>
<div v-if="productsWithReport">
    <q-table title="Продукты с жалобами" :rows="productsWithReport">
        <template v-slot:header>
            <q-tr>
                <q-th colspan="1">ID продавца</q-th>
                <q-th colspan="1">ID продукта</q-th>
                <q-th colspan="1">Описание продукта</q-th>
                <q-th>жалобы</q-th>
                <q-th></q-th>
                <q-th></q-th>
            </q-tr>
        </template>
        <template v-slot:body="props">
            <reportsTr @accept="accept" v-bind:product="props.row"/>
        </template>
    </q-table>
</div>
</template>


<script>
import requester from "src/boot/requester"
import sellerRequirement from "./components/admin/sellerRequirement.vue"
import reportsTr from "./components/admin/reportsTr.vue"
import {ref} from "vue"
export default{
    components:{
        sellerRequirement, reportsTr
    },
    data(){
        return{
            sellerRequirement:ref(null),
            productsWithReport:ref(null)
        }
    },
    async created(){
        await requester("GET",`seller-requirements/all?page=1&requirementsOnPage=50`).then(res=>{
            this.sellerRequirement = res
        })
        console.log(this.sellerRequirement)
        await requester("GET",`products/only/reports`).then(res =>{
            const normalArray = Object.values(res);
            this.productsWithReport = normalArray;
        })
        console.log(this.productsWithReport)
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