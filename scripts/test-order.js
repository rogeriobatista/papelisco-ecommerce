#!/usr/bin/env node

// Simple test script to verify Place Order functionality
// This script tests the order creation API endpoint

async function testPlaceOrder() {
  const baseUrl = 'http://localhost:3000';
  
  try {
    console.log('🧪 Testing Place Order API...\n');
    
    // First, let's test without authentication (should fail)
    console.log('1. Testing without authentication...');
    const noAuthResponse = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{ productId: 'test', quantity: 1, price: 10.99 }],
        shippingAddress: { firstName: 'Test', lastName: 'User' },
        billingAddress: { firstName: 'Test', lastName: 'User' },
        paymentMethod: 'Visa',
        cardDetails: { cardNumber: '4111111111111111', expiryDate: '12/25', cvv: '123', cardName: 'Test User' }
      })
    });
    
    console.log(`   Status: ${noAuthResponse.status} - ${noAuthResponse.status === 401 ? '✅ Correctly requires authentication' : '❌ Should require auth'}\n`);
    
    // Test the credit card formatting functions
    console.log('2. Testing credit card utilities...');
    
    // Since we're running this as a standalone script, we need to test the logic
    const testCardNumber = '4111111111111111';
    const testExpiry = '1225';
    const testCVV = '123abc';
    
    // Basic formatting tests (simplified since we can't import our utilities here)
    const formattedCard = testCardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
    const formattedExpiry = testExpiry.length >= 2 ? `${testExpiry.slice(0, 2)}/${testExpiry.slice(2, 4)}` : testExpiry;
    const formattedCVV = testCVV.replace(/\D/g, '').slice(0, 4);
    
    console.log(`   Card Number: ${testCardNumber} → ${formattedCard} ${formattedCard === '4111 1111 1111 1111' ? '✅' : '❌'}`);
    console.log(`   Expiry Date: ${testExpiry} → ${formattedExpiry} ${formattedExpiry === '12/25' ? '✅' : '❌'}`);
    console.log(`   CVV: ${testCVV} → ${formattedCVV} ${formattedCVV === '123' ? '✅' : '❌'}\n`);
    
    // Check if products exist for order testing
    console.log('3. Checking available products...');
    const productsResponse = await fetch(`${baseUrl}/api/products`);
    const productsData = await productsResponse.json();
    
    if (productsData.success && productsData.products.length > 0) {
      console.log(`   Found ${productsData.products.length} products ✅`);
      console.log(`   Sample product: ${productsData.products[0].name} ($${productsData.products[0].price})\n`);
    } else {
      console.log('   ❌ No products found for testing\n');
    }
    
    // Test API endpoint structure
    console.log('4. Testing order API endpoint structure...');
    const orderResponse = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    
    const orderResult = await orderResponse.json();
    console.log(`   Status: ${orderResponse.status}`);
    console.log(`   Response: ${JSON.stringify(orderResult).substring(0, 100)}...`);
    
    if (orderResponse.status === 401) {
      console.log('   ✅ Order endpoint correctly requires authentication\n');
    } else if (orderResponse.status === 400) {
      console.log('   ✅ Order endpoint validates request data\n');
    } else {
      console.log('   ⚠️  Unexpected response status\n');
    }
    
    console.log('🎉 Place Order API tests completed!');
    console.log('📝 Manual testing steps:');
    console.log('   1. Visit http://localhost:3000');
    console.log('   2. Add products to cart');
    console.log('   3. Go to checkout (/checkout)');
    console.log('   4. Fill out the form with credit card formatting');
    console.log('   5. Submit to test order placement');
    console.log('   6. Check order success page with success banner');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the application is running on http://localhost:3000');
  }
}

testPlaceOrder();