const API  = 'http://localhost:3000/api/'
const HEADERS = {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer `+localStorage.accessToken        
                }

import axios, {AxiosResponse} from 'axios';

import catchError from "./errors"
export default async function requeter (method: "GET" | "POST" | "PUT" | "DELETE", url:string, body:Object){
  try{
     let res = axios[method.toLowerCase()](API+url, body? body : {headers : HEADERS, credentials: "include"}, { headers: HEADERS, credentials: "include" }, ).then((res:AxiosResponse)=>{
      return res.data
     })
     return res
  }catch(e:any){
    if(e.response?.data?.message === 'Access Token Invalid'){
      const res = await axios.get(`${API}auth/refresh`,{  
                                headers:{
                                  "Content-Type":"application/json",
                                  "Authorization":"Bearer "+localStorage.refreshToken
                                  }
                                })

      localStorage.accessToken = res.data.accessToken
      localStorage.refreshToken = res.data.refreshToken
      await requeter(method,url,body)
      return
    }else{
      console.log(e)
      return catchError(e)
    }

  }
}
