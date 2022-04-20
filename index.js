var lookup = {}; //dropdown data
var jsonData = {}; //card data
var excelURL = "https://smrithisiva.github.io/POC-HCA/DB.csv"; //Card details are available in this csv
var dropdownURL = "https://smrithisiva.github.io/POC-HCA/DB-DropdownValues.csv"; //IMOcategory to Giftbasket relation is available in this csv
$(window).on('load',function () {
    var pageUrl = window.location.href;
    if (pageUrl.includes('detailed-dashboard')) {
        readDB("",excelURL,"cards");
    }
    else{
        setSearchFields();
    }
    //Update the title of the drodpown cell to default value incase all the dropdown values are deselected
    $(document).on('click', function () {
        let count=0;
        let msdata = $(".btn.dropdown-toggle.btn-light")[0].title;
        if (msdata.includes('Select all applicable Gift Baskets') || msdata.includes('Nothing selected')) {
            for (let i = 0; i < $('.dropdown-menu.inner.show li').length; i++) {
                if (!$('.dropdown-menu.inner.show li')[i].classList.contains('selected')) {
                    count++;
                }
            }
            if (count === $('.dropdown-menu.inner.show li').length) {
                $(".btn.dropdown-toggle.btn-light")[0].title = "Select all applicable Gift Baskets";
                $(".filter-option-inner-inner")[0].innerText = "Select all applicable Gift Baskets";
            } 
        }
    });
    //Select the drodpown values that are updated in the title from session variable
    $(".btn.dropdown-toggle.btn-light").on('click', function () {
        if($(".btn.dropdown-toggle.btn-light.bs-placeholder")[0]){
            let msdata = $(".btn.dropdown-toggle.btn-light.bs-placeholder")[0].title;
            for (let i = 0; i < $('.dropdown-menu.inner.show li').length; i++) {
                if (msdata.includes($('.dropdown-menu.inner.show li')[i].innerText)) {
                    $('.dropdown-menu.inner.show li')[i].children[0].click();
                }
            }
        }
    });

    //disbale the rate radio button
    $('input[name="rating"]').unbind('click').click(function () {
        return false;
    });
    
});
//Populate Title for every search field on change event
$(function() {
    $("#Category").change(function() {
      this.title = $(this).val();
    }).change()
  })
$(function() {
    $("#Outcome").change(function() {
      this.title = $(this).val();
    }).change()
  })
$(function() {
    $("#Domain").change(function() {
      this.title = $(this).val();
    }).change()
  })
$(function() {
    $("#Industry").change(function() {
      this.title = $(this).val();
    }).change()
  })
$(function () {
    $("#Buyer").change(function () {
        this.title = $(this).val();
    }).change()
})
 $('#IMOCategory').on('change', function() {
    this.title = $(this).val();
    //Read the relation DB to populate respective GiftBasket with reference to IMOCategory
    if(!lookup.length){
        readDB("", dropdownURL, "");
    }
    else{
        populateDropdown();
    }
 });
function populateDropdown(){
    var selectValue = $('#IMOCategory').val();
    var title = $(".filter-option-inner-inner")[0].innerText;
    // Empty the target field
    $('#GiftBasket').empty();

    // For each chocie in the selected option
    if (lookup[selectValue]){
        for (i = 0; i < lookup[selectValue].length; i++) {
            // Output choice in the target field
            if (selectValue === '--') {
                $('#GiftBasket').append("<option disabled selected>Please select an IMO Category</option>");
            } else {
                $('#GiftBasket').append("<option value='" + lookup[selectValue][i] + "'>" + lookup[selectValue][i] + "</option>");
            }
        }
    }else{
        $('#GiftBasket').append("<option disabled selected>Please select an IMO Category</option>");
    }
    $('#GiftBasket').selectpicker('refresh');
    $(".btn.dropdown-toggle.btn-light")[0].title = title;
    $(".filter-option-inner-inner")[0].innerText = title;
}
//Get Search Criteria as entered by End User
function getSearchCriteria(){
    let searchCriteria = {};
    searchCriteria.keyword = $('#Keyword').val();
    searchCriteria.name = $('#search-title').val();
    searchCriteria.category = $('#Category').val();
    searchCriteria.industry = $('#Industry').val();
    searchCriteria.domain = $('#Domain').val();
    searchCriteria.imo = $('#IMOCategory').val();
    searchCriteria.buyer = $('#Buyer').val();
    searchCriteria.outcome = $('#Outcome').val();
    searchCriteria.giftbox = $(".filter-option-inner-inner")[0].innerText;
    return searchCriteria;
}
//Search results based on SearchCriteria
function searchResult(){
    let searchCriteria = JSON.parse(JSON.stringify(getSearchCriteria()));
    storeInSession(searchCriteria);
    if(!jsonData.length){
        readDB(searchCriteria, excelURL, "cards");
    }else{
        createCards(searchCriteria);
    }
}
//Store the SearchCriteria in Session
function storeInSession(searchCriteria){
    var setsession = window.sessionStorage.setItem("portal-searchCriteria", JSON.stringify(searchCriteria));
}
//Set Search Fields after reading from Session Variable
function setSearchFields(){
    var getsession = window.sessionStorage.getItem("portal-searchCriteria");
    if(getsession){
        let searchCriteria = JSON.parse(getsession)
        $('#Keyword').val(searchCriteria.keyword);
        $('#search-title').val(searchCriteria.name);
        $('#Category').val(searchCriteria.category);
        $('#Industry').val(searchCriteria.industry);
        $('#Domain').val(searchCriteria.domain);
        $('#IMOCategory').val(searchCriteria.imo);
        $('#IMOCategory').trigger('change');
        $('#Buyer').val(searchCriteria.buyer);
        $('#Outcome').val(searchCriteria.outcome);
        $(".filter-option-inner-inner")[0].innerText = searchCriteria.giftbox;
        $(".btn.dropdown-toggle.btn-light")[0].title = searchCriteria.giftbox;
        //Trigger Search Functionality if the Search Fields are not empty or having default values
        if (!((searchCriteria.name.length === 0) &&
            (searchCriteria.keyword.length === 0) &&
            (searchCriteria.industry === '--') &&
            (searchCriteria.category === '--') &&
            (searchCriteria.domain === '--') &&
            (searchCriteria.imo === '--') &&
            (searchCriteria.buyer === '--') &&
            (searchCriteria.outcome === '--') &&
            (searchCriteria.giftbox === 'Select all applicable Gift Baskets' || 
            searchCriteria.giftbox === 'Nothing selected'))){
                $('.search-btn').click();
            }
            else{
            $(".btn.dropdown-toggle.btn-light")[0].title = "Select all applicable Gift Baskets";
            $(".filter-option-inner-inner")[0].innerText = "Select all applicable Gift Baskets"
            }
    }
    else{
        $(".btn.dropdown-toggle.btn-light")[0].title = "Select all applicable Gift Baskets";
        $(".filter-option-inner-inner")[0].innerText = "Select all applicable Gift Baskets"
    }
}
//Clear Filters
function clearFilter(){
    $('#Keyword').val('');
    $('#search-title').val('');
    $('#Category').val('--');
    $('#Industry').val('--');
    $('#Domain').val('--');
    $('#IMOCategory').val('--');
    $('#Buyer').val('--');
    $('#Outcome').val('--');
    $('.tiles-pagination').hide();
    $('.result-tiles').empty();
    $('#GiftBasket').empty();
    $('#GiftBasket').append("<option disabled selected>Please select an IMO Category</option>");
    $('#GiftBasket').selectpicker('refresh');
    $(".btn.dropdown-toggle.btn-light")[0].title = "Select all applicable Gift Baskets";
    $(".filter-option-inner-inner")[0].innerText = "Select all applicable Gift Baskets";
    if ($('.no-record')){
        $('.no-record').hide();
    }
    let searchCriteria = JSON.parse(JSON.stringify(getSearchCriteria()));
    storeInSession(searchCriteria);
}
//Read from Excel DB ? searchCriteria,excelURL,dbType(if cards then populate result cards or else populate dropdown)
function readDB(searchCriteria,excelURL,dbType){
    var url = excelURL;
    var oReq = new XMLHttpRequest();
    var data;
    oReq.open("GET", url, true);
    oReq.responseType = "arraybuffer";

    oReq.onload = function (e) {
        var arraybuffer = oReq.response;

        /* convert data to binary string */
        var data = new Uint8Array(arraybuffer);
        var arr = new Array();
        for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");

        /* Call XLSX */
        var workbook = XLSX.read(bstr, {
            type: "binary"
        });

        /* DO SOMETHING WITH workbook HERE */
        var first_sheet_name = workbook.SheetNames[0];
        /* Get worksheet */
        var worksheet = workbook.Sheets[first_sheet_name];
        if(dbType === "cards"){
            jsonData = XLSX.utils.sheet_to_json(worksheet, {
                raw: true
            });
            var pageUrl = window.location.href;
            if (pageUrl.includes('detailed-dashboard')) {
                detailsPage();
            }
            else {
                createCards(searchCriteria);
            }
        }else{
            let dropdownData = XLSX.utils.sheet_to_json(worksheet, {
                raw: true
            });
            for(let i=0;i<dropdownData.length;i++){
                lookup[dropdownData[i]['IMOCategory']] = dropdownData[i]['GiftBaskets'].split(',');
            }
            lookup['--'] = [''];
            populateDropdown();
        }
    }
    oReq.send();
}
//Create Result Cards based on SearchCriteria
function createCards(searchCriteria){
    $('.result-tiles').empty();
    let resSearchCriteria;
    let searchPer = 100;
    let resultsCount=0;
    for(let i=0;i<jsonData.length;i++){
        resSearchCriteria = JSON.parse(JSON.stringify(searchCriteria));
        let jsonRes = JSON.parse(JSON.stringify(createJSON(i)));
        jsonRes.description = jsonRes.description.length > 120 ? jsonRes.description.substr(0,117)+'...' : jsonRes.description;
        jsonRes.kpis = jsonRes.kpis.length > 120 ? jsonRes.kpis.substr(0, 117) + '...' : jsonRes.kpis;
        let detailsLink = "detailed-dashboard.html?assetName=" + jsonRes.name.replace(new RegExp(' ','g'),'');
        resSearchCriteria.name = resSearchCriteria.name.length === 0 ? jsonRes.name : resSearchCriteria.name;
        resSearchCriteria.keyword = resSearchCriteria.keyword.length === 0 ? jsonRes.keyword : resSearchCriteria.keyword;
        resSearchCriteria.industry = resSearchCriteria.industry === '--' ? jsonRes.industry : resSearchCriteria.industry;
        resSearchCriteria.category = resSearchCriteria.category === '--' ? jsonRes.category : resSearchCriteria.category;
        resSearchCriteria.domain = resSearchCriteria.domain === '--' ? jsonRes.domain : resSearchCriteria.domain;
        resSearchCriteria.imo = resSearchCriteria.imo === '--' ? jsonRes.imo : resSearchCriteria.imo;
        resSearchCriteria.buyer = resSearchCriteria.buyer === '--' ? jsonRes.buyer : resSearchCriteria.buyer;
        resSearchCriteria.outcome = resSearchCriteria.outcome === '--' ? jsonRes.outcome : resSearchCriteria.outcome;
        resSearchCriteria.giftbox = resSearchCriteria.giftbox === 'Select all applicable Gift Baskets' ? jsonRes.giftbox : resSearchCriteria.giftbox;
        if(jsonRes.name.toLowerCase().includes(resSearchCriteria.name.toLowerCase().trim())
        && jsonRes.domain.toLowerCase().includes(resSearchCriteria.domain.toLowerCase())
        && jsonRes.keyword.toLowerCase().includes(resSearchCriteria.keyword.toLowerCase().trim())
        && jsonRes.category.toLowerCase().includes(resSearchCriteria.category.toLowerCase())
        && jsonRes.industry.toLowerCase().includes(resSearchCriteria.industry.toLowerCase())
        && jsonRes.imo.toLowerCase().includes(resSearchCriteria.imo.toLowerCase())
        && jsonRes.outcome.toLowerCase().includes(resSearchCriteria.outcome.toLowerCase())
        && jsonRes.buyer.toLowerCase().includes(resSearchCriteria.buyer.toLowerCase())
        && (jsonRes.giftbox.toLowerCase().includes(resSearchCriteria.giftbox.toLowerCase()) 
            || resSearchCriteria.giftbox.toLowerCase().includes(jsonRes.giftbox.toLowerCase()) ))
        {
            resultsCount +=1;
            searchPer -= 2;
            let htmlBody = '<div class="card col-md-12 card-holder mt-2 no-padding"><div class="row card-container g-0 justify-content-around"><div class="col-md-2 no-padding"><img class="card-size-cus" src="assets/' + jsonRes.image + '" alt="Card image cap"></div><div class="col-md-10"><div class="card-body cust-padding-card-body"><div class="card-title-header"><h4 class="card-title card-heading font-weight-bolder">' + jsonRes.name + '</h4></div><form class="rating tiles-rating">[rating]</form><div class="tiles-rating-reviews"><h7>[review] ratings</h7></div><table class="table  table-bordered "><thead class="table-color"><th scope="row">Industry</th><th scope="row">Domain/Target Capability</th><th scope="row">POC</th><th scope="row">Category</th></thead><tbody><tr><td>' + jsonRes.industry + '</td><td>' + jsonRes.domain + '</td><td>' + jsonRes.poc + '</td><td>' + jsonRes.category + '</td></tr></tbody></table><h5 class="font-weight-bold min-margin card-subheading">Asset Description:</h5><p class="card-text min-margin">' + jsonRes.description + '</p><h5 class="font-weight-bold min-margin card-subheading">Key KPIs/Value Delivered:</h5><p class="card-text min-margin">' + jsonRes.kpis + '</p></div><div class="col-md-12 text-md-center details-overlay mb-1"><div><a href="'+detailsLink+'" class="btn btn-primary details-btn">More Details</a></div></div><div class="percentage-tag">' + (searchPer) + '% Matched</div></div></div ></div>'
            let ratingHtml = '';
            let max = 5;
            let min = 3;
            let maxRatings = 200;
            let minRatings = 50;
            let rand = Math.floor(Math.random() * (max - min + 1)) + min;
            let randRatings = Math.floor(Math.random() * (maxRatings - minRatings + 1)) + minRatings;
            rand = Math.ceil(rand);
            for(let i=5;i>=1;i--){
                if(rand == i){
                    ratingHtml = ratingHtml + '<input type="radio" name="rating" value="' + i + '" id="' + i + '" checked><label for="' + i +'">☆</label>';
                }else{
                    ratingHtml = ratingHtml + '<input type="radio" name="rating" value="' + i + '" id="' + i + '"><label for="' + i +'">☆</label>';
                }
            }
            htmlBody = htmlBody.replace('[rating]',ratingHtml);
            htmlBody = htmlBody.replace('[review]', randRatings);
            $('.result-tiles').append(htmlBody);
        }
        resSearchCriteria = {};
    }
    if(resultsCount !== 0){
        $('.result-tiles').show();
        $('.tiles-pagination').show();
        $('.results-count')[0].innerHTML = 'Results: ' + resultsCount;
        if ($('.no-record')){
            $('.no-record').hide();
        }
        //disbale the rate radio button
        $('input[name="rating"]').unbind('click').click(function () {
            return false;
        });
    }
    else{
        $('.result-tiles').hide();
        $('.tiles-pagination').hide();
        $('.no-record').show();
    }
}
//Populate Details Page by help of QueryParam that contains asset name
function detailsPage(){
    let params = getUrlVars();
    let name = params["assetName"];
    for(let i=0;i<jsonData.length;i++){
        let jsonRes = JSON.parse(JSON.stringify(createJSON(i)));
        if (jsonRes.name.toString().trim().replace(new RegExp(' ', 'g'), '') === name) {
            $('.asset-name')[0].innerHTML = jsonRes.name;
            $('.asset-industry')[0].innerHTML = jsonRes.industry;
            $('.asset-category')[0].innerHTML = jsonRes.category;
            $('.asset-domain')[0].innerHTML = jsonRes.domain;
            $('.asset-ppmd')[0].innerHTML = jsonRes.ppmd;
            $('.asset-poc')[0].innerHTML = jsonRes.poc;
            $('.asset-description')[0].innerHTML = jsonRes.description;
            let keyKPIS = jsonRes.kpis.split(':');
            for (i in keyKPIS) {
                var li = $('<li/>')
                    .appendTo('.key-kpis')
                    .text(keyKPIS[i]);
            }
            let nextGen = jsonRes.nextGen.split(',');
            for (i in nextGen) {
                var li = $('<li/>')
                    .appendTo('.next-gen')
                    .text(nextGen[i]);
            }
            let clientList = jsonRes.client.split(',');
            for(i in clientList){
                var li = $('<li/>')
                    .appendTo('.client-list')
                    .text(clientList[i]);
            }
            $('.project-completed')[0].innerHTML = jsonRes.projectCompleted;
            $('.asset-live-on')[0].innerHTML = jsonRes.liveOn;
            if(jsonRes.percentage !== 'TBD'){
                $('.client-feedback')[0].innerHTML = jsonRes.percentage + '%';
            }
            else{
                $('.client-feedback')[0].innerHTML = jsonRes.percentage;
            }
            
            break;
        }
    }
}
function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
//Create JSON for each card
function createJSON(i){
    let jsonRes = {};
    jsonRes.category = jsonData[i]["Asset Category"] ? jsonData[i]["Asset Category"].toString().trim() : '';
    jsonRes.description = jsonData[i]["Asset Description"] ? jsonData[i]["Asset Description"].toString().trim(): '';
    jsonRes.name = jsonData[i]["Asset Name"] ? jsonData[i]["Asset Name"].toString().trim() : '';
    jsonRes.industry = jsonData[i]["Industry"].toString().trim();
    jsonRes.domain = jsonData[i]["Domain"].toString().trim();
    jsonRes.poc = jsonData[i]["Asset Lead"] ? jsonData[i]["Asset Lead"].toString().trim() : '';
    jsonRes.kpis = jsonData[i]["Value Delivered/Key KPIs"] ? jsonData[i]["Value Delivered/Key KPIs"].toString().trim() : '';
    jsonRes.percentage = jsonData[i]["Positive Client Feedback Percentage"].toString().trim();
    jsonRes.ppmd = jsonData[i]["Project PPMDs"] ? jsonData[i]["Project PPMDs"].toString().trim() : '';
    jsonRes.nextGen = jsonData[i]["Tech/AI/Core Capabilities"] ? jsonData[i]["Tech/AI/Core Capabilities"].toString().trim() : '';
    jsonRes.client = jsonData[i]["Key Accounts/Clients"] ? jsonData[i]["Key Accounts/Clients"].toString().trim() : '';
    jsonRes.assetMaturity = jsonData[i]["Key Accounts/Clients"] ? jsonData[i]["Key Accounts/Clients"].toString().trim() : '';
    jsonRes.projectCompleted = jsonData[i]["Number of projects"] ? jsonData[i]["Number of projects"].toString().trim() : '';
    jsonRes.liveOn = jsonData[i]["Clients Live with"] ? jsonData[i]["Clients Live with"].toString().trim() : '';
    jsonRes.pocTiming = jsonData[i]["Key Accounts/Clients"] ? jsonData[i]["Key Accounts/Clients"].toString().trim() : '';
    jsonRes.image = jsonData[i]["Image Tagging"] ? jsonData[i]["Image Tagging"].toString().trim() : '';
    jsonRes.keyword = jsonData[i]["Keyword tagging"] ? jsonData[i]["Keyword tagging"].toString().trim() : '';
    jsonRes.imo = jsonData[i]["IMO Category"] ? jsonData[i]["IMO Category"].toString().trim() : '';
    jsonRes.buyer = jsonData[i]["Buyer Types"] ? jsonData[i]["Buyer Types"].toString().trim() : '';
    jsonRes.outcome = jsonData[i]["Outcome"] ? jsonData[i]["Outcome"].toString().trim() : '';
    jsonRes.giftbox = jsonData[i]["Gift Baskets"] ? jsonData[i]["Gift Baskets"].toString().trim() : '';
    return jsonRes;
}