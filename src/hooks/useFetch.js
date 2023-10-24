import { useQuery } from '@tanstack/react-query'


export  function useFetch() {
  return useQuery({
    queryKey:["Images"],
    queryFn:()=>{
       return fetch("https://api.unsplash.com/photos/random?client_id=k5CX2l8_63cFXxvUergOw5IvfElHZszQCoDqS_S34og")
       .then(res=>res.json())
    }
})
}
