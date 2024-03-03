export default {
    toDbFormat(date){
        if(!date){
            return null;
        }
        if(typeof date == 'object'){
            return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        } else if (typeof date == 'string') {
            var pattern = /(\d{2})\.(\d{2})\.(\d{4})\./;
            var dt = new Date(date.replace(pattern,'$3-$2-$1'));
            return dt.getFullYear()+'-'+(dt.getMonth()+1)+'-'+dt.getDate();
        }
    },
    toAppFormat(date){
        if(!date){
            return null;
        }
        if(typeof date == 'object'){
            return date.getDate()+'.'+(date.getMonth()+1)+'.'+date.getFullYear()+'.';
        } else if (typeof date == 'string') {
            var pattern = /(\d{2})-(\d{2})-(\d{4})-/;
            var dt = new Date(date.replace(pattern,'$3-$2-$1'));
            return dt.getDate()+'.'+(dt.getMonth()+1)+'.'+dt.getFullYear()+'.';
        }
    }
};