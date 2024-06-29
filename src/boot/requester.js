const API  = 'http://localhost:3000/api/'
const HEADERS = {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer `+localStorage.accessToken        
                }
import axios from 'axios';
import catchError from "./errors"

export default async function(method, url, body){
  try{
    method = method.toLowerCase()
    const res =  await axios[method](API+url, body? body : {headers : HEADERS}, { headers: HEADERS })
    await console.log(res)
    return res.data
  }catch(e){
    if(e.response?.data?.message === 'Access Token Invalid'){
      const res = await axios.get(`${API}auth/refresh`,{  
                                headers:{
                                  "Content-Type":"application/json",
                                  "Authorization":"Bearer "+localStorage.refreshToken
                                  }
                                })

      localStorage.accessToken = res.data.accessToken
      localStorage.refreshToken = res.data.refreshToken

      await this(method,url,body)
      return
    }else{
      return catchError(e)
    }

  }
}