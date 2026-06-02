# ASICS Melbourne Local Guide

A tourist guide web app for ASICS Melbourne store customers. Displays curated Melbourne locations on an interactive map with category filtering and search.

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The app ships with 13 sample Melbourne locations so it works immediately without any configuration.

## Google Sheet Setup

### 1. Create the Sheet

Create a Google Sheet with exactly these 3 column headers in row 1:

| Google Maps URL | Category | Description |
|---|---|---|

That's it — **name and address are pulled automatically from the Google Maps URL.**

**Column guide:**

| Column | What to put |
|--------|-------------|
| Google Maps URL | The URL from your browser when viewing the place on Google Maps (see below) |
| Category | Pick one: `Nature` · `Food & Drink` · `Culture` · `Shopping` · `Sport` · `Nightlife` |
| Description | 1–2 sentences about the place |

> **Tip:** To prevent Category typos, select the Category column in Sheets → **Data → Data validation → Dropdown** and enter the 6 options. Staff then pick from a list instead of typing.

### 2. Getting the Google Maps URL

For each location:
1. Go to [maps.google.com](https://maps.google.com)
2. Search for the place
3. Copy the URL from your **browser's address bar**

The URL will look like:
```
https://www.google.com/maps/place/Federation+Square/@-37.818,144.9691,15z/...
```

The app automatically extracts the **place name**, **map coordinates**, and **street address** from that URL — nothing else to fill in.

> **Note:** Don't use the Share button shortlink (`maps.app.goo.gl/…`) — it won't work. Copy from the address bar only.

### 3. Publish the Sheet as CSV

1. **File → Share → Publish to web**
2. Change the format from **"Web page"** to **"Comma-separated values (.csv)"**
3. Click **Publish** and copy the URL

The URL will look like:
```
https://docs.google.com/spreadsheets/d/SHEET_ID/pub?output=csv
```

Once published, the URL updates automatically whenever you edit the sheet — no need to republish.

### 4. Configure the App

Copy `.env.example` to `.env` and paste your CSV URL:

```
VITE_SHEET_CSV_URL=https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/pub?output=csv
```

## Deploying to Vercel

1. Push this repo to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add the environment variable `VITE_SHEET_CSV_URL` in the Vercel project settings
4. Deploy — `vercel.json` handles SPA routing automatically
