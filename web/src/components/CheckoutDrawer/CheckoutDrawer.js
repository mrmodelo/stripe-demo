// Payment.js
import React, { Component } from 'react';
import { Elements } from 'react-stripe-elements';
import PaymentForm from '../PaymentForm/PaymentForm'
// import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import {firebaseURL} from '../../constants/constants';
import './CheckoutDrawer.css';
import Currency from 'react-currency-formatter';
import { Divider, CircularProgress} from '@material-ui/core';

class CheckoutDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentIsProcessing: false,
    }
  }

  componentDidMount(){
    const {cart} = this.props;

    var total = 0;
    cart.forEach(item=>{
      total += item.productPrice;
    })
    this.setState({
      subTotal: total
    })
  }
 
  handlePayment(token) {
    this.setState({
      paymentIsProcessing: true
    })

    const paymentObject = {
      stripeToken: token.token,
      amount: this.state.subTotal
    };
    
    axios
      .post(`${firebaseURL}/completeStripePayment`, paymentObject)
      .then(res => {
        if (
          res.status === 200 &&
          res.data &&
          res.data.status === 'charge-successful' && 
          res.data.transactionId
        ) {
           this.setState({
            transactionId: res.data.transactionId,
            paymentIsProcessing: false,
            receiptURL: res.data.receiptURL
           });
           
            this.props.handleSuccesfullCharge();
           
        }
      }).catch(err=>{
          console.log('There was an error posting the communication.')
      })
  }

  renderCart() {
    const {cart} = this.props;
    const {subTotal} = this.state;
    
    return (
        <div className="elements">
          <div className='title-bar'>
            <h2>Cart Items</h2>
          </div>

            <ul className='cart-items'>
              {cart.map(cartItem => (
                <li className='line-item'>
                  <span className='product-name'>{cartItem.productName}</span>
                  <span className='price'>
                    <Currency quantity={cartItem.productPrice} currency="USD"/>
                  </span>
                </li>
              ))}
            </ul>
            <Divider></Divider>
    
            <div className='amount-totals line-item'>
              <span className='product-name'>TOTAL</span>
              <span className='price'>
                <Currency
                quantity={subTotal}
                currency="USD"/>
              </span>
            </div>
          
          <Elements>
            <PaymentForm
              amount='600'
              handleResult={this.handlePayment.bind(this)}
              errorMessage={this.props.errorMessage}
            />
          </Elements>
        </div>
        )
  }
  

  render() {    
    const {transactionId,paymentIsProcessing, receiptURL} = this.state;
    const {cart} = this.props;

    return (
      <div className='checkout-drawer-container'>
        {
          transactionId ? (
          <div className='transaction-confirmation'>
            <h3>Thanks for your order!</h3>
            <span><b>Transaction ID:</b> {transactionId}</span>
            <span>Your receipt can be found <a href={receiptURL}>here</a>.</span>
          </div>
          ) : paymentIsProcessing ?
            ( 
            <div className='loading-state'>
              <CircularProgress className='spinner' color="primary" />
            </div>)       
            : 
            cart.length ?
            this.renderCart()
            :
            <div className='null-state'>
              <h2>No items in your cart.</h2>
            </div>
            
        }
      </div>
    );
  }
}


export default CheckoutDrawer;
