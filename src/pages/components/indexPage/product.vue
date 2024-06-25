<template>
    <div class="product-container" style="text-align: center;" >
        <div class="cursor-pointer toProduct" @click="console.log('vov')">
            <img style="width: 15vw;" src="../assets/largelogo.png">
            <p style="color: var(--q-accent); font-size: larger;" class="text-truncate">{{ product.name }}</p>
            <p class="text-truncate">{{ product.description }}</p>
        </div>
        <q-btn @click="console.log('представьте, что я поместил это в корзину')">
            <p style="margin-right: 5px ;">В корзину!</p>
          <strong>{{formattedPrice(product.price)}}</strong> <!-- Цена продукта -->
        </q-btn>
    </div>
</template>

<script>
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
    computed: {
        formattedPrice() {
            return price => {
                console.log(this.product)
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
    max-width: 20vw;
   /* border: 0.5px solid var(--q-primary);*/
    padding: 10px;
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