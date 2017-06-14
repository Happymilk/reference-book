let cells = Array.from(document.getElementsByTagName('td')); //массив всех ячеек таблицы
let rows = Array.from(document.getElementsByTagName('tr'));
let x;
let oldVal
cells.forEach(function(element, index, array){
    element.onclick = function(element){
        //element.toElement.innerHTML = 'dsknk';//менять содержимое ячейки
        //element.toElement.style.color = "red";//менять стиль ячейки
        let t = element.target || element.srcElement; //получаем название тега
        let elm_name = t.tagName.toLowerCase(); //если это инпут - ничего не делаем
        if(elm_name == 'input') {return false;}
        x = element.toElement;
        oldVal = $(this).html();//$(this).html() == element.toElement.outerHTML
        let code = '<input type="text" id="edit" value="'+oldVal+'" size='+(oldVal.length - 1)+'/>';
        $(this).empty().append(code);//!!!
        $('#edit').focus();
        $('#edit').blur(function() {
            let newVal = $(this).val();
            if(newVal != oldVal){
                $(this).parent().empty().html(newVal);
                document.location.href = '#modal';
            }
        });
    };
});

window.addEventListener('keypress',function(event){
    if(event.keyCode == 13){
        $('#edit').blur();
    }
});

buttonAdd.onclick = function(){
    $('#firstTable').append(x.parentElement.outerHTML);
    x.innerHTML = oldVal;
    document.location.href = '#close';
};

buttonChange.onclick = function(){
    document.location.href = '#close';
}

buttonClose.onclick = function(){
    x.innerHTML = oldVal;
    document.location.href = '#close';
}
