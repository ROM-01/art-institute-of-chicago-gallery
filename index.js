const name1 = document.createElement("div")
const body = document.getElementsByTagName('body')[0]

body.appendChild(name1)


fetch("https://api.artic.edu/api/v1/artworks/86912").then(response => {
    if (!response.ok) {
        throw new Error('Request failed')
    } return response.json()
})
.then(art => {
    console.log(art)
    name1.innerText = art.data.title

})
.catch(error => {
    console.error('Error:', error)
})