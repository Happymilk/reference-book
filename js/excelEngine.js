const Excel = require('exceljs');

let workbook = new Excel.Workbook();
workbook.xlsx.readFile("НСИ.xlsx")
    .then(function() {
		let worksheet = workbook.getWorksheet(1);
		window.document.getElementById("results").innerHTML = '<tr>'+
			'<td>' + worksheet.getCell('A1').value + '</td>' +
			'<td>' + worksheet.getCell('B1').value + '</td>' +
			'<td>' + worksheet.getCell('C1').value + '</td>' +
			'<td>' + worksheet.getCell('D1').value + '</td>' +
			'<td>' + worksheet.getCell('E1').value + '</td>' +
			'</tr>';
    });
