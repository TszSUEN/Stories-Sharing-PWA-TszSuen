//
function onSubmit() {
    const data = JSON.stringify($(this).serializeArray());
    // const data= {name: document.getElementById('name').value};
    try{
        sendAjaxQuery('/recommendation', data);
    } catch (e){
        alert('not a valid JSON structure '+e);
    }
    event.preventDefault();
}

