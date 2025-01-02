async function quote () {
    let res =  await fetch('https://api.quotable.io/random')
    if (res.ok) { 
        let json = await res.json();
        let quote = json.content
        let author = json.author
        console.log(quote)
        console.log(author)
        let quote_h = document.getElementById('quote')

        let el = document.createElement('p')
        let el1 = document.createElement('p')

        el.className = 'libaries'
        el1.className = 'libaries'
        el.style.color = 'red'
        el1.style.color = 'red'
        el1.style.textShadow = "2px 2px 4px rgba(207, 0, 0, 0.5)";
        el.style.textShadow = "2px 2px 4px rgba(207, 0, 0, 0.5)";
        el.innerHTML = quote
        el1.innerHTML = '@' + author

        quote_h.appendChild(el)
        quote_h.appendChild(el1)
      } 
}
