<template>
    <div v-if="!isLoading" class="product-page">
      <header class="product-header">
        <img src="src/assets/largelogo.png" alt="Логотип" class="logo">
        <h1 class="product-name">{{ product.name }}</h1>
        <div class="tags">
          <span v-for="tag in product.categories" class="tag">{{ tag }}</span>
        </div>
      </header>
      <main class="product-main">
        <section class="description">
          <p>{{ product.description }}</p>
        </section>
        <section class="price">
          <span class="price-value">{{ product.price }}</span>
          <span class="price-currency">₽</span>
        </section>
        <div class="actions">
          <button @click="toBasket()" class="add-to-cart-btn">В корзину</button>
          <input v-model="count" v-if="inBasket" type="number" min="1" class="quantity-input" placeholder="Введите количество">
        </div>
        <div class="tabs">
          <q-tabs v-model="tab" dense class="custom-tabs">
            <q-tab name="reviews" label="Отзывы" />

            <q-tab class="reports" :style="tab==='reports'? 'background-color:red':''" name="reports" label="Жалобы" />
          </q-tabs>
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="reviews">
              <div v-for="review in product.reviews" :key="review.id" class="review">
                <div class="review-author">{{ review.name }}</div>
                <div class="review-description">{{ review.description }}</div>
                <div class="review-rating">{{ review.rate }}/5</div>
              </div>
              <q-input label="Ваш отзыв" v-model="review" class="review-input"></q-input>
              <div class="rating-stars">
                <span v-for="n in 5" :key="n" class="star" @click="setRating(n)">&#9733;</span>
              </div>
              <q-btn label="Отправить отзыв" @click="newReview" class="submit-review-btn"></q-btn>
            </q-tab-panel>
            <q-tab-panel name="reports">
              <div v-for="report in product.reports" :key="report.id" class="report">
                <div class="report-description">{{ report.description }}</div>
              </div>
              <q-input label="Ваша жалоба" v-model="report" class="report-input"></q-input>
              <q-btn label="Подать жалобу" @click="newReport" class="submit-report-btn"></q-btn>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </main>
    </div>
  </template>
  
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
  
<script>
import requester from 'src/boot/requester';
import {ref} from "vue"

export default{
   data(){
        return{
            product:ref(null),
            count:0,
            tab:ref("reviews"),
            isLoading:true,
            report:"",
            review:""
        }
    },
    async created() {
        this.getProduct()
    },
    methods:{
        async newReview(){
            await requester("POST", "reviews/new",{
                name:"ф",
                description:this.review,
                rate:this.rate,
                productId:Number(this.$route.query.id)
            })
        },
        setRating(n){
            this.rate = n
            console.log(n)
        },
        async newReport(){
            await requester("POST", "reports/new", {
                name:"report",
                description:this.report,
                productId:Number(this.$route.query.id)
            })
        },
        async getProduct(){
            this.product = await requester("GET","products/"+this.$route.query.id)
            console.log(this.product)
            this.isLoading = false
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
            }
        }
    }

</script>

