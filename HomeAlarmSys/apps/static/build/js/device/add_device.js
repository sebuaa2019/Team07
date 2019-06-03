$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    //console.log(a);
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [ o[this.name] ];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};




var $addDeviceForm = $("#add-device-form");
var $rooms = $("#roomSelect");


$(function () {

    initRoom();
    $("#add-device-btn").click(function () {

        var name = $(this).attr('name');
        if (name ==='save') {
            $.ajax({
                    url: '/device/add/',
                    type: 'POST',
                    data: JSON.stringify($addDeviceForm.serializeObject()),
                    contentType: 'application/json; charset=utf-8',
                    success:function (r) {
                        if (r === '200'){
                            closeModal();
                            $TableManager.n_success(r);
                            $TableManager.refreshTable('deviceTable');
                        }
                        else $TableManager.n_danger(r)
                    }
                }
            );
        }
        if (name === 'update'){
            var $form = $addDeviceForm.serializeObject();
            $form['id'] =  $("#deviceTable").bootstrapTable("getSelections")[0].id;
                $form['status'] =$addDeviceForm.find("input[name='status']:checked").val();
            $form['room'] = $rooms.val();
            $.ajax({
                    url: '/device/update/',
                    type: 'POST',
                    referer:"/device/manage",
                    data: JSON.stringify($form),
                    contentType: 'application/json; charset=utf-8',
                    success:function (r) {
                        if (r === '200'){
                            closeModal();
                            $TableManager.n_success(r);
                            $TableManager.refreshTable('deviceTable');
                        }
                        else $TableManager.n_danger(r)
                    }
                }
            );

        }

    });
});

function closeModal() {
    $('#add-device-btn').attr('name', 'save');
    $('#add-device-modal-title').html('添加设备');
    $TableManager.closeAndRestModal('device-add');

}

function initRoom(){
    $.ajax({
        url:'/room/list/',
        type:'POST',
        contentType:'application/json; utf-8',
        success:function (r) {
            var roomList = r;
            var option = "";
            for (var i = 0; i < roomList.length; i++){

                option += "<option value='" +roomList[i].id+"'>"+roomList[i].room_name+"</option>"
            }
            $rooms.html("").append(option)

        }
    });
}


