const photo = document.querySelector('#photo');
const edit = document.querySelector('.edit');
const forInp = document.querySelector('#forInp');
const autoplay = document.querySelector('.autoplay');
const on = document.querySelector('#on');
const off = document.querySelector('#off');
const buttons = document.querySelector('#buttons');
const title = document.querySelector('#title');
const text = document.querySelector('#text');
const info = document.querySelector('#info');
const gallery = document.querySelector('.gallery');
const fade = document.querySelector('.fade');
const carousel = document.querySelector('.carousel');
forFade();
function forFade() {
    if (photo.style.display != "none") {
        fetch("http://localhost:7777/slides/")
            .then(data => data.json())
            .then(data => {
                data.forEach((elem) => {
                    gallery.innerHTML += `<img class="gallery-cell" src=img/${elem.src}>`
                })
                gallery.innerHTML += `<img class="gallery-cell" src=img/${data[0].src}>`
                gallery.innerHTML += `<img class="gallery-cell" src=img/${data[1].src}>`
                gallery.innerHTML += `<img class="gallery-cell" src=img/${data[2].src}>`
                gallery.innerHTML += `<img class="gallery-cell" src=img/${data[3].src}>`
                gallery.firstElementChild.classList.add("scale");
                return data;
            })
            .then(data => slider(data))
        function slider(data) {
            const galleryArr = document.querySelectorAll('.gallery-cell');
            let i = -1;
            let count = 0;
            let memoryIndex;
            let slide = setInterval(forInterval, 3000);
            function forInterval() {
                if (photo.style.display != "none") {
                    if (i === data.length - 1) {
                        i = 0;
                    } else {
                        i++;
                    }
                    photo.src = `img/${data[i].src}`;
                    info.firstElementChild.firstElementChild.textContent = data[i].title;
                    info.firstElementChild.lastElementChild.textContent = data[i].text;
                } else {
                    if (count >= -gallery.parentElement.scrollWidth) {
                        count -= 255;
                    } else {
                        count = 0;
                    }
                    gallery.style.transform = `translateX(${count}px)`;
                    galleryArr.forEach((elem, index) => {
                        if (elem.offsetLeft == -1 * count) {
                            elem.classList.add("scale");
                            elem.style.opacity = "100%";
                            info.firstElementChild.firstElementChild.textContent = data[index].title;
                            info.firstElementChild.lastElementChild.textContent = data[index].text;
                            memoryIndex = index;
                        } else {
                            elem.classList.remove("scale");
                            elem.style.opacity = "50%";
                        }
                    })
                }
            }
            edit.addEventListener("click", () => {
                clearInterval(slide);
                edit.classList.toggle("forEdit")
                if (forInp.style.display == "inline-block") {
                    forInp.style.display = "none";
                    forInp.parentElement.style.zIndex = "-1"
                    if (on.classList.contains("onclass")) {
                        slide = setInterval(forInterval, 3000)
                    }
                } else {
                    forInp.parentElement.style.zIndex = "2"
                    forInp.style.display = "inline-block";
                }
            })
            off.addEventListener("click", (e) => {
                clearInterval(slide);
                buttons.style.display = "flex";
                off.classList.add("offclass")
                on.classList.remove("onclass")
            })
            buttons.lastElementChild.addEventListener("click", () => {
                if (photo.style.display != "none") {
                    if (i >= data.length - 1) {
                        i = 0;
                    } else {
                        i++;
                    }
                    photo.src = `img/${data[i].src}`;
                    info.firstElementChild.firstElementChild.textContent = data[i].title;
                    info.firstElementChild.lastElementChild.textContent = data[i].text;
                } else {
                    if (count < 0) {
                        count += 255;
                        gallery.style.transform = `translateX(${count}px)`;
                        galleryArr.forEach((elem, index) => {
                            if (elem.offsetLeft == -1 * count) {
                                elem.classList.add("scale");
                                elem.style.opacity = "100%";
                                info.firstElementChild.firstElementChild.textContent = data[index].title;
                                info.firstElementChild.lastElementChild.textContent = data[index].text;
                                memoryIndex = index;
                            } else {
                                elem.classList.remove("scale");
                                elem.style.opacity = "50%";
                            }
                        })
                    }
                }
            })
            buttons.firstElementChild.addEventListener("click", () => {
                if (photo.style.display != "none") {
                    if (i <= 0) {
                        i = data.length - 1;
                    } else {
                        i--;
                    }
                    photo.src = `img/${data[i].src}`;
                    info.firstElementChild.firstElementChild.textContent = data[i].title;
                    info.firstElementChild.lastElementChild.textContent = data[i].text;
                } else {
                    if (count >= -gallery.parentElement.scrollWidth) {
                        count -= 255;
                    } else {
                        count = 0;
                    }
                    gallery.style.transform = `translateX(${count}px)`;
                    galleryArr.forEach((elem, index) => {
                        if (elem.offsetLeft == -1 * count) {
                            console.log(elem);
                            elem.classList.add("scale");
                            elem.style.opacity = "100%";
                            info.firstElementChild.firstElementChild.textContent = data[index].title;
                            info.firstElementChild.lastElementChild.textContent = data[index].text;
                            memoryIndex = index;
                        } else {
                            elem.classList.remove("scale");
                            elem.style.opacity = "50%";
                        }
                    })
                }
            })
            on.addEventListener("click", () => {
                buttons.style.display = "none";
                off.classList.remove("offclass")
                on.classList.add("onclass")
                slide = setInterval(forInterval, 3000)
            })
            forInp.lastElementChild.addEventListener("submit", async (e) => {
                e.preventDefault();
                slide = setInterval(forInterval, 3000);
                await fetch(`http://localhost:7777/slides/${photo.style.display != "none" ? i + 1 : memoryIndex + 1}`, {
                    method: "PATCH",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({
                        title: title.value == "" ? info.firstElementChild.textContent : title.value,
                        text: text.value == "" ? info.lastElementChild.textContent : text.value
                    })
                })
                info.firstElementChild.textContent = title.value;
                info.lastElementChild.textContent = text.value;
                forInp.style.display = "none";
            })
            fade.addEventListener("click", () => {
                gallery.style.display = "none";
                photo.style.display = "block";
                info.style.alignItems = "center";
                fade.classList.add("select");
                carousel.classList.remove("select");
                clearInterval(slide)
                if (buttons.style.display != "flex") {
                    slide = setInterval(forInterval, 3000)
                }
            })
            carousel.addEventListener("click", () => {
                fade.classList.remove("select");
                carousel.classList.add("select");
                gallery.style.display = "flex";
                photo.style.display = "none";
                info.style.alignItems = "flex-start";
                clearInterval(slide)
                if (buttons.style.display != "flex") {
                    slide = setInterval(forInterval, 3000)
                }
            })
        }
    }
}