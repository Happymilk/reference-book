/* Ошибки/баги/проблемы к исправлению
[x] ошибка при клике по ячейке - появление кода
[ ] [object Object]
[x] при редактировании не хочет брать все что в кавычках
[x] при создании элементов фокус всегда на первой строке первой созданной ячейке
[x] размер ячейки не должен скакать при фокусе
[ ] динамический размер ячеек
[ ] странный формат даты
[x] при добавлении новой строки, не хватате ячеек в конце, если ранее добавлялись новые столбцы

Необходиме фичи
[x] редактирование
[x] редактирование с добавлением новой строки
[x] подгрузка из файла
[x] динамическая загрузка таблиц
[ ] фильтр по клику на ячейку в шапке
[ ] сортировка по ???
[х] добавление новой строки
[х] добавление нового столбца
[ ] при добавлении запиcи(редактирование!!!), добавлять дату редактирования
[ ] поиск
[ ] удаление строки
[ ] удаление столбца
[ ] РЕДАКТИРОВАНИЕ ФАЙЛА
[ ] История изменений по оператору*/


const Excel = require('exceljs');
let indexes = [null];
let workbook = new Excel.Workbook();

workbook.xlsx.readFile("НСИ.xlsx").then(function() {
	let index = 1;
	workbook.eachSheet(function(worksheet, sheetId) {
		window.document.getElementById("navigation").innerHTML += '<li><a class="page-scroll" onclick="createTable('+ index + ')">' + worksheet.name + '</a></li>';
		indexes.push(sheetId);
		index++;
	});
	createTable(1);
});

function createTable(sheet) {
	window.document.getElementById('loader').style.display = 'block';

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

	modalAdd.onclick = function(){
		currentCell.innerHTML = newVal;
		$('#firstTable').append(currentCell.parentElement.outerHTML);
		currentCell.innerHTML = oldVal;
		document.location.href = '#close';
		edditCells();
	};

	modalChange.onclick = function(){
		currentCell.innerHTML = newVal;
		document.location.href = '#close';
	}

	modalClose.onclick = function(){
		currentCell.innerHTML = oldVal;
		document.location.href = '#close';
	}

	buttonDeleteRow.onclick = function(){
		alert('Удалить строку');
	}

	buttonDeleteColl.onclick = function(){
		alert('Удалить колонку');
	}

	buttonAddRow.onclick = function(){
		let cells = Array.from(document.getElementsByTagName('td')); //массив всех ячеек таблицы
	    let rows = Array.from(document.getElementsByTagName('tr'));
		let code = '<tr>';
		for (let i = 1; i <= (cells.length)/(rows.length); i++)
			code += '<td></td>';
		code += '</tr>';
		$('#firstTable').append(code);
		edditCells();
	}

	buttonAddColl.onclick = function(){
		$('tr').append('<td></td>');
	}

	buttonSearch.onclick = function(){
		alert('Искать запись');
	}
}
