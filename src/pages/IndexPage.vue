<template>
  <product v-for="product in products" v-bind:product="product">
  </product>
</template>

<script>
import { defineComponent, ref } from 'vue';
import product from './components/indexPage/product.vue'
import requester from 'src/boot/requester';

export default {
  name: 'IndexPage',
  components:{
    product
  },
  setup() {
    const products = ref([]);
    async function fetchProducts() {
      const res = await requester.requester("GETnoToken","products/all?page=1&productOnPage=10");
      products.value = res.result;
    }
    fetchProducts();
    console.log(products)
    return { products };
  }
}
</script>