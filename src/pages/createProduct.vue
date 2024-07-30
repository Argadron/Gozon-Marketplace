<template>
    <div class="product-page">
      <header class="product-header">
        <q-file label="Фото продукта" type="file"/>
        <q-input label="Имя продукта" v-model="product.name" class="product-name"/>
        <div class="tags">
          <span @dblclick="deleteTag" v-for="tag in product.tags" class="tag">{{ tag }}</span>
            <q-select :options="categories" v-model="tag" label="Имя тега" />
            <q-btn label="Добавить" @click="addTag"/>
        </div>
      </header>
      <main class="product-main">
        <section class="description">
          <q-input label="Описание продукта" v-model="product.description"/>
        </section>
        <section class="price">
          <q-input label="Цена" v-model="product.price" class="price-value"/>
        </section>
        <q-input label="Количество продукта" v-model="product.count"/>
       <q-btn @click="saveProduct" label="Сохранить продукт" color="positive"/>
        
      </main>
    </div>
  </template>
  <script>
  import requester from 'src/boot/requester';
  import {ref} from "vue"
  
  export default{
     data(){
          return{
              product:{
                name:'',
                tags:[],
                description:"",
                count:'',
                price:'',
                categories:['c']
              },
              count:0,
              tab:ref("reviews"),
              isLoading:true,
              report:"",
              review:"",
              tag:"",
              productPhoto:File,
              categories: [
                   "category1"
                 ],
          }
      },
      methods:{
            deleteTag(e){
                const tagName = event.toElement.innerText;
                this.product.tags = this.product.tags.filter(tag => tag !== tagName);
            },
            addTag(){
                this.product.categories.push(this.tag)
            },
            async saveProduct(){
                await requester("POST","products/newProduct",this.product)
            }
          },
      created(){
        requester("GET","categories/all").then((response)=>{
          this.categories = response.map(element=>{return element.name})
        })
      }
      }
  
  </script>
  
  
  <style scoped>
  .product-page {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .product-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  
  .logo {
    width: 100px;
    height: auto;
  }
  
  .product-name {
    font-size: 24px;
    color: var(--q-text);
  }
  
  .tags {
    display: flex;
  }
  
  .tag {
    margin-right: 10px;
    padding: 5px 10px;
    background-color: var(--q-secondary);
    color: var(--q-dark);
  }
  
  .description {
    margin-bottom: 20px;
  }
  
  .price {
    font-size: 20px;
    color: var(--q-text);
  }
  
  .price-value {
    font-weight: bold;
  }
  
  .price-currency {
    margin-left: 5px;
  }
  
  .actions {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .add-to-cart-btn {
    padding: 10px 20px;
    background-color: var(--q-primary);
    color: var(--q-dark);
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .quantity-input {
    margin-left: 10px;
    padding: 5px;
  }
  
  .tabs {
    margin-top: 20px;
  }
  
  .custom-tabs {
    background-color: var(--q-secondary);
  }
  
  .review,
  .report {
    margin-bottom: 10px;
  }
  
  .review-author,
  .report-description {
    font-weight: bold;
  }
  
  .review-description {
    color: var(--q-text);
  }
  
  .review-rating {
    color: var(--q-accent);
  }
  
  .review-input,
  .report-input {
    margin-bottom: 10px;
  }
  
  .rating-stars {
    margin-bottom: 10px;
  }
  
  .star {
    font-size: 24px;
    color: var(--q-accent);
    cursor: pointer;
  }
  
  .submit-review-btn,
  .submit-report-btn {
    background-color: var(--q-primary);
    color: var(--q-dark);
  }
  .reports{
    transition: 500ms;
  }
  </style>
  
