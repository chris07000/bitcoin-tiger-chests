const mkcert = require('mkcert');

async function generateCertificates() {
  const ca = await mkcert.createCA({
    organization: 'Bitcoin Tiger Chests Dev CA',
    countryCode: 'NL',
    state: 'Noord-Holland',
    locality: 'Amsterdam',
    validityDays: 365
  });

  const cert = await mkcert.createCert({
    domains: ['127.0.0.1', 'localhost'],
    validityDays: 365,
    caKey: ca.key,
    caCert: ca.cert
  });

  require('fs').writeFileSync('certificates/cert.key', cert.key);
  require('fs').writeFileSync('certificates/cert.crt', cert.cert);
  console.log('Generated SSL certificates in certificates/ directory');
}

generateCertificates().catch(console.error); 