import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api',
});

API.interceptors.request.use((config)=>{
  const token = localStorage.getItem('token')
  if(token && !config.url.includes("/auth")){
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export async function getRequest(url){
  try{
    const res = await API.get(url)
    return res.data
  }catch(err){
    throw err.response?.data||err.message;
  }
};

export async function postRequest(url,data) {
  try{
    const res = await API.post(url,data)
    return res.data
  }catch(err){
    throw err.response?.data||err.message;
  }
}

export default API;