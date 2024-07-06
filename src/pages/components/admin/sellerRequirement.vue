<template>
    
    <q-tr>

            <q-td>{{sellerRequirement.id}}</q-td>
            <q-td>{{sellerRequirement.userId}}</q-td>
            <q-td>{{sellerRequirement.fio}}</q-td>
            <q-td>{{sellerRequirement.phone}}</q-td>
            <q-td>{{sellerRequirement.email}}</q-td>
            <q-td>{{sellerRequirement.description}}</q-td>
            <q-td><q-checkbox disabled readonly v-model="sellerRequirement.isCompany"/></q-td>
            <!-- <q-td>{{sellerRequirement}}</q-td> -->
            <q-td><q-btn @click="response(true)" color="positive" label="Принять"/></q-td>
            <q-td><q-btn @click="response(false)" color="negative" label="Отклонить"/></q-td>

    </q-tr>

</template>

<script>
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
        sellerRequirement:null
    },
    methods:{
        response(accepted){
            console.log(accepted)
            this.$emit("accept",{accepted, userId: this.sellerRequirement.userId})
        }
    }
}
</script>