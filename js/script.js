let cells = Array.from(document.getElementsByTagName('td')); //массив всех ячеек таблицы
cells.forEach(function(element, index, array){
    element.onclick = function(element){
        //console.log(element);
        //element.toElement.innerHTML = 'dsknk';//менять содержимое ячейки
        //element.toElement.style.color = "red";//менять стиль ячейки
        var t = element.target || element.srcElement; //получаем название тега
        var elm_name = t.tagName.toLowerCase(); //если это инпут - ничего не делаем
        if(elm_name == 'input') {return false;}
        var val = $(this).html();//$(this).html() == element.toElement.innerHTML
        var code = '<input type="text" id="edit" value="'+val+'" size='+(val.length - 1)+'/>';
        console.log(val.length);
        $(this).empty().append(code);//!!!
        $('#edit').focus();
        $('#edit').blur(function() {
            var val = $(this).val();
            $(this).parent().empty().html(val);
            document.location.href = '#modal';
        });
    };
});

window.addEventListener('keypress',function(event){
    if(event.keyCode == 13){
        $('#edit').blur();
    }
});
