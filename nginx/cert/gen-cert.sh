#!/bin/sh
set -e

CERT=/certs/cert.pem
KEY=/certs/key.pem

if [ -f "$CERT" ] && [ -f "$KEY" ]; then
    echo "certs: certificate already exists, skipping"
    exit 0
fi

openssl req -x509 -nodes -days 365 \
    -newkey rsa:2048 \
    -keyout "$KEY" \
    -out "$CERT" \
    -subj "/CN=localhost" \
    -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"

echo "certs: self-signed certificate generated for localhost"