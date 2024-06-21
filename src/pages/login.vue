<template>
    <q-page class="flex flex-center">
      <q-card style="display: grid;flex-direction:column;width:30vw; height: 50vh;" class="my-16 max-w-sm">
        <q-card-section style="display: grid;">
            <div style="width: 100%;display: flex; flex-direction: column; justify-content: center; align-self: center;">
                <q-input outlined v-model="username" label="Пользовательское имя" />
                <q-input outlined v-model="password" label="Пароль" type="password" />
                <q-btn label="Войти" color="primary" />
            </div>
        </q-card-section>



      </q-card>
    </q-page>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: '',
        password: ''
      };
    },
    methods: {
      handleSubmit() {
        // Логика отправки формы
        console.log('Username:', this.username);
        console.log('Password:', this.password);
      }
    }
  };
  </script>
<style>
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