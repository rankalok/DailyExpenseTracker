# 🧾 Daily Expense Tracker

A comprehensive web application for tracking daily expenses with smart categorization, file import/export capabilities, and detailed financial summaries. Built with modern web technologies for a seamless user experience across all devices.

## Features

### 📥 Add Expense Page
- **Date Input**: Quick date selection buttons + manual calendar (Format: dd-MMM-YYYY)
  - **Today** button: Current date (1 click)
  - **Yesterday** button: Previous day (1 click)
  - **Last Month** button: Same day from previous month (1 click) - Perfect for monthly recurring expenses
  - **Custom** button: Manual date picker for any specific date
- **Amount**: Numeric input with 2 decimal places support
- **Description**: Text input (max 200 characters with live counter)
- **Label**: Autocomplete suggestions from predefined categories
- **Payment Option**: Autocomplete suggestions from payment methods
- **Auto-save**: New labels and payment options are automatically saved

### 📄 List Added Expenses Page
- **Monthly Navigation**: Browse expenses by month with arrow controls
- **Expense Table**: Complete list with S.No, Date, Amount, Description, Label, Payment Option
- **Inline Editing**: Edit expenses directly with modal forms
- **Delete Protection**: Confirmation dialogs for expense deletion
- **Label Summary**: Total spending by category with percentages
- **Payment Summary**: Total spending by payment method with percentages
- **Real-time Calculations**: Automatic totals and percentages
- **File Operations**: 
  - **Import**: Load expenses from CSV or TXT files
  - **Export**: Download data as CSV or TXT format
  - **Smart Parsing**: Automatic detection of CSV format in TXT files

### ⚙️ Settings Page (New!)
- **Label Management**: 
  - Add new expense categories
  - Edit existing labels with inline editing
  - Delete unused labels with confirmation
  - Grid-based display for easy management
- **Payment Options Management**: 
  - Add new payment methods
  - Edit existing options
  - Delete obsolete payment methods
  - Organized card layout
- **Smart Features**:
  - Duplicate prevention with validation
  - Empty entry protection
  - Uppercase normalization for consistency
  - Enter key support for quick additions
- **Reset Options**: Restore default labels and payment options
- **Real-time Updates**: Changes immediately reflect in form suggestions
- **Responsive Design**: Works perfectly on mobile and desktop

## Default Categories

### Labels
FOOD, CLOTHING, GROOMING, MEDICAL, UTILITY, VEHICLE-MAINTENANCE, PETROL, MONTHLY, CLASSES, SCHOOL, LEARNING, MANDIR, BHISI, JSG, OFFICE-LUNCH, COMMUTING, ONLINE-PAYMENT, EATING-OUT, ENTERTAINMENT, TRAVEL/VACATION, ELECTRONICS, INVESTMENT, MISCELLANEOUS

### Payment Options
CC-HDFC-RUPAY, CC-AXIS-BANK, CC-HDFC-REGALIA, CC-ICICI-AMAZON-PAY, UPI-LITE, UPI-JUPITER, UPI-DCB-NIYO, UPI-KOTAK, UPI-AXIS, UPI-SBI, UPI-ICICI, AMAZON-PAY, PLUXEE, FASTAG, CASH, BHAVNA, PAHAL

## File Import/Export Features

### Supported File Formats
- **CSV Files**: Standard comma-separated values with quoted text support
- **TXT Files**: Both traditional format and CSV-formatted text files
- **Smart Detection**: Automatically detects CSV format in TXT files

### Import Capabilities
- **Date Parsing**: Supports dd-MMM-YYYY format (e.g., "01-Oct-2025")
- **Amount Parsing**: Handles currency symbols and decimal values
- **Quoted Fields**: Properly processes quoted descriptions and special characters
- **Duplicate Prevention**: Avoids importing duplicate expenses
- **Error Handling**: Validates data and provides helpful error messages

### Export Options
- **CSV Download**: Clean CSV format with proper quoting
- **TXT Download**: Traditional text format with detailed formatting
- **Monthly Files**: Organized by month (MMM-YYYY.csv/txt)
- **Browser Integration**: Direct download without external dependencies

### File Format Examples

**CSV Format:**
```csv
Date,Amount,Description,Label,Payment Option
01-Oct-2025,800.00,"Prachi diet consultation",MISCELLANEOUS,BHAVNA
02-Oct-2025,2638.00,"Trimurti groceries",FOOD,UPI-DCB-NIYO
```

**Traditional TXT Format:**
```
1. 01-Oct-2025
Amount: ₹800.00
Description: Prachi diet consultation
Label: MISCELLANEOUS
Payment: BHAVNA

2. 02-Oct-2025
Amount: ₹2638.00
Description: Trimurti groceries
Label: FOOD
Payment: UPI-DCB-NIYO
```

## Technical Details

### Data Storage
- **Client-side Persistence**: Uses `localStorage` for data storage
- **Monthly Organization**: Expenses stored as `expenses-YYYY-MM` format
- **Settings Storage**: 
  - Custom labels: `expenseLabels`
  - Custom payment options: `paymentOptions`
- **Data Integrity**: Automatic sorting and validation
- **Cross-session**: Data persists between browser sessions
- **No Server Required**: Completely client-side application

### File Structure
```
├── index.html          # Main application page
├── styles.css          # CSS styling and responsive design
├── script.js           # JavaScript functionality
├── LABELS.txt          # Default expense labels
├── PAYMENT-OPTIONS.txt # Default payment options
└── README.md           # This file
```

### Key Technical Features
- **Responsive Design**: CSS Grid and Flexbox for all screen sizes
- **Data Persistence**: localStorage with JSON serialization
- **Smart Parsing**: Advanced CSV/TXT parsing with error handling  
- **Date Handling**: Multiple date format support (ISO, dd-MMM-yyyy)
- **Auto-suggestions**: Dynamic autocomplete with datalist elements
- **Month Navigation**: Efficient date-based data organization
- **Summary Reports**: Real-time calculations with percentage analytics
- **Form Validation**: Client-side validation with user feedback
- **Modal System**: Overlay editing with backdrop blur effects
- **File Operations**: Drag-and-drop ready import/export system

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
   - Import expenses from CSV/TXT files
   - Download expense data in CSV or TXT format
   - All data persists between browser sessions

4. **Settings Management**:
   - Click "⚙️ Settings" tab
   - Add new labels or payment options
   - Edit existing items by clicking the edit icon
   - Delete items with the trash icon (with confirmation)
   - Reset to default values if needed

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