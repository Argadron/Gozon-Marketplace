<template>
    <div style="padding: 15px;" class="flex">
    <q-avatar size="5vw">
        <img src="./components/assets/largelogo.png" alt="">
    </q-avatar>
    <p style="margin-left:5px;font-size:25px; color: var(--q-text);">{{ username }}</p>
    </div>

    <h3 style="margin:0; text-align: center;">Корзина</h3>
    <p>Напрягите воображение, и представьте,что тут корзина </p>
</template>
<script>
import requester from 'src/boot/requester'
export default{
    data(){
        return{
            username:'',

        }
    },
    async mounted(){
        if(!localStorage.accessToken){
            window.location.href = "/login"
            return
        }   
        const res = await requester.requester("GET","users/getProfile")
        this.username = res.username

        //const file = await requester.requester("GET","users/getProfilePhoto")

        
    }
}

</script>