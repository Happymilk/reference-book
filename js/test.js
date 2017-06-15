
	let string = '<tbody>';
	for (let i = 1; i <= 5; i++) {
		string += '<tr>';
		for (let j = 1; j <= 8; j++)
				string += '<td>' + j + '</td>';
			
		string += '</tr>'
	}
	string += '</tbody>';
	window.document.getElementById("testTable").innerHTML = string;

window.document.getElementById('loader').style.display = 'none';
	window.document.getElementById('p1').style.display = 'none';
	window.document.getElementById('p2').style.display = 'none';


