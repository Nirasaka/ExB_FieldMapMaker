//ヘルプ表示
const helpbtn = document.getElementById('help');
const helpwindow = document.getElementById('helpwindow');
helpbtn.onclick = function(){
    helpwindow.classList.add('show');
};
document.addEventListener('click', (e)=>{
    if(e.target.closest('#helptext') == null && e.target.closest('#help') == null) helpwindow.classList.remove('show');
});
window.addEventListener('DOMContentLoaded',resizeHelpWindow());
window.onresize = resizeHelpWindow;
function resizeHelpWindow(){
    helpwindow.style.height = parseInt(window.innerHeight * 0.9 - 70);
};

//マップ・範囲テンプレートトグル
const trigger = document.getElementById('trigger');

//マップ
const maptable = document.getElementById("map");
const maprow = document.getElementById('mapheight');
const mapcol = document.getElementById('mapwidth');

const penOps = document.getElementsByName("penOps");
const coloroption = document.getElementById("penColor");
const penradio = document.getElementById('penradio');
const eraser = document.getElementById('eraser');

//マップのパラメータ・描画管理
const mapparam = document.getElementById("mapparam");

//範囲テンプレート
const rangetable = document.getElementById('range');
const rangetype = document.getElementById('rangetype');

const circlemenu = document.getElementById('circlemenu');
const circlesize = document.getElementById('circlesize');

const fanmenu = document.getElementById('fanmenu');
const fansize = document.getElementById('fansize');

const riflemenu = document.getElementById('riflemenu');
const riflemax = document.getElementById('riflemax');
const riflemin = document.getElementById('riflemin');

const rangeparam = document.getElementById('rangeparam');
const rangerow = document.getElementById('rangeheight');
const rangecol = document.getElementById('rangewidth');

//初期化ボタン
const initbtn = document.getElementById('initbtn');

//不透明度
const alpha = document.getElementById('alphanum');



//トリガー
trigger.onclick = function(){
    let modechange = document.getElementsByClassName('modechange');
    for(i=0;i<modechange.length;i++){
        modechange[i].classList.toggle('rangemode')
    }

    let rangetype = document.getElementById('rangetype');
    switch(rangetype.value){
        case "circle":
            let circlemenu = document.getElementById('circlemenu');
            circlemenu.classList.toggle('circle');
            break;
        case "fan":
            let fanmenu = document.getElementById('fanmenu');
            fanmenu.classList.toggle('fan');
            break;
        case "rifle":
            let riflemenu = document.getElementById('riflemenu');
            riflemenu.classList.toggle('rifle');
            break;
        case "custom":
            let rangeparam = document.getElementById('rangeparam');
            rangeparam.classList.toggle('custom');
            break;
    }
    editRange();
};

//表編集
function editTable(table,row,col,withTh=0,paintable=1,white=1){
    if(withTh) withTh = 1;
    else withTh = 0;

    let color;
    if(white) color = '#ffffffFF';
    else color = '#00000000';

    if(row>0 && col>0){
        //行が増えた時
        while(table.rows.length<row+withTh){
            let tr = document.createElement('tr');
            if(withTh){
                let th = document.createElement('th');
                if(table.rows.length>0) th.textContent = table.rows.length;
                tr.appendChild(th);
            }
            else{
                let td = document.createElement('td');
                if(paintable) td.classList.add("paintable");
                td.style.background = color;
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
    
        //行が減った時
        while(table.rows.length>row+withTh){
            table.deleteRow(-1);
        }
    
        //列が増えた時
        for(i=0;i<table.rows.length;i++){
            while(table.rows[i].cells.length<col+withTh){
                if(withTh && i==0){
                    let th = document.createElement('th');
                    th.textContent = alphCells(table.rows[i].cells.length);
                    table.rows[i].appendChild(th);
                }
                else{
                    let td = document.createElement('td');
                    if(paintable) td.classList.add("paintable");
                    td.style.background = color;
                    table.rows[i].appendChild(td);
                }
            }
        }
    
        //列が減った時
        while(table.rows[0].cells.length>col+withTh){
            for(i=0;i<table.rows.length;i++){
                table.rows[i].deleteCell(-1);
            }
        }
    }
}

//列番号アルファベット化関数
//1=A,2=B,...,26=Z,27=AA,...
function alphCells(alphNum){
    let tmp, letter = "";

    while(alphNum > 0){
        tmp = (alphNum - 1) % 26;
        letter = String.fromCharCode(tmp + 65) + letter;
        alphNum = (alphNum - tmp -1)/26;
    }

    return letter;
}


//マップの初期化
editTable(maptable,parseInt(maprow.value),parseInt(mapcol.value),true);

function deleteTable(table){
    while(table.rows.length>0){
        table.deleteRow(-1);
    }
}

mapparam.addEventListener('change', {table : maptable,row : parseInt(maprow.value),col : parseInt(mapcol.value),withTh : true, handleEvent : function(){
    editTable(maptable,parseInt(maprow.value),parseInt(mapcol.value),true);
}});


//初期化ボタン
initbtn.onclick = function(){
    if(trigger.classList.contains('rangemode')){
        if(confirm('カスタムテンプレートを初期化しますか？\n行列数は変わらず、染色したマスはリセットされます。')){
            deleteTable(rangetable);
            let rangerow = document.getElementById('rangeheight');
            let rangecol = document.getElementById('rangewidth');
            editTable(rangetable,parseInt(rangerow.value),parseInt(rangecol.value),false,true,false);
        }
    }
    else{
        if(confirm('マップを初期化しますか？\n行列数は変わらず、染色したマスはリセットされます。')){
            deleteTable(maptable);
            editTable(maptable,parseInt(maprow.value),parseInt(mapcol.value),true);
        }
    }
}

//範囲テンプレート
rangetype.onchange = editRange;

circlemenu.onchange = editRange;

fansize.onchange = editRange;

riflemax.onchange = editRange;
riflemin.onchange = editRange;

rangeparam.addEventListener('change', {handleEvent : function(){
    editTable(rangetable,parseInt(rangerow.value),parseInt(rangecol.value),false,true,false);
    changeCellAlpha();
}});

function editRange(){
    circlemenu.classList.remove('circle');
    fanmenu.classList.remove('fan');
    riflemenu.classList.remove('rifle');
    rangeparam.classList.remove('custom');
    penradio.classList.remove('custom');
    eraser.classList.remove('custom');
    initbtn.classList.remove('custom');
    deleteTable(rangetable);

    if(trigger.classList.contains('rangemode')){
        switch(rangetype.value){
            case 'circle':
                circlemenu.classList.add('circle');
                let circlediameter
                if(parseInt(circlesize.value)<=9) circlediameter = 3;
                else circlediameter = 5;
                editTable(rangetable,circlediameter,circlediameter,false,false,false);
                for(i=0;i<circlediameter;i++){
                    for(j=0;j<circlediameter;j++){
                        if(parseInt(circlesize.value)!=13){
                            rangetable.rows[i].cells[j].style.backgroundColor = coloroption.value + parseInt(255 * alpha.value).toString(16);
                        }else if(Math.abs(2-i)+Math.abs(2-j)<=2 && Math.abs(2-i)+Math.abs(2-j)>=0){
                            rangetable.rows[i].cells[j].style.backgroundColor = coloroption.value + parseInt(255 * alpha.value).toString(16);
                        }
                    }
                }
                break;
    
            case 'cross':
                let crossdiameter = 3;
                editTable(rangetable,crossdiameter,crossdiameter,false,false,false);
                for(i=0;i<crossdiameter;i++){
                    for(j=0;j<crossdiameter;j++){
                        if(Math.abs(1-i)+Math.abs(1-j)<=1 && Math.abs(1-i)+Math.abs(1-j)>=0){
                            rangetable.rows[i].cells[j].style.backgroundColor = coloroption.value + parseInt(255 * alpha.value).toString(16);
                        }
                    }
                }
                break;
    
            case 'fan':
                fanmenu.classList.add('fan');
                editTable(rangetable,parseInt(fansize.value),(1+2*(parseInt(fansize.value)-1)),false,false,false);
                for(i=0;i<parseInt(fansize.value);i++){
                    for(j=0;j<(1+2*(parseInt(fansize.value)-1));j++){
                        if(parseInt(fansize.value)-1-i<=j && parseInt(fansize.value)-1+i>=j){
                            rangetable.rows[i].cells[j].style.backgroundColor = coloroption.value + parseInt(255 * alpha.value).toString(16);
                        }
                    }
                }
                break;
    
            case 'rifle':
                riflemenu.classList.add('rifle');
                let max = parseInt(riflemax.value);
                let min = parseInt(riflemin.value);

                riflemax.min = min;
                riflemin.max = max;
                editTable(rangetable,max*2+1,max*2+1,false,false,false);

                for(i=0;i<max*2+1;i++){
                    for(j=0;j<max*2+1;j++){
                        if(Math.abs(max-i)+Math.abs(max-j)<=max && Math.abs(max-i)+Math.abs(max-j)>=min){
                            rangetable.rows[i].cells[j].style.backgroundColor = coloroption.value + parseInt(255 * alpha.value).toString(16);
                        }
                        if(i==max && j==max){
                            rangetable.rows[i].cells[j].style.backgroundColor = coloroption.value + parseInt(255 * alpha.value).toString(16);
                            rangetable.rows[i].cells[j].style.borderRadius = '50%'
                        }
                    }
                }
                break;
    
            case 'custom':
                rangeparam.classList.add('custom');
                penradio.classList.add('custom');
                eraser.classList.add('custom');
                initbtn.classList.add('custom');
                editTable(rangetable,parseInt(rangerow.value),parseInt(rangecol.value),false,true,false);
                break;
        }
    }
};

//セルの染色
function rgb2hex(color){
    return "#" + color.match(/\d+/g).map(function(a){return ("0" + parseInt(a).toString(16)).slice(-2)}).join("");
};

maptable.onmousedown = paintCell;
rangetable.onmousedown = paintCell;

function paintCell(){
    let paintables = document.getElementsByClassName("paintable");
    for(i=0;i<paintables.length;i++){
        paintables[i].onmousedown = function(){
            if(penOps.item(0).checked){
                this.style.background = coloroption.value;
                changeCellAlpha();
            }
            if(penOps.item(1).checked){
                coloroption.value = rgb2hex(this.style.background).substring(0,7);
                changeCellAlpha();
            }
            if(penOps.item(2).checked && trigger.classList.contains('rangemode')){
                this.style.background = rgb2hex(this.style.background).substring(0,7) + '00';
            }
        };
        paintables[i].onmousemove = function(){
            if(penOps.item(0).checked){
                this.style.background = coloroption.value;
                changeCellAlpha();
            }
            if(penOps.item(1).checked){
                coloroption.value = rgb2hex(this.style.background).substring(0,7);
                changeCellAlpha();
            }
            if(penOps.item(2).checked && trigger.classList.contains('rangemode')){
                this.style.background = rgb2hex(this.style.background).substring(0,7) + '00';
            }
        };
        paintables[i].onmouseup = function(){
            for(i=0;i<paintables.length;i++){
                paintables[i].onmousemove = null;
            }
        };
    }
};

//不透明度
alpha.onchange = function(){
    changeCellAlpha();
} 
function changeCellAlpha(){
    for(i=0;i<rangetable.rows.length;i++){
        for(j=0;j<rangetable.rows[0].cells.length;j++){
            if(rangetable.rows[i].cells[j].style.background.substr(0,4) === 'rgba') {
                if(rgb2hex(rangetable.rows[i].cells[j].style.background).substring(7) != '00'){
                    rangetable.rows[i].cells[j].style.background = rgb2hex(rangetable.rows[i].cells[j].style.background).substring(0,7) + parseInt(255 * alpha.value).toString(16);
                }
            }
            else rangetable.rows[i].cells[j].style.background = rgb2hex(rangetable.rows[i].cells[j].style.background) + parseInt(255 * alpha.value).toString(16);
        }
    }
};

coloroption.onchange = function(){
    if(rangetype.value != 'custom'){
        
    for(i=0;i<rangetable.rows.length;i++){
        for(j=0;j<rangetable.rows[0].cells.length;j++){
            if(rangetable.rows[i].cells[j].style.background.substr(0,4) === 'rgba') {
                if(rgb2hex(rangetable.rows[i].cells[j].style.background).substring(7) != '00'){
                    rangetable.rows[i].cells[j].style.background = coloroption.value + parseInt(255 * alpha.value).toString(16);
                }
            }
        }
    }
    }
};

//右クリック禁止
maptable.oncontextmenu = function(){
    return false;
};





//画像保存
var imgName = ""

const dltablebtn = document.getElementById('dltablebtn');
dltablebtn.onclick = function(){
    if(dltablebtn.classList.contains('rangemode')){
        imgName = "exb_range" + rangetable.rows[0].cells.length + 'x' + rangetable.rows.length;
        rangetable.style.borderColor = "#00000000";
        for(var i=0;i<rangetable.rows.length;i++){
            for(var j=0;j<rangetable.rows[i].cells.length;j++){
                rangetable.rows[i].cells[j].style.borderColor = "#00000000";
            }
        }
        html2image('#range');
        rangetable.style.borderColor = "#000000FF";
        for(var i=0;i<rangetable.rows.length;i++){
            for(var j=0;j<rangetable.rows[i].cells.length;j++){
                rangetable.rows[i].cells[j].style.borderColor = "#000000FF";
            }
        }
    }else{
        imgName = "exb_map" + maptable.rows.length + "x" + maptable.rows[0].cells.length + "(" + (parseInt(maptable.rows.length)+1) + "x" + (parseInt(maptable.rows[0].cells.length)+1) + ")";
        html2image('#map');
    }
}

function html2image(targetid) {
    let capture = document.querySelector(targetid);
    html2canvas(capture, {useCORS: true,backgroundColor: null}).then(canvas => {
        let base64 = canvas.toDataURL('image/png');

        let dl = document.getElementById('download');
        dl.href = base64;
        dl.download = imgName;
        dl.click();				//自動ダウンロード
    })
};
