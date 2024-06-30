<template>
  <div class="flex">
    <productCard v-for="product in products" v-bind:product="product"/>
  </div>

</template>

<script>
import { defineComponent, ref } from 'vue';
import productCard from 'src/components/productCard.vue'
import requester from 'src/boot/requester.ts';
import axios from 'axios';
export default {
  name: 'IndexPage',
  components:{
    productCard
  },
  setup() {
    console.log(axios["get"])
    const products = ref([]);
    async function fetchProducts() {
      const res = await requester("GET","products/all?page=1&productOnPage=10");
      products.value = res.result;
    }
    fetchProducts();
    console.log(products)
    return { products };
  }
}
</script>