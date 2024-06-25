<template>
  <q-layout view="lHr LpR lFr">
      
      <q-header elevated class="bg-primary text-white">
          <q-toolbar>
              <q-toolbar-title class="flex items-center" :class="{'justify-between': $q.screen.lt.sm}">
                    <img class="cursor-pointer" @click="toMain" src="../assets/logo.png"/>
                    <p class="cursor-pointer" @click="toMain" v-if="!$q.screen.lt.sm">
                      GOZON
                    </p>
                    <div @click="toUser" class=" cursor-pointer" style="flex: 1 1 0%; text-align: right;">
                        <p style="display: inline;">Личный кабинет</p> <q-icon name="person_outline" class="text-white" size="30px"></q-icon>
                    </div>
              </q-toolbar-title>
              
          </q-toolbar>
          
      </q-header>
      
      
      <q-page-container>
          <router-view />
      </q-page-container>
  
  </q-layout>
</template>

<script>
export default{
    methods:{
        toUser(){
            window.location.href = "user"
        },
        toMain(){
            window.location.href = "/"
        }
    }
}

</script>

<style>
p{
  margin: 0;
 /* margin-left: 15px;*/
}
.q-toolbar{
  padding: 0;
}
</style>