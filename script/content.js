//Password
var Password;
//ConnectionName 当前日期
var ConnectionName;
//Host
var Host;
//Port  
var Port;

//UserName
var UserName;

var ConnType = "MYSQL";


// 创建一个 MutationObserver 实例
const observer = new MutationObserver((mutationsList) => {
    // 遍历每个发生变化的节点
    for (let mutation of mutationsList) {
        // 如果变化类型为子节点被添加，并且添加的节点是目标表格
        if (mutation.type === 'childList' && mutation.addedNodes[0]?.tagName === 'table') {
            // 显示按钮
            button.style.display = 'block';
            // 停止监听
            observer.disconnect();
        }
    }
});

// 监听页面 DOM 变化
observer.observe(document.body, { childList: true, subtree: true });




window.addEventListener('load', function () {
    count = 0;
    function getTableContent() {
        const table = document.getElementsByTagName("table");

        if (table[0]) {
           var newCell2 = createNavicatFile(table);

            navicatOut(newCell2);

            otherOut(newCell2);


            //循环 table[0].rows
            loopInfo(table);

            clearInterval(timer);
        }
        // 防止死循环
        if (count > 10) {
            clearInterval(timer);
        }
        count++;
    }

    // 每隔1000毫秒执行一次getTableContent函数
    const timer = setInterval(getTableContent, 1000);
});

function otherOut(newCell2) {
    const otherButton = newCell2.querySelector("#other-button");
    otherButton.addEventListener("click", function () {
        createSelect(ConnectionName, ConnType, Host, Port, UserName,Password);
    });
}

function navicatOut(newCell2) {
    // 获取newCell2 的button元素
    const button = newCell2.querySelector("#navicat-button");
    // 当navicat按钮被点击时执行以下函数
    button.addEventListener("click", function () {
        var blob = createNavicatBlob(ConnectionName, ConnType, Host, Port, UserName);
        chrome.runtime.sendMessage({
            action: 'download',
            url: URL.createObjectURL(blob),
            filename: ConnectionName,
            suffix: "ncx"
        });
        copyPwd(Password);
    });
}

function createNavicatFile(table) {
    table[0].querySelectorAll(".fa.fa-eye")[0].click();
    // 在页面中注入一个按钮
    const newRow = table[0].insertRow(-1);
    newRow.className = 'ng-star-inserted';

    //_ngcontent-har-c31
    // newRow 属性 _ngcontent-har-c31
    newRow.setAttribute("_ngcontent-har-c31", "");
    // 插入两个单元格
    const newCell1 = newRow.insertCell(-1);
    const newCell2 = newRow.insertCell(-1);

    //newRow class="title" 的单元格
    newCell1.className = 'title';
    newCell1.className = 'navicate-title';
    //text-td
    newCell2.className = 'text-td';
    // 设置单元格内容
    newCell1.innerHTML = "一键导出";
    //<button type="button" class="btn btn-primary">Primary</button>
    newCell2.innerHTML = "<button class='btn btn-primary btn-sm' id = 'navicat-button'>导出Navicat连接信息</button> <button type='button' class='btn btn-primary btn-sm' id = 'other-button'>导出其他连接信息</button>";
    newCell2.className = "button-wapper";
    return newCell2;
}

function loopInfo(table) {
    for (let i = 0; i < table[0].rows.length; i++) {
        //循环 table[0].rows[i].cells
        for (let j = 0; j < table[0].rows[i].cells.length; j++) {
            // 输出 table[0].rows[i].cells[j].innerText
            // console.log(table[0].rows[i].cells[j].innerText);
            // 只输出第二列的内容ss
            if (j == 1) {
                // 第二列的第0个数据是连接名
                if (i == 0) {
                    ConnectionName = table[0].rows[i].cells[j].innerText;
                    // 加上日期 20220101193001
                    var date = new Date();
                    var year = date.getFullYear();
                    var month = date.getMonth() + 1;
                    var day = date.getDate();
                    var hour = date.getHours();
                    var minute = date.getMinutes();
                    var second = date.getSeconds();
                    ConnectionName = ConnectionName + year + month + day + hour + minute + second;
                }
                // 第二列的第二个数据是主机名
                if (i == 1) {
                    Host = table[0].rows[i].cells[j].innerText;
                }
                // 第二列的第三个数据是端口号
                if (i == 2) {
                    Port = table[0].rows[i].cells[j].innerText;
                }
                // 第二列的第四个数据是用户名
                if (i == 3) {
                    UserName = table[0].rows[i].cells[j].innerText;
                }
                // 第二列的第五个数据是密码
                if (i == 4) {
                    Password = table[0].rows[i].cells[j].innerText;
                    table[0].querySelectorAll(".fa.fa-eye")[0].click();
                }
                // 第二列的第七个数据是连接类型
                if (i == 6) {
                    // 转为大写
                    ConnType = table[0].rows[i].cells[j].innerText.toUpperCase();
                    console.log(ConnType);
                }
            }
        }
    }
}

