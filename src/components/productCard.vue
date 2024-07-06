<template>
    <div style="width: 240px;" class="product-container">
        <div style="text-align: center;" class="cursor-pointer toProduct" @click="toProduct()">
            <img style="width: 15vw;" src="../assets/largelogo.png">
            <p style="color: var(--q-accent); font-size: larger; text-align: center;" class="text-truncate">{{ formattedName }}</p>
            <p class="text-truncate">{{formattedDescription }}</p>
        </div>
        <div v-if="!isInBasket" style="text-align: center; align-self: flex-end;">
            <p style="margin-bottom:5px;"><strong>Цена: {{ formattedPrice(product.price) }}</strong></p>
            <q-btn :label="dropedInBasket ? 'В корзину' : 'Купить'"  style="max-height: 35px;" @click="dropedInBasket ? saveToBasket() : dropToBasket()"/>
            <q-input type="number" v-model="count" v-if="dropedInBasket" label="Введите количество"/>
        </div>
        <div class="bottom flex justify-between items-center">
            <div class="icon-text-wrapper">
                <q-icon color="warning" name="warning">
                    <q-tooltip content="Описание количества жалоб">Жалобы</q-tooltip>
                </q-icon>
                <p>{{ product.reports.length }}</p>
            </div>
            <div class="icon-text-wrapper">
                <q-icon id="reviewsItem" color="info" name="info">
                    <q-tooltip content="Описание количества отзывов">Отзывы</q-tooltip>
                </q-icon>
                <p>{{ product.reviews.length }}</p>
            </div>
        </div>
    </div>
</template>


<script>
import {formattedString} from "src/boot/formatted.js"
import {ref, watchEffect} from "vue"
import requester from "src/boot/requester";
export default {
    props: {
        product:{
            type:Object,
            required:true,
        },
        isInBasket:{
            type:Boolean
        }
        /*
        {
            "id": 1,
            "name": "Товар 2",
            "description": "Описани очень  длинное ываываываываываываыв",
            "price": 20,
            "rate": 220,
            "reportsCount": 0,
            "count": 30,
            "tags": [
                "тэг1"
            ],
            "categories": [],
            "productPhoto": "no",
            "isSold": false,
            "sellerId": 1,
            "createdAt": "2024-07-03T16:59:11.891Z",
            "updatedAt": "2024-07-03T16:59:11.891Z",
            "reviews": [],
            "reports": []
        }
        */
    },
    watch:{
      product:{

      }
    },
    data(){
        const formattedName = formattedString(this.product.name,20)

        const formattedDescription = formattedString(this.product.description,45)
        return{
            formattedName,
            formattedDescription,
            count:1,
            
        dropedInBasket:ref(false)

        }
    },
    setup(){
        return {
            formattedString
        }
    },
    computed: {
        formattedPrice() {
            return price => {
                let res = "";
                let reversedPrice = price.toString().split("").reverse().join("")
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
            };
        }
    },
    methods:{
        async dropToBasket(){
            this.dropedInBasket = true
            console.log(this.dropedToBasket)
        },
        async saveToBasket(){
            this.dropedInBasket = false
            console.log({
                productCount:this.count,
                productId:this.product.id
            })
            await requester("POST","basket/addProduct",{
                productCount:Number(this.count),
                productId:this.product.id
            })
        },
        toProduct(){
            window.location.href = 'product?id='+this.product.id
        }
    }
};
</script>
<style>
.product-container p{
    color: var(--q-text);

}
.product-container:hover{
    box-shadow: 3px 2px 1px -1px dark;
}
.product-container{
    margin-top: 5px;
    margin-left: 5px;
    margin-right: 2vw;
    max-width: 20vw;
   /* border: 0.5px solid var(--q-primary);*/
    padding: 10px;
    display: grid;
}

.text-truncate {
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;  
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Для поддержки Firefox */
.text-truncate {
  word-wrap: break-word;
}

.stars span {
    font-size: 1.2em;
    color: gold;
}

.stars span.filled {
    color: orange;
}
.icon-text-wrapper {
    display: flex;
    align-items: center;
}
.reviewsItem{
    margin: 0;
    padding: 0;
    translate: 0;
}
</style>