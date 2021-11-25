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

	// Here, calculating the each and every selected items and create a package.
    placeOrder() {
        var cartItems = this.state.itemList.filter((e)=> (e.isChecked == true))
        console.log('cartItems :', JSON.stringify(cartItems));

        if(cartItems.length) {
            var numOfPackage = this.findNumOfPackage(cartItems);
            console.log('numOfPackage :', numOfPackage);

            if(numOfPackage == 1) {
                this.createCartList(cartItems, numOfPackage);
            } else {
                cartItems.sort((a, b) => parseInt(b.Weight) - parseInt(a.Weight));
                console.log('cartItems :', JSON.stringify(cartItems));

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
    }

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

	// To find NumOfPackage while placing order
    findNumOfPackage(cartItems) {
        var totalPrice = 0;
        cartItems.forEach((val, index) => {
            totalPrice += val['Price'];
        })
        return Math.ceil(totalPrice/maxOrderPrice);
    }

	// Sorting the array to get lower weight value as first
    sortFunction(a, b) {
        if (a[0].Weight === b[0].Weight) {
            return 0;
        } else {
            return (a[0].Weight < b[0].Weight) ? -1 : 1;
        }
    }

	// Show/hide cart Modal window
    toggleCart () {
        this.setState({cartVisible: !this.state.cartVisible});
    }

	// Clear/Reset selected items
    clearCart () {
        var data = this.state.itemList;
        data.forEach((item, index, array) => {
            item.isChecked = false
        })
        this.setState({ itemList: data, cartList: [], cartVisible: false });


    }
}
export default App;