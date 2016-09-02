/**
 * [when everything its ready do: hide all the divs from the html, get the local storage
 * set in the plus and minus functions, do a log in to be avail to use the api things]
 */
jQuery(document).ready(function() {
    var hideEverything = function() {
        $("#divTabletas").hide();
        $("#divAerosoles").hide();
        $("#divSachet").hide();
        $("#divDifusores").hide();
        $("#divResumen").hide();
        $("#table-toggle-baby").hide();
        $("#table-toggle-bouquet").hide();

    }

    hideEverything();
    var loginData = {
        username: 'test',
        password: 'shto33'
    }

    jQuery.ajax({
        url: 'http://www.productosnano.com/index.php?route=api/login',
        type: 'POST',
        dataType: 'json',
        data: loginData,
        success: function(data) {
            //console.log('success');
            //console.log(data);
        },
        error: function(error) {
            console.log('error: ', error);
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
var storageQuantity;
var storageTotalPrice;
/**
 * [getLocalStorage get the local storage for display]
 */
var getLocalStorage = function() {
    //show the local storage in the inputs
    var storageData = JSON.parse(localStorage.getItem("InputsValues"));
    console.log('datos traidos del local storage: ', storageData);
    if (storageData) {
        storageData.map(function(field) {
            document.getElementById(field.idField).value = field.value;
        });
    }

    storageQuantity = localStorage.getItem("QuantityProduct");
    document.getElementById("badge").innerHTML = storageQuantity;
    document.getElementById("badge-tablets").innerHTML = storageQuantity;
    document.getElementById("badge-aerosoles").innerHTML = storageQuantity;
    document.getElementById("badge-dif").innerHTML = storageQuantity;
    document.getElementById("badge-res").innerHTML = storageQuantity;
    document.getElementById("badge-sachet").innerHTML = storageQuantity;
    storageTotalPrice = localStorage.getItem("totalPrice");
    document.getElementById("price").innerHTML = storageTotalPrice;
    document.getElementById("price-tablets").innerHTML = storageTotalPrice;
    document.getElementById("price-aerosoles").innerHTML = storageTotalPrice;
    document.getElementById("price-dif").innerHTML = storageTotalPrice;
    document.getElementById("price-res").innerHTML = storageTotalPrice;
    document.getElementById("price-sachet").innerHTML = storageTotalPrice;
}

/**
 * [hideEverythingTwice hide everything outside the document ready]
 * @return {[none]} []
 */
function hideEverythingTwice() {
    $("#divTabletas").hide();
    $("#divAerosoles").hide();
    $("#divDifusores").hide();
    $("#divSachet").hide();
    $("#divAceites").hide();
    $("#divResumen").hide();
}
/**
 * [incrementInput increment the input of the label buttons]
 * @param  {[id]} idField [id from the input field to increment]
 * @return {[none]}
 */
function incrementInput(idField) {
    var actualNumber = parseInt(document.getElementById(idField).value);
    var newValue = actualNumber + 1;
    document.getElementById(idField).value = String(newValue);
}
/**
 * [decrementInput decrement the input of the label buttons and validate]
 * @param  {[id]} idField [id from the input field to decrement]
 * @return {[none]}
 */
function decrementInput(idField) {
    var actualNumber = parseInt(document.getElementById(idField).value);
    if (actualNumber > 0) {
        var newValue = actualNumber - 1;
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
function plusClick(inputId, aroma, producId, currentField, aromaId, aromaT, idAromaT) {
    console.log('entra a funcion plusclick');
    incrementInput(currentField);
    //console.log('inputId: ',inputId);
    //console.log('cantidad producto: ',document.getElementById(currentField).value);

    var productData = `{
        "product_id":"` + producId + `",
        "quantity": "1",
        "option[` + aromaId + `]":"` + aroma + `",
        "option[` + idAromaT + `]":"` + aromaT + `"
    }`;
    var productLsObject = {
        idField: currentField,
        value: document.getElementById(currentField).value
    };

    //console.log(productData);
    productApi = JSON.parse(productData);
    //data local storage
    console.log('data local storage: ', productLsObject);

    jQuery.ajax({
        url: 'http://www.productosnano.com/index.php?route=api/cart/add',
        type: 'POST',
        dataType: 'json',
        data: productApi,
        success: function(data) {
            //console.log('success adding product to cart by input');
            console.log(data);
            getResume();
            var indexFound = productExist(currentField);
            //console.log('$#$#$# ',indexFound);
            if (indexFound == -1) {
                dataLocalStorage.push(productLsObject);
                console.log('agrego btn mas');
            } else {
                dataLocalStorage[indexFound].value = document.getElementById(currentField).value;
                console.log('actualizo btn mas');
            }
            localStorage.setItem("InputsValues", JSON.stringify(dataLocalStorage));
        },
        error: function(error) {
            console.log('error adding product by input: ', error);
        }
    });
}

function productExist(currentField) {
    var indexField = -1;
    dataLocalStorage.map(function(arrayfield, i) {
        if (arrayfield.idField === currentField) {
            //console.log('entro si es igual');
            indexField = i;
        }
    }); //map
    return indexField;
}
/**
 * [minusClick everytime you click the - btn get the values to do a post request to the api and edit the local storage]
 * @param  {[id]} inputId    [id from the input field]
 * @param  {[id]} idField
 * @param  {[string]} productKey [key from the product for edit the cart]
 */
function minusClick(inputId, currentField, productKey) {
    console.log('entra a funcion minusclick');
    decrementInput(currentField);
    //console.log('inputId: ',inputId);
    //console.log('cantidad producto para editar: ',document.getElementById(idField).value);

    var productDataForEdit = `{
            "key":"` + productKey + `",
            "quantity": "` + document.getElementById(currentField).value + `"
        }`;

    var newDataProduct = {
        idField: currentField, //key product
        value: document.getElementById(currentField).value
    };
    console.log('update data local storage: ', newDataProduct);

    productEdit = JSON.parse(productDataForEdit);
    //console.log(productEdit);

    jQuery.ajax({
        url: 'http://www.productosnano.com/index.php?route=api/cart/edit',
        type: 'POST',
        dataType: 'json',
        data: productEdit,
        success: function(data) {
            console.log(data);
            getResume();
            var indexFound = productExist(currentField);
            console.log(' UPDATE ', indexFound);
            if (indexFound == -1) {
                dataLocalStorage.push(newDataProduct);
                console.log('agrego en el btn menos');
            } else {
                dataLocalStorage[indexFound].value = document.getElementById(currentField).value;
                console.log('actualizo en el btn menos');
            }
            localStorage.setItem("InputsValues", JSON.stringify(dataLocalStorage));
        },
        error: function(error) {
            console.log('error editing the cart: ', error);
        }
    });
}
/**
 * [getResume takes de data from the api and display it to the label front end
 * this one does a get request bc its asking for the data cart]
 */
function getResume() {
    tbobyMoney = document.querySelector('#tbl-resumen tbody');
    tbobyProducts = document.querySelector('#tbl-resumen-products tbody');
    tbobyMoney.innerHTML = "";
    tbobyProducts.innerHTML = "";
    var totalproducts = 0;

    jQuery.ajax({
        url: 'http://www.productosnano.com/index.php?route=api/cart/products',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log('success getting the info from the cart');
            //imprimir resultados en el modal
            globalSubTotal = (data.totals[0].text);
            globalImpuesto = (data.totals[1].text);
            globalTotalMoney = (data.totals[2].text);
            localStorage.setItem("totalPrice", globalTotalMoney);
            console.log(globalTotalMoney);
            console.log(data);
            document.getElementById("price").innerHTML = globalTotalMoney;
            document.getElementById("price-tablets").innerHTML = globalTotalMoney;
            document.getElementById("price-aerosoles").innerHTML = globalTotalMoney;
            document.getElementById("price-dif").innerHTML = globalTotalMoney;
            document.getElementById("price-res").innerHTML = globalTotalMoney;
            //llenar las tablas del resumen.
            data.totals.map(function(total) {
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

            data.products.map(function(product) {
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
            localStorage.setItem("QuantityProduct", globalQuantity);
            document.getElementById("badge").innerHTML = globalQuantity;
            document.getElementById("badge-tablets").innerHTML = globalQuantity;
            document.getElementById("badge-aerosoles").innerHTML = globalQuantity;
            document.getElementById("badge-dif").innerHTML = globalQuantity;
            document.getElementById("badge-res").innerHTML = globalQuantity;
        },
        error: function(error) {
            console.log('error getting the info from the cart ', error);
        }
    });
    return globalQuantity;
    return globalTotalMoney;
}
/**
 * [compareData compare the api data  to the local storage for sync]
 */
function compareData() {
    $('#myModal').on('show.bs.modal', function(e) {
        var totalproducts = 0;
        tbobyProducts = document.querySelector('#tbl-resumen-products tbody');
        tbobyMoney = document.querySelector('#tbl-resumen tbody');
        tbobyProducts.innerHTML = "";
        tbobyProducts.innerHTML = "";
        console.log('Hidden del modal se activo en compareData');

        jQuery.ajax({
            url: 'http://www.productosnano.com/index.php?route=api/cart/products',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                if (data.products.length > 0) {
                    if (data.totals[2].text == storageTotalPrice) {
                        console.log('los precios y la cantdad del carrito y el modal son iguales');
                        data.products.map(function(product) {
                            console.log('map del modal de cuando son iguales');

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
                        }); //map
                        data.totals.map(function(total) {
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
                        }); //map
                    } else {
                        //precios
                        console.log('los precios y la cantidad del carrito y el modal NO SON IGUALES');
                        globalTotalMoney = data.totals[2].text;
                        console.log('nuevo precio al comparar: ' + globalTotalMoney);
                        document.getElementById("price").innerHTML = globalTotalMoney;
                        document.getElementById("price-tablets").innerHTML = globalTotalMoney;
                        document.getElementById("price-aerosoles").innerHTML = globalTotalMoney;
                        document.getElementById("price-dif").innerHTML = globalTotalMoney;
                        document.getElementById("price-res").innerHTML = globalTotalMoney;
                        document.getElementById("price-sachet").innerHTML = globalTotalMoney;
                        localStorage.setItem("totalPrice", globalTotalMoney);

                        //map para recorrer data. products y obtener la cantidad de productos
                        data.products.map(function(product) {
                            console.log('map del modal de cuando no son iguales');
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
                        }); //map
                        data.totals.map(function(total) {
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
                        }); //map
                        globalQuantity = totalproducts;
                        console.log('nueva cantidad de productos: ' + globalQuantity);
                        //actualizar local storage con el api
                        document.getElementById("badge").innerHTML = globalQuantity;
                        document.getElementById("badge-tablets").innerHTML = globalQuantity;
                        document.getElementById("badge-aerosoles").innerHTML = globalQuantity;
                        document.getElementById("badge-dif").innerHTML = globalQuantity;
                        document.getElementById("badge-res").innerHTML = globalQuantity;
                        document.getElementById("badge-sachet").innerHTML = globalQuantity;
                        localStorage.setItem("QuantityProduct", globalQuantity);
                    } //else
                }
                console.log('success trayendo datos para comparar');
                console.log(data);

            },
            error: function(error) {
                    console.log('Error trayendo datos para comparar ', error);
                } //error
        })
    })
}
getLocalStorage();
compareData();

/**
 * [this ones hide and show for the siguiente and atras buttons]
 *aceites, tabletas, aerosoles, sachets, difusores, resumen.
 *resumen, dif, sac, aerosoles, tablet, aceites.
 *top buttons*/

$("#next-aceites").click(function() {
    hideEverythingTwice();
    $("#divTabletas").show();
});
$("#next-tabletas").click(function() {
    hideEverythingTwice();
    $("#divAerosoles").show();
});
$("#next-aerosoles").click(function() {
    hideEverythingTwice();
    $("#divSachet").show();
});
$("#next-sachet").click(function() {
    hideEverythingTwice();
    $("#divDifusores").show();
});
$("#next-difusores").click(function() {
    hideEverythingTwice();
    $("#divResumen").show();
});
//bottom buttons
$("#down-next-aceites").click(function() {
    hideEverythingTwice();
    $("#divTabletas").show();
});
$("#down-next-tabletas").click(function() {
    hideEverythingTwice();
    $("#divAerosoles").show();
});
$("#down-next-aerosoles").click(function() {
    hideEverythingTwice();
    $("#divSachet").show();
});
$("#down-next-sachet").click(function() {
    hideEverythingTwice();
    $("#divDifusores").show();
});
$("#down-next-difusores").click(function() {
    hideEverythingTwice();
    $("#divResumen").show();
});


$("#back-tabletas").click(function() {
    hideEverythingTwice();
    $("#divAceites").show();
});
$("#back-aerosoles").click(function() {
    hideEverythingTwice();
    $("#divTabletas").show();
});
$("#back-sachet").click(function() {
    hideEverythingTwice();
    $("#divAerosoles").show();
});
$("#back-difusores").click(function() {
    hideEverythingTwice();
    $("#divSachet").show();
});
$("#back-resumen").click(function() {
    hideEverythingTwice();
    $("#divDifusores").show();
});
//bottom btns
$("#down-back-tabletas").click(function() {
    hideEverythingTwice();
    $("#divAceites").show();
});
$("#down-back-aerosoles").click(function() {
    hideEverythingTwice();
    $("#divTabletas").show();
});
$("#down-back-sachet").click(function() {
    hideEverythingTwice();
    $("#divAerosoles").show();
});
$("#down-back-difusores").click(function() {
    hideEverythingTwice();
    $("#divSachet").show();
});
$("#down-back-resumen").click(function() {
    hideEverythingTwice();
    $("#divDifusores").show();
});

//toggle dropdown
$("#toggle-baby").click(function(){
    $( "#table-toggle-baby" ).toggle(2000)
});
$("#toggle-bouquet").click(function(){
    $( "#table-toggle-bouquet" ).toggle(2000)
});