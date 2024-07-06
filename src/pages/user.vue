<template>
    <div class="user-container" style="padding: 15px; display: flex; justify-content: space-between;">
        <div class="userinfo">
            <q-avatar size="5vw">
                <img src="src/assets/largelogo.png" alt="">
            </q-avatar>
            <p style="margin-left:5px;font-size:25px; color: var(--q-text);">{{ user.username }}</p>
        </div>
       
        <q-btn v-if="user.role !== 'SELLER'" @click="sellerDialogCall = true" style="justify-self: flex-end; max-height: 5vh">Я хочу стать продавцом!</q-btn>
    </div>

    <div v-if="user.role === 'SELLER'" class="seller-api">
        <h3 style="color: var(--q-text); text-align: center;">Мои продукты</h3>
        <div @click="createProduct()" class="sellerProducts"><q-btn icon="add" label="Создать продукт"/></div>
    </div>

    <h3 style="margin:0; text-align: center;">Корзина</h3>
    <table v-if="products[0]"> 
        <thead>
            <tr style="width: 100vw;"><td><h6>Товар</h6></td><td><h6>количество</h6></td><td><h6>Итого</h6></td></tr>
        </thead>
        <tbody>
            <productCard @deleteProduct="this.getBasketProducts();console.log('SA')" v-for="product in products" v-bind:product = "product"/>
        </tbody>
    </table>

    <p     v-if="!products[0]" style="font-size: large;">Здесь пока ничего нет... Хотите перейти к <strong class="cursor-pointer" @click="goToMain()">выбору товара?</strong></p>
    <sellerDialog @close="sellerDialogCall = false" v-bind:user="user" v-model="sellerDialogCall"/>
</template>
<script>
import { AxiosError } from 'axios'
import {ref} from 'vue'
import productCard from './components/user/productCardInBasket.vue'
import requester from 'src/boot/requester.ts'
import sellerDialog from './components/user/sellerDialog.vue'
export default{
    methods:{
        goToMain(){
            window.location.href = "/"
        },
        async getProduct(productId){
            const res = await requester("GET","products/"+productId)
            console.log(JSON.parse(JSON.stringify(res)))
            return JSON.parse(JSON.stringify(res))
        },
        async getBasketProducts(){
            const res = await requester("GET","users/getProfile")
            if(res.name === "AxiosError"&& res.response.statusText == "Unauthorized"){
                 window.location.href = "/login"
            }
            this.user = res

            this.products = await Promise.all(res.userProducts.map(async(element) => {
                return{... await this.getProduct(element.productId),
                            count:element.productCount
                }
            })); 
        },
        createProduct(){
            window.location.href = 'createProduct'
        }
    },
    components:{
        productCard,
        sellerDialog
    },
    data(){
        return{
            description:'',
            isCompany:false,
            sellerDialogCall:ref(false),
            user:Object,
            products:Array
        }
    },
    async mounted(){
        if(!localStorage.accessToken){
            window.location.href = "/login"
            return
        }   
       await this.getBasketProducts();
        console.log(this.products)
    }   
}

</script>

<style>
.user-container *{
    display: inline;
}
</style>