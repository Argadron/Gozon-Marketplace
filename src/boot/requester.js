const API  = 'http://localhost:3000/api/'
import axios from 'axios';
export default{
    async requester(method, url,body){
        switch(method){
          case "GET":
            try{
              console.log(localStorage.accessToken)
              const request = await axios.get(API+url,{headers:{
                  "Content-Type": "application/json",
                  'Authorization': `Bearer `+localStorage.accessToken        
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

          case "GETnoToken":
            try{
              console.log(localStorage.accessToken)
              const request = await axios.get(API+url,{headers:{
                  "Content-Type": "application/json", 
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
            const request = await axios.post(API+url,body,{
              headers:{
                "Content-Type": "application/json",
                //'Authorization': `Bearer ${localStorage.getItem('accessToken')}`          
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
        const res = await axios.get(`${API}auth/refresh`,{  
          headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.refreshToken
            }
          })

          localStorage.accessToken = res.data.accessToken
          localStorage.refreshToken = res.data.refreshToken
    }
}