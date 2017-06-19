/* Ошибки/баги/проблемы к исправлению
[x] ошибка при клике по ячейке - появление кода
[ ] [object Object]
[x] при редактировании не хочет брать все что в кавычках
[x] при создании элементов фокус всегда на первой строке первой созданной ячейке
[x] размер ячейки не должен скакать при фокусе
[ ] динамический размер ячеек
[ ] странный формат даты

Необходиме фичи
[x] редактирование
[x] редактирование с добавлением новой строки
[x] подгрузка из файла
[x] динамическая загрузка таблиц
[ ] фильт по клику на ячейку ф шапке
[ ] сортировка по ???
[ ] добавление новой строки
[ ] при добавлении запими(редактирование!!!), добавлять дату редактирования
[ ] поиск
[ ] удаление строк
[ ] РЕДАКТИРОВАНИЕ ФАЙЛА*/


const Excel = require('exceljs');
let indexes = [null];
let workbook = new Excel.Workbook();

workbook.xlsx.readFile("НСИ.xlsx").then(function() {
	let index = 1;
	workbook.eachSheet(function(worksheet, sheetId) {
		window.document.getElementById("navvv").innerHTML += '<li><a class="page-scroll" onclick="execute('+ index + ')">' + worksheet.name + '</a></li>';
		indexes.push(sheetId);
		index++;
	});
	execute(1);
});

function execute(sheet) {
	window.document.getElementById('loader').style.display = 'block';
	window.document.getElementById('p1').style.display = 'block';
	window.document.getElementById('p2').style.display = 'block';

	let worksheet = workbook.getWorksheet(indexes[sheet]);
	let rowcount = 0;

	worksheet.getColumn(1).eachCell(function(cell, rowNumber) {
		rowcount = rowNumber;
	});
	let max = 0;
	worksheet.eachRow(function(row, rowNumber) {
		row.eachCell(function(cell, colNumber) {
			if (max < colNumber) max = colNumber;
		});
	});

	let code = '<tbody>';
	for (let i = 1; i <= rowcount; i++) {
		code += '<tr>'
		let row = worksheet.getRow(i);
		for (let j = 1; j <= max; j++)
			if (row.getCell(j).value != null)
				code += '<td>' + row.getCell(j).value + '</td>';
			else code += '<td></td>';

		code += '</tr>'
	}
	code += '</tbody>';
	window.document.getElementById("firstTable").innerHTML = code;

	edditCells();

	window.document.getElementById('loader').style.display = 'none';
	window.document.getElementById('p1').style.display = 'none';
	window.document.getElementById('p2').style.display = 'none';
}

function edditCells() {
	let cells = Array.from(document.getElementsByTagName('td')); //массив всех ячеек таблицы
    let rows = Array.from(document.getElementsByTagName('tr'));
    let currentCell;
    let oldVal;
	let newVal;
    cells.forEach(function(element, index, array){
        element.onclick = function(element){
			let cellHeight = element.target.clientHeight;
			let cellWidth = element.target.clientWidth;
            let t = element.target || element.srcElement;
            let elm_name = t.tagName.toLowerCase();//получаем название тега
            if(elm_name == 'textarea') {return false;}//если это инпут - ничего не делаем
            currentCell = element.toElement;
            oldVal = $(this).html();
			let code = '<textarea name="text" id="edit">'+oldVal+'</textarea>';
			$(this).empty().append(code);//!!!
			let area = document.getElementById('edit');
			area.style.height = (cellHeight - 22)+'px';
			area.style.width = (cellWidth - 16)+'px';
            $('#edit').focus();
            $('#edit').blur(function() {
                newVal = $(this).val();
                if(newVal != oldVal)
                    document.location.href = '#modal';
				else currentCell.innerHTML = oldVal;
            });
        };
    });

	window.addEventListener('keypress',function(event){
		if(event.keyCode == 13){
			$('#edit').blur();
		}
	});

	buttonAdd.onclick = function(){
		currentCell.innerHTML = oldVal;
		$('#firstTable').append(currentCell.parentElement.outerHTML);
		alert(currentCell.innerHTML);
		document.location.href = '#close';
		edditCells();
	};

	buttonChange.onclick = function(){
		currentCell.outerHTML = '<td>'+newVal+'</td>';
		document.location.href = '#close';
	}

	buttonClose.onclick = function(){
		currentCell.innerHTML = oldVal;
		document.location.href = '#close';
	}
}
