/* Ошибки/баги/проблемы к исправлению
[x] ошибка при клике по ячейке - появление кода
[ ] [object Object]
[x] при редактировании не хочет брать все что в кавычках
[x] при создании элементов фокус всегда на первой строке первой созданной ячейке
[x] размер ячейки не должен скакать при фокусе
[ ] динамический размер ячеек
[ ] странный формат даты
[x] при добавлении новой строки, не хватате ячеек в конце, если ранее добавлялись новые столбцы
[ ] модифицировать алгоритм сортировки!! (сортирует по суммам номеров символов)

Необходиме фичи
[x] редактирование
[x] редактирование с добавлением новой строки
[x] подгрузка из файла
[x] динамическая загрузка таблиц
[х] реакция шапки на левый клик
[ ] фильтр
[x] сортировка по левому клику на ячейку в шапке
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

workbook.xlsx.readFile("НСИ.xlsx").then(function () {
	let index = 1;
	workbook.eachSheet(function (worksheet, sheetId) {
		window.document.getElementById("navigation").innerHTML += '<li><a class="page-scroll" onclick="createTable(' + index + ')">' + worksheet.name + '</a></li>';
		indexes.push(sheetId);
		index++;
	});
	createTable(1);
});

function createTable(sheet) {
	window.document.getElementById('loader').style.display = 'block';

	let worksheet = workbook.getWorksheet(indexes[sheet]);
	let rowcount = 0;

	worksheet.getColumn(1).eachCell(function (cell, rowNumber) {
		rowcount = rowNumber;
	});
	let max = 0;
	worksheet.eachRow(function (row, rowNumber) {
		row.eachCell(function (cell, colNumber) {
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

	workWithTable();

	window.document.getElementById('loader').style.display = 'none';
}

function edditCells() {
	let cells = Array.from(document.getElementsByTagName('td')); //массив всех ячеек таблицы
	let rows = Array.from(document.getElementsByTagName('tr'));
	cells.forEach(function (element, index, array) {
		element.onclick = function (element) {
			let t = element.target || element.srcElement;
			let cellH = element.target.clientHeight;
			let cellW = element.target.clientWidth;

			if (t.tagName.toLowerCase() == 'textarea') return false;
			edditCells.cellToEdit = element.toElement;
			edditCells.oldCellVal = $(this).html();

			let code = '<textarea name="text" id="edit">' + edditCells.oldCellVal + '</textarea>';
			$(this).empty().append(code);

			let cellArea = document.getElementById('edit');
			cellArea.style.height = (cellH - 22) + 'px';
			cellArea.style.width = (cellW - 16) + 'px';

			$('#edit').focus();
			$('#edit').blur(function () {
				edditCells.newCellVal = $(this).val();
				if (edditCells.newCellVal != edditCells.oldCellVal)
					document.location.href = '#modal';
				else edditCells.cellToEdit.innerHTML = edditCells.oldCellVal;
			});
		};
	});

	window.addEventListener('keypress', function (event) {
		if (event.keyCode == 13)
			$('#edit').blur();
	});
}

function workWithTable(){
	edditCells();
	sortTable();
}

/*-----------------------------------сортировка-------------------------------*/

function GnomeSort(arrToAnalyze, arrToSort) {
	let i = 2;
	let j = 3;
	while (i < arrToAnalyze.length) {
		if (arrToAnalyze[i - 1] < arrToAnalyze[i]) {
			i = j;
			j++;
		} else {
			let t = arrToSort[i - 1];
			arrToSort[i - 1] = arrToSort[i];
			arrToSort[i] = t;
			t = arrToAnalyze[i - 1];
			arrToAnalyze[i - 1] = arrToAnalyze[i];
			arrToAnalyze[i] = t;
			i--;
			if (i == 1) {
				i = j;
				j++;
			}
		}
	}
	return arrToSort;
}

function GnomeSort1(arrToAnalyze) {
	let i = 2;
	let j = 3;
	while (i < arrToAnalyze.length) {
		if (arrToAnalyze[i - 1] < arrToAnalyze[i]) {
			i = j;
			j++;
		} else {
			let t = arrToAnalyze[i - 1];
			arrToAnalyze[i - 1] = arrToAnalyze[i];
			arrToAnalyze[i] = t;
			i--;
			if (i == 1) {
				i = j;
				j++;
			}
		}
	}
	return arrToAnalyze;
}

function sortTable(){
	let cells = Array.from(document.getElementsByTagName('td')); //массив всех ячеек таблицы
	let rows = Array.from(document.getElementsByTagName('tr'));

	for (let currentColl = 0; currentColl < (cells.length) / (rows.length); currentColl++){ //для шапки
		cells[currentColl].oncontextmenu = function () {//по правому клику
			let count = 0;
			let filterCells = [];
			cells.forEach(function (element, index) {
				if (index == count * ((cells.length) / (rows.length)) + currentColl) {
					filterCells.push(element.innerHTML);
					count++;
				}
			});

			GnomeSort(filterCells, rows);
			let a = '';
			let c = 0;
			rows.forEach(function (element, index, array) {
				a += element.outerHTML;
				c++;
			});
			window.document.getElementById("firstTable").innerHTML = a;
			workWithTable();
		}
	}
}

/*-----------------------------------обработчики кнопок-----------------------*/

buttonAddRow.onclick = function(){
	let cells = Array.from(document.getElementsByTagName('td')); //массив всех ячеек таблицы
	let rows = Array.from(document.getElementsByTagName('tr'));
	let code = '<tr>';
	for (let i = 1; i <= (cells.length) / (rows.length); i++)
		code += '<td></td>';
	code += '</tr>';
	$('#firstTable').append(code);
	workWithTable();
}

buttonAddColl.onclick = function(){
	$('tr').append('<td></td>');
	workWithTable();
}

buttonDeleteRow.onclick = function(){
	alert('Удалить строку');
}

buttonDeleteColl.onclick = function(){
	alert('Удалить колонку');
}

buttonSearch.onclick = function(){
	alert('Искать запись');
}

buttonOperChanges.onclick = function(){
	alert('История изменений по оператору');
}

modalAdd.onclick = function(){
	edditCells.cellToEdit.innerHTML = edditCells.newCellVal;
	$('#firstTable').append(edditCells.cellToEdit.parentElement.outerHTML);
	edditCells.cellToEdit.innerHTML = edditCells.oldCellVal;
	document.location.href = '#close';
	workWithTable();
};

modalChange.onclick = function(){
	edditCells.cellToEdit.innerHTML = edditCells.newCellVal;
	document.location.href = '#close';
}

modalClose.onclick = function(){
	edditCells.cellToEdit.innerHTML = edditCells.oldCellVal;
	document.location.href = '#close';
}
