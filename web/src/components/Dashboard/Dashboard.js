import React, {Component} from 'react';
import {productList,stripeKey } from '../../constants/constants';
import Currency from 'react-currency-formatter';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Snackbar from '@material-ui/core/Snackbar';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import './Dashboard.css';
import { IconButton, Badge, Drawer,AppBar,Toolbar } from '@material-ui/core';
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

handlePaymentSuccess() {
  console.log('setting cart to 0')
  this.setState({cart: []})
}

renderProductList(products){
  return (
    (
      <div className='product-container'>
      <GridList 
        cols={2}
        className='grid-list'
        spacing={30} 
        >
        { products.map(product => (
            <GridListTile
            key={product.productId}
            className='product-tile'>
              <img src={product.productImage} alt={product.productName} />
              <GridListTileBar
                title={product.productName}
                subtitle={<span>
                  <Currency
                    quantity={product.productPrice}
                    currency="USD"/>
                  </span>}
                
                actionIcon={
                  <IconButton aria-label={`Add ${product.productName} to cart.`} className='add-to-cart-icon' onClick={()=>this.addProductToCart(product)}>
                    <Badge badgeContent='+'color="primary" >
                      <ShoppingCartIcon/>
                    </Badge>
                  </IconButton>
              }
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
        <AppBar 
          position="static" 
          color="default"
          elevation={0}
          className='app-bar'>
          <Toolbar>
          <span>Zach's Gift Card Shop</span>
          <div className='grow'></div>
          <IconButton aria-label="cart">
            <Badge badgeContent={cart ? cart.length : 0} color="primary" 
                onClick={()=>this.toggleDrawer(true)}>
              <ShoppingCartIcon  onClick={()=>this.toggleDrawer(true)}/>
            </Badge>
          </IconButton>
          </Toolbar>
        </AppBar>
        
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
              horizontal: 'center',
            }}
            open={this.state.snackBarOpen}
            autoHideDuration={2000}
            onClose={this.handleClose.bind(this)}
            message={<span id="message-id">Product Added To Cart</span>}
          />

        <Drawer
          open={drawerOpen}
          onClose={()=>this.toggleDrawer(false)}
          anchor='right'
          width='50%'>
          <StripeProvider apiKey={stripeKey}>
              <CheckoutDrawer 
                handleSuccesfullCharge={()=>this.handlePaymentSuccess()}
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