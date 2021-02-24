function ModelManager() {
    this.Models = [];
}

ModelManager.prototype = {
    addModel: function (model) {
        for (var i = 0; i < this.Models.length; i++) {
            if (this.Models[i].ModelId == model.ModelId)
                return;
        }

        this.Models.push(model);
    },

    getModel: function (modelId) {
        for (var i = 0; i < this.Models.length; i++) {
            var theModel = this.Models[i];
            if (theModel && theModel.ModelId == modelId)
                return theModel;
        }
        return null;
    }
}

function Model(modelID, brand, productDesc, ozelKod1) {
    this.ModelId = modelID
    this.Brand = brand;
    this.ProductDesc = productDesc;
    this.OzelKod1 = ozelKod1;
    this.Options = [];
}

Model.prototype = {
    addOption: function (option) {
        this.Options.push(option);
    },

    addOptions: function (options) {
        for (var i = 0; i < options.length; i++) {
            this.addOption(options[i]);
        }
    },

    addProducts: function (products) {
        for (var i = 0; i < products.length; i++) {
            var theProduct = products[i];
            if (!this.getProduct(theProduct.ProductId)) {
                var theOption = this.getOption(theProduct.OptionId);
                if (theOption) {
                    theOption.addProduct(theProduct);
                }
            }
        }
    },

    getProducts: function (optionID) {
        var theOption = this.getOption(optionID);
        if (theOption)
            return theOption.Products;
    },

    getProduct: function (productId) {
        for (var i = 0; i < this.Options.length; i++) {
            var theProduct = this.Options[i].getProductbyId(productId);
            if (theProduct)
                return theProduct;
        }
        return null;
    },

    getOption: function (optionId) {
        for (var i = 0; i < this.Options.length; i++) {
            var theOption = this.Options[i];
            if (theOption && theOption.OptionId == optionId)
                return theOption;
        }
        return null;
    },

    getProductsbySizeId: function (optionId, sizeId) {
        var theOption = this.getOption(optionId);
        return theOption.getProductsbySizeId(sizeId);
    },

    findProduct: function (optionId, sizeId, heightId) {
        var theOption = this.getOption(optionId);
        return theOption.getProductBySizeAndHeightId(sizeId, heightId);
    },

    print: function () {
        document.write("Model ID=" + this.modelId + "<br />");
        for (var i = 0; i < this.Option.length; i++) {
            this.Options[i].print();
        }
    }
}

function Option(optionID, title, colorCode, composition) {
    this.OptionId = optionID;
    this.hasDoubleSizeProduct = false;
    this.Title = title;
    this.ColorCode = colorCode;
    this.Composition = composition;
    this.Products = [];
    this.Images = [];
}

Option.prototype = {
    addImage: function (img) {
        this.Images.push(img);
    },
    addProduct: function (product) {
        var existingProduct = this.getProductbyId(product.ProductId);
        if (existingProduct)
            throw "product already in option";
        else {
            if (product instanceof DoubleSizeProduct)
                this.hasDoubleSizeProduct = true;

            this.Products.push(product);
        }
    },
    addProducts: function (products) {
        for (var i = 0; i < products.length; i++) {
            if (this.optionId == products[i].OptionId)
                this.addProduct(products[i]);
        }
    },
    getProductbyId: function (productId) {
        for (var i = 0; i < this.Products.length; i++) {
            var theProduct = this.Products[i];
            if (theProduct && theProduct['productId'] == productId)
                return theProduct;
        }
        return null;
    },
    getProductsbySizeId: function (sizeId) {
        var products = [];
        var temp = 0;
        for (var i = 0; i < this.Products.length; i++) {
            var theProduct = this.Products[i];

            if (theProduct.SizeId == sizeId) {
                products[temp] = theProduct;
                temp++;
            }
        }
        return products;
    },

    getProductBySizeAndHeightId: function (sizeId, heightId) {
        var findInDouble = false;
        if (heightId) {
            findInDouble = true;
        }

        for (var i = 0; i < this.Products.length; i++) {
            var theProduct = this.Products[i];

            if (findInDouble && theProduct instanceof DoubleSizeProduct) {
                if (theProduct.SizeId == sizeId && theProduct.HeightId == heightId) {
                    return theProduct;
                }
            }

            else if (!findInDouble && theProduct instanceof SingleSizeProduct) {
                if (theProduct.SizeId == sizeId) {
                    return theProduct;
                }
            }
        }
        return null;
    },

    print: function () {
        document.write("Option ID=" + this.OptionId + "<br />");
        for (var i = 0; i < this.Products.length; i++) {
            if (this.Products[i] instanceof DoubleSizeProduct)
                document.writeln(" DoubleSizeProduct --> ");
            else
                document.writeln(" SingleSizeProduct --> ");

            this.Products[i].print();
        }
    },
    HasPurchasableProduct: function () {
        for (var i = 0; i < this.Products.length; i++) {
            if (this.Products[i].Stock > 0) {
                return true;
            }
        }
        return false;
    }
}

function OptionPicture(smallPic, mediumPic, largePic) {
    this.SmallImage = smallPic;
    this.MediumImage = mediumPic;
    this.LargeImage = largePic;
}
OptionPicture.prototype = {
}

function SingleSizeProduct(optionID, productID, sizeID, sizeText, sizeDisplayOrder, stock, price, instPrice, firstPrice, currency, urunOptionSizeRef, hasInstallments) {
    this.OptionId = optionID;
    this.ProductId = productID;
    this.Stock = stock;
    this.SizeId = sizeID;
    this.SizeText = sizeText;
    this.SizeDisplayOrder = sizeDisplayOrder;
    this.Price = price;
    this.InstalmentPrice = instPrice;
    this.FirstPrice = firstPrice;
    this.Currency = currency;
    this.UrunOptionSizeRef = urunOptionSizeRef;
    this.HasInstallments = hasInstallments
}

SingleSizeProduct.prototype =
    {
        print: function () {
            document.write("OptionId=" + this.OptionId + ", " + "productId=" + this.ProductId + ", " + "SizeId=" + this.SizeId + ", " + "SizeText=" + this.SizeText + "<br /> ")
        }
    }

DoubleSizeProduct.prototype = new SingleSizeProduct;
DoubleSizeProduct.constructor = DoubleSizeProduct;
function DoubleSizeProduct(optionID, productID, sizeID, sizeText, sizeDisplayOrder, heightID, heightText, heightDisplayOrder, stock, price, instPrice, firstPrice, currency, urunOptionSizeRef, hasInstallments) {
    SingleSizeProduct.call(this, optionID, productID, sizeID, sizeText, sizeDisplayOrder, stock, price, instPrice, firstPrice, currency, urunOptionSizeRef, hasInstallments);
    this.HeightId = heightID;
    this.HeightText = heightText;
    this.HeightDisplayOrder = heightDisplayOrder;
}
DoubleSizeProduct.prototype =
{
    print: function () {
        document.write("OptionId=" + this.OptionId + ", " + "productId=" + this.ProductId + ", " + "SizeId=" + this.SizeId + ", " + "SizeText=" + this.SizeText + ", " + "HeightID=" + this.HeightId + "HeightText = " + this.HeightText + "<br />")
    }
}

var modelManager = new ModelManager();