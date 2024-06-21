<template>
  <q-layout view="lHr LpR lFr">
      
      <q-header elevated class="bg-primary text-white">
          <q-toolbar>
              <q-toolbar-title class="flex items-center" :class="{'justify-between': $q.screen.lt.sm}">
                  <img src="../assets/logo.png"/>
                  
                  <p v-if="!$q.screen.lt.sm">
                    GOZON
                  </p>
                  <q-btn round dense flat icon="person_outline" class="text-white cursor-pointer" @click="goToProfile()"></q-btn>
              </q-toolbar-title>
              
          </q-toolbar>
          
      </q-header>
      
      
      <q-page-container>
          <router-view />
      </q-page-container>
  
  </q-layout>
</template>

<script setup>
import {ref, onMounted, watch} from 'vue'
import {useRouter} from "vue-router";

import { useQuasar } from 'quasar'
const $q = useQuasar()

const isMiniDrawer = ref($q.screen.lt.md);

const isDrawerOpen = ref(true);
const toggleLeftDrawer = () => {
  
  if ($q.screen.lt.sm) {
      isDrawerOpen.value = false
      return
  }
  
  isMiniDrawer.value = !isMiniDrawer.value
};

const menuList = [
{
      icon: 'fa-solid fa-calendar-days',
      label: 'Расписание',
      to: '/schedule'
  },
  {
      icon: 'done',
      label: 'Посещения',
      to: '/visits'
  },
  {
      icon: 'fas fa-user',
      label: 'Ученики',
      to: '/students'
  },
  {
      icon: 'send',
      label: 'Педагоги',
      to: '/teachers'
  },
  {
      icon: 'business_center',
      label: 'Занятия',
      to: '/lessons'
  },
];

const router = useRouter()

watch(() => $q.screen.width, newValue => {
  if ($q.screen.gt.xs) {
      isDrawerOpen.value = true
  }
  else {
      isMiniDrawer.value = true
  }
});

onMounted(() => {
  isDrawerOpen.value = $q.screen.gt.xs
  try {
      const routeName = localStorage.getItem('prevRoute')
      console.log(routeName)
      if (routeName) {
          router.push({
              name: routeName,
          });
      }
  }
  catch (e) {
      router.push({
          name: RouterPages.SCHEDULE,
      });
  }
})

</script>

<style>
p{
  margin: 0;
  margin-left: 15px;
}
.q-toolbar{
  padding: 0;
}
</style>