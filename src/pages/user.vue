<template>

</template>
<script>
export default{
    mounted(){
        if(!localStorage.acessToken){
            window.location.href = "/login"
        }
    }
}

</script>