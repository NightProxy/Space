// Typewriting effect 
var TxtType = function (el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = "";
    this.tick();
    this.isDeleting = false;
};

TxtType.prototype.tick = function () {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">' + this.txt + "</span>";

    var that = this;
    var delta = 200 - Math.random() * 100;

    if (this.isDeleting) {
        delta /= 2;
    }

    if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
    } else if (this.isDeleting && this.txt === "") {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
    }

    setTimeout(function () {
        that.tick();
    }, delta);
};

window.onload = function () {
    var elements = document.getElementsByClassName("typewrite");
    for (var i = 0; i < elements.length; i++) {
        var toRotate = elements[i].getAttribute("data-type");
        var period = elements[i].getAttribute("data-period");
        if (toRotate) {
            new TxtType(elements[i], JSON.parse(toRotate), period);
        }
    }
    // INJECT CSS
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML =
        ".typewrite > .wrap { border-right: 0.06em solid #a04cff}";
    document.body.appendChild(css);
};

// UV INPUT FORM 
const address = document.getElementById("gointospace");

const proxySetting = localStorage.getItem("proxy") ?? 'uv'; // Using nullish coalescing operator for default value

const swConfig = {
    'uv': { file: '/!/sw.js', config: __uv$config }
};

const { file: swFile, config: swConfigSettings } = swConfig[proxySetting] ?? { file: '/uv.js', config: __uv$config };

// Search function definition
function search(input) {
    input = input.trim();
    const searchTemplate = localStorage.getItem("search") || 'https://google.com/search?q=%s';

    try {
        return new URL(input).toString();
    } catch (err) {
        try {
            const url = new URL(`http://${input}`);
            if (url.hostname.includes(".")) {
                return url.toString();
            }
            throw new Error('Invalid hostname');
        } catch (err) {
            return searchTemplate.replace("%s", encodeURIComponent(input));
        }
    }
}
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(swFile, { scope: swConfigSettings.prefix })
        .then(async (registration) => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
            document.getElementById("gointospace").addEventListener('keydown', function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    let encodedUrl = swConfigSettings.prefix + __uv$config.encodeUrl(search(document.getElementById("gointospace").value));
                    localStorage.setItem("input", document.getElementById("gointospace").value);
                    localStorage.setItem("output", encodedUrl);
                    document.querySelectorAll(".spinnerParent")[0].style.display = "block"
                    document.querySelectorAll(".spinner")[0].style.display = "block"
                    document.getElementById("gointospace").style.display = "none"
                    document.querySelectorAll(".search-header__icon")[0].style.display = "none"
                    document.getElementById('intospace').src = encodedUrl;
                    document.getElementById('intospace').style.display = 'block';

                }
            });
        })
        .catch((error) => {
            console.error('ServiceWorker registration failed:', error);
        });
}