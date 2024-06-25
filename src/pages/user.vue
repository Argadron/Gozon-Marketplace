<template>
    <div>
    <q-avatar></q-avatar>
    <h5 style="color: var(--q-text);">{{ username }}</h5>
    </div>
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