const imagesArea = document.querySelector('.images')
const gallery = document.querySelector('.gallery')
const galleryHeader = document.querySelector('.gallery-header')
const searchBtn = document.getElementById('search-btn')
const sliderBtn = document.getElementById('create-slider')
const sliderContainer = document.getElementById('sliders')
const search = document.getElementById('search')
const errDiv = document.getElementById('error')
const tryAgain = document.getElementById('try-again')
const extraSliderImage = document.getElementById('extraSliderImage')
// selected image
let sliders = []

// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q'

// show images
const showImages = (images) => {
  errDiv.style.display = 'none'
  imagesArea.style.display = 'block'
  gallery.innerHTML = ''
  // show gallery title
  galleryHeader.style.display = 'flex'
  images.forEach((image) => {
    let div = document.createElement('div')
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2'
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`
    gallery.appendChild(div)
  })
}

function focusSearch() {
  search.focus()
}
const showError = (query) => {
  errDiv.innerHTML = `<h2>Your <span> ${query} </span> this result dose not found</h2>
  <p> Please <a onclick=focusSearch()  id='try-again'>Try Again </a> </p>`
  errDiv.style.display = 'block'
  document.querySelector('.images').style.display = 'none'
}
const getImages = (query) => {
  fetch(
    `https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`,
  )
    .then((response) => response.json())
    .then((data) => {
      let imagesData = data.hits
      if (imagesData.length >= 1) {
        showImages(imagesData)
      } else {
        showError(query)
      }
    })
    .catch((err) => console.log(err))
}

let slideIndex = 0
const selectItem = (event, img) => {
  let element = event.target
  element.classList.add('added')

  let item = sliders.indexOf(img)
  if (item === -1) {
    sliders.push(img)
  } else {
    if (confirm('You Want To Deselect this img')) {
      sliders.splice(item, 1)
      console.log(img)
      element.classList.remove('added')
    }
  }
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return
  }

  // crate slider previous next area
  sliderContainer.innerHTML = ''
  const prevNext = document.createElement('div')
  prevNext.className =
    'prev-next d-flex w-100 justify-content-between align-items-center'
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `

  let duration = +document.getElementById('duration').value

  if (duration < 1000) {
    alert(
      `Please Input Value More Than 1000 Your Input Value ${duration} Is Not Allow Default Input Value is 1000 Counted`,
    )
    console.log(duration)
    duration = 1000
  } else {
    duration = duration
  }
  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block'
  // hide image aria
  imagesArea.style.display = 'none'

  sliders.forEach((slide) => {
    let item = document.createElement('div')
    item.className = 'slider-item'
    item.innerHTML = `<img class="w-100"
      src="${slide}"
      alt="">`
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++
    changeSlide(slideIndex)
  }, duration)
}

// change slider index
const changeItem = (index) => {
  changeSlide((slideIndex += index))
}

// change slide item
const changeSlide = (index) => {
  const items = document.querySelectorAll('.slider-item')
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex
  }

  if (index >= items.length) {
    index = 0
    slideIndex = 0
  }

  items.forEach((item) => {
    item.style.display = 'none'
  })

  items[index].style.display = 'block'
}
function getResult() {
  document.querySelector('.main').style.display = 'none'
  clearInterval(timer)
  if (search.value == '') {
    alert('Please Input for result')
    search.focus()
  } else {
    getImages(search.value)
  }

  sliders.length = 0
  search.value = ''
}
searchBtn.addEventListener('click', getResult)
search.addEventListener('keyup', function (e) {
  if (e.keyCode == 13) {
    getResult()
  }
})
sliderBtn.addEventListener('click', function () {
  createSlider()
})
// Extra Slider Image Selection
extraSliderImage.addEventListener('click', function () {
  imagesArea.style.display = 'block'
  document.querySelector('.main').style.display = 'none'
})
