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
			if (row.getCell(j).value != null) code += '<td>' + row.getCell(j).value + '</td>';
			else code += '<td></td>';

		code += '</tr>'
	}
	code += '</tbody>';
	window.document.getElementById("firstTable").innerHTML = code;

	let cells = Array.from(document.getElementsByTagName('td')); //массив всех ячеек таблицы
    let rows = Array.from(document.getElementsByTagName('tr'));
    let currentCell;
    let oldVal;
    cells.forEach(function(element, index, array){
        element.onclick = function(element){
            //element.toElement.innerHTML = 'dsknk';//менять содержимое ячейки
            //element.toElement.style.color = "red";//менять стиль ячейки
            let t = element.target || element.srcElement;
            let elm_name = t.tagName.toLowerCase();//получаем название тега
            if(elm_name == 'input') {return false;}//если это инпут - ничего не делаем
            currentCell = element.toElement;
            oldVal = $(this).html();//$(this).html() == element.toElement.outerHTML
            let code = '<input type="text" id="edit" value="'+oldVal+'" />'/*'size='+oldVal.length+'/>'*/;
            $(this).empty().append(code);//!!!
            $('#edit').focus();
            $('#edit').blur(function() {
                let newVal = $(this).val();
                if(newVal != oldVal){
                    $(this).parent().empty().html(newVal);
                    document.location.href = '#modal';
                }
            });
        };
    });

    window.addEventListener('keypress',function(event){
        if(event.keyCode == 13){
            $('#edit').blur();
        }
    });

    buttonAdd.onclick = function(){
        $('#firstTable').append(currentCell.parentElement.outerHTML);
        currentCell.innerHTML = oldVal;
        document.location.href = '#close';
    };

    buttonChange.onclick = function(){
        document.location.href = '#close';
    }

    buttonClose.onclick = function(){
        currentCell.innerHTML = oldVal;
        document.location.href = '#close';
    }
	
	window.document.getElementById('loader').style.display = 'none';
	window.document.getElementById('p1').style.display = 'none';
	window.document.getElementById('p2').style.display = 'none';
}
