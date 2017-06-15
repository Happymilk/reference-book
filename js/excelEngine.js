const Excel = require('exceljs');
let indexes = [null];

let workbook = new Excel.Workbook();
workbook.xlsx.readFile("НСИ.xlsx").then(
	function() {
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
			if (max < colNumber)
				max = colNumber;
		});
	});
	let string = '<tbody>';
	for (let i = 1; i <= rowcount; i++) {
		string += '<tr>'
		let row = worksheet.getRow(i);
		for (let j = 1; j <= max; j++)
			if (row.getCell(j).value != null)
				string += '<td>' + row.getCell(j).value + '</td>';
			else
				string += '<td></td>';
			
		string += '</tr>'
	}
	string += '</tbody>';
	window.document.getElementById("firstTable").innerHTML = string;

	window.document.getElementById('loader').style.display = 'none';
	window.document.getElementById('p1').style.display = 'none';
	window.document.getElementById('p2').style.display = 'none';
}


