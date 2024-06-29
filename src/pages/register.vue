
<template>
    <q-page class="flex flex-center">
      <q-card style="display: grid;flex-direction:column;width:30vw; height: 50vh;" class="my-16 max-w-sm">
        <q-card-section style="display: grid;">
            <div style="width: 100%;display: flex; flex-direction: column; justify-content: center; align-self: center;">
                <q-input :rules="mainRules" v-model="username" label="Логин" />
                <q-file :rules="mainRules" v-model="ava" label="Выберете фото для аватарки" type="file" />
                <q-input :rules="rulesPhone" v-model="phone" label="Телефон" />
                <q-input :rules="rulesEmail" v-model="email" label="Почта" />
                <q-input :rules="mainRules" v-model="password" label="Пароль" type="password" />
                <q-btn @click="register" label="Зарегестрироваться" color="primary" />
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
        phone:null,
        email:null,
        username: '',
        password: '',
        ava:null,
        rulesPhone:[
            value =>((/^[\d\+][\d\(\)\ -]{4,14}\d$/).test(value)||!value)||'Неверный телефон'
        ],
        rulesEmail:[
            //value=> !!value || 'Обязательно',
            value =>((/^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i).test(value)||!value)||'Неверна почта'
        ],
        mainRules:[
            value => !!value || "Обязательно"
        ]
      };
    },
    methods: {
       async register() {
        let request={
            username: this.username,
            password: this.password,
            file: this.ava,
        }
        request.phone = this?.phone
        request.email = this?.email
        console.log(request)
        let res = await requester("POST","auth/register",request)
        console.log(res)
        localStorage.accessToken = res.access;
        localStorage.refreshToken  = res.refresh;
        window.href = "/"
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