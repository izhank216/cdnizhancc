(function () {
    function Loader(options) {
        if (options.loader !== "enabled") throw new Error("Loader needs to be enabled inorder to set the HTML configuration.")
        this.blockScripts = options.blockScripts || false
        this.blockXSS = options.blockXSS || false
        this.blockHacks = options.blockHacks || false
        this.corsProxy = options.corsProxy !== false
        this.proxyURL = "https://api.allorigins.win/raw?url="
    }

    Loader.fromDocument = function () {
        var el = document.querySelector("meta[name='loader-settings']")
        if (!el) throw new Error("Loader needs to be enabled inorder to set the HTML configuration.")
        return new Loader({
            loader: "enabled",
            blockScripts: el.getAttribute("data-block-scripts") === "true",
            blockXSS: el.getAttribute("data-block-xss") === "true",
            blockHacks: el.getAttribute("data-block-hacks") === "true",
            corsProxy: el.getAttribute("data-cors-proxy") !== "false"
        })
    }

    Loader.prototype.sanitize = function (input) {
        var out = input
        if (this.blockScripts) out = out.replace(/<\s*script.*?>.*?<\s*\/script\s*>/gi, "")
        if (this.blockXSS) out = out.replace(/on\w+=/gi, "").replace(/javascript:/gi, "")
        if (this.blockHacks) out = out.replace(/</g, "").replace(/>/g, "")
        return out
    }

    Loader.prototype.protectDOM = function () {
        if (this.blockScripts) {
            var scripts = Array.from(document.querySelectorAll("script[data-allow!='true']"))
            scripts.forEach(function (s) { s.remove() })
        }
    }

    Loader.prototype.fetch = function (url, options) {
        if (this.corsProxy) return window.fetch(this.proxyURL + encodeURIComponent(url), options)
        return window.fetch(url, options)
    }

    window.IzhanLoader = Loader
})();
