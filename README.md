# Rewind the Finds — Storefront Showcase

A working archive of the storefront Jared Hall built for Rewind the Finds, with its saved product catalog and an interactive shopping cart.

**[Open the live demo](https://bropaine.github.io/RewindTheFinds-Storefront-Showcase/)** · **[Browse products](https://bropaine.github.io/RewindTheFinds-Storefront-Showcase/category.html)** · **[Engineering case study](https://bropaine.github.io/RewindTheFinds-Storefront-Showcase/about.html)**

## Under the hood

<details>
<summary><strong>Availability filters preserve explicit user choices</strong></summary>

The browser defaults to In Stock only when the URL has no status parameter. An explicitly empty parameter represents All Statuses.

```js
status: getQueryParam('status'),
// ...other filters...
if (currentFilters.status === null) currentFilters.status = "in-stock";
```

The query builder retains an empty status selection when the page is refreshed:

```js
for (const key in params) {
  if (params[key] || key === 'status') searchParams.set(key, params[key]);
}
```

[Full filtering and sorting implementation](category.html)

</details>

<details>
<summary><strong>The cart stores selections rather than duplicating product data</strong></summary>

The catalog remains the source of product details. Cart state contains product IDs and quantities, with inventory limits enforced when adding items.

```js
const maxAvailable = (product.status === "coming-soon" ? 99 : product.quantity || 1);
const item = cart.find(i => i.productId === productId);

if (item) {
  item.quantity = Math.min(item.quantity + quantity, maxAvailable);
} else {
  cart.push({ productId, quantity: Math.min(quantity, maxAvailable) });
}
saveCart(cart);
```

[Full cart state implementation](scripts/cart.js) · [Cart rendering and subtotals](cart.html)

</details>

![Original Rewind the Finds branding](images/rewind-logo.webp)

## What to try

1. Open **Browse products**. Availability defaults to **In Stock**.
2. Search the catalog, filter categories, or sort by price and name.
3. Open a product or click **Add to Cart**.
4. Open the cart to see photos, quantities, prices, and the subtotal. Add another product, remove an item, or clear the cart.
5. Refresh the page: the cart persists in your browser.
6. Select **Preview Checkout** to see the final summary. No payment information is collected and no order is submitted.

The saved catalog contains **170 products**: **148 In Stock** and **22 Archived**. These are historical labels and prices, not current offers or inventory. All 148 available product photos are bundled locally. The 22 unavailable historical photos have clearly labeled placeholders. Coming Soon items are supported by the preview cart, although none appear in the saved catalog.

## Engineering demonstrated

| Area | Implementation |
| --- | --- |
| Frontend | HTML5, CSS, plain JavaScript; responsive layouts and a saved theme preference |
| Catalog | Data-driven listings, category hierarchy, availability filters, search, sorting, product detail pages, incremental loading |
| Shopping flow | Product selection, persistent browser cart, inventory-aware quantity limits, removal, subtotal calculation, checkout preview |
| Content integration | Original storefront consumed structured product data managed by separate import and admin tooling |
| Archive portability | Relative URLs, bundled photos, inlined navigation/footer, static HTML; no PHP server, package installation, API credentials, or old domain required |

## How this relates to the original systems

The original customer-facing storefront used an HTML/CSS and JavaScript frontend with PHP page shells and Shopify checkout integration. This archive converts those page shells into static HTML and replaces live checkout with a local preview.

Jared's related independent work included Python backend/admin tooling, image-assisted product information, OpenAI API market research, data rendering, batch updates of website product data, and UI-driven changes to availability labels and configuration. Those services are described in the case study; they do not execute inside this static demo.

Related public implementation: **[Unified Shopify Product Generator](https://github.com/Bropaine/UnifiedShopifyProductGenerator)**. The original admin application remains private.

There is no React implementation in this storefront. It demonstrates the actual frontend used for the store.

## Run without hosting

Download this repository as a ZIP, extract it, and open **index.html** in a browser. Keep the `images`, `scripts`, and `style` folders alongside the HTML files. The demo uses ordinary local scripts and bundled images rather than network imports.

For a local web preview, run `python -m http.server 8000` from the extracted folder and open `http://localhost:8000/`. No Python application services are needed; this command only serves the static files.

GitHub Pages publishes `main` from the repository root. `.nojekyll` keeps deployment as plain static files. No custom domain is configured.

## Documentation

- [Architecture and archive changes](docs/ARCHITECTURE.md)
- [Security and data boundaries](docs/SECURITY.md)
- [Verification checklist](docs/VERIFICATION.md)

Built by **Jared Hall** · [GitHub](https://github.com/Bropaine) · [LinkedIn](https://www.linkedin.com/in/jared-hall-171596233/)
