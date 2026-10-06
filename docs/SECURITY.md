# Security and data boundaries

The public export is restricted to storefront pages, display-only catalog fields, browser scripts, CSS, images, and documentation. It does not contain server endpoints, environment files, credentials, webhook logs, customer records, order records, Shopify checkout embeds, operational notes, or private repository history.

No live checkout, contact submission, analytics, or AI API calls are included. External links in the case study and footer lead to Jared's public GitHub/LinkedIn materials. All storefront images and scripts are local to the archive.

Cart state is stored in the browser and is not uploaded. This demo contains historical product information; it is not a current store. A credentials-pattern scan and a check for runtime network/submission endpoints are part of verification. Such scans reduce accidental disclosure but cannot prove the absence of every possible secret.

Report a suspected issue through the repository's GitHub issues without posting credentials or other sensitive data.
