// Call the dataTables jQuery plugin
$(document).ready(function() {
    getClientList();

    $("#client-option").change(function() {
        getTableList($("#client-option").val());
    });


    $("#trg-btn").click(function() {
        getTableData($("#client-option").val(), $("#table-option").val(), $("#date-input").val());
    });

    
});


function getTableData(client, table, date) {
    
    var params = `client=${client}&table=${table}&date=${date}`
    var data_result = {};
    $.ajax({
        url: "/main/v1/data/table_data?"+params, 
        success: function(result){
            // $("#column-head").empty();
            // for(var i=0; i<result.length; i++){
            //     html_block = `<th>${result[i].data}</th>`;
            //     $("#column-head").append(html_block);
            // }
        
            data_result = {"data": result.data, "columns": result.columns}
            $('#table-cont').empty();
        }, 
        complete: function() {
            populateTable(data_result.data, data_result.columns);
        }
    });
}

function populateTable(dataSet, columns){
    
    $('#table-cont').html( '<table class="table table-bordered" id="dataTable" width="100%" cellspacing="0"></table>' );

    $('#dataTable').DataTable({
        
        data: dataSet,
        columns: columns,
        "bDestroy": true
    });

    


    
}

function getClientList() {
    
    $.ajax({
        url: "/main/v1/data/clients", 
        success: function(result){
            
            for(var i=0; i<result.length; i++){
                html_block = `<option value="${result[i]}">${result[i]}</option>`;
                $("#client-option").append(html_block);
            }
            
        }, 
        complete: function(data) {
            getTableList($("#client-option").val());
        }
    });
    
}

function getTableList(client){
    $("#table-option").empty();
    $.ajax({
        url: "/main/v1/data/tables?client="+client, 
        success: function(result){
            
            for(var i=0; i<result.length; i++){
                html_block = `<option value="${result[i]}">${result[i]}</option>`;
                $("#table-option").append(html_block);
            }
            
        }, 
        complete: function(data) {
           
        }
    });
}