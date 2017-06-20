function mailIt() {
var elms=document.forms[0].elements;
var q='Dear '+elms.name.value+'&#37;0AYour '+elms.comment.value+' Quickspaza';
document.forms[0].action='mailto:meriodoc@gmail.com?cc='+elms.email.value+'&subject=Feedback form&body=' + q;
document.forms[0].submit();
};
