$ (function(){
    if($("textarea#description").length){
        CKEDITOR.replace("description");
        CKEDITOR.config.allowedContent = true;
    }
})