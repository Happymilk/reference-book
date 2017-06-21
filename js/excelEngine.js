/* Ошибки/баги/проблемы к исправлению
[x] ошибка при клике по ячейке - появление кода
[x] при редактировании не хочет брать все что в кавычках
[x] при создании элементов фокус всегда на первой строке первой созданной ячейке
[x] размер ячейки не должен скакать при фокусе
[x] при добавлении новой строки, не хватате ячеек в конце строки, если ранее добавлялись новые столбцы
[х] при сортировке все скачет
[x] модифицировать алгоритм сортировки!! (сортирует по алфавиту даже цифры + скачет при одинаковых данных в строках)
[х] [object Object]
[ ] объединенные в Excel ячейки дублируются в проге
[ ] если в цифровом столбце попадается число+цифры - не сортирует нормально
[ ] динамический размер ячеек
[ ] странный формат даты
[ ] пустые строки

Необходимые фичи
[x] редактирование
[x] редактирование с добавлением новой строки
[x] подгрузка из файла
[x] динамическая загрузка таблиц
[х] реакция шапки на левый клик
[x] сортировка по левому клику на ячейку в шапке
[х] добавление новой строки
[х] добавление нового столбца
[x] удаление строки
[x] удаление столбца
[ ] поиск
[ ] фильтр
[ ] РЕДАКТИРОВАНИЕ ФАЙЛА
[ ] История изменений по оператору
[ ] при добавлении запиcи(редактирование!!!), добавлять дату редактирования*/


/*----------------------------------------------------------------------------*/
						    let ANDREY = 'make his code';
/*----------------------------------------------------------------------------*/

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
				if (row.getCell(j).value.result != undefined)
					code += '<td>' + row.getCell(j).value.result + '</td>';
				else if (row.getCell(j).value.text != undefined)
					code += '<td>' + row.getCell(j).value.text + '</td>';
				else if (row.getCell(j).value.hyperlink != undefined)
					code += '<td>' + row.getCell(j).value.hyperlink + '</td>';
				else if (row.getCell(j).value.richText != undefined)
					code += '<td>' + row.getCell(j).value.richText[0].text + '</td>';
				else
					code += '<td>' + row.getCell(j).value + '</td>';
		else code += '<td></td>';
		code += '</tr>'
	}
	code += '</tbody>';
	window.document.getElementById("firstTable").innerHTML = code;

	workWithTable();

	window.document.getElementById('loader').style.display = 'none';
}

/*----------------------------------------------------------------------------*/
						    let VICA = 'make her code';
/*----------------------------------------------------------------------------*/

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
		if(typeof(arrToAnalyze[i - 1])=='string') //если строка только из цифр - перевести в намбер и сравнивать как числа
			if (arrToAnalyze[i - 1].search(/^[0-9]+$/gm) == 0){
				arrToAnalyze[i - 1] = Number(arrToAnalyze[i - 1]);
			}
		if (typeof(arrToAnalyze[i])=='string')
			if (arrToAnalyze[i].search(/^[0-9]+$/gm) == 0){
				arrToAnalyze[i] = Number(arrToAnalyze[i]);
			}
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
			rows.forEach(function (element, index, array) {
				a += element.outerHTML;
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
	$('tr:last-child').remove();
	workWithTable();
}

buttonDeleteColl.onclick = function(){
	$('td:last-child').remove();
	workWithTable();
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
