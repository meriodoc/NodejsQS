// When I create a new cart the old cart items will be assigned into this constructor method
module.exports = function Cart(oldCart) {
  // Old cart items will be assigned here (Whetehr it is empty or notusing boolean operator
  // to not have object empty else i won't be able to increment it and it will show NAN as in index.js
  this.items = oldCart.items || {};
  this.totalQty = oldCart.totalQty || 0;
  this.totalPrice = oldCart.totalPrice || 0;
// this function is to add a new item to cart
  this.add = function(item, id) {
    // If yes
    var storedItem = this.items[id];
    // If NOT This if is for if product has been added else... line 14 etc
    if (!storedItem) {
      storedItem = this.items[id] = {item:item, qty: 0, price: 0};
    }
    storedItem.qty++;
    storedItem.price = storedItem.item.price * storedItem.qty;
    this.totalQty++;
    this.totalPrice += storedItem.item.price;
  };
  // Implement this function in index.js below the addto cart route
    this.reduceByOne = function(id) {
      this.items[id].qty--;
      this.items[id].price -= this.items[id].item.price;
      this.totalQty--;
      this.totalPrice -= this.items[id].item.price;

      // Adjust so Zero cannot happen
      if (this.items[id].qty <= 0) {
        delete this.items[id];
      }
    };
    // Implement this function in index.js below the addto cart route
      this.reduceByOneCart = function(id) {
        this.items[id].qty--;
        this.items[id].price -= this.items[id].item.price;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.price;

      //  Adjust so Zero cannot happen
        if (this.items[id].qty <= 0) {
          delete this.items[id];
        }
      };
// Doing plus button
// Implement this function in index.js below the addto cart route
  this.increaseByOne = function(id) {
    this.items[id].qty++;
    this.items[id].price += this.items[id].item.price;
    this.totalQty++;
    this.totalPrice += this.items[id].item.price;

    // Adjust so Zero cannot happen
    if (this.items[id].qty <= 0) {
      delete this.items[id];
    }
  };
// End plus button
    this.removeItem = function(id) {
      // all the items of this id = qty
      this.totalQty -= this.items[id].qty;
      // Will remove aggregate price
      this.totalPrice -= this.items[id].price;
      delete this.items[id];
    };

// this will transform my objects above into an array so that i can output a list of my product groups
  this.generateArray = function() {
      var arr = [];
      for (var id in this.items) {
        arr.push(this.items[id]);
      }
      return arr;
  };
};
