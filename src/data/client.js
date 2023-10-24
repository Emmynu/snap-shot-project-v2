import { createClient } from 'pexels'
export const client = createClient('WOoM2JZpjLLERoU7VozswwS1EfF9c6zq14zzmlVikGB5Oii93KGWmtBJ');


 const months =["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
 const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

export const day = days[new Date().getDay()]
export const month = months[new Date().getMonth()]
export const time = `${new Date().getHours()}:${new Date().getMinutes()}`