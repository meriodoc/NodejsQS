// $('#sandbox-container .input-group.date').datepicker({
//     format: "dd/mm/yyyy",
//     maxViewMode: 3,
//     todayBtn: true,
//     clearBtn: true,
//     daysOfWeekDisabled: "0",
//     todayHighlight: true
// });

function placeOrder()
  {
    window.location.href="/checkoutthankyou?Date="+document.getElementById('datepick').value
  }
;

document.getElementById('calbut').onclick = function() {
    document.getElementById('datepick').focus();
};

document.getElementById('editAddress').onclick = function() {
    document.getElementById('textarea').focus();
};
