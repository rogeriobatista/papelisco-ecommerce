# SSL Certificates Directory

Place your SSL certificates here for production HTTPS setup.

## Required Files for HTTPS

- `cert.pem` - SSL certificate
- `key.pem` - Private key

## Self-Signed Certificates for Development

If you need to test HTTPS locally, you can generate self-signed certificates:

```bash
# Generate self-signed certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem \
  -out nginx/ssl/cert.pem \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
```

## Let's Encrypt (Production)

For production, use Let's Encrypt certificates:

```bash
# Install certbot
apt-get update && apt-get install certbot python3-certbot-nginx

# Obtain certificate
certbot --nginx -d yourdomain.com

# Copy to nginx/ssl directory
cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/cert.pem
cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/key.pem
```

## Enable HTTPS in nginx.conf

Uncomment the HTTPS server block in `nginx/nginx.conf` and update the domain names.

## Security Notes

- **Never commit private keys to git**
- Use strong certificates in production
- Regularly renew certificates
- Monitor certificate expiration