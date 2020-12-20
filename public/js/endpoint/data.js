// Call the dataTables jQuery plugin
$(document).ready(function() {
    getClientList();

    $("#client-option").change(function() {
        getTableList($("#client-option").val());
    });

    $('#dataTable').DataTable();
});


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