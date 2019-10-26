export const firebaseURL = process.env.REACT_APP_FIREBASE_FUNCTION_BASE_URL
export const productList = [
  {
    productName: '$5 Amazon Gift Card',
    productPrice: 5,
    productId: 'amazon5',
    productImage: 'http://www.vmastoryboard.com/wp-content/uploads/2014/08/Amazon-Logo_Feature.jpg'
  },
  {
    productName: '$10 Panera Bread Gift Card',
    productPrice: 10,
    productId: 'panera10',
    productImage: 'http://twocafeandboutique.com/wp-content/uploads/2018/03/Panera-Bread-Logo-1.png'
  },
  {
    productName: '$15 Starbucks Gift Card',
    productPrice: 15,
    productId: 'starbucks15',
    productImage: 'https://i1.wp.com/www.logoworks.com/blog/wp-content/uploads/2017/06/Untitled-2.png?resize=640%2C360&ssl=1'
  },
  {
    productName: '$20 IN-N-OUT Gift Card',
    productPrice: 20,
    productId: 'inNOut20',
    productImage: 'https://media-cdn.tripadvisor.com/media/photo-s/0f/1b/48/d4/logo.jpg'
  }
];
export const stripeKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY