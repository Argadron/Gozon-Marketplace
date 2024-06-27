<template>
  <div class="flex">
    <product v-for="product in products" v-bind:product="product">
    </product>
  </div>

</template>

<script>
import { defineComponent, ref } from 'vue';
import product from './components/indexPage/productCard.vue'
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