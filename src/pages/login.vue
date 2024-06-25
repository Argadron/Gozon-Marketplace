<template>
  <q-page class="flex flex-center">
    <q-card style="display: grid;flex-direction:column;" class="my-16 max-w-sm card">
      <q-card-section style="display: grid;">
          <div style="width: 100%;display: flex; flex-direction: column; justify-content: center; align-self: center;">
              <q-input v-model="username" label="Логин/телефон/почта" />
              <q-input v-model="password" label="Пароль" type="password" />
              <q-btn  @click = "join" label="Войти" color="primary" />
              <a style="text-decoration: none; color: var(--q-text ); margin-top: 10px; text-align: center;" href="register">Я ещё не зарегестрировался...</a>
          </div>
      </q-card-section>



    </q-card>
  </q-page>
</template>

<script>
import requester from 'src/boot/requester';
export default {
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    async join() {
        let request={
            username: this.username,
            password: this.password,
        }
        console.log(request)
        let res = await requester.requester("POST","auth/login",request)
        console.log(res)

        localStorage.accessToken = res.access;
        localStorage.refreshToken  = res.refresh;
        window.href = "/"
      }
  }
};
</script>
<style>
.card{
  width:30vw; height: 50vh;
}
.q-input{
  padding: 5px;
  border-color: var(--q-dark);
}
.q-input:hover{
  padding: 5px;
  border-color: var(--q-dark);
}
.q-input:focus{
  padding: 5px;
  border-color: var(--q-dark);
}
</style>


