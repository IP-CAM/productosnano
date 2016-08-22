/**
 * [when everything its ready do: hide all the divs from the html, get the local storage
 * set in the plus and minus functions, do a log in to be avail to use the api things]
 */
jQuery(document).ready(function(){
    var hideEverything = function(){
        $("#divTabletas").hide();
        $("#divAerosoles").hide();
        $("#divDifusores").hide();
        $("#divResumen").hide();
    }
    hideEverything();
    
    
    var loginData={username:'test',password:'shto33'}

   jQuery.ajax({
        url: 'http://www.productosnano.com/index.php?route=api/login',
        type: 'POST',
        dataType:'json',
        data: loginData,
        success: function(data){
            //console.log('success');
            //console.log(data);  
        },
        error: function(error){
            console.log('error: ',error);       
        }
    });
});
/** 
 * @type {number}
 */
var globalQuantity = 0;
var globalTotalMoney = 0;
var globalSubTotal = 0;
var globalImpuesto = 0;
var dataLocalStorage = [];

var getLocalStorage = function(){
    //show the local storage in the inputs
    var storageData = JSON.parse(localStorage.getItem("InputsValues"));
    console.log('datos traidos del local storage: ',storageData); 
    if(storageData){
        storageData.map(function(field){
            document.getElementById(field.idField).value = field.value;
        });
    } 
    var storageQuantity = localStorage.getItem("QuantityProduct");
    document.getElementById("badge").innerHTML = storageQuantity;
    var storageTotalPrice = localStorage.getItem("totalPrice");
    document.getElementById("price").innerHTML = storageTotalPrice;
}



/**
 * [hideEverythingTwice hide everything outside the document ready]
 * @return {[none]} []
 */
var hideEverythingTwice=function(){
    $("#divTabletas").hide();
    $("#divAerosoles").hide();
    $("#divDifusores").hide();
    $("#divAceites").hide();
    $("#divResumen").hide();
}
/**
 * [incrementInput increment the input of the label buttons]
 * @param  {[id]} idField [id from the input field to increment]
 * @return {[none]}       
 */
var incrementInput = function(idField){
    var actualNumber = parseInt(document.getElementById(idField).value);
    var newValue = actualNumber  + 1;
    document.getElementById(idField).value = String(newValue);
}
/**
 * [decrementInput decrement the input of the label buttons and validate]
 * @param  {[id]} idField [id from the input field to decrement]
 * @return {[none]}        
 */
var decrementInput = function(idField){
    var actualNumber = parseInt(document.getElementById(idField).value);
    if(actualNumber > 0){
        var newValue = actualNumber  - 1;
        document.getElementById(idField).value = String(newValue);
    };
}
/**
 * [plusClick everytime you click the + btn get the values to do a post request and set the local storage]
 * @param  {[id]} inputId  [id from the input field]
 * @param  {[number]} aroma   
 * @param  {[id]} producId
 * @param  {[id]} aromaId  
 * @return {[none]}
 */
function plusClick(inputId,aroma,producId,currentField,aromaId){
    incrementInput(currentField);
    //console.log('inputId: ',inputId);
    //console.log('cantidad producto: ',document.getElementById(currentField).value);

    var productData=`{
        "product_id":"`+producId+`",
        "quantity": "1",
        "option[`+aromaId+`]":"`+aroma+`"
    }`;
    var productLsObject={
        idField:currentField,
        value: document.getElementById(currentField).value
    };
    
    //console.log(productData);
    productApi = JSON.parse(productData);
    //data local storage
    console.log('data local storage: ',productLsObject);

    jQuery.ajax({
        url: 'http://www.productosnano.com/index.php?route=api/cart/add',
        type: 'POST',
        dataType:'json',
        data: productApi,
        success: function(data){
            //console.log('success adding product to cart by input');
            getResume();
            var indexFound=productExist(currentField);
            //console.log('$#$#$# ',indexFound);
            if(indexFound == -1){
                 dataLocalStorage.push(productLsObject);
                 console.log('agrego btn mas');
            }else{
                dataLocalStorage[indexFound].value = document.getElementById(currentField).value;
                console.log('actualizo btn mas');
            }
            localStorage.setItem("InputsValues",JSON.stringify(dataLocalStorage));
        },
        error: function(error){
            console.log('error adding product by input: ',error);
        }
    });
}

function productExist(currentField){
    var indexField = -1;
    dataLocalStorage.map(function(arrayfield,i){
        if(arrayfield.idField === currentField){
            //console.log('entro si es igual');
            indexField = i;
        }
    }); 
    return indexField;
 }
/**
 * [minusClick everytime you click the - btn get the values to do a post request to the api and edit the local storage]
 * @param  {[id]} inputId    [id from the input field]
 * @param  {[id]} idField    
 * @param  {[string]} productKey [key from the product for edit the cart]
 */
function minusClick(inputId,currentField,productKey){
    decrementInput(currentField);
    //console.log('inputId: ',inputId);
    //console.log('cantidad producto para editar: ',document.getElementById(idField).value);

    var productDataForEdit=`{
            "key":"`+productKey+`",
            "quantity": "`+document.getElementById(currentField).value+`"
        }`;

    var newDataProduct={
        idField:currentField, //key product
        value: document.getElementById(currentField).value
    };
    console.log('update data local storage: ',newDataProduct);

    productEdit = JSON.parse(productDataForEdit);
    //console.log(productEdit);

    jQuery.ajax({
            url: 'http://www.productosnano.com/index.php?route=api/cart/edit',
            type: 'POST',
            dataType:'json',
            data: productEdit,
            success: function(data){
                console.log(data);
                getResume();
                var indexFound=productExist(currentField);
                    console.log(' UPDATE ',indexFound);
                    if(indexFound == -1){
                        dataLocalStorage.push(newDataProduct);
                        console.log('agrego en el btn menos');
                    }else{
                        dataLocalStorage[indexFound].value = document.getElementById(currentField).value;
                        console.log('actualizo en el btn menos');
                    }
                localStorage.setItem("InputsValues",JSON.stringify(dataLocalStorage));
            },
            error: function(error){
                console.log('error editing the cart: ',error);
            }
    });
}
/**
 * [getResume takes de data from the api and display it to the label front end
 * this one does a get request bc its asking for the data cart]
 */
function getResume(){
    tbobyMoney = document.querySelector('#tbl-resumen tbody');
    tbobyProducts = document.querySelector('#tbl-resumen-products tbody');
    tbobyMoney.innerHTML="";
    tbobyProducts.innerHTML="";
    var totalproducts =0;

    jQuery.ajax({
            url:'http://www.productosnano.com/index.php?route=api/cart/products',
            type:'GET',
            dataType:'json',
            success: function(data){
                console.log('success getting the info from the cart');
                //imprimir resultados en el modal 
                globalSubTotal = (data.totals[0].text);
                globalImpuesto = (data.totals[1].text);
                globalTotalMoney = (data.totals[2].text);
                localStorage.setItem("totalPrice",globalTotalMoney);
                document.getElementById("price").innerHTML = globalTotalMoney;
                //llenar las tablas del resumen.
                data.totals.map(function(total){    
                    //console.log('MAP DE LISTA DE RESUMEN');
                    var fila = document.createElement('tr');
                    var celdaDetalle = document.createElement('td');
                    var celdaMonto = document.createElement('td');

                    var nodoTxtDetalle = document.createTextNode(total.title);
                    var nodoTxtMonto = document.createTextNode(total.text);

                    $(celdaDetalle).append(nodoTxtDetalle);
                    $(fila).append(celdaDetalle);

                    $(celdaMonto).append(nodoTxtMonto);
                    $(fila).append(celdaMonto);
                    $(tbobyMoney).append(fila);
                });

                //console.log('total de dinero a pagar: '+ globalTotalMoney);
                //total de productos
               
                data.products.map(function(product){
                    //console.log('MAP DE PRODUCTOS');
                    //console.log(product);
                    var fila = document.createElement('tr');
                    var celdaProduct = document.createElement('td');
                    var celdaQuantity = document.createElement('td');
                    var celdaPrice = document.createElement('td');

                    var nodoTxtProduct = document.createTextNode(product.name);
                    var nodoTxtQuantity = document.createTextNode(product.quantity);
                    var nodoTxtPrice = document.createTextNode(product.price);

                    $(celdaProduct).append(nodoTxtProduct);
                    $(fila).append(celdaProduct);

                    $(celdaQuantity).append(nodoTxtQuantity);
                    $(fila).append(celdaQuantity);

                    $(celdaPrice).append(nodoTxtPrice);
                    $(fila).append(celdaPrice);

                    $(tbobyProducts).append(fila);

                    totalproducts += parseInt(product.quantity);
                });
                globalQuantity = totalproducts;
                //console.log("Total de productos en el carrito: ",globalQuantity);
                localStorage.setItem("QuantityProduct",globalQuantity);
                document.getElementById("badge").innerHTML = globalQuantity;
            },
            error: function(error){
               console.log('error getting the info from the cart ',error);
            }
        }); 
    return globalQuantity;
    return globalTotalMoney; 
}    



getLocalStorage();

/**
 * [this ones hide and show for the siguiente and atras buttons]
 */
$("#next-aceites").click(function(){
    hideEverythingTwice();
    $("#divTabletas").show();
});
$("#next-tabletas").click(function(){
    hideEverythingTwice();
    $( "#divAerosoles" ).show();
});
$("#next-aerosoles").click(function(){
    hideEverythingTwice();
    $( "#divDifusores" ).show();
});
$("#next-difusores").click(function(){
    hideEverythingTwice();
    $( "#divResumen" ).show();
});
$("#back-tabletas").click(function(){
    hideEverythingTwice();
    $( "#divAceites" ).show();
});
$("#back-aerosoles").click(function(){
    hideEverythingTwice();
    $( "#divTabletas" ).show();
});
$("#back-difusores").click(function(){
    hideEverythingTwice();
    $("#divAerosoles" ).show();
});
$("#back-resumen").click(function(){
   hideEverythingTwice();
    $( "#divDifusores" ).show();
}); 







            
