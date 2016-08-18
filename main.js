jQuery(document).ready(function(){
    var hideEverything = function(){
        $("#divTabletas").hide();
        $("#divAerosoles").hide();
        $("#divDifusores").hide();
        $("#divResumen").hide();
    }
    hideEverything();
    var getLocalStorage = function(){
        //get the local storage


        //var jazDiezLs = localStorage.getItem("jazDiez");
        //console.log('datos del local storage: '+ jazDiezLs);
        //set the local storage
        //document.getElementById("Jazmin10input").innerHTML = jazDiezLs;
        //document.getElementById("Jazmin10input").value = String(jazDiezLs);
        //var getlocal = localStorage.getItem("precios");
        //parslocal = JSON.parse(getlocal)
        //localStorage.setItem("precios", JSON.stringify(nuevovalor));
    }
    getLocalStorage();

    /*log in*/
    var loginData={username:'test',password:'shto33'}

   jQuery.ajax({
        url: 'http://www.productosnano.com/index.php?route=api/login',
        type: 'POST',
        dataType:'json',
        data: loginData,
        success: function(data){
            console.log('success');
            console.log(data);  
        },
        error: function(error){
            console.log('error: ',error);       
        }
    });
});
//variables globales
var globalQuantity = 0;
var globalTotalMoney = 0;
var globalSubTotal = 0;
var globalImpuesto = 0;



var hideEverythingTwice=function(){
    $("#divTabletas").hide();
    $("#divAerosoles").hide();
    $("#divDifusores").hide();
    $("#divAceites").hide();
    $("#divResumen").hide();
}

var incrementInput = function(idField){
    var actualNumber = parseInt(document.getElementById(idField).value);
    var newValue = actualNumber  + 1;
    document.getElementById(idField).value = String(newValue);
   
}

var decrementInput = function(idField){
    var actualNumber = parseInt(document.getElementById(idField).value);
    if(actualNumber > 0){
        var newValue = actualNumber  - 1;
        document.getElementById(idField).value = String(newValue);
    };
}

function plusClick(inputId,aroma,producId,idField,aromaId){
    incrementInput(idField);
    console.log('inputId: ',inputId);
    console.log('cantidad producto: ',document.getElementById(idField).value);

    var productData=`{
            "product_id":"`+producId+`",
            "quantity": "1",
            "option[`+aromaId+`]":"`+aroma+`"
        }`;

    console.log(productData);
    productApi = JSON.parse(productData);

    
    jQuery.ajax({
        url: 'http://www.productosnano.com/index.php?route=api/cart/add',
        type: 'POST',
        dataType:'json',
        data: productApi,
        success: function(data){
            console.log('success aadding product to cart by input');
            console.log(data);
            getResume();
            /*var jazDiezMl = document.getElementById("Jazmin10input").value;
            localStorage.setItem("jazDiez", JSON.stringify(jazDiezMl));
            var inputsAceites = $("#divAceites").map(function(){
                    return $(this).val();
                }).get();
            console.log('inputs: ',inputsAceites);*/
            var inputsAceites = document.getElementById("divAceites").getElementsByTagName("input").getAttribute('value');
            console.log(inputsAceites);

    



         


            //localStorage.setItem("inputsAceites", JSON.stringify(jazDiezMl));
        },
        error: function(error){
            console.log('error adding product by input: ',error);
        }
    });
}
 

function minusClick(inputId,idField,productKey){
    decrementInput(idField);
    console.log('inputId: ',inputId);
    console.log('cantidad producto para editar: ',document.getElementById(idField).value);

    var productDataForEdit=`{
            "key":"`+productKey+`",
            "quantity": "`+document.getElementById(idField).value+`"
        }`;

    productEdit = JSON.parse(productDataForEdit);
    console.log(productEdit);

    jQuery.ajax({
            url: 'http://www.productosnano.com/index.php?route=api/cart/edit',
            type: 'POST',
            dataType:'json',
            data: productEdit,
            success: function(data){
                console.log('success editing the cart ');
                console.log(data);
                getResume();
            },
            error: function(error){
                console.log('error editing the cart: ',error);
            }
    });
}

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
                document.getElementById("price").innerHTML = globalTotalMoney;
                //llenar las tablas del resumen.
                data.totals.map(function(total){    
                    console.log('MAP DE LISTA DE RESUMEN');
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
                    console.log('MAP DE PRODUCTOS');
                    console.log(product);
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
                console.log("Total de productos en el carrito: ",globalQuantity);
                document.getElementById("badge").innerHTML = globalQuantity;
            },
            error: function(error){
               console.log('error getting the info from the cart ',error);
            }
        }); 
    return globalQuantity;
    return globalTotalMoney; 
}    


$("#next-aceites").click(function(){
    hideEverythingTwice();
    $("#divTabletas").show();
    
    /*var inputDiezJazmin = document.getElementById("Jazmin10input").value;
    localStorage.setItem("inputDiezJazmin", inputDiezJazmin);*/
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

//pendiente: local storage, botones fuera del scroll.
//hecho: cantidad en boton de carrito. Precio. resumen tabla 1 y 2.
//urge: localstorage por cada click de mas o menos.





            
