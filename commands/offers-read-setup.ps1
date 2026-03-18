# Offers Read Setup Commands
# Run from repo root: c:\Users\Mabco\Desktop\New MABCO Website

# 1) Build/refresh the offers_read collection via the API server
# Ensure the API server is running on http://localhost:5000
Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/offers-read/rebuild"

# 2) Restart the server (adjust to your setup if different)
# If you run the API with npm scripts, use one of these:
# npm run dev
# npm start

# 3) (Optional) If you want to create DB indexes manually (Mongo shell)
# Replace <dbName> if needed
# use mabco_website
# db.products.createIndex({ "offers.offer_type": 1, updatedAt: -1 })
# db.products.createIndex({ "offers.type": 1, updatedAt: -1 })
# db.products.createIndex({ "colorVariants.offers.offer_type": 1 })
# db.products.createIndex({ "colorVariants.offers.type": 1 })
# db.products.createIndex({ "chargeOptions.offers.offer_type": 1 })
# db.products.createIndex({ "chargeOptions.offers.type": 1 })
