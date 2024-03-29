var $tabContainer = document.querySelector('.tab-container');
var $tab = document.querySelectorAll('.tab');
var $view = document.querySelectorAll('.view');

$tabContainer.addEventListener('click', viewSwap);

function viewSwap(event) {
  if (event.target && event.target.matches('.tab')) {
    for (var i = 0; i < $tab.length; i++) {
      if ($tab[i] === event.target) {
        $tab[i].className = 'tab active';
      } else {
        $tab[i].className = 'tab';
      }
    }
    var $dataView = event.target.getAttribute('data-view');
    for (var j = 0; j < $view.length; j++) {
      if ($view[j].getAttribute('data-view') === $dataView) {
        $view[j].setAttribute('class', 'view');
      } else {
        $view[j].setAttribute('class', 'view hidden');
      }
    }
  }
}

var $productListing = document.querySelector('#product-listings');
var $loadingDiv = document.querySelector('.loading');

var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://makeup-api.herokuapp.com/api/v1/products.json?rating_greater_than=3');
xhr.responseType = 'json';
$loadingDiv.className = 'loading';
xhr.addEventListener('load', function () {

  event.preventDefault();

  for (var i = 0; i < xhr.response.length; i++) {
    var newListing = {
      name: xhr.response[i].name,
      price: xhr.response[i].price,
      entryId: xhr.response[i].id,
      image: xhr.response[i].image_link,
      description: xhr.response[i].description
    };
    if (xhr.response[i].price !== '0.0' && xhr.response[i].price !== null) {
      var makeUpProducts = renderListing(newListing);
      $productListing.appendChild(makeUpProducts);
    }
    if (xhr.response >= 400) {
      console.error('Sorry! There is an error with this request');
    }
  }
  $loadingDiv.className = 'loading hidden';
});
xhr.send();

function renderListing(listing) {
  event.preventDefault();
  var $imgBroken = document.querySelectorAll('img');
  [].forEach.call($imgBroken, function (event) {
    event.addEventListener('error', function (event) {
      event.target.src = './images/image.png';
    });
  });

  var makeUpContainer = document.createElement('ul');

  var makeUpListing = document.createElement('li');
  makeUpListing.setAttribute('class', 'col');
  makeUpContainer.appendChild(makeUpListing);

  var firstDiv = document.createElement('div');
  firstDiv.setAttribute('class', 'card h-100');
  makeUpListing.appendChild(firstDiv);

  var productImg = document.createElement('img');
  productImg.setAttribute('src', listing.image);
  productImg.setAttribute('class', 'card-img-top');
  productImg.setAttribute('alt', 'product image');
  firstDiv.appendChild(productImg);

  var secondDiv = document.createElement('div');
  secondDiv.setAttribute('class', 'card-body');
  firstDiv.appendChild(secondDiv);

  var productName = document.createElement('h5');
  productName.textContent = capitalizeWords(listing.name);
  productName.setAttribute('class', 'card-title fw-bold pb-2');
  secondDiv.appendChild(productName);

  var productPrice = document.createElement('span');
  productPrice.textContent = 'Price: $' + Number.parseFloat(listing.price).toFixed(2);
  productPrice.setAttribute('class', 'card-text fs-5');
  secondDiv.appendChild(productPrice);

  makeUpListing.setAttribute('data-entry-id', listing.entryId);

  return makeUpListing;
}

function capitalizeWords(string) {
  var array = string.split(' ');
  var newString = '';
  for (var i = 0; i < array.length; i++) {
    var word = array[i];
    var newWord = word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase();
    newString = newString + ' ' + newWord;
  }
  return newString.slice(1);
}

function listingHomePage(event) {
  $productDetails.classList.add('hidden');
  $productListing.classList.remove('hidden');
  $heroImg.classList.remove('hidden');
}

var $homeButton = document.querySelector('.home-button');
$homeButton.addEventListener('click', homeButtonClicked);
function homeButtonClicked(event) {
  if (event.target.tagName === 'A') {
    return listingHomePage();
  }
}

function detailListingPage() {
  $productDetails.classList.remove('hidden');
  $productListing.classList.add('hidden');
  $heroImg.classList.add('hidden');
  $saveSubmitButton.classList.remove('hidden');
  $deleteButton.classList.add('hidden');
}

var $productDetails = document.querySelector('.details-page');
var $productImageDetails = document.querySelector('.product-img-details');
var $productNameDetails = document.querySelector('.product-name-span');
var $productPriceDetails = document.querySelector('.product-price-span');
var $productDescriptionDetails = document.querySelector('.product-description-details');
var $heroImg = document.querySelector('.hero');

$productListing.addEventListener('click', productListingClicked);
function productListingClicked(event) {

  var getListingItem = event.target.closest('li');
  var getListingId = parseInt(getListingItem.getAttribute('data-entry-id'));
  detailListingPage();

  for (var i = 0; i < xhr.response.length; i++) {
    if (xhr.response[i].id === getListingId) {
      $productImageDetails.setAttribute('src', xhr.response[i].image_link);
      $productNameDetails.textContent = xhr.response[i].name;
      $productPriceDetails.textContent = '$' + Number.parseFloat(xhr.response[i].price).toFixed(2);
      $productDescriptionDetails.textContent = xhr.response[i].description;

      var detailsObject = {
        image: xhr.response[i].image_link,
        name: xhr.response[i].name,
        price: '$' + Number.parseFloat(xhr.response[i].price).toFixed(2),
        id: xhr.response[i].id,
        description: xhr.response[i].description
      };
      data.id = detailsObject;
      var savedProducts = renderSavedItems(detailsObject);
      $savedItemsStorage.appendChild(savedProducts);

    }
  }
}

function containsObject(object, array) {
  for (var i = 0; i < array.length; i++) {
    if (object.id === array[i].id) {
      return true;
    }
  }
  return false;
}

var $saveSubmitButton = document.querySelector('.save-submit-button');
$saveSubmitButton.addEventListener('click', saveSubmitButtonFunction);
function saveSubmitButtonFunction(event) {
  event.preventDefault();

  if (event.target.matches('.save-submit-button')) {
    if (containsObject(data.id, data.save) !== true) {
      data.save.push(data.id);
    }
  }
  savedHomePage();
}

function savedPage() {
  $savedHeroImg.classList.remove('hidden');
  $savedItemsStorage.classList.remove('hidden');
  $deleteButton.classList.remove('hidden');
  $saveSubmitButton.classList.add('hidden');
  $productDetails.classList.add('hidden');
  $savedPage.classList.remove('hidden');
}

var $savedPage = document.querySelector('.saved-page');
var $savedItemsStorage = document.querySelector('#saved-items');
var $savedHomePageButton = document.querySelector('.saved-button');
$savedHomePageButton.addEventListener('click', savedHomePage);
function savedHomePage(event) {

  savedPage();

  removeAllChildNodes($savedItemsStorage);

  for (var i = 0; i < data.save.length; i++) {
    var dataSavedItems = data.save[i];
    var savedProductsInStorage = renderSavedItems(dataSavedItems);
    $savedItemsStorage.appendChild(savedProductsInStorage);
  }
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function renderSavedItems(listing) {

  var savedContainer = document.createElement('ul');

  var savedListing = document.createElement('li');
  savedListing.setAttribute('class', 'col');
  savedContainer.appendChild(savedListing);

  var firstDiv = document.createElement('div');
  firstDiv.setAttribute('class', 'card h-100');
  savedListing.appendChild(firstDiv);

  var productImg = document.createElement('img');
  productImg.setAttribute('src', listing.image);
  productImg.setAttribute('class', 'card-img-top');
  productImg.setAttribute('alt', 'product image');
  firstDiv.appendChild(productImg);

  var secondDiv = document.createElement('div');
  secondDiv.setAttribute('class', 'card-body');
  firstDiv.appendChild(secondDiv);

  var productName = document.createElement('h5');
  productName.textContent = capitalizeWords(listing.name);
  productName.setAttribute('class', 'card-title fw-bold pb-2');
  secondDiv.appendChild(productName);

  var productPrice = document.createElement('span');
  productPrice.textContent = 'Price: ' + listing.price;
  productPrice.setAttribute('class', 'card-text fs-5');
  secondDiv.appendChild(productPrice);

  savedListing.setAttribute('data-entry-id', listing.id);

  return savedListing;
}

var $savedHeroImg = document.querySelector('.saved-hero-img');
var $deleteButton = document.querySelector('.delete-button');

function savedItemsDetails() {
  $productDetails.classList.remove('hidden');
  $productListing.classList.add('hidden');
  $heroImg.classList.add('hidden');
  $savedHeroImg.classList.add('hidden');
  $savedItemsStorage.classList.add('hidden');
}

$savedItemsStorage.addEventListener('click', savedItemStorageFunction);
function savedItemStorageFunction(event) {
  var getListingItem = event.target.closest('li');
  var getListingId = parseInt(getListingItem.getAttribute('data-entry-id'));
  savedItemsDetails();

  for (var i = 0; i < xhr.response.length; i++) {
    if (xhr.response[i].id === getListingId) {
      $productImageDetails.setAttribute('src', xhr.response[i].image_link);
      $productNameDetails.textContent = xhr.response[i].name;
      $productPriceDetails.textContent = '$' + Number.parseFloat(xhr.response[i].price).toFixed(2);
      $productDescriptionDetails.textContent = xhr.response[i].description;

      var detailsObject = {
        image: xhr.response[i].image_link,
        name: xhr.response[i].name,
        price: '$' + Number.parseFloat(xhr.response[i].price).toFixed(2),
        id: xhr.response[i].id,
        description: xhr.response[i].description
      };
      data.id = detailsObject;
    }
  }
}

$deleteButton.addEventListener('click', deleteButtonFunction);

function deleteButtonFunction(event) {
  if (event.target.matches('.delete-button') && containsObject(data.id, data.save) === true) {
    for (var i = 0; i < data.save.length; i++) {
      if (data.id.id === data.save[i].id) {
        data.save.splice(i, 1);
      }
    }
  }
  savedHomePage();
}
