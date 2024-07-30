<template>
    
    <q-tr>

            <q-td>{{product.sellerId}}</q-td>
            <q-td>{{product.id}}</q-td>
            <q-td>{{product.description}}</q-td>
            <q-td>{{ product.reports.map(report=>{return report.description}).join("") }}</q-td>
            <!-- <q-td>{{sellerRequirement}}</q-td> -->
            <q-td><q-btn @click="banUser" color="positive" label="В бан"/></q-td>
            <q-td><q-btn @click="toProduct" color="negative" label="К продукту"/></q-td>

    </q-tr>

</template>

<script>
import requester from "src/boot/requester"
/*createdAt: "2024-07-04T14:08:52.868Z"
description: "Гони мне селлерку!"
email: "derebenko23@gmail.com"
fio: "И.И.Иванов"
id: 1
isCompany: true
phone: "+79238246321"
updatedAt: "2024-07-04T14:08:52.868Z"
userId: 1
*/
export default{

    props:{
        product:null
    },
    mounted(){
        console.log(this.product)
    },methods:{
        async toProduct(){
            window.location.href = "product?id="+this.product.id.toString()
        },
        async banUser(){
            //await requester("DELETE","products/delete/"+this.product.id.toString())
            await requester("DELETE","products/delete/"+this.product.id.toString())
        }
    }
}
 </script>