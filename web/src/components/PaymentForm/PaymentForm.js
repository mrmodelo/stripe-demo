import React, { Component } from 'react';
import { 
  CardElement,
  injectStripe
 } from 'react-stripe-elements';
import Button from '@material-ui/core/Button';
import './PaymentForm.css'


class PaymentForm extends Component {
  state = {
    errorMessage: '',
    isComplete: false
  };

  handleChange = ({ error, complete }) => {
    if (error) {
      this.setState({ errorMessage: error.message });
    } else if (complete) {
      this.setState({
        isComplete: true
      });
    } else if (!complete){
      this.setState({
        isComplete: false
      });
    }
  };
  
  handleSubmit = evt => {
    evt.preventDefault();
    const {erroMessage} = this.state;
    if (!erroMessage){
      if (this.props.stripe) {
        this.props.stripe.createToken().then(token => {
          if(token.error){
            alert(token.error.message)
            console.log(token.error);
          } else {
            this.props.handleResult(token);
          }
        }).catch(error=> {
          alert(error)
        });
      } else {
        console.log("Stripe.js hasn't loaded yet.");
      }
    } else {
      alert("Please enter valid credit card information");
    }
  };

  render() {
    const {isComplete} = this.state;

    return (
      <div className='card-container'>
        <h2>Payment Details</h2>
        <form  onSubmit={this.handleSubmit.bind(this)}>
          <fieldset>
            <div>
              <CardElement 
                className="pay-input" 
                onChange={this.handleChange}
               />
            </div>
          </fieldset>
          <div className="row" style={{ color: 'red' }}>
            {this.props.errorMessage}
          </div>
          <div className='order-button' >
            <Button 
              disabled={!isComplete} 
              color="primary" 
              variant='contained' 
              type="submit" 
              data-tid="elements_examples.form.pay_button">
                COMPLETE ${this.props.amount} CHARGE
              </Button>
          </div>
        </form>
      </div>
    );
  }
}
export default injectStripe(PaymentForm);

