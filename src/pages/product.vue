<template>

        <p style="color: var(--q-text); text-align: center; font-size: 30px;">{{ product.name }}</p>
        <div class="flex", style="justify-content: center;">
            <img src="src/assets/largelogo.png" alt="">
        </div>
        <div><p v-for="tag in product?.tags"> #{{ tag }}</p></div>
        <p style="text-align: center;">{{ product.description }} </p>
        <q-btn @click="toBasket()" :label="'В корзину  '"></q-btn>
        <q-input v-model="count" v-if="inBasket" label="Введите количество"></q-input>          

</template>


<script>

 /*
        {
        "id": 1,
        "name": "Автоувлажнитель",
        "description": "Мегаультрасупердуперувлажнитель всего за 299.499",
        "price": 3000000,
        "rate": 0,
        "reports": 2,
        "count": 3,
        "tags": [
            "#dlyaloxow #Скамлоха"
        ],
        "productPhoto": "no",
        "isSold": false,
        "createdAt": "2023-01-30T17:43:33.629Z",
        "updatedAt": "2023-01-30T17:43:33.629Z"
        }
        */


import requester from 'src/boot/requester';
import {ref} from "vue"
export default{
   async data(){
        return{
            product:ref(null),
            count:0,
        }
    },
    async mounted() {
        this.getProduct()
    },
    methods:{
        async getProduct(){
            this.product = await requester("GET","products/"+this.$route.query.id)
            console.log(this.product)
            console.log(this.product)
            //location.reload()
            this.$forceUpdate()
        },
        async toBasket(){
            await requester("POST","basket/addProduct",{
                productCount:this.count,
                productId:this.product.id
            })
        },
        formattedPrice(price) {
                let res = 0;

                let reversedPrice = price.toString().split("").reverse().join("")//Еблан почему-то не принимает если я передаю цену из html аргументом в функцию
                console.log(reversedPrice)
                reversedPrice.split("").forEach((val,index)=>{
                    if(index%3==0&&index!==0){
                        res+='.'
                    }
                    res+=val
                })

                res = res.split('').reverse().join('')
                console.log(res)
                return res;
            }
        }
}

</script>