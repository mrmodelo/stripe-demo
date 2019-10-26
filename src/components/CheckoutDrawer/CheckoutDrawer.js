// Payment.js
import React, { Component } from 'react';
import { Elements } from 'react-stripe-elements';
import PaymentForm from '../PaymentForm/PaymentForm'
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import {firebaseURL} from '../../constants/constants';
import './CheckoutDrawer.css'



class CheckoutDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentIsProcessing: false,
    }
  }
 
  handlePayment(token) {
    this.setState({
      paymentIsProcessing: true
    })
    const paymentObject = {
      stripeToken: token.token,
      uid: this.props.auth.uid,
      amount: this.props.deal.currentProposal.payout,
      recipientId: this.props.deal.influencerId,
      paymentPeriod: this.props.deal.currentProposal.dueDate //this needs to be pulled off the current proposal object
    };
     
    axios
      .post(`${firebaseURL}/charge-client`, paymentObject)
      .then(res => {
        if (
          res.status === 200 &&
          res.data &&
          res.data.status === 'charge-successful' && 
          res.data.transactionId
        ) {
           this.setState({
            transactionId: res.data.transactionId
           }).then(()=>{
            this.props.handleSuccesfullCharge();
           })
        }
      }).catch(err=>{
          console.log('There was an error posting the communication.')
      })
  }

  render() {    
    const {transactionId,isProcessing} = this.state;
    return (
      <div className='checkout-drawer-container'>
        {/* Loading screen for if the payment is processing */}
        {
          transactionId ? 
          (<div>
            <h3>Thanks for your order!</h3>
            <span>Transaction ID: {transactionId}</span>
          </div>):   
            isProcessing ?
            ( <CircularProgress color="primary" />)       
            : (
            <div className="elements">
              <Elements>
                <PaymentForm
                  amount='600'
                  handleResult={this.handlePayment.bind(this)}
                  errorMessage={this.props.errorMessage}
                />
              </Elements>
            </div>)
        }
      </div>
    );
  }
}


export default CheckoutDrawer;
