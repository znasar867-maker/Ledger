## Subscription Ledger
# Project Overview

Subscription Ledger is a browser-based personal finance application designed to help users track and manage recurring subscription expenses.

The application allows users to manually record subscriptions, monitor upcoming charges, understand monthly and yearly spending, identify expensive subscriptions, and find subscriptions that may be worth cancelling.

The project uses browser localStorage, so subscription data stays on the user's device and does not require a backend or database.

# Problem Statement

People often subscribe to multiple streaming, software, fitness, music, and other recurring services. Over time, it can become difficult to remember:

Which subscriptions are currently active
How much is being spent each month and year
When the next payment is due
Which subscriptions are expensive
Which services have not been used recently
Where subscription spending is concentrated

Subscription Ledger addresses this problem by providing a simple interface for manually logging subscriptions and reviewing their financial impact.

# Features Implemented
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

# Tech Stack
Frontend
HTML5
CSS3
JavaScript
Browser Storage
Web Storage API
localStorage
Architecture

The application is a client-side, multi-page web application consisting of:

index.html
audit.html
insights.html
style.css
app.js


The same app.js file is shared across all three pages.

# Project Structure
subscription-ledger/
│
├── index.html
├── audit.html
├── insights.html
├── style.css
├── app.js
└── README.md

index.html

The Home page provides:

Monthly spending summary
Yearly spending summary
Number of subscriptions
Possible cuts
Upcoming charges
Category spending
Quick navigation to Audit and Insights
audit.html

The Audit page provides:

Subscription entry form
Streaming-site selection
Upcoming charge timeline
Subscription ledger
Edit functionality
Delete functionality
Clear-all functionality
insights.html

The Insights page provides:

Spending statistics
Upcoming renewals
Expensive subscription analysis
Possible cuts
Category spending breakdown
Complete subscription records
style.css

Contains the visual styling for the application.

app.js

Contains the shared application logic, including:

Local storage
Subscription management
Date calculations
Cost calculations
Audit rendering
Home page rendering
Insights rendering
Streaming-site handling
Editing and deleting subscriptions
Installation & Setup

No backend server, database, package manager, or external dependencies are required.

Step 1: Download or clone the project

Place all project files in the same directory.

Example:

subscription-ledger/
├── index.html
├── audit.html
├── insights.html
├── style.css
├── app.js
└── README.md

Step 2: Verify the JavaScript file

Make sure app.js is located in the same directory as the HTML files.

Each HTML page should contain:

<script src="app.js"></script>

Step 3: Verify the stylesheet

Make sure style.css is also located in the same directory.

The HTML files should contain:

<link rel="stylesheet" href="style.css">

How to Run the Project
Option 1: Open Directly in a Browser

The simplest way to run the application is to open:

index.html


in a modern web browser.

From the Home page, users can navigate to:

Home → Audit → Insights

Option 2: Use VS Code Live Server

If using Visual Studio Code:

Open the project folder in VS Code.
Install the Live Server extension if it is not already installed.
Right-click index.html.
Select Open with Live Server.
The application will open in the browser.

The project does not require:

npm install
npm start


or any backend server.

Using the Application
Add a Normal Subscription
Open Audit.
Enter the subscription name.
Enter the cost.
Select the billing cycle.
Select the next charge date.
Enter the last-used date if applicable.
Select a category.
Click Add line.
Add a Streaming Subscription
Open Audit.
Enter the subscription name.
Enter the cost.
Select the billing cycle.
Select the next charge date.
Select:
Category → Streaming

A Streaming site field will appear.
Select the relevant streaming service.
Click Add line.

The streaming service will be saved with the subscription and displayed in Insights.

# Data Flow

The application uses localStorage to share subscription information between pages.

The basic flow is:

Audit
  ↓
Add subscription
  ↓
JavaScript
  ↓
localStorage
  ↓
Subscription Ledger Data
  ↓
Home / Insights


For a streaming subscription:

Audit
  ↓
Category = Streaming
  ↓
Streaming Site = Netflix
  ↓
Save to localStorage
  ↓
Insights
  ↓
Netflix appears in Streaming Site column

Data Format

A subscription is stored approximately as:

{
  id: "123456789",
  name: "Netflix",
  cost: 15.99,
  cycle: "monthly",
  next: "2026-09-15",
  lastUsed: "2026-09-01",
  category: "Streaming",
  streamingSite: "Netflix"
}


Non-streaming subscriptions can have an empty streaming-site value:

{
  category: "Software",
  streamingSite: ""
}

Browser Compatibility

The project requires a modern browser with support for:

HTML5
CSS3
JavaScript
localStorage

Recommended browsers include current versions of:

Google Chrome
Microsoft Edge
Mozilla Firefox
Safari
Privacy

The application does not connect to a bank account or financial institution.

The interface explicitly treats subscription information as manually entered data.

All subscription records are stored locally in the browser using localStorage.

Clearing the browser's local storage or using the application's Clear all entries option will remove the stored subscription data.


# Conclusion

Subscription Ledger provides a simple client-side solution for monitoring recurring subscription expenses.

It combines an Audit interface for entering subscription information with Home and Insights pages that transform the stored data into useful spending summaries, renewal information, category breakdowns, and potential savings opportunities.

Streaming services are specifically tracked so that a subscription such as Netflix can be identified not only as a Streaming expense but also by its specific Streaming Site.