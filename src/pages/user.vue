<template>
    <div class="user-container" style="padding: 15px; display: flex; justify-content: space-between;">
        <div class="userinfo">
            <q-avatar size="5vw">
                <img src="./components/assets/largelogo.png" alt="">
            </q-avatar>
            <p style="margin-left:5px;font-size:25px; color: var(--q-text);">{{ user.username }}</p>
        </div>
       
        <q-btn style="justify-self: flex-end; max-height: 5vh">Я хочу стать продавцом!</q-btn>
    </div>

    <h3 style="margin:0; text-align: center;">Корзина</h3>
    <div class="flex">
        <productCard v-for="product in products" v-bind:product = "product"/>
    </div>
</template>
<script>
import { AxiosError } from 'axios'
import productCard from 'src/components/productCard.vue'
import requester from 'src/boot/requester'
export default{
    methods:{
        async getProduct(productId){
            const res = await requester("GET","products/"+productId)
            console.log(JSON.parse(JSON.stringify(res)))
            return JSON.parse(JSON.stringify(res))
        }
    },
    components:{
        productCard,
    },
    data(){
        return{
            user:Object,
            products:Array
        }
    },
    async mounted(){
        if(!localStorage.accessToken){
            window.location.href = "/login"
            return
        }   
        const res = await requester("GET","users/getProfile")
        if(res.name === "AxiosError"&& res.response.statusText == "Unauthorized"){
             window.location.href = "/login"
        }
        this.user = res

        this.products = await Promise.all(res.userProducts.map(async(element) => {
            return await this.getProduct(element.productId)
        })); 
        console.log(this.products)
    }   
}

</script>

<style>
.user-container *{
    display: inline;
}
</style>