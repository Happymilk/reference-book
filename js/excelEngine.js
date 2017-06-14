const Excel = require('exceljs');

let workbook = new Excel.Workbook();
workbook.xlsx.readFile("НСИ.xlsx").then(
	function() {
		workbook.eachSheet(function(worksheet, sheetId) {
			window.document.getElementById("navvv").innerHTML += '<li><a class="page-scroll">' + worksheet.name + '</a></li>';
		});
    });
