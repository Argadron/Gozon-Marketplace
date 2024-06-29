<template>
    <p style="color: var(--q-text); text-align: center; font-size: 30px;">{{ product.name }}</p>
    <div>
        <img src="./components/assets/largelogo.png" alt="">
    </div>
    <div><p v-for="tag in product.tags"> #{{ tag }}</p></div>
    <p>{{ product.description }} Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquam et animi, impedit excepturi omnis amet voluptate dolor tempora molestiae, quasi harum illo! Ipsam alias voluptatum neque esse sint minima reiciendis.
    Placeat, sed? Molestias consectetur excepturi optio ipsam neque, quas quisquam maxime, unde, expedita illum autem! Similique aspernatur labore dignissimos necessitatibus itaque. Totam voluptates labore dignissimos dicta error similique aliquam fugit.
    Eaque, dolore repellat! Dolores voluptate nisi veritatis, illo quibusdam ab harum dignissimos doloremque provident corporis inventore laudantium voluptates esse error! Iusto dolorum, magni repellendus sint sunt vel mollitia deserunt quis.
    Quasi, consequuntur! Quae incidunt architecto facere voluptas quia perferendis quod molestias odit laboriosam provident. Rerum tenetur porro, minima voluptatibus, natus blanditiis necessitatibus officia obcaecati omnis dolore veritatis, dolores excepturi quibusdam.
    Ut et nihil aliquid, alias illum minima dicta nam necessitatibus iure pariatur fugiat, minus vero ipsa dolore. Quis iste reiciendis ut officia sint? Quasi accusantium architecto quos consectetur nulla ad.
    Et placeat nobis perspiciatis at beatae commodi praesentium quisquam porro omnis repudiandae maiores ab consectetur animi eveniet eligendi, quas iste sapiente vero modi pariatur exercitationem numquam eum. Culpa, aspernatur adipisci.
    Ratione laboriosam perferendis aspernatur itaque delectus nulla dolore beatae facilis illum autem quo, sint sunt provident nesciunt natus laborum adipisci aut consequatur numquam reiciendis ab veritatis reprehenderit. Fugit, incidunt ipsam!
    Unde quis, aspernatur dolor labore distinctio fuga vel ab? Odio dignissimos sequi totam esse recusandae eius doloremque labore neque! Nostrum in dolore quaerat assumenda accusamus laudantium, consequuntur ipsum architecto officia.
    Impedit aliquid consequuntur sunt provident quidem praesentium optio! Iusto illum quo voluptatum ex, qui, veritatis, vitae autem corporis nihil fugiat odio doloremque accusamus consequuntur dolor itaque odit maiores nam! Officiis?
    Obcaecati vero accusantium iure esse. Similique excepturi consequuntur dolores ipsam illo? Corporis, enim impedit deserunt nisi perspiciatis neque nihil vitae saepe at ullam harum minus qui veniam voluptatum dicta expedita?
    </p>
    <q-btn @click="toBasket()" :label="'В корзину  '+formattedPrice()"></q-btn>
    <q-input v-model="count" v-if="inBasket" label="Введите количество"></q-input>
</template>


<script>

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


import requester from 'src/boot/requester';
import {ref} from "vue"
export default{
    data(){
        return{
            product:ref(Object),
            count,
        }
    },
    async created(){
       this.product = await requester("GET","products/"+this.$route.query.id)
    },
    methods:{
        async toBasket(){
            await requester("POST","basket/addProduct",{
                productCount:this.count,
                productId:this.product.id
            })
        },
        formattedPrice() {
                let res = 0;
                let reversedPrice = this.product.price.toString().split("").reverse().join("")//Еблан почему-то не принимает если я передаю цену из html аргументом в функцию
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