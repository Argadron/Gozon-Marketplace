<template>
    <div style="width: 240px;" class="product-container" >
        <div style="text-align: center;" class="cursor-pointer toProduct" @click="toProduct">
            <img style="width: 15vw;" src="../assets/largelogo.png">
            <p style="color: var(--q-accent); font-size: larger; text-align: center;" class="text-truncate">{{ formattedName() }}</p>
            <p class="text-truncate">{{formattedDescription() }}</p>
        </div>
        <div style="text-align: center; align-self: flex-end;">
            <p style="margin-bottom:5px;"><strong>Цена: {{ formattedPrice(product.price) }}</strong></p>
            <q-btn label="В корзину" style="max-height: 35px;" @click="saveProduct"/>
        </div>
    </div>
</template>

<script>
import formattedString from "src/boot/formatted.js"
export default {
    props: {
        product: Object

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
    },
    watch:{
      product:{
        handler(newValue) {
            console.log(newValue);
            this.user.stringRole = newValue[this.user.userRole-1].roleValue
        },
      }
    },
    data(){
        const formattedName = ()=>{
            return formattedString(this.product.name,20)
        }
        const formattedDescription = ()=>{
            return formattedString(this.product.description,45)
        }
        return{
            formattedName,
            formattedDescription
        }
    },
    setup(){
        return {
            formattedString
        }
    },
    computed: {
        formattedPrice() {
            console.log(formattedString)
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
        saveProduct(){
            if(localStorage.products){
                localStorage.products =+ this.product.id.toString()
                console.log('asd')
            }else{
                localStorage.products = this.product.id.toString()
            }
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
</style>