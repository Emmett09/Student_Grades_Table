var averageGradeType = 1;
let initTable;

//https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode
//duplicates table node to be reinstated in the reset function
function cloneTable(){
    var copy=document.getElementsByTagName("myTable")[0];
    initTable = myTable.cloneNode(true);
}

//return table to initial state
//https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/replaceWith
function reset(){
    document.getElementById("myTable").replaceWith(initTable);
    addListnerToTable();
    cloneTable();
    document.getElementById('missingGrades').innerHTML='Missing grades';
}

//sets value of a clicked cell to empty when clicked
//dealt with by the event listener
function strip(cell){
    var rowNo=cell.parentNode.rowIndex;
    var cellNo=cell.cellIndex;
    var tableBody = document.getElementById("myTable").tBodies[0];
    if(cellNo > 1 && cellNo < tableBody.rows.length-1){
        var row = tableBody.rows[rowNo-1];
        var cell =row.cells[cellNo];
        cell.innerHTML='';
    }
    //change color of row on name click
    if(cellNo ==0){
        var row = tableBody.rows[rowNo-1];
        var style = window.getComputedStyle(cell);
        console.log(style.backgroundColor);
        if(style.backgroundColor === "rgba(0, 0, 0, 0)"){
            console.log("white");
            for(var j = 0 ; j<row.cells.length;j++){
                row.cells[j].style.backgroundColor="green";
            }
        }else{
            for(var j = 0 ; j<row.cells.length;j++){
                row.cells[j].style.backgroundColor="rgba(0, 0, 0, 0)";
            }
            sum();
        }
    }
}

//add event listener to make cells interactive
//https://stackoverflow.com/questions/46341171/how-to-addeventlistener-to-table-cells/46341480
function addListnerToTable(){
    var tableBody = document.getElementById("myTable").tBodies[0];
    for (var i=0; i<tableBody.rows.length; i++) {
        var row = tableBody.rows[i];
        for(j=0;j<row.cells.length;j++){
            row.cells[j].onclick = (function(){         strip(this) });
        }
    }
}

//remove row from table
//https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_table_deleterow
function removeRow() {
    var x = document.getElementById("myTable");
    x.deleteRow(-1);
}

//add a new row
//https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_table_insertrow
function addRow() {
    var tableHead = document.getElementById('myTable').tHead;
    var headerRow = tableHead.rows[0];
    var table = document.getElementById("myTable");
    var row = table.insertRow(-1);
    for(var i = 0 ; i < headerRow.cells.length ; i++){
        var x = row.insertCell(i)
        x.innerHTML = "-";
    }

    addListnerToTable();

}

// append column to the HTML table
//https://www.redips.net/javascript/adding-table-rows-and-columns/
function addColumn() {
    var tableHead = document.getElementById('myTable').tHead;
    var headerRow = tableHead.rows[0];
    var secondLastIndex = headerRow.cells.length-1;
    var lastAssignmentHead = tableHead.rows[0].cells[secondLastIndex-1].innerHTML;

    var lastAssignmentNumber = lastAssignmentHead.replace(/[^0-9]/g, "");
    var newHead = Number(lastAssignmentNumber) +1; // "500"

    var newItem = document.createElement("th");
    newItem.innerHTML="Assignment "+ newHead;
    tableHead.childNodes[1].insertBefore(newItem, tableHead.childNodes[1].cells[secondLastIndex]);

    var tableBody = document.getElementById("myTable").tBodies[0];
    for (var i=0; i<tableBody.rows.length; i++) {
        var newCell = tableBody.rows[i].insertCell(secondLastIndex);
        newCell.innerHTML = '-'
    }

    addListnerToTable();
    sum();
}

//deletes column
function deleteColumn() {
    var tableHead = document.getElementById('myTable').tHead;
    var headerRow = tableHead.rows[0];
    var secondLastIndex = headerRow.cells.length-1;
    var lastAssignmentHead = tableHead.rows[0].cells[secondLastIndex-1].innerHTML;
    tableHead.rows[0].cells[secondLastIndex-1].remove();
    var tableBody = document.getElementById("myTable").tBodies[0];
    for (var i=0; i<tableBody.rows.length; i++) {
        tableBody.rows[i].cells[secondLastIndex].remove();
    }

    for (var i=0; i<tableBody.rows.length; i++) {
        tableBody.rows[i].cells[secondLastIndex-1].innerHTML='-';
    }

    sum();
}

//https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableElement/tBodies
//https://www.w3schools.com/Jsref/coll_table_rows.asp
//https://www.w3schools.com/jsref/coll_table_cells.asp
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
//iterates over table and counts symbols to set the number of missing grades
//sets background colour according to contents of cells
//prevents illegal symbols in cells by detecint with "isNumeric" and resetting to "-"
function sum() {
    var tableBody = document.getElementById("myTable").tBodies[0];
    var sumOfUnSubmitted=0;
    for (var i=0; i<tableBody.rows.length; i++) {
        var sum = 0;
        var sumOfAssignemtsSubmitted = 0;
        var singleRow=tableBody.rows[i];
        for(var j=0;j<singleRow.cells.length;j++){
            if(j==0 || j==1 ){

            }
            else {
                if( (singleRow.cells[j].innerHTML == '-') && (j != singleRow.cells.length-1) ){
                    sumOfUnSubmitted=sumOfUnSubmitted+1;
                    singleRow.cells[j].style.backgroundColor = "yellow"
                }else if(!isNumeric(singleRow.cells[j].innerHTML) && (j != singleRow.cells.length-1)){
                    singleRow.cells[j].innerHTML = '-';
                    singleRow.cells[j].style.backgroundColor = "yellow"
                }else{
                    if((j != singleRow.cells.length-1)){
                        singleRow.cells[j].style.backgroundColor = "white"
                        sum += Number(singleRow.cells[j].innerHTML);
                        sumOfAssignemtsSubmitted+=1;
                    }
                }

                // if its the last col set the average
                //calculates row average
                if(j == singleRow.cells.length-1 && sumOfAssignemtsSubmitted !=0 ) {
                    var percentValue=Math.round(sum/sumOfAssignemtsSubmitted);
                    console.log(percentValue);
                    mapGradeToType(percentValue,singleRow,j);
                    if(percentValue<60){
                        singleRow.cells[j].style.backgroundColor = "red";
                        singleRow.cells[j].style.color="white";
                    }
                    if(percentValue>60){
                        singleRow.cells[j].style.backgroundColor = "white";
                        singleRow.cells[j].style.color="black";
                    }
                }

            }
        }
    }
    //presents the number of the missing grades
    document.getElementById('missingGrades').innerHTML='Missing grades : ' +sumOfUnSubmitted;
}

//takes the average percentage, the row, and position of j and assesses the grade type from the the %
//sets alternate values for types of grades that allow for toggling
function mapGradeToType(percentValue,singleRow , j){
    //singleRow.cells[j].innerHTML
    if(averageGradeType==1){
        singleRow.cells[j].innerHTML=percentValue;
    }else if(averageGradeType==2){
        if(percentValue>=93){
            singleRow.cells[j].innerHTML='A';
        }
        else if(percentValue>= 90 && percentValue <=92 ){
            singleRow.cells[j].innerHTML='A-';
        }
        else if(percentValue>= 87 && percentValue <=89 ){
            singleRow.cells[j].innerHTML='B+';
        }
        else if(percentValue>= 83 && percentValue <=86 ){
            singleRow.cells[j].innerHTML='B';
        }
        else if(percentValue>= 80 && percentValue <=82 ){
            singleRow.cells[j].innerHTML='B-';
        }
        else if(percentValue>= 77 && percentValue <=79 ){
            singleRow.cells[j].innerHTML='C+';
        }
        else if(percentValue>= 73 && percentValue <=76 ){
            singleRow.cells[j].innerHTML='C';
        }
        else if(percentValue>= 70 && percentValue <=72 ){
            singleRow.cells[j].innerHTML='C-';
        }
        else if(percentValue>= 67 && percentValue <=69 ){
            singleRow.cells[j].innerHTML='D+';
        }
        else if(percentValue>= 63 && percentValue <=66 ){
            singleRow.cells[j].innerHTML='D';
        }
        else if(percentValue>= 60 && percentValue <=61 ){
            singleRow.cells[j].innerHTML='D-';
        }
        else if(percentValue < 62 ){
            singleRow.cells[j].innerHTML='F';
        }
    }else{
        if(percentValue>=93){
            singleRow.cells[j].innerHTML='4.0';
        }
        else if(percentValue>= 90 && percentValue <=92 ){
            singleRow.cells[j].innerHTML='3.7';
        }
        else if(percentValue>= 90 && percentValue <=92 ){
            singleRow.cells[j].innerHTML='3.7';
        }
        else if(percentValue>= 87 && percentValue <=89 ){
            singleRow.cells[j].innerHTML='3.3';
        }
        else if(percentValue>= 83 && percentValue <=86 ){
            singleRow.cells[j].innerHTML='3.0';
        }
        else if(percentValue>= 83 && percentValue <=86 ){
            singleRow.cells[j].innerHTML='3.0';
        }
        else if(percentValue>= 80 && percentValue <=82 ){
            singleRow.cells[j].innerHTML='2.7';
        }
        else if(percentValue>= 77 && percentValue <=79 ){
            singleRow.cells[j].innerHTML='2.3';
        }
        else if(percentValue>= 73 && percentValue <=76 ){
            singleRow.cells[j].innerHTML='2.0';
        }
        else if(percentValue>= 70 && percentValue <=72 ){
            singleRow.cells[j].innerHTML='1.7';
        }
        else if(percentValue>= 67 && percentValue <=69 ){
            singleRow.cells[j].innerHTML='1.3';
        }
        else if(percentValue>= 63 && percentValue <=66 ){
            singleRow.cells[j].innerHTML='1.0';
        }
        else if(percentValue>= 60 && percentValue <=61 ){
            singleRow.cells[j].innerHTML='0.7';
        }
        else if(percentValue < 62 ){
            singleRow.cells[j].innerHTML='0.0';
        }
    }

}

//checks for valid number
//https://stackoverflow.com/questions/175739/built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number#:~:text=Try%20the%20isNan%20function%3A,Otherwise%20it%20returns%20false.
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isFinite
//https://www.w3schools.com/jsref/jsref_parsefloat.asp
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

//called by clicking the percentage column header, changes the value of averageGradeType and the HTML associated
function toggleGrades(){

    var tableHead = document.getElementById('myTable').tHead;
    var headerRow = tableHead.rows[0];
    var lastColId = headerRow.cells.length;
    var lastCol = headerRow.cells[lastColId-1];

    if(averageGradeType == 3){
        averageGradeType = 1;
    }else{
        averageGradeType+=1;
    }
    sum();
    if(averageGradeType ==3){
        lastCol.innerHTML="Average [4.0]";
    }
    if(averageGradeType ==2){
        lastCol.innerHTML="Average [Letter]";
    }
    if(averageGradeType ==1){
        lastCol.innerHTML="Average (%)";
    }


}
