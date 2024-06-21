require('dotenv').config();
import axios from './axios';
export default{
    async requester(url,method, body){
        switch(method){
          case "GET":
            try{

              const request = await axios.get(url,{headers:{
                  "Content-Type": "application/json",
                  'Authorization': `Bearer ${localStorage.getItem('accessToken')}`          
                }
              })

              return request.data

            }catch(e){        
              if (e.response?.data?.message === 'Access Token Invalid'){
                await this.refresh()
                this.requester(url,method,body)

                break
              }
            }
          case "POST":
          try{
            const request = await axios.post(url,{
              body:body,
              headers:{
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`          
              }
            })       
            return request.data
          }catch(e){        
            if (e.response?.data?.message === 'Access Token Invalid'){
              await this.refresh()
              this.requester(url,method,body)
              break
            }
          }
        }
    },
    async refresh(){
        const res = await axios.get(`${process.env.API}auth/refresh`,{  
          headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.refreshToken
            }
          })

          localStorage.accessToken = res.data.accessToken
          localStorage.refreshToken = res.data.refreshToken
    }
}