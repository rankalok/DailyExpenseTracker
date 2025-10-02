# 🧾 Daily Expense Tracker

A simple and intuitive web application for tracking daily expenses with categorization and detailed summaries.

## Features

### 📥 Add Expense Page
- **Date Input**: Manual entry or calendar dropdown (Format: dd-MMM-YYYY)
- **Amount**: Numeric input with 2 decimal places support
- **Description**: Text input (max 200 characters with live counter)
- **Label**: Autocomplete suggestions from predefined categories
- **Payment Option**: Autocomplete suggestions from payment methods
- **Auto-save**: New labels and payment options are automatically saved

### 📄 List Added Expenses Page
- **Monthly Navigation**: Browse expenses by month
- **Expense Table**: Complete list with edit/delete functionality
- **Label Summary**: Total spending by category with percentages
- **Payment Summary**: Total spending by payment method with percentages
- **Real-time Calculations**: Automatic totals and percentages

## Default Categories

### Labels
FOOD, CLOTHING, GROOMING, MEDICAL, UTILITY, VEHICLE-MAINTENANCE, PETROL, MONTHLY, CLASSES, SCHOOL, LEARNING, MANDIR, BHISI, JSG, OFFICE-LUNCH, COMMUTING, ONLINE-PAYMENT, EATING-OUT, ENTERTAINMENT, TRAVEL/VACATION, ELECTRONICS, INVESTMENT, MISCELLANEOUS

### Payment Options
CC-HDFC-RUPAY, CC-AXIS-BANK, CC-HDFC-REGALIA, CC-ICICI-AMAZON-PAY, UPI-LITE, UPI-JUPITER, UPI-DCB-NIYO, UPI-KOTAK, UPI-AXIS, UPI-SBI, UPI-ICICI, AMAZON-PAY, PLUXEE, FASTAG, CASH, BHAVNA, PAHAL

## Technical Details

### Data Storage
- Uses `localStorage` for client-side data persistence
- Monthly expense files: `expenses-YYYY-MM`
- Label storage: `expenseLabels`
- Payment options storage: `paymentOptions`

### File Structure
```
├── index.html          # Main application page
├── styles.css          # CSS styling and responsive design
├── script.js           # JavaScript functionality
├── LABELS.txt          # Default expense labels
├── PAYMENT-OPTIONS.txt # Default payment options
└── README.md           # This file
```

### Key Features
- **Responsive Design**: Works on desktop and mobile devices
- **Data Persistence**: All data saved locally in browser
- **Auto-suggestions**: Dynamic autocomplete for labels and payment options
- **Month Navigation**: Easy browsing of historical expenses
- **Summary Reports**: Automatic categorization and percentage calculations
- **Form Validation**: Client-side validation for all inputs
- **Delete Functionality**: Remove individual expenses with confirmation

## Usage

1. **Adding Expenses**:
   - Click "📥 Add Expense" tab
   - Fill in all required fields
   - Click "Add Expense" to save
   - Use "Clear" to reset the form

2. **Viewing Expenses**:
   - Click "📄 List Expenses" tab
   - Use month navigation arrows to browse different months
   - View three summary tables: expenses, labels, and payment methods

3. **Managing Data**:
   - New labels and payment options are automatically saved
   - Delete individual expenses using the trash icon
   - All data persists between browser sessions

## Browser Compatibility

- Modern browsers with localStorage support
- Responsive design for mobile and desktop
- Progressive Web App capabilities

## Future Enhancements

- Export to CSV functionality
- Data backup and restore
- Expense categories with budgets
- Charts and visualizations
- Multi-currency support