// 019.js

// Dynamically import BrowserFS
(function() {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/BrowserFS/2.0.0/browserfs.min.js";
    script.integrity = "sha512-mz0EI+Ay1uIJP7rZEX8C/JlTAcHRIQ8Sny4vxmmj8MSzDJgG9NxxY2pUmOGv1lO7imFIFMyjjCzEXEywNgaUdQ==";
    script.crossOrigin = "anonymous";
    script.referrerPolicy = "no-referrer";
    script.onload = init;
    document.head.appendChild(script);
})();

function init() {
    // Configure BrowserFS to use IndexedDB for persistent storage
    BrowserFS.configure({ fs: "IndexedDB", options: {} }, function(err) {
        if (err) return console.error(err);

        const fs = BrowserFS.BFSRequire('fs');
        const profileFile = '/profile.json';
        let profileLogs = [];

        // Initialize file if it doesn't exist
        if (!fs.existsSync(profileFile)) {
            fs.writeFileSync(profileFile, JSON.stringify(profileLogs, null, 2));
        } else {
            try {
                profileLogs = JSON.parse(fs.readFileSync(profileFile, 'utf8'));
            } catch (e) {
                profileLogs = [];
            }
        }

        function logProfile(status) {
            const entry = {
                name: "default",
                status: status,
                timestamp: new Date().toISOString()
            };
            profileLogs.push(entry);

            // Update the file
            fs.writeFile(profileFile, JSON.stringify(profileLogs, null, 2), err => {
                if (err) console.error(err);
            });

            console.log(JSON.stringify(entry, null, 2));
        }

        function profileCycle() {
            console.profile("default");
            logProfile("started");

            setTimeout(() => {
                console.profileEnd("default");
                logProfile("ended");

                // repeat almost immediately
                setTimeout(profileCycle, 10);
            }, 10); // profile duration
        }

        // start the loop
        profileCycle();
    });
}
