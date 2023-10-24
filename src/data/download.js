export function downloadImage(url,imageName,state){
    state(true)
    fetch(url)
    .then(resp=>resp.blob())
    .then(res =>{
        let file = URL.createObjectURL(res)
        let a = document.createElement("a")
        a.href = file
        a.download = `image ${imageName}`
        a.click()
        a.remove()
        setTimeout(() => {
            state(false)
        }, 2000);
    })
}