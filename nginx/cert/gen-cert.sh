#!/bin/sh
set -e

CERT=/certs/cert.pem
KEY=/certs/key.pem

# DNS:nginx is the name the Next.js server uses to reach nginx over HTTPS.
# An older certificate without it is replaced.
if [ -f "$CERT" ] && [ -f "$KEY" ] \
    && openssl x509 -in "$CERT" -noout -ext subjectAltName 2>/dev/null | grep -q "DNS:nginx"; then
    echo "certs: certificate already exists, skipping"
    exit 0
fi

openssl req -x509 -nodes -days 365 \
    -newkey rsa:2048 \
    -keyout "$KEY" \
    -out "$CERT" \
    -subj "/CN=localhost" \
    -addext "subjectAltName=DNS:localhost,DNS:nginx,IP:127.0.0.1"

echo "certs: self-signed certificate generated for localhost and nginx"
