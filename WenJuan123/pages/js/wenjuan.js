var exa = new Array();
var questionAre;
var questions = new Array();
var qnum = 0;
var ws = new WebSocket('ws://localhost:3000');
exa[0] = "<div class='panel' id='";
// 这个断点添加id
exa[1] = "'><b class='question'>";
// 这个断点添加问题
exa[2] = "</b><div class='options";
exa[17] = "'>";
// 这个断点添加答案
exa[3] = "</div></div>";

// 这个是答案起始
exa[4] = "<div class='option'>";
// 这个是答案结束点
exa[5] = "</div>";

// 这个是单选
exa[6] = "<input class='radio' type='radio' name='";
exa[7] = "' value='";
exa[8] = "'>";
exa[9] = "<br>";

// 这个是复选
exa[10] = "<input class='checkbox' type='checkbox' name='";
exa[11] = "' value='";
exa[12] = "'>";
exa[13] = "<br>";

// 这个是简答题
exa[14] = "<textarea class='textarea'></textarea><br>";

// 这个是文本框
exa[15] = "<input class='text' type='text' name='";
exa[16] = "' style='width: ";
exa[18] = "px;'>";

// 输入数据处理1
function inputOD(str) {
    // var q = str.split(";");
    var sstr = '' + str;
    var q = sstr.match(/(?<=;).*?(?=;)/g);
    for (let i = 0; i < q.length; i++) {
        inputData(q[i]);
    }
}

// 输入数据的处理2
function inputData(str) {
    var a = new Array();
    a = str.match(/(?<=,").*?(?=",)/g);
    questions[qnum] = a[1];
    qnum++;
    // setcookie(questions[qnum], "null", 7);
    switch (a[0]) {
        case 'radio':
            var vau = new Array();
            var dis = new Array();
            for (let i = 0; i < a[3]; i++) {
                vau[i] = a[4 + i];
                dis[i] = a[4 + (a[3]) / 1 + i];
            }
            questionAre.innerHTML += addRadio(a[1], a[2], a[3], a[1], vau, dis);
            break;
        case 'textarea':
            questionAre.innerHTML += addTextarea(a[1], a[2]);
            break;
        case 'checkbox':
            var vau = new Array();
            var dis = new Array();
            for (let i = 0; i < a[3]; i++) {
                vau[i] = a[6 + i];
                dis[i] = a[6 + (a[3]) / 1 + i];
            }
            questionAre.innerHTML += addCheckbox(a[1], a[2], a[3], a[1], vau, dis, a[4], a[5]);
            break;
        case 'custom':
            questionAre.innerHTML += addCustom(a[1], a[2], a[3]);
            break;
        default: break;
    }
}

// 这个是添加个性题
function addCustom(id, question, str) {
    return exa[0] + id + exa[1] + question + exa[2] + exa[17] + str + exa[3];
}

// 这个是添加单选题
function addRadio(id, question, n, name, values, dis) {
    var str = exa[0] + id + exa[1] + question + exa[2] + exa[17];
    for (var i = 0; i < n; i++) {
        str += exa[4] + exa[6] + name + exa[7] + values[i]
            + exa[8] + dis[i] + exa[9] + exa[5];
    }
    str += exa[3];
    return str;
}

// 这个是添加多选题
function addCheckbox(id, question, n, name, values, dis, min, max) {
    var str = exa[0] + id + "' min='" + min + "' max='" + max +  exa[1] + question + exa[2] +exa[17];
    for (var i = 0; i < n; i++) {
        str += exa[4] + exa[10] + name
            + exa[11] + values[i] + exa[12] + dis[i] + exa[13] + exa[5];
    }
    str += exa[3];
    return str;
}

// 这个是添加简答题
function addTextarea(id, question) {
    return exa[0] + id + exa[1] + question + exa[2] + exa[17] + exa[14] + exa[3];
}

// 提交
function submit() {
    if (questions.length != 0) {
        var r = confirm("您确定要提交?");
        if (r == true) {
            submitar();
        }
    }else{
        alert("您未能及时获取到相应的题目\n请等待服务器响应或通过QQ联系Franklin3:2294678765");
    }
}

function submitar() {
    var ba = 0;
    var bc = 0;
    var qus = new Array();
    var qusc = new Array();
    var str = "";
    for (i = 0; i < questions.length; i++) {
        var a = document.getElementById(questions[i]);
        if (a != null && a.style.display != "none") {
            var b = 0;
            var r = a.getElementsByClassName("radio");
            for (j = 0; j < r.length; j++) {
                if (r[j].checked) {
                    // setcookie(questions[i], r[j].value, 7);
                    str = str + ";" + questions[i] + "=" + r[j].value;
                    b++;
                }
            }
            var c = a.getElementsByClassName("checkbox");
            var b2 = 0;
            for (j = 0; j < c.length; j++) {
                if (c[j].checked) {
                    // addcookie(questions[i], c[j].value);
                    str = str + ";" + questions[i] + "=" + c[j].value;
                    b++;
                    b2++;
                }
            }
            if (b2 != 0 && !(b2 <= a.getAttribute('max') && b2 >= a.getAttribute('min'))) {
                qusc[bc] = i + 1;
                bc++;
            }
            var ta = a.getElementsByTagName("textarea");
            for (j = 0; j < ta.length; j++) {
                if (ta[j].value != "") {
                    // setcookie(questions[i], ta[j].value, 7);
                    str = str + ";" + questions[i] + "=" + ta[j].value;
                    b++;
                }
            }
            var t = a.getElementsByClassName("text");
            for (j = 0; j < t.length; j++) {
                if (t[j].value != "") {
                    // setcookie(questions[i], t[j].value, 7);
                    str = str + ";" + questions[i] + "=" + t[j].value;
                    b++;
                }
            }
            if (b == 0) {
                qus[ba] = i + 1;
                ba++;
            }
        }
    }
    if (ba != 0 && bc == 0) {
        alert("您有" + ba + "道题目没有完成!");
    } else if (ba == 0 && bc != 0) {
        var strn = qusc[0];
        for (i = 1; i < qusc.length; i++) {
            strn = strn + "," + qusc[i];
        }
        alert("您有" + bc + "道多选题选项个数不符合要求!");
    } else if (ba != 0 && bc != 0) {
        var strn = qus[0];
        for (i = 1; i < qus.length; i++) {
            strn = strn + "," + qus[i];
        }
        var strn2 = qusc[0];
        for (i = 1; i < qusc.length; i++) {
            strn2 = strn2 + "," + qusc[i];
        }
        alert("您有" + ba + "道题目没有完成!" +
            "并且您有" + bc + "道多选题选项个数不符合要求!");
    } else {
        submitData(str);
        alert("您已成功提交!" + document.cookie);
    }
}

function submitData(str) {
    // 数据上传到服务器中
    ws.send("result:" + str);
    var content = document.getElementById("content");
    content.innerHTML = "<div class='box' id='box'>提交中...请等待服务器响应<br>如果长时间未响应请通过QQ联系Franklin3:2294678765</div>";
    content.style.height = 80+"vh";
}

// 链接
function vis(id, id2, value) {
    document.getElementById(id).style.display = "none";
    var a = document.getElementById(id2).getElementsByTagName("input");
    for (i = 0; i < a.length; i++) {
        a[i].tar = id;
        if (a[i].type == "radio") {
            a[i].onclick = function () {
                if (this.value == value) {
                    document.getElementById(this.tar).style.display = "inline";
                } else {
                    document.getElementById(this.tar).style.display = "none";
                }
            }
        } else if (a[i].type == "checkbox") {
            if (this.value == value) {
                a[i].onclick = function () {
                    if (this.checked == true && this.value == value) {
                        document.getElementById(this.tar).style.display = "inline";
                    } else {
                        document.getElementById(this.tar).style.display = "none";
                    }
                }
            }
        }
    }
}

function inputvis(str) {
    var q = str.match(/(?<=;).*?(?=;)/g);
    for (let i = 0; i < q.length; i++) {
        var a = q[i].match(/(?<=,").*?(?=",)/g);
        vis(a[0], a[1], a[2]);
    }
}

function finish() {
    window.onbeforeunload = null;
    var box = document.getElementById("box");
    box.innerHTML = "恭喜您已经完成问卷<br>感谢您对我们调查问卷的支持<br>暂未有统计结果,请等待统计结果发布";
    ws.close();
}

ws.onmessage = function (e) {
    var se = '' + e.data;
    var a = se.match(/.*?(?=:)/);
    if(a=="question"){
        var str = se.match(/(?<=:).*/);
        inputOD(str);
    }else if(a=="link"){
        var str = se.match(/(?<=:).*/);
        inputvis(str);
    }else if(a=="done"){
        finish();
    }
}

window.onload = function () {
    questionAre = document.getElementById("questionare");
}

ws.onopen = function() {
    ws.send("request:HDUwenjuan123");
}