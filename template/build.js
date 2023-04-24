'use strict';

function createNavicatBlob(ConnectionName, ConnType, Host, Port, UserName) {
    return new Blob([`<?xml version="1.0" encoding="UTF-8"?>
<Connections Ver="1.5">
	<Connection ConnectionName="${ConnectionName}" ProjectUUID="" ConnType="${ConnType}" OraConnType="" ServiceProvider="Default" Host="${Host}" Port="${Port}" Database="" OraServiceNameType="" TNS="" MSSQLAuthenMode="" MSSQLAuthenWindowsDomain="" DatabaseFileName="" UserName="${UserName}"  SessionLimit="0" ClientCharacterSet="" ClientEncoding="65001" Keepalive="false" KeepaliveInterval="240" Encoding="65001" MySQLCharacterSet="true" Compression="false" AutoConnect="false" NamedPipe="false" NamedPipeSocket="" OraRole="" OraOSAuthen="false" UseAdvanced="false" SSL="false" SSL_Authen="false" SSL_PGSSLMode="REQUIRE" SSL_ClientKey="" SSL_ClientCert="" SSL_CACert="" SSL_Clpher="" SSL_PGSSLCRL="" SSL_WeakCertValidation="false" SSL_AllowInvalidHostName="false" SSL_PEMClientKeyPassword="" SSH="false" SSH_Host="" SSH_Port="22" SSH_UserName="" SSH_AuthenMethod="PASSWORD" SSH_PrivateKey="" SSH_Compress="false" HTTP="false" HTTP_URL="" HTTP_PA="" HTTP_PA_UserName="" HTTP_EQ="" HTTP_CA="" HTTP_CA_ClientKey="" HTTP_CA_ClientCert="" HTTP_CA_CACert="" HTTP_Proxy="" HTTP_Proxy_Host="" HTTP_Proxy_Port="" HTTP_Proxy_UserName="" Compatibility="false" Compatibility_OverrideLowerCaseTableNames="false" Compatibility_LowerCaseTableNames="" Compatibility_OverrideSQLMode="false" Compatibility_SQLMode="" Compatibility_OverrideIsSupportNDB="false" Compatibility_IsSupportNDB="false" Compatibility_OverrideDatabaseListingMethod="false" Compatibility_DatabaseListingMethod="" Compatibility_OverrideViewListingMethod="false" Compatibility_ViewListingMethod=""/>
</Connections>`], { type: "text/ncx" });
}

function createOtherBlob(template, type) {
    console.log(template);
    console.log(type);
    return new Blob([template], { type: type });
}

//弹出一个输入框 一个多行文本 输入模版信息，一个输入文本 输入文件后缀 boostrap 样式
function createSelect(ConnectionName, ConnType, Host, Port, UserName, Password) {
    //input-group
    var div = document.createElement("div");
    div.className = "input-group";
    div.id = "input-group";

    div.innerHTML = `<div class="input-group-prepend">
    <span class="input-group-text" id="inputGroup-sizing-default">模版信息</span>
    </div>
    <textarea class="form-control" aria-label="With textarea" id="template" style="height: 100px;"></textarea>
    <div class="input-group-prepend">
    <span class="input-group-text" id="inputGroup-sizing-default">文件后缀</span>
    </div>
    <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" id="suffix">`;

    // 增加两个按钮 一个确定一个保存
    var btnGroup = document.createElement("div");
    btnGroup.className = "btn-group";
    btnGroup.id = "btn-group";
    btnGroup.innerHTML = `<button type="button" class="btn btn-primary" id="save">保存</button>
    <button type="button" class="btn btn-primary" id="confirm">确定</button>`;
    div.appendChild(btnGroup);

    // 弹出
    var modal = document.createElement("div");
    modal.className = "modal fade";
    modal.id = "myModal";
    modal.setAttribute("tabindex", "-1");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-labelledby", "exampleModalLabel");
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `<div class="modal-dialog" role="document">
    <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">自定义导出连接信息</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="inputGroup-sizing-default">模版信息</span>
                </div>
                <textarea class="form-control" aria-label="With textarea" id="template" style="height: 100px;"></textarea>  
           </div>
           <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="inputGroup-sizing-default">文件后缀</span>
                </div>
                <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" id="suffix">
            </div>
        </div>
        <div class="modal-footer">
            <div class="btn-group btn-group-xs" role="group">
                <button type="button" class="btn btn-primary btn-sm" id="exmple-json">json格式案例</button>
            </div>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" id="save">确定</button>
        </div>
              
    </div>
</div>`;

    // 显示弹出框
    document.body.appendChild(modal);
    $("#myModal").modal("show");


    //获取模版信息
    var template = document.getElementById("template");
    // 获取输入内容
    var suffix = document.getElementById("suffix");
    // 获取保存按钮
    var save = document.getElementById("save");

    // 获取缓存 模版信息
    chrome.storage.sync.get("templateInfo", function (result) {
        if (result.templateInfo) {
            template.value = result.templateInfo.template;
            suffix.value = result.templateInfo.suffix;
        }
    });


    //当点击json格式案例按钮时
    var exmpleJson = document.getElementById("exmple-json");
    exmpleJson.addEventListener("click", function () {
        // 模版信息
        template.value = `{
    "connectionName": "\${ConnectionName}",
    "connType": "\${ConnType}",
    "host": "\${Host}",
    "port": "\${Port}",
    "userName": "\${UserName}",
    "password": "\${Password}"
}`;
        suffix.value = "json";
    });


    // 点击确定按钮
    save.addEventListener("click", function () {
        var suffixValue = suffix.value;
        var templateValue = template.value;
        if (templateValue == "") {
            alert("模版信息不能为空");
            return;
        }
        if (suffixValue == "") {
            alert("文件后缀不能为空");
            return;
        }

        //缓存模版信息
        var templateInfo = {
            template: templateValue,
            suffix: suffixValue
        }
        chrome.storage.sync.set({ templateInfo: templateInfo }, function () {
            console.log('保存成功');
        }
        );
        //导出Navicat连接信息其他格式
        //templateValue 的值是模版信息 需要替换${} 里面的值
        templateValue = templateValue.replace("${ConnectionName}", ConnectionName);
        templateValue = templateValue.replace("${ConnType}", ConnType);
        templateValue = templateValue.replace("${Host}", Host);
        templateValue = templateValue.replace("${Port}", Port);
        templateValue = templateValue.replace("${UserName}", UserName);
        var blob = createOtherBlob(templateValue, `text/${suffixValue}`);
        chrome.runtime.sendMessage({
            action: 'download',
            url: URL.createObjectURL(blob),
            filename: ConnectionName,
            suffix: suffixValue
        });
        copyPwd(Password);

        // 关闭弹出框
        $("#myModal").modal("hide");
    });
};


function removeInput() {
    var div = document.getElementsByClassName("modal-body")[1];
    if (div) {
        // id 为 otherTemplate 的移除
        var otherTemplate = document.getElementById("otherTemplate");
        if (otherTemplate) {
            otherTemplate.remove();
        }
    }
    return div;
}

function copyPwd(Password) {
    Password = Password.trim();
    navigator.clipboard.writeText(Password).then(function () {
        var div = document.createElement("div");
        div.className = "position-fixed bottom-0 right-0 p-3";
        div.style = "position: absolute; top: 0; right: 0";

        var toast = document.createElement("div");
        toast.className = "toast show";
        toast.role = "alert";
        toast.setAttribute("aria-live", "assertive");
        toast.setAttribute("aria-atomic", "true");
        toast.setAttribute("data-delay", "2000");

        var toastHeader = document.createElement("div");
        toastHeader.className = "toast-header";

        var strong = document.createElement("strong");
        strong.className = "mr-auto text-primary";
        strong.innerText = "导出成功";

        var toastBody = document.createElement("div");
        toastBody.className = "toast-body";
        toastBody.innerText = "密码已复制到剪切板";


        var button = document.createElement("button");
        button.type = "button";
        button.className = "ml-2 mb-1 close";
        button.setAttribute("data-dismiss", "toast");
        button.setAttribute("aria-label", "Close");

        var span = document.createElement("span");
        span.setAttribute("aria-hidden", "true");
        span.innerHTML = "&times;";
        button.appendChild(span);

        toastHeader.appendChild(strong);
        toastHeader.appendChild(button);

        toast.appendChild(toastHeader);
        toast.appendChild(toastBody);


        div.appendChild(toast);

        document.body.appendChild(div);

        // 3秒后移除
        setTimeout(function () {
            div.remove();
        }, 3000);

        


        console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    }
    );
}
