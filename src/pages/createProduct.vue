<template>

    <q-input style="color: var(--q-text); text-align: center; font-size: 30px;" lable="Имя продукта"/>
    <div class="flex", style="justify-content: center;">
        <img src="src/assets/largelogo.png" alt="">
    </div>
    <div><p v-for="tag in product?.tags"> #{{ tag }}</p></div>
    <p style="text-align: center;">{{ product.description }} </p>
    <q-btn @click="toBasket()" :label="'В корзину  '"></q-btn>
    <q-input v-model="count" v-if="inBasket" label="Введите количество"></q-input>          

</template>

<script>
export default{
    data(){
        return{
            product
        }
    }
}

</script>