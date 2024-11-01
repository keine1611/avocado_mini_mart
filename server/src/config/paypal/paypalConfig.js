import paypal from '@paypal/checkout-server-sdk'

const environment = new paypal.core.SandboxEnvironment(
  'AerBDGpkuUbN1vbkY2jB3PmxmP8ijXS0D8qnWEzcpvaZEtTg7bAp_qEt52BRkXnFav1z7pA_cGl8Cp6F',
  'ED5PYODM2iAQ_rx9fJytKCjiR6dWQlMWeN3j76OvBRXigZc0nnO8zf7stWyQQ14DCB4kQEYzjgcqwk8R'
)

const client = new paypal.core.PayPalHttpClient(environment)

export { client }
