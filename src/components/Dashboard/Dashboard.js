import React, {Component} from 'react';
import {productList,stripeKey } from '../../constants/constants';
import Currency from 'react-currency-formatter';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Snackbar from '@material-ui/core/Snackbar';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import './Dashboard.css';
import { IconButton, Badge, Drawer } from '@material-ui/core';
import CheckoutDrawer from '../CheckoutDrawer/CheckoutDrawer';
import {StripeProvider} from 'react-stripe-elements';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
      snackBarOpen: false,
      products: productList,
      cart: []
    }
  }

addProductToCart(productToAdd){
  this.setState(prevState => ({
    cart: [...prevState.cart, productToAdd],
    snackBarOpen: true
  }))
}

handleClose (){
  this.setState({snackBarOpen: false });
};

toggleDrawer(value){
  this.setState({
    drawerOpen: value
  })
}

renderProductList(products){
  return (
    (
      <div className='product-container'>

      <GridList 
        spacing={5}   
        cols={2}>
        { products.map(product => (
            <GridListTile
            key={product.productId}
            onClick={()=>this.addProductToCart(product)}
            className='product-tile'>
              <img src={product.productImage} alt={product.productName} />
              <GridListTileBar
                title={product.productName}
                subtitle={<span>
                  <Currency
                    quantity={product.productPrice}
                    currency="USD"/>
                  </span>}
                />
            </GridListTile>
          ))}
      </GridList>           
      </div>   
    ) 
  )
}

render() {
  const {products, cart, drawerOpen} = this.state;
    return (
      <div className='page-container'>
        <h4>Click to Add To Cart</h4>
        
        {/* Header bar with title and cart call to action */}
        <div>
        <IconButton aria-label="cart">
          {cart && cart.length ? 
          <Badge badgeContent={cart? cart.length : 0} color="primary" 
              onClick={()=>this.toggleDrawer(true)}>
            <ShoppingCartIcon  onClick={()=>this.toggleDrawer(true)}/>
          </Badge> : <div></div>}
        </IconButton>
        </div>


        {/* Products section */}
        <div>
          { products ?
            this.renderProductList(products)
            : <div className='null-state'>NO PRODUCTS</div>
          }
        </div>

        {/* Toggled Components */}
        <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={this.state.snackBarOpen}
            autoHideDuration={2000}
            onClose={this.handleClose.bind(this)}
            message={<span id="message-id">Product Added To Cart</span>}
          />

        <Drawer
          open={drawerOpen}
          
          anchor='right'
          width='50%'>
          <StripeProvider apiKey='pk_test_FQEKzJFqxR1i9r6JWUV0GBWq00eO3RvYJC'>
              <CheckoutDrawer 
                handleSuccesfullCharge={()=>this.setState({cart: []})}
                cart={cart}
                className='slideout-drawer'
                >
              </CheckoutDrawer>
          </StripeProvider>
        </Drawer>

      </div>
    );
  }
}

export default Dashboard;