<template>
  <q-layout view="lHr LpR lFr">
      
      <q-header elevated class="bg-primary text-white">
          <q-toolbar>
              <q-toolbar-title class="flex items-center" :class="{'justify-between': $q.screen.lt.sm}">
                    <img class="cursor-pointer" @click="toMain" src="../assets/logo.png"/>
                    <p style="color: white;" class="cursor-pointer" @click="toMain" v-if="!$q.screen.lt.sm">
                      GOZON
                    </p>


                    <div  style="flex: 1 1 0%; text-align: right;">
                            <q-icon size="larger" class="cursor-pointer" name="notifications" style="margin-right: 15px;" />
                            <p @click="toUser" class=" cursor-pointer"  style="display: inline; color: white;">Личный кабинет</p> 
                            <q-icon name="person_outline" class="text-white animated-icon pulse" size="30px"></q-icon>
                        
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
import io from 'socket.io-client';
import requeter from '../boot/requester';

export default{
    methods:{
        toUser(){
            window.location.href = "user"
        },
        toMain(){
            window.location.href = "/"
        }
    },
    async created(){
    //     const socket = io("http://localhost:3000", {
    //         auth: {
    //             token:localStorage.accessToken
    //         }
    //     });
    //     console.log(socket.connected)

    //    socket.emit('sendAlert',{
    //         auth: {
    //             token:localStorage.accessToken
    //         }
    //     })
       // const {alerts} = requeter("GET","users/getProfile")
        // socket.on('message',(message)=>{
        //     console.log(message)
        // })
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