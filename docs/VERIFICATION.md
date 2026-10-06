# Verification

The archive should satisfy these checks after changes:

- Product browsing without a status parameter shows In Stock listings; explicit Coming Soon, Archived, and All Statuses selections are respected.
- Search and sorting update the displayed items, and All Statuses persists after reloading its URL.
- Product images load locally and missing historical photos show the archive placeholder.
- Adding a product fills the cart with its image, quantity, and price; adding another creates another row.
- Removing and clearing items update the subtotal and count. Cart state persists after reload.
- Coming Soon records can be added and survive cart cleanup, including when quantity is zero. Test this with an isolated fixture rather than changing the historical catalog.
- In Stock quantities cannot exceed recorded inventory; Archived items cannot be added.
- Checkout stays in the archive and displays a summary without collecting payment details.
- Local links resolve and no PHP, old-domain, analytics, live-checkout, or server-submission dependencies remain.
- Check desktop and narrow layouts, navigation, and product details.

Validation results for the initial archive are recorded with the delivered build report.
