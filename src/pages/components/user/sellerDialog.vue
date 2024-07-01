<template>
    <q-dialog
        >
        <q-card style="width: 50vw; display: grid;">
            <q-input v-model="fio" label="Введите ваши инициалы"/>
            <q-input v-model="email" v-if="!user.email" label="Введите ваш электронную почту"/>
            <q-input v-model="phone" v-if="!user.phone" label="Введите ваш телефон"/>
            <q-input v-model="description" v-if="!user.phone" label="Может, будут комментарии?"/>
            <q-checkbox v-model="isCompany" label="Я представитель компании"/>
            <q-btn @click="toSeller()" style="display: block; justify-self: center;" label="Отправить на рассмотрение"/>
        </q-card>
    </q-dialog>
</template>

<script>
import requester from 'src/boot/requester'
export default{
    props:{
        user:{
            type:Object,
        }
    },
    data(){
        return{
            fio:'',
            email:'',
            phone:'',
            description:'',
            isCompany:false,

        }
    },
    methods:{
        async toSeller(){
            await requester("POST","seller-requirements/createSellerRequirement",{
                fio:this.fio,
                phone:this.phone,
                email:this.email,
                description:this.description,
                isCompany:this.isCompany

            })
            this.$emit("close")
        }
    }
}

</script>