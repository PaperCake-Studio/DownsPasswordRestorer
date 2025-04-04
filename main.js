var Swal;
(async () => {
    Swal = await import("https://cdn.jsdelivr.net/npm/sweetalert2@11.17.2/+esm");
})();
if (typeof window.chrome !== "undefined") {
    document.getElementById("ext-link").href = "https://chromewebstore.google.com/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf";
}
else if (typeof window.opr !== "undefined") {
    document.getElementById("ext-link").href = "https://addons.opera.com/en/extensions/details/cors-toggle/";
}
else if (window.navigator.userAgent.indexOf("Firefox") > -1) {
    document.getElementById("ext-link").href = "https://addons.mozilla.org/en-US/firefox/addon/cors-everywhere/";
}
else {
    document.getElementById("ext-link").parentNode.textContent = "不支持的浏览器！";
}

document.getElementById("startBtn").onclick = function() {
    if (document.getElementById("username").value.split(".").length == 2) {
        if (localStorage.getItem("DM-PasswdRestore-InstalledExt") != "1") {
            Swal.default.fire({
                title: '注意',
                text: '请确保您已经安装了CORS插件。',
                icon: 'info',
                confirmButtonText: '装了',
                showDenyButton: true,
                denyButtonText: "没装",
              }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                  localStorage.setItem("DM-PasswdRestore-InstalledExt", "1");
                } else if (result.isDenied) {
                  return;
                }
              });
        }
        start(document.getElementById("username").value);
        document.getElementById("username").setAttribute("disabled", "");
        document.getElementById("startBtn").setAttribute("disabled", "");
        document.getElementById("api").setAttribute("disabled", "");
        document.getElementById("workers-count").setAttribute("disabled", "");
    }
}


function start(username) {
    document.getElementById("progress").value = 0;
    document.getElementById("testing-passwd").textContent = "正在测试的密码";
    document.getElementById("passwd-found").textContent = "找到的密码";

    var arr = username.split(".");
    var splitCaps = arr[0].charAt(0) + arr[1].charAt(0);
    var workers = [];
    var rangeList = [];

    var count = parseInt(document.getElementById("workers-count").item(document.getElementById("workers-count").selectedIndex).textContent);
    var min = 0;
    var range = 10000 / count;
    for (var i = 0; i < count; i++) {
        rangeList[i] = [min, min + range - 1];
        min += range;
    }

    for (var i = 0; i < count; i++) {
        workers.push(new Worker("worker.js"));
        workers[i].onmessage = function(e) {
            if (e.data[0] == "tested") {
                document.getElementById("testing-passwd").textContent = e.data[1];
                document.getElementById("progress").value++;
            }

            if (e.data[0] == "success") {
                workers.forEach((el) => {
                    el.terminate();
                });
                document.getElementById("passwd-found").textContent = e.data[1]
                document.getElementById("progress").value = 10000;

                
                document.getElementById("username").removeAttribute("disabled");
                document.getElementById("startBtn").removeAttribute("disabled");
                document.getElementById("api").removeAttribute("disabled");
                document.getElementById("workers-count").removeAttribute("disabled");
            }
        }

        workers[i].postMessage([username, splitCaps, rangeList[i][0], rangeList[i][1], 
            document.getElementById("api").selectedIndex == document.getElementById("api").childElementCount - 1,
            document.getElementById("reverse-check").checked]);
    }
    
}