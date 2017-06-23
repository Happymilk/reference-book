/* Ошибки/баги/проблемы к исправлению
[x] ошибка при клике по ячейке - появление кода
[x] при редактировании не хочет брать все что в кавычках
[x] при создании элементов фокус всегда на первой строке первой созданной ячейке
[x] размер ячейки не должен скакать при фокусе
[x] при добавлении новой строки, не хватате ячеек в конце строки, если ранее добавлялись новые столбцы
[х] при сортировке все скачет
[x] модифицировать алгоритм сортировки!! (сортирует по алфавиту даже цифры + скачет при одинаковых данных в строках)
[х] [object Object]
[x] ищет только по полному совпадению
[x] странный формат даты
[ ] объединенные в Excel ячейки дублируются в проге
[ ] если в цифровом столбце попадается число+цифры/ пустые строки/ одинаковые значения - не сортирует нормально
[x] динамический размер ячеек
[x] пиринг_2017 ШАПКА ФИКС


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
[x] поиск
[x] фильтр
[ ] справка
[ ] РЕДАКТИРОВАНИЕ ФАЙЛА
[ ] История изменений по оператору
[ ] при добавлении запиcи(редактирование!!!), добавлять дату редактирования*/


/*----------------------------------------------------------------------------*/
						    let ANDREY = 'make his code';
/*----------------------------------------------------------------------------*/
const Excel = require('exceljs');
let workbook = new Excel.Workbook();
let indexes = [null];

workbook.xlsx.readFile('НСИ.xlsx').then(function () {
	let index = 1;
	workbook.eachSheet(function (worksheet, sheetId) {
		window.document.getElementById('navigation').innerHTML += '<li><a class="page-scroll" onclick="createTable(' + index + ')">' + worksheet.name + '</a></li>';
		indexes.push(sheetId);
		index++;
	});
	createTable(1);
});

function createTable(sheet) {
	Array.from(document.getElementsByClassName('loader')).forEach(function(element,index){
		element.style.display = 'block';
	});
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

	let reg = /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z/i;

	let shapon = checkShapon(worksheet, rowcount, max);

	let code = '<tbody>';
	for (let i = 1; i <= rowcount; i++) {
		code += '<tr>'
		let row = worksheet.getRow(i);
		for (let j = 1; j <= max; j++) {
			if (i <= shapon)
				code += '<td class="table-header">';
			else
				code += '<td>';
			if (row.getCell(j).value != null) 
				if (row.getCell(j).value.result != undefined) {
					let res = reg.exec(JSON.stringify(row.getCell(j).value.result));
					if (res != null)
						code += JSON.stringify(row.getCell(j).value.result).slice(1,11) + '</td>';
					else
						code += row.getCell(j).value.result + '</td>';
				}
				else if (row.getCell(j).value.text != undefined)
					code += row.getCell(j).value.text + '</td>';
				else if (row.getCell(j).value.hyperlink != undefined)
					code += row.getCell(j).value.hyperlink + '</td>';
				else if (row.getCell(j).value.richText != undefined)
					code += row.getCell(j).value.richText[0].text + '</td>';
				else {
					let res = reg.exec(JSON.stringify(row.getCell(j).value));
					if (res != null)
						code += JSON.stringify(row.getCell(j).value).slice(1,11) + '</td>';
					else
						code += row.getCell(j).value + '</td>';
				}
			else code += '</td>';
		}
		code += '</tr>'
	}
	code += '</tbody>';
	window.document.getElementById('firstTable').innerHTML = code;

	workWithTable();

	Array.from(document.getElementsByClassName('loader')).forEach(function(element,index){
		element.style.display = 'none';
	});
}

function checkShapon(worksheet, rowcount, max) {
	let i = 1, reg = /[-._a-z0-9]+@(?:[a-z0-9][-a-z0-9]+\.)+[a-z]{2,6}/i;
	while (i <= rowcount) {
		let row = worksheet.getRow(i), j = 1;
		while (j <= max) {
			if (row.getCell(j).value != null) {
				if (row.getCell(j).value.text != undefined) {
					if (!Number.isNaN(+row.getCell(j).value.text))
						return i-1;
					else {
						let res = reg.exec(JSON.stringify(row.getCell(j).value.text));
						if (res != null)
							return i-1;
					}
				}
				else if (!Number.isNaN(+row.getCell(j).value.toString()))
					return i-1;
				else {
					let res = reg.exec(JSON.stringify(row.getCell(j).value));
					if (res != null)
						return i-1;
				}
			}
			j++;
		}	
		i++;
	}
	return i;
}

/*----------------------------------------------------------------------------*/
						    let VICA = 'make her code';
/*----------------------------------------------------------------------------*/

function edditCells() {
	let cells = Array.from($('td'));
	let rows = Array.from($('tr'));
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
					document.location.href = '#modalEdit';
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
	generateDropMenu();
	edditCells();
	sortTable();
}
/*-----------------------------------фильтрация-------------------------------*/

function generateFilterModal(i){
	let cells = Array.from($('td'));
	document.location.href = '#modalFilter';
	document.getElementById('filterCell').innerHTML = cells[i].innerHTML;
	generateFilterModal.index = i;
}

modalBtnFilter.onclick = function(){
	let val = $('#filterContent').val();
	let cells = Array.from($('td'));
	let rows = Array.from($('tr'));
	generateFilterModal.oldTable = rows;
	let count = 1;
	let arr = [];
	arr.push(rows[0].outerHTML);
	cells.forEach(function (element, index) {
		if (index == count * ((cells.length) / (rows.length)) + generateFilterModal.index) {
			if (element.innerHTML == val){
				arr.push(rows[count].outerHTML);
			}
		count++;
		}
	});
	if (arr.length == 1)
		alert('Совпадений по столбцу '+cells[generateFilterModal.index].innerHTML+' со значением '+val+' не найдено');
	else
		$('#firstTable').empty().append(arr.join());
	document.getElementById('filterContent').value = '';
	document.location.href = '#close';
}

btnFilterReset.onclick = function(){
	$('#firstTable').empty().append(generateFilterModal.oldTable);
}

function generateDropMenu(){
	let cells = Array.from($('td'));
	let rows = Array.from($('tr'));
	let code = '';
	for (let i = 0; i < (cells.length) / (rows.length); i++){
		if(cells[i].innerHTML!='')
			code += '<li><a onclick="generateFilterModal(' + i + ')">' + (cells[i].innerHTML) + '</a></li>';
	}
	document.getElementById('sort-dropdown-menu').innerHTML = code;
}

/*-----------------------------------сортировка-------------------------------*/

function GnomeSort(arrToAnalyze, arrToSort) {
	let i = 2;
	let j = 3;
	while (i < arrToAnalyze.length) {
		if((typeof(arrToAnalyze[i - 1])=='string')&&(arrToAnalyze[i - 1].search(/^[0-9]+$/gm) == 0)){
			arrToAnalyze[i - 1] = parseInt(arrToAnalyze[i - 1],10);
			}
		if ((typeof(arrToAnalyze[i])=='string')&&(arrToAnalyze[i].search(/^[0-9]+$/gm) == 0)){
				arrToAnalyze[i] = parseInt(arrToAnalyze[i],10);
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
	let cells = Array.from($('td'));
	let rows = Array.from($('tr'));

	for (let currentCol = 0; currentCol < (cells.length) / (rows.length); currentCol++){ //для шапки
		cells[currentCol].oncontextmenu = function () {//по правому клику
			let count = 0;
			let filterCells = [];
			cells.forEach(function (element, index) {
				if (index == count * ((cells.length) / (rows.length)) + currentCol) {
					filterCells.push(element.innerHTML);
					count++;
				}
			});

			GnomeSort(filterCells, rows);
			let a = '';
			rows.forEach(function (element, index, array) {
				a += element.outerHTML;
			});
			window.document.getElementById('firstTable').innerHTML = a;
			workWithTable();
		}
	}
}

/*-----------------------------------поиск------------------------------------*/

function SearchReset(){
	let cells = Array.from($('td'));
	cells.forEach(function(element,index){
		if(element.hasAttribute('class')){
			let attrArr = element.getAttribute('class').split(' ');//массив содержащий все классы в теге
			let attr = attrArr.filter(function(element,index){
				return (element != 'warning');
			});
			element.setAttribute('class',attr.join(' '));
		}
	});
}

/*-----------------------------------обработчики кнопок-----------------------*/

btnAddRow.onclick = function(){ //add row
	let cells = Array.from($('td'));
	let rows = Array.from($('tr'));
	let code = '<tr>';
	for (let i = 1; i <= (cells.length) / (rows.length); i++)
		code += '<td></td>';
	code += '</tr>';
	$('#firstTable').append(code);
	workWithTable();
}

btnAddCol.onclick = function(){
	$('tr').append('<td></td>');
	workWithTable();
}

btnDelRow.onclick = function(){
	$('tr:last-child').remove();
	workWithTable();
}

btnDelCol.onclick = function(){
	$('td:last-child').remove();
	workWithTable();
}

btnSearch.onclick = function(){
	SearchReset();
	let cells = Array.from($('td'));
	let value = $('#searchContent').val();
	if(value!=''){
		let arr = cells.filter(function(element,index){
			if((element.innerHTML).trim().toLowerCase().includes(value.trim().toLowerCase())) return true;
			return false;
		});
		if(arr.length == 0){alert('Совпадений не найдено');}
		else{
			arr.forEach(function(element,index){
				element.setAttribute('class',(arr[0].getAttribute('class') + ' warning'));
			});
		}
	} else alert('Строка поиска пуста');
}

btnSearchReset.onclick = function(){
	document.getElementById('firstTable').value = null;
	SearchReset();
}

btnOperChanges.onclick = function(){
	alert('История изменений по оператору');
}

modalBtnAdd.onclick = function(){
	edditCells.cellToEdit.innerHTML = edditCells.newCellVal;
	$('#firstTable').append(edditCells.cellToEdit.parentElement.outerHTML);
	edditCells.cellToEdit.innerHTML = edditCells.oldCellVal;
	document.location.href = '#close';
	workWithTable();
};

modalBtnChange.onclick = function(){
	edditCells.cellToEdit.innerHTML = edditCells.newCellVal;
	document.location.href = '#close';
}

modalBtnClose1.onclick = function(){
	edditCells.cellToEdit.innerHTML = edditCells.oldCellVal;
	document.location.href = '#close';
}

modalBtnClose2.onclick = function(){
	document.location.href = '#close';
}
