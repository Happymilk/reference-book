class Table{
    constructor(){
		this.Excel;
        this.indexes;
        this.workbook;
    }

	start(){
		this.Excel = require('exceljs')
        this.indexes = [null];
        this.workbook = new this.Excel.Workbook();
		this.workbook.xlsx.readFile("НСИ.xlsx").then(function() {
        	let index = 1;
        	this.workbook.eachSheet(function(worksheet, sheetId) {
        		window.document.getElementById("navigation").innerHTML += '<li><a class="page-scroll" onclick="Table.createTable('+ index + ')">' + worksheet.name + '</a></li>';
        		this.indexes.push(sheetId);
        		index++;
        	});
        	this.createTable(1);
        });
	}
    createTable(sheet) {
    	window.document.getElementById('loader').style.display = 'block';

    	let worksheet = this.workbook.getWorksheet(this.indexes[sheet]);
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
    				if(j==1)
    					code += '<td class="tableHead">' + row.getCell(j).value + '</td>';
    				else code += '<td>' + row.getCell(j).value + '</td>';
    			else code += '<td></td>';

    		code += '</tr>'
    	}
    	code += '</tbody>';
    	window.document.getElementById("firstTable").innerHTML = code;

    	this.edditCells();

    	window.document.getElementById('loader').style.display = 'none';
    }

    edditCells() {
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
    		this.edditCells();
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
    		this.edditCells();
    	}

    	buttonAddColl.onclick = function(){
    		$('tr').append('<td></td>');
    	}

    	buttonSearch.onclick = function(){
    		alert('Искать запись');
    	}

    	rows = Array.from(document.getElementsByTagName('tr'));
    	cells = Array.from(document.getElementsByTagName('td'));
    	for(let i=0;i<(cells.length)/(rows.length);i++)
    		cells[i].oncontextmenu = function(){
    			alert('фильтруем '+(i+1)+' ячейку');
    	}
    }
}
let a = new Table();
a.start();
