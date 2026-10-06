# Architecture

The pages share structured catalog data from `scripts/products.js`. Navigation and footer markup are inlined so opening the archive from disk does not require cross-file fetch requests. `scripts/cart.js` manages a dedicated browser-storage key, `rewind_showcase_cart_v1`, with item IDs and quantities. Product descriptions and details originate from the saved catalog.

`category.html` filters and sorts the catalog. A missing availability parameter selects `in-stock`; an explicitly empty `status` parameter preserves All Statuses. `product.html` renders the requested item. `cart.html` resolves selections against the catalog and displays its items and subtotal. `checkout.html` displays a summary without collecting details or submitting an order.

The original PHP shells, analytics, server-side contact submission, webhook endpoint, webhook logs, Shopify embed code, variant IDs, and operational product notes are not included. The original logo and CSS are retained. The category cover illustrations are replacements created for the archive. Product photos are resized local copies; unavailable historical photos are explicitly marked.

The preview cart allows Coming Soon items even when their current inventory quantity is zero, using a preview limit of 99. In Stock items retain the recorded inventory limits. Archived items cannot be added. No Coming Soon records exist in this catalog snapshot.

This repository is a portfolio archive. Separate Python/admin/AI services and the Shopify payment flow are not simulated as live integrations.
