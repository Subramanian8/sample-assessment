import React from "react";
import List from "./list"
import css from "./style.css";
import auth from '../utils/auth.js';

var maxOrderPrice = 250;

class App extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            itemList: [],
            cartList: [],
            cartVisible: false
        };
    }

    componentDidMount() {
		// call the getitems service in auth.js to get datas
        auth.getItemList((response, data) => {
            if (response) {
                data.map((e)=>{ e['isChecked'] = false });
                this.setState({ itemList: data });
            } else {
                console.log("error",data);
				alert("Failed to fetch data! start the nodejs server.");
            }
        });
    }

	// Here, list the products as package
    renderActionSection () {
        return this.state.cartList.map((items, i) =>
                <div className="cartPackage">
                    <div>Package {i+1}</div>
                    <ul>
                        <li><span>Items</span> - <span>{items.items}</span></li>
                        <li><span>Total weight</span> - <span>{items.tw}</span></li>
                        <li><span>Total price</span> - <span>{items.tp}</span></li>
                        <li><span>Courier price </span> - <span>{items.cp}</span></li>
                    </ul>
                </div>
            )
    }

    render () {
        return (
            <div>
                <h1>Online Products</h1>
                <List
                    items={this.state.itemList}
                    toggleItem={this.toggleItem.bind(this)}
                />
                {(this.state.itemList.length) ?
                    <div className="placeorderbtn"><button onClick={this.placeOrder.bind(this)}>Place Order</button></div>
                : ''}


                {(this.state.cartVisible) ?
                    <div id="cartModal">
                        <p className="cartModalheader">Order</p>
                        <div>
                            {this.renderActionSection()}
                        </div>
                        <div className="cancel-btn-div">
                            <button className="cancel-btn" onClick={this.clearCart.bind(this)}>Reset</button>
                            <button className="cancel-btn" onClick={this.toggleCart.bind(this)}>Cancel</button>
                        </div>
                    </div>
                : ''}
            </div>
        );
    }

	// To check/uncheck the item in lists.
    toggleItem (itemId) {
        var items = this.state.itemList;
        items[itemId].isChecked = !items[itemId].isChecked;
        this.setState({ itemList: items });
    }

    // Show/hide cart Modal window
    toggleCart () {
        this.setState({cartVisible: !this.state.cartVisible});
    }

    // Clear/Reset selected items
    clearCart () {
        var data = this.state.itemList;
        data.forEach((item, index, array) => {
            if(item.isChecked)
                this.toggleItem(index);
        })
        this.setState({ itemList: data, cartList: [], cartVisible: false });
    }

    // To find NumOfPackage while placing order
    findNumOfPackage(cartItems) {
        var totalPrice = 0;
        cartItems.forEach((val, index) => {
            totalPrice += val['Price'];
        })
        return Math.ceil(totalPrice/maxOrderPrice);
    }

    // To create a package array and show the cart popup
    createCartList(allItems, numOfPackage) {
        var data = [];
        if(numOfPackage == 1){
            data.push(this.formPackage(allItems));
        } else {
            allItems.forEach((val, index) => {
                data.push(this.formPackage(val));
            })
        }
        this.setState({ cartList: data })
        this.toggleCart();
    }

    // To form the package array which contains totalWeight, totalPrice and courierPrice
    formPackage(allItems) {
        var items = '',totalWeight = 0,totalPrice = 0,courierPrice = 0;
        allItems.forEach((val, index) => {
            if(items == '') items = val.Name;
            else items += ', '+val.Name;

            totalWeight += parseInt(val.Weight);
            totalPrice += parseInt(val.Price);
        })
        courierPrice = this.findCourierCharge(totalWeight);
        totalWeight = totalWeight+'g';
        totalPrice = '$'+totalPrice;

        return {'items': items, 'tw': totalWeight, 'tp': totalPrice, 'cp': courierPrice};
    }

    // To find courierPrice
    findCourierCharge(g) {
        if(g <= 200) return '$5';
        else if(g > 200 && g <= 500) return '$10';
        else if(g > 500 && g <= 1000) return '$15';
        else if(g > 1000 && g <= 5000) return '$20';
        else return '$25';
    }

	// Sorting the array to get lower weight value as first
    sortFunction(a, b) {
        if (a[0].Weight === b[0].Weight) {
            return 0;
        } else {
            return (a[0].Weight < b[0].Weight) ? -1 : 1;
        }
    }

    // To get overall weight
    getWeight(packArray) {
        var totalWeight = 0
        packArray.forEach((val, index) => {
            totalWeight += val.Weight
        })
        return totalWeight
    }

    // To get overall price
    getPrice(packArray) {
        var totalPrice = 0
        packArray.forEach((val, index) => {
            totalPrice += val.Price
        })
        return totalPrice
    }


    placeOrder() {
        var cartItems = this.state.itemList.filter((e)=> (e.isChecked == true))
        if(cartItems.length) {
            var packagesArray = [];
            var numOfPackage = this.findNumOfPackage(cartItems);
            cartItems.sort((a, b) => parseInt(b.Price) - parseInt(a.Price));

            for(var i=0; i<numOfPackage; i++) {
                packagesArray[i] = [];
                packagesArray[i].push(cartItems[i]);
            }

            cartItems = this.removeItemsFrom(cartItems, packagesArray);

            packagesArray = this.getOrderedPackagesWithWeightLimit(cartItems, packagesArray);

            var nonAccomodateableItems = this.removeItemsFrom(cartItems, packagesArray);
            for (var item of nonAccomodateableItems) {
                packagesArray.push([item]);
            }

            console.log('packagesArray')
            console.log(packagesArray)

            this.createCartList(packagesArray, numOfPackage);
        } else {
            alert("choose any item to place order");
        }
    }

    getOrderedPackagesWithWeightLimit(itemsArray, packagesArray) {
        var packagesArray = packagesArray;

        for(var i=0; i<itemsArray.length; i++) {
            var weightArray = [];
            // packagesArray.sort(this.sortFunction);
            // packagesArray = packagesArray.sort((a, b) => parseInt(this.getWeight(a).Weight) - parseInt(this.getWeight(b).Weight));
            for(var pack of packagesArray) {
                weightArray.push(this.getWeight(pack));
            }
            var item = itemsArray[i];
            var isInserted = false;

            for(var j=0; j<weightArray.length; j++) {
                if(!isInserted) {
                    if((this.getPrice(packagesArray[j])+item.Price) <= maxOrderPrice) {
                        packagesArray[j].push(item);
                        isInserted = true;
                    }
                }
            }
        }
        return packagesArray;
    }

    removeItemsFrom(itemsArray, packagesArray) {
        var temArray = itemsArray;

        for(var i=0; i<itemsArray.length; i++) {
            for(var j=0; j<packagesArray.length; j++) {
                var pack = packagesArray[j];
                for(var tempItem of pack) {
                    if(itemsArray[i].Name == tempItem.Name) {
                        temArray = temArray.filter((e) => (e.Name != tempItem.Name))
                    }
                }
            }
        }
        return temArray;
    }


    /*// Here, calculating the each and every selected items and create a package.
        placeOrder() {
            var cartItems = this.state.itemList.filter((e)=> (e.isChecked == true))

            if(cartItems.length) {
                var numOfPackage = this.findNumOfPackage(cartItems);

                if(numOfPackage == 1) {
                    this.createCartList(cartItems, numOfPackage);
                } else {
                    cartItems.sort((a, b) => parseInt(b.Weight) - parseInt(a.Weight));

                    var Package = [];
                    cartItems.forEach((val, index) => {
                        if(index < numOfPackage) {
                            for(var i=0; i<numOfPackage; i++) {
                                if(i == index) {
                                    Package[i] = [];
                                    Package[i].push(val);
                                    return;
                                }
                            }
                        } else {
                            Package.sort(this.sortFunction);
                            for(var i=0; i<numOfPackage; i++) {
                                var TPRIZE = 0;
                                for(var j=0; j<Package[i].length; j++) {
                                    TPRIZE += Package[i][j].Price;
                                }

                                if (TPRIZE + val['Price'] <= maxOrderPrice) {
                                    Package[i].push(val);
                                    return;
                                }
                            }
                        }
                    })

                    this.createCartList(Package, numOfPackage);
                }
            } else {
                alert("choose any item to place order");
            }
        }*/
}
export default App;