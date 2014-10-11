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
    this.$cartShipping = this.$cart.find('#cart-shipping');
    this.$cartTotal    = this.$cart.find('#cart-total span');
    this.$cartPayBtn   = this.$cart.find('#cart-pay');

    this.$paypalForm = this.$cart.find('#paypal-form');

    this.paypalUrl      = 'https://www.sandbox.paypal.com/cgi-bin/webscr';
    this.paypalBusiness = 'isenhard-facilitator@gmail.com';
    this.paypalCurrency = 'DKK';
    this.paypalReturn   = 'http://localhost:3005#thanks';
    this.paypalCancel   = 'http://localhost:3005#cancel';

    // if cart not in storage, init a new cart
    if(!sessionStorage.getItem(this.sessionKey)) {
        sessionStorage.setItem(this.sessionKey, JSON.stringify({
            items: {}
        }));
    }

    // init
    this.addToCart();
    this.updateCart();
    this.payCart();
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

                    // get cart as json
                    var cart = JSON.parse(sessionStorage.getItem(self.sessionKey));
                    
                    var items = cart.items;

                    // update item
                    items[name] = items[name] || {qty: 0};
                    items[name].price = price;
                    items[name].qty += qty;

                    cart.items = items;
                    
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
    var self = this;
    var cart = JSON.parse(sessionStorage.getItem(this.sessionKey));
    var items = cart.items;

    if (this.$cartProducts.length) {
        var total = 0;
        var price, qty;

        this.$cartProducts.empty();

        for (var key in items) {
            if (items.hasOwnProperty(key)) {
                price = items[key].price;
                qty = items[key].qty;

                this.$cartProducts.append(
                    '<div data-key="'+key+'"><p>Name: ' + key + '</p><p>Price: ' +
                    price + '</p><p>Quantity: ' +
                    qty + '</p><a href="#" class="remove-product">Remove</a></div>'
                );

                total += price * qty;
            }
        }

        this.$cartTotal.text(total);

        this.$cartProducts.find('a.remove-product').on('click', function(e) {
            e.preventDefault();

            // get product key
            var key = $(this).parent().data('key');

            // remove product from cart
            delete cart.items[key];

            // update cart
            sessionStorage.setItem(self.sessionKey, JSON.stringify(cart));
            self.updateCart();
        });
    }

    /* jshint devel:true */
    if (this.$paypalForm.length) {
        var $form = this.$paypalForm;
        var $payBtn = $form.find('#cart-pay');
        
        $form.attr('action', this.paypalUrl);
        $form.find('input[name="business"]').val(this.paypalBusiness);
        $form.find('input[name="currency_code"]').val(this.paypalCurrency);
        $form.find('input[name="return"]').val(this.paypalReturn);
        $form.find('input[name="cancel_return"]').val(this.paypalCancel);
        
        var i = 0;
        for (var iKey in items) {
            if (items.hasOwnProperty(iKey)) {
                var cartItem = items[iKey];
                var n = i + 1;
                var itemName  = iKey;
                var itemPrice = cartItem.price;
                var itemQty   = cartItem.qty;
                
                $('<div/>').html(
                    '<input type="hidden" name="quantity_' + n + '" value="' + itemQty + '"/>' +
                    '<input type="hidden" name="item_name_' + n + '" value="' + itemName + '"/>' +
                    '<input type="hidden" name="item_number_' + n + '" value="SKU ' + itemName + '"/>' +
                    '<input type="hidden" name="amount_' + n + '" value="' + itemPrice.toFixed(2) + '"/>'
                ).insertBefore($payBtn);
            }
        }
    }
};

Shop.prototype.payCart = function() {
    var self = this;
    var shippingInfo = {};

    this.$cartPayBtn.on('click', function() {
        // validate fields
        if (!self.validateInfo()) {
            return false;
        }
        else {
            shippingInfo.name    = $('#name').val();
            shippingInfo.email   = $('#email').val();
            shippingInfo.city    = $('#city').val();
            shippingInfo.address = $('#address').val();
            shippingInfo.zip     = $('#zip').val();
            shippingInfo.country = $('#country').val();

            self.$cart.html(
                '<img src="http://jeroenooms.github.io/dashboard/snack/images/spinner.gif" width="260px" />' +
                '<h4 style="text-align: center;">Processing...</h4>'
            );

            // TO DO:
            // submit to php, store in db, callback to submit paypal form
            // add redirect page for paypal, to Thank You page.
        }
    });
};

Shop.prototype.validateInfo = function() {
    var valid = true;

    this.$cartShipping.find('.message').remove();

    this.$cartShipping.find(':input').each(function() {
        var $input = $(this);
        var type   = $input.data('type');
        
        if (type === 'text') {
            if($input.val() === '') {
                $('<span class="message"/>').text('Invalid field').insertBefore($input);
                valid = false;
            }
        }
        else if (type === 'email') {

            /* jshint maxlen:false */
            var emailCheck = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            
            if (!emailCheck.test($input.val())) {
                $('<span class="message"/>').text('Invalid email').insertBefore($input);
                valid = false;
            }
        }
    });
    
    return valid;
};