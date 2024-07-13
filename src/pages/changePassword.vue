<template>
    <div class="password-reset-page">
        <div class="page-content">
            <h2>Изменение пароля</h2>
            <p>Введите ваш старый и новый пароли ниже:</p>
            <q-input v-model="oldPassword" label="Старый пароль" type="password" />
            <q-input v-model="newPassword" label="Новый пароль" type="password" />
            <q-btn @click="resetPassword" label="Сменить пароль" color="primary" />
            <p v-if="error" class="error">{{ error }}</p>
        </div>
    </div>
</template>

<script>
import requester from "src/boot/requester.ts"
export default{
    data(){
        return{
            oldPassword:"",
            newPassword:"",
            error: ""
        }
    },
    methods:{
        async resetPassword(){
            try {
                const res = await requester("POST", "auth/changePassword?urlTag="+this.$route.query.urlTag,{
                    oldPassword:this.oldPassword,
                    newPassword:this.newPassword
                })
                // Обработка успешного сброса пароля
                this.error = "Пароль успешно сброшен. Пожалуйста, войдите снова.";
            } catch (err) {
                console.error(err);
                this.error = "Произошла ошибка при смене пароля." + err;
            }
        }
    }
}
</script>

<style scoped>
.password-reset-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f9f9f9;
}

.page-content {
    width: 80%;
    max-width: 400px;
    padding: 20px;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
}

h2 {
    color: #444b36;
    margin-bottom: 10px;
}

q-input {
    margin-bottom: 20px;
}

q-btn {
    margin-top: 20px;
}

.error {
    color: red;
    margin-top: 10px;
}
</style>