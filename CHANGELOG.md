# Changelog

All notable changes to the Daily Expense Tracker project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-10-02

### Added
- **Settings Management Page**
  - Added new "⚙️ Settings" tab to main navigation
  - **Label Management Section**:
    - Add new expense categories with real-time validation
    - Edit existing labels with inline editing (prompt-based)
    - Delete labels with confirmation dialogs
    - Grid-based display with card layout for easy management
  - **Payment Options Management Section**:
    - Add new payment methods with duplicate prevention
    - Edit existing payment options with validation
    - Delete obsolete payment methods with confirmation
    - Organized card layout with hover effects
  - **Smart Features**:
    - Uppercase normalization for consistency
    - Enter key support for quick additions
    - Real-time form suggestion updates
    - Duplicate prevention with user feedback
  - **Reset Options**:
    - "Reset Labels to Default" button to restore original categories
    - "Reset Payment Options to Default" button to restore original methods
    - Confirmation dialogs for destructive operations
  - **Responsive Design**: Perfect mobile and desktop experience

- **Enhanced File Import/Export**
  - **Improved CSV Parsing**:
    - Fixed date parsing for dd-MMM-YYYY format (e.g., "01-Oct-2025")
    - Proper handling of quoted fields in CSV files
    - Enhanced field validation and error reporting
    - Added missing `generateId()` method for imported expenses
  - **Smart TXT File Processing**:
    - Automatic detection of CSV format within TXT files
    - Dual-format support: traditional TXT and CSV-formatted TXT
    - Backward compatibility with existing TXT export format
  - **Advanced Date Handling**:
    - Prioritized dd-MMM-YYYY parsing for CSV imports
    - Fixed timezone issues in date conversion
    - ISO format validation and normalization
    - Consistent date formatting across all operations

### Fixed
- **Date Parsing Issues**
  - Fixed incorrect date conversion where "01-Oct-2025" was being parsed incorrectly
  - Resolved timezone offset problems in date creation
  - Proper ISO format conversion (dd-MMM-YYYY → YYYY-MM-DD)
  - Consistent date handling across import and display functions

- **CSV Import Problems**
  - Fixed missing `generateId()` method that caused import failures
  - Corrected CSV field parsing for quoted descriptions
  - Improved error handling for malformed CSV data
  - Enhanced duplicate detection during import process

- **TXT File Compatibility**
  - Added CSV format detection for TXT files with identical content
  - Maintained support for traditional numbered TXT format
  - Fixed parsing inconsistencies between file formats
  - Improved error messages for unsupported formats

### Improved
- **User Experience Enhancements**
  - Settings page with intuitive management interface
  - Real-time validation feedback for all operations
  - Consistent button styling and hover effects
  - Mobile-responsive design for settings management
  - Keyboard shortcuts (Enter key) for common actions

- **Data Management**
  - Automatic label and payment option synchronization
  - Improved localStorage management for settings
  - Enhanced data validation across all operations
  - Consistent uppercase normalization for categories

- **Code Quality**
  - Modular settings management functions
  - Improved error handling and user feedback
  - Better separation of concerns in codebase
  - Enhanced documentation and code comments

## [1.1.0] - 2025-10-02

### Added
- **Download Functionality**
  - Added "Download CSV" button to export expense data in CSV format
  - Added "Download TXT" button to export expense data in TXT format (same format as CSV)
  - Both downloads use smart naming: `expenses-{MONTH}-{YEAR}.{extension}` (e.g., `expenses-OCT-2025.csv`)
  - CSV and TXT files now use identical comma-separated format for consistency

- **Import/Load Functionality**
  - Added "Load File" button to import expense data from external files
  - Support for importing CSV files with automatic parsing
  - Support for importing TXT files with automatic parsing
  - Hidden file input that accepts both .csv and .txt file types
  - Intelligent duplicate detection to prevent importing the same expense twice

- **Data Processing Features**
  - Smart date parsing supporting multiple formats:
    - ISO format (YYYY-MM-DD)
    - dd-MMM-YYYY format (e.g., 02-Oct-2025)
  - Automatic data validation during import:
    - Amount validation (must be numeric and non-negative)
    - Date validation with format conversion
    - Required field validation
  - Auto-categorization: New labels and payment options from imported files are automatically added to the system

- **User Interface Enhancements**
  - Redesigned list header with organized control sections
  - New `.header-controls` container for better layout organization
  - File operations section with download and upload controls
  - Green-styled download buttons with hover effects
  - Blue-styled upload button with hover effects
  - Success/error messaging for all file operations

### Changed
- **UI Structure Updates**
  - Modified `.list-header` layout from simple flex to nested control structure
  - Updated header controls to use flex-column layout for better organization
  - Improved button spacing and alignment in file operations section

- **CSS Styling Improvements**
  - Enhanced `.list-header` styles for better responsive design
  - Added new button styles:
    - `.btn-download` with green gradient (success theme)
    - `.btn-upload` with blue gradient (info theme)
  - Added hover animations with transform and shadow effects
  - Improved responsive design for mobile devices:
    - Centered file operations on smaller screens
    - Flexible button wrapping for narrow viewports

- **JavaScript Architecture**
  - Extended `ExpenseTracker` class with new methods:
    - `downloadCSV()` - CSV export functionality
    - `downloadTXT()` - TXT export functionality  
    - `generateTXT()` - TXT content generation (now matches CSV format)
    - `downloadFile()` - Generic file download helper
    - `triggerFileInput()` - File input trigger
    - `handleFileLoad()` - File load event handler
    - `parseCSV()` - CSV parsing logic
    - `parseCSVLine()` - CSV line parsing with quote handling
    - `parseTXT()` - TXT parsing logic
    - `createExpenseFromFields()` - Expense object creation from CSV
    - `createExpenseFromTXTData()` - Expense object creation from TXT
    - `parseDate()` - Multi-format date parsing
    - `mergeExpenses()` - Smart expense merging with duplicate prevention
  - Added comprehensive error handling for file operations
  - Enhanced data validation throughout the import process

### Technical Details
- **File Format Standardization**
  - Both CSV and TXT downloads now use identical comma-separated format
  - Header row: `Date,Amount,Description,Label,Payment Option`
  - Data rows: Properly quoted descriptions, formatted amounts, standardized dates

- **Data Storage Integration**
  - Imported expenses are automatically organized by month in localStorage
  - Month keys follow format: `expenses-YYYY-MM`
  - Expenses are sorted by date within each month
  - Labels and payment options are synchronized across all months

- **Error Handling**
  - Comprehensive validation for imported data
  - User-friendly error messages for invalid files
  - Graceful handling of malformed CSV/TXT content
  - File format detection and appropriate parsing

- **Performance Optimizations**
  - Efficient duplicate detection during import
  - Minimal DOM updates during large imports
  - Memory management with proper file URL cleanup

### Security
- Input sanitization for imported expense descriptions
- File type validation to accept only .csv and .txt files
- Data validation to prevent malicious content injection

---

## [1.0.0] - Initial Release

### Added
- Basic expense tracking functionality
- Add expense form with date, amount, description, label, and payment option
- Monthly expense viewing and navigation
- Expense editing and deletion capabilities
- Summary tables by label and payment option
- Local storage persistence
- Responsive design for mobile and desktop
- Auto-complete suggestions for labels and payment options
- Character count validation for descriptions
- Default labels and payment options system

### Features
- **Add Expense Page**
  - Date picker with current date default
  - Amount input with decimal precision
  - Description field with 200 character limit
  - Label autocomplete with predefined options
  - Payment option autocomplete
  - Form validation and clearing

- **List Expenses Page**
  - Monthly navigation (previous/next month)
  - Comprehensive expense table with edit/delete actions
  - Summary by label with percentages
  - Summary by payment option with percentages
  - Total amount calculation
  - Empty state handling

- **Data Management**
  - localStorage-based persistence
  - Monthly data organization
  - Dynamic label and payment option management
  - Expense editing modal
  - Data validation and error handling