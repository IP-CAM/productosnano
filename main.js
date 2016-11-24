/**
 * [when everything its ready do: hide all the divs from the html, get the local storage
 * set in the plus and minus functions, do a log in to be avail to use the api things]
 */
jQuery(document).ready(function() {

    var loginData = {
        username: 'test',
        password: 'shto33'
    }

    jQuery.ajax({
        url: 'https://www.productosnano.com/index.php?route=api/login',
        type: 'POST',
        dataType: 'json',
        data: loginData,
        success: function(data) {
          console.error("askjdaksjhdbaskdas" , data);
            var resumenStorage;
            function getLocalStorage() {
                var storageData = JSON.parse(localStorage.getItem("InputsValues"));

                if (storageData == null) {
                    console.log('Storage data is null');
                } else {
                    storageData.map(function(field) {
                        if (document.getElementById(field.idField).value) {
                            document.getElementById(field.idField).value = field.value;
                        }
                    });
                }
                //show the local storage in the inputs
                if (storageQuantity) {
                    storageQuantity = localStorage.getItem("QuantityProduct");
                    storageTotalPrice = localStorage.getItem("totalPrice");
                    document.getElementById("badge").innerHTML = storageQuantity;
                    document.getElementById("badge-tablets").innerHTML = storageQuantity;
                    document.getElementById("badge-aerosoles").innerHTML = storageQuantity;
                    document.getElementById("badge-dif").innerHTML = storageQuantity;
                    document.getElementById("badge-res").innerHTML = storageQuantity;
                    document.getElementById("badge-sachet").innerHTML = storageQuantity;
                    document.getElementById("price").innerHTML = storageTotalPrice;
                    document.getElementById("price-tablets").innerHTML = storageTotalPrice;
                    document.getElementById("price-aerosoles").innerHTML = storageTotalPrice;
                    document.getElementById("price-dif").innerHTML = storageTotalPrice;
                    document.getElementById("price-res").innerHTML = storageTotalPrice;
                    document.getElementById("price-sachet").innerHTML = storageTotalPrice;

                    //fill out the resume table from the data of local storage
                    resumenStorage = JSON.parse(localStorage.getItem("resumen"));
                }
                if (resumenStorage) {
                    tbobyProducts = document.querySelector('#tb-resumen tbody');
                    tbobyProducts.innerHTML = "";
                    resumenStorage.map(function(Object) {
                        var fila = document.createElement('tr');
                        var celdaNameOfProduct = document.createElement('td');
                        var celdaQuantityByProduct = document.createElement('td');
                        var celdaPriceByProduct = document.createElement('td');

                        var nodoNameProduct = document.createTextNode(Object.name);
                        var nodoQuantityByProduct = document.createTextNode(Object.quantity);
                        var nodoPriceByProduct = document.createTextNode(Object.price);

                        $(celdaNameOfProduct).append(nodoNameProduct);
                        $(fila).append(celdaNameOfProduct);

                        $(celdaQuantityByProduct).append(nodoQuantityByProduct);
                        $(fila).append(celdaQuantityByProduct);

                        $(celdaPriceByProduct).append(nodoPriceByProduct);
                        $(fila).append(celdaPriceByProduct);

                        $(fila).append(celdaProducto);

                        $(tbobyProducts).append(fila);
                    });
                }
            }
            getLocalStorage();
        }, //success
        error: function(error) {
          console.log('error: ', error);
        }
    });
}); //end of j-docready.
/**
 * [global variables]
 * @type {Number, Arrays}
 */
var globalQuantity = 0;
var globalTotalMoney = 0;
var globalSubTotal = 0;
var globalImpuesto = 0;
var storageQuantity;
var storageTotalPrice;
var resumeData = [];
var dataLocalStorage = [];
if(localStorage.getItem("InputsValues")){
  dataLocalStorage = JSON.parse(localStorage.getItem("InputsValues"));
}


/**
 * [ hide everything outside the document ready]
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
 * [ increment the input of the label buttons]
 * @param  {[id]} idField [id from the input field to increment]
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
    incrementInput(currentField);
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

    productApi = JSON.parse(productData);

    jQuery.ajax({
        url: 'https://www.productosnano.com/index.php?route=api/cart/add',
        type: 'POST',
        dataType: 'json',
        data: productApi,
        success: function(data) {
            getResume();
            var indexFound = productExist(currentField);
            if (indexFound == -1) {
                dataLocalStorage.push(productLsObject);
            } else {
                dataLocalStorage[indexFound].value = document.getElementById(currentField).value;
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
function minusClick(inputId, currentField, productKey) {
    decrementInput(currentField);
    var productDataForEdit = `{
            "key":"` + productKey + `",
            "quantity": "` + document.getElementById(currentField).value + `"
        }`;

    var newDataProduct = {
        idField: currentField, //key product
        value: document.getElementById(currentField).value
    };
    productEdit = JSON.parse(productDataForEdit);
    jQuery.ajax({
        url: 'https://www.productosnano.com/index.php?route=api/cart/edit',
        type: 'POST',
        dataType: 'json',
        data: productEdit,
        success: function(data) {
            getResume();
            var indexFound = productExist(currentField);
            if (indexFound == -1) {
                dataLocalStorage.push(newDataProduct);
            } else {
                dataLocalStorage[indexFound].value = document.getElementById(currentField).value;
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
        url: 'https://www.productosnano.com/index.php?route=api/cart/products',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            if (data !== null && data !== undefined && data !== NaN && data !== 0 && data !== "") {
                globalSubTotal = (data.totals[0].text);
                globalImpuesto = (data.totals[1].text);
                var i;
                data.totals.find(function(total, index) {
                    if (total.title == "Total:") {
                        i = index;
                        globalTotalMoney = total.text;
                        return true;
                    } else {
                        globalTotalMoney = 0;
                        i = undefined;
                        return false;
                    }
                });
                localStorage.setItem("totalPrice", globalTotalMoney);
                document.getElementById("price").innerHTML = globalTotalMoney;
                document.getElementById("price-tablets").innerHTML = globalTotalMoney;
                document.getElementById("price-aerosoles").innerHTML = globalTotalMoney;
                document.getElementById("price-sachet").innerHTML = globalTotalMoney;
                document.getElementById("price-dif").innerHTML = globalTotalMoney;
                document.getElementById("price-res").innerHTML = globalTotalMoney;

                tbobyMoney.innerHTML = "";
                data.totals.map(function(total) {
                    var fila = document.createElement('tr');
                    var celdaDetalle = document.createElement('td');
                    var celdaMonto = document.createElement('td');

                    celdaMonto.setAttribute('id', 'monto-table');

                    var nodoTxtDetalle = document.createTextNode(total.title);
                    var nodoTxtMonto = document.createTextNode(total.text);

                    $(celdaDetalle).append(nodoTxtDetalle);
                    $(fila).append(celdaDetalle);

                    $(celdaMonto).append(nodoTxtMonto);
                    $(fila).append(celdaMonto);
                    $(tbobyMoney).append(fila);
                }); //map

                resumeData = [];
                tbobyProducts.innerHTML = "";
                console.log('adasdas' , data);
                data.products.map(function(product) {
                  var productName= product.name;
                  product.option.map(function(option){
                    if(option.name === "Aroma"){
                      productName += " " + option.value;
                    }
                  })
                  console.log('productName ' ,productName);

                    var dataForLocalStorageResume = {
                        name: productName,
                        price: product.price,
                        quantity: product.quantity
                    }
                    //console.log('product' , product.option);"Aroma"
                    //


                    resumeData.push(dataForLocalStorageResume);
                    localStorage.setItem("resumen", JSON.stringify(resumeData));

                    var fila = document.createElement('tr');
                    var celdaProduct = document.createElement('td');
                    var celdaQuantity = document.createElement('td');
                    var celdaPrice = document.createElement('td');

                    var nodoTxtProduct = document.createTextNode(productName);
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
                localStorage.setItem("QuantityProduct", globalQuantity);
                document.getElementById("badge").innerHTML = globalQuantity;
                document.getElementById("badge-tablets").innerHTML = globalQuantity;
                document.getElementById("badge-aerosoles").innerHTML = globalQuantity;
                document.getElementById("badge-dif").innerHTML = globalQuantity;
                document.getElementById("badge-sachet").innerHTML = globalQuantity;
                document.getElementById("badge-res").innerHTML = globalQuantity;
            } //if
        },
        error: function(error) {
            console.log('error getting the info from the cart ', error);
        }
    });
}
/**
 * [compareData compare the api data  to the local storage for sync]
 */

function compareData() {
    $('#myModal').on('shown.bs.modal', function(e) {
        var totalproducts = 0;
        jQuery.ajax({
            url: 'https://www.productosnano.com/index.php?route=api/cart/products',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                tbobyProducts = document.querySelector('#tbl-resumen-products tbody');
                tbobyMoney = document.querySelector('#tbl-resumen tbody');
                var localTotal = 0;
                console.log("asdasdas" , data);
                if (data.products.length > 0) {
                    var n = 0;
                    data.totals.find(function(total, index) {
                        if (total.title == "Total:") {
                            n = index;
                            localTotal = total.text;
                            return true;
                        } else {
                            n = undefined;
                            localTotal = n;

                            return false;
                        }
                    });

                    if (localTotal != undefined && data.totals[n].text == storageTotalPrice) {
                        data.products.map(function(product) {
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
                        globalTotalMoney = data.totals[n].text;
                        document.getElementById("price").innerHTML = globalTotalMoney;
                        document.getElementById("price-tablets").innerHTML = globalTotalMoney;
                        document.getElementById("price-aerosoles").innerHTML = globalTotalMoney;
                        document.getElementById("price-dif").innerHTML = globalTotalMoney;
                        document.getElementById("price-res").innerHTML = globalTotalMoney;
                        document.getElementById("price-sachet").innerHTML = globalTotalMoney;
                        localStorage.setItem("totalPrice", globalTotalMoney);

                        //map para recorrer data. products y obtener la cantidad de productos
                        data.products.map(function(product) {
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
                        document.getElementById("badge").innerHTML = globalQuantity;
                        document.getElementById("badge-tablets").innerHTML = globalQuantity;
                        document.getElementById("badge-aerosoles").innerHTML = globalQuantity;
                        document.getElementById("badge-dif").innerHTML = globalQuantity;
                        document.getElementById("badge-res").innerHTML = globalQuantity;
                        document.getElementById("badge-sachet").innerHTML = globalQuantity;
                        localStorage.setItem("QuantityProduct", globalQuantity);
                    } //else
                }
            },
            error: function(error) {
                console.log('Error getting the cart for compare', error);
            } //error
        });
    });
}
//getLocalStorage();
compareData();;

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
$("#top-back-resumen").click(function() {
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
