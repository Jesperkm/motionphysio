var Shop = function(element) {
    this.$element = $(element);
    this.init();
};

Shop.prototype.init = function() {
    // Session Key
    this.sessionKey = 'cart';

    // Products
    this.$addToCartBtns = this.$element.find('li.shop');

    // Cart
    this.$cart         = $('#shopping-cart');
    this.$cartProducts = this.$cart.find('#cart-products');
    this.$cartTotal    = this.$cart.find('#cart-total span');

    // if cart not in storage, init a new cart
    if(!sessionStorage.getItem(this.sessionKey)) {
        sessionStorage.setItem(this.sessionKey, JSON.stringify({
            items: {},
            total: 0
        }));
    }

    // init
    this.addToCart();
    this.updateCart();
};

/*
    Products
*/

// adds items to cart
// addToCart buttons should have a data-price and a data-name
Shop.prototype.addToCart = function() {
    var self = this;

    self.$addToCartBtns.each(function() {
        var $this = $(this);
        var name  = $this.data('name');
        var price = parseFloat($this.data('price'));

        if (price && name) {
            $this.on('click', function() {
                if (!$(this).parent().hasClass('selecting-quantity-one')) {
                    // set parent as active one
                    $('.box ul').removeClass('selecting-quantity-one');
                    $(this).parent().addClass('selecting-quantity-one');
                }
                else {
                    // get quantity
                    var qty = parseInt($this.parent().find('.quantity-input').val());
                    
                    // get total price for item(s)
                    var subTotal = qty * price;

                    // get cart as json
                    var cart = JSON.parse(sessionStorage.getItem(self.sessionKey));
                    
                    var items = cart.items;

                    // update item
                    items[name] = items[name] || {qty: 0};
                    items[name].price = price;
                    items[name].qty += qty;

                    cart.items = items;

                    // update total price
                    cart.total = parseFloat(cart.total) + subTotal;
                    
                    // update cart
                    sessionStorage.setItem(self.sessionKey, JSON.stringify(cart));
                    self.updateCart();
                }
            });
        }
    });
};


/*
    Cart
*/

Shop.prototype.updateCart = function() {
    if (this.$cartProducts.length) {
        var self = this;
        var cart = JSON.parse(sessionStorage.getItem(this.sessionKey));
        var items = cart.items;

        this.$cartProducts.empty();

        for (var key in items) {
            if (items.hasOwnProperty(key)) {
                this.$cartProducts.append(
                    '<div data-key="'+key+'"><p>Name: ' + key + '</p><p>Price: ' +
                    items[key].price + '</p><p>Quantity: ' +
                    items[key].qty + '</p><a href="#" class="remove-product">Remove</a></div>'
                );
            }
        }

        this.$cartTotal.text(cart.total);

        this.$cartProducts.find('a.remove-product').on('click', function(e) {
            e.preventDefault();

            // get product key
            var key = $(this).parent().data('key');

            // update cart total
            var productTotal = items[key].qty * items[key].price;
            cart.total -= productTotal;

            // remove product from cart
            delete cart.items[key];

            // update cart
            sessionStorage.setItem(self.sessionKey, JSON.stringify(cart));
            self.updateCart();
        });
    }
};