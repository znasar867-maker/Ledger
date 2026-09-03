# Why i chose this idea

I chose this idea because I often see people struggle to keep track of their subscriptions and stay on top of recurring payments. This is also a problem I can personally relate to, as it can be easy to forget about subscriptions when they renew automatically. I wanted to create a solution that makes it easier for users to monitor their subscriptions, understand their recurring expenses, and avoid unexpected charges.

# Every feature implemented

1. Subscription Audit
The Audit page allows users to add and manage subscription records.

Users can enter:

Subscription name
Cost
Billing cycle
Next charge date
Last used date
Category
Streaming site, when the category is Streaming
Supported billing cycles:

Monthly
Weekly
Yearly
2. Streaming Site Tracking
The Audit page includes a dedicated streaming-site selector when the Streaming category is selected.

Supported streaming services include:

Netflix
Amazon Prime Video
Disney+
Hulu
Max
Apple TV+
Paramount+
Peacock
YouTube Premium
Spotify
Other
The selected streaming service is stored together with the subscription.

For example:

Name: Netflix
Category: Streaming
Streaming Site: Netflix
Cost: $15.99
Billing Cycle: Monthly

Streaming-site information is also displayed in the Insights page.

3. Edit Subscriptions
Existing subscriptions can be edited from the Audit page.

When editing a streaming subscription, its selected streaming site is loaded automatically.

Users can update:

Name
Cost
Billing cycle
Next charge date
Last used date
Category
Streaming site
4. Delete Subscriptions
Users can delete individual subscription records from the Audit page.

A confirmation message is displayed before deletion.

5. Clear All Entries
The Audit page provides an option to remove all saved subscription records.

A confirmation is required before all data is deleted.

6. Monthly and Yearly Spending
The application automatically calculates normalized monthly costs.

For example:

Monthly subscription → full monthly cost
Weekly subscription → yearly weekly cost divided by 12
Yearly subscription → yearly cost divided by 12
The application also calculates estimated yearly spending from the monthly total.

7. Upcoming Charges
The Home and Audit pages display upcoming subscription charges.

The Audit page includes a timeline for charges occurring within the next 45 days.

8. Renewal Tracking
The Insights page identifies subscriptions that are:

Past due
Due today
Due within 7 days
Due within 30 days
This helps users identify upcoming recurring expenses.

9. Expensive Subscription Analysis
The Insights page sorts subscriptions by their normalized monthly cost and displays the most expensive subscriptions.

This helps users quickly identify services that have the largest impact on their monthly budget.

10. Possible Cuts
Subscriptions that have not been used for 60 or more days are flagged as possible budget cuts.

The application calculates the potential monthly savings from cancelling those subscriptions.

11. Category Spending Breakdown
Subscription spending is grouped by category.

Categories include:

Streaming
Software
Fitness
Music
News
Utilities
Other
The Home and Insights pages display the monthly spending breakdown using visual bars.

12. Complete Subscription Data
The Insights page provides a complete subscription table containing:

Name
Category
Streaming Site
Cost
Monthly cost
Next charge date
Status
13. Browser-Based Storage
Subscription information is stored using:

localStorage

The application uses the storage key:

subscription-ledger-data

No bank account information or external financial data is retrieved.

All subscription records remain in the user's browser.


# Future Improvements

Currency selection
Subscription reminders
Different mode