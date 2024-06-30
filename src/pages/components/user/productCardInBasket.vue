<template>

        <tr>
            <td class="flex" style="justify-content: center;"><productCard v-bind:product="product" v-bind:isInBasket="true"/></td>
            <td><h6>{{ product.count }}</h6></td>
            <td><h6><strong>{{ formattedPrice(product.count * product.price) }}</strong></h6></td>
            <td><q-btn @click="deleteProduct()" label="Удалить из корзины"></q-btn></td>
        </tr>
        
        


</template>

<script>
import {formattedPrice} from "src/boot/formatted";
import productCard from "src/components/productCard.vue"
import requester from "src/boot/requester";
export default{
    components:{
        productCard
    },
    props:{
        product:{
            type:Object,
            required:true
        }
    },
    methods:{
        async deleteProduct(){
            await requester("DELETE",`basket/deleteProduct/${this.product.id}`)
            console.log("ASD")
            this.$emit("deleteProduct")
        }
    },
    setup(){
        return{
            formattedPrice
        }
    }
}
</script>
<style>
td{
    width: 33vw;
    text-align:center;
    text-justify: center;
}
h6{
    color: var(--q-text);
}
</style>