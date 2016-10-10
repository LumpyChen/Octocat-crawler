import fs from 'fs'
import fetch from "isomorphic-fetch"
import cheerio from "cheerio"

const baseUrl = "https://octodex.github.com",
  dir = "./images/"

fetch(baseUrl)
  .then((res) => res.text())
  .then((out) => {
    let $ = cheerio.load(out),
      urlArr = []
    $(".preview-image img").each((i, ele) => {
      let src = ele.attribs["data-src"]
      console.log(`Get image path: ${ele.attribs["data-src"]}`)
      urlArr.push(src)
    })
    return urlArr
}).then((arr) => {
    const setFetch = (url, i) => {
      setTimeout(() => {
        fetch(baseUrl+url)
          .then((res) => res.buffer())
          .then((data) => {
            const fileName = url.split('/').slice(0.-1)
            fs.writeFileSync(dir+fileName, data)
            console.log(`Download image ${i} success!`)
          }).catch((err) => {
            console.error(`Error while ${i}'s downloading!`)
            console.log('start again !')
            setFetch(url, i)
          })
      }, 1000*i)
    }
    console.log("download begins!")
    console.log(`${arr.length} images totally!`);
    arr.forEach((url, i) => {
      setFetch(url, i)
    })
  })

