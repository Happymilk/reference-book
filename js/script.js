let cells = Array.from(document.getElementsByTagName('td')); //массив всех ячеек таблицы
cells.forEach(function(element, index, array){
    element.onclick = function(element){
        //console.log(element);
        //element.toElement.innerHTML = 'dsknk';//менять содержимое ячейки
        //element.toElement.style.color = "red";//менять стиль ячейки
        let t = element.target || element.srcElement; //получаем название тега
        let elm_name = t.tagName.toLowerCase(); //если это инпут - ничего не делаем
        if(elm_name == 'input') {return false;}
        let val = $(this).html();//$(this).html() == element.toElement.innerHTML
        let code = '<input type="text" id="edit" value="'+val+'" size='+(val.length - 1)+'/>';
        $(this).empty().append(code);//!!!
        $('#edit').focus();
        $('#edit').blur(function() {
            let val = $(this).val();
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

buttonAdd.onclick = function(firstTable){
    let t = firstTable.target || firstTable.srcElement; //получаем название тега
    let elm_name = t.tagName.toLowerCase(); //если это инпут - ничего не делаем
    let code = '<tr><td>Left info51</td><td>Data info52</td><td>Data info53</td><td>Data info55</td><td>Data info55</td><td>Data info56</td><td>Data info57</td><td>Data info58</td><td>Data info59</td><td>Data info50</td></tr>';
    $('#firstTable').append(code);//!!!
    document.location.href = '#close';
};
