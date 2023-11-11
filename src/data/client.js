import { createClient } from 'pexels'
export const client = createClient('WOoM2JZpjLLERoU7VozswwS1EfF9c6zq14zzmlVikGB5Oii93KGWmtBJ');


export function getSingleImage(id,container,error){
    client.photos.show({id}).then(resp=>
        container({
        id:resp.id,
        alt:resp.alt,
        src:resp.src.large2x,
        photographer:resp.photographer
    })).catch(err=>error(err.message))
}