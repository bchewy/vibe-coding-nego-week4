# vibe-coding-nego-week4
- No code was written by a human.
# Negotiation Calculator for Moms.com Deal

A simple web calculator to help evaluate different deal scenarios when negotiating for Moms.com TV show rights.

## Key Features

- Calculate total revenue based on number of runs per episode (4-8 runs)
- Evaluate licensing fees per episode ($30k-$60k range) 
- Payment schedule optimization with savings calculations
- Comparison against BATNA ($3M alternative deal)
- Visual indicators for recommended ranges

## Usage

1. Clone the repo
2. Run `npm install`
3. Start with `npm start`
4. Open http://localhost:8080 in your browser

## Calculator Logic

- Base revenue: $8.4M (based on 6 runs)
- Revenue adjustment: ±$800k per run above/below 6 runs
- Payment savings: 10% per year delayed (up to 50% in year 5)
- Licensing fee: Per episode cost × 100 episodes

## Tech Stack

- React for UI components
- Tailwind CSS for styling
- Simple static hosting with http-server

## Development

The calculator is built as a single-page app with React. Key calculations are handled in the NegotiationCalculator component.

Feel free to modify ranges and formulas in app.js to match your specific negotiation parameters.
