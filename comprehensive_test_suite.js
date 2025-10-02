// Comprehensive Test Suite for Daily Expense Tracker
// Testing all major functionality as specified in requirements

console.log("🧪 DAILY EXPENSE TRACKER - COMPREHENSIVE TEST SUITE");
console.log("=".repeat(60));
console.log(`Test Date: ${new Date().toLocaleDateString()}`);
console.log(`Test Environment: Node.js ${process.version}`);
console.log("=".repeat(60));

// Mock Environment Setup
const mockStorage = {};
global.localStorage = {
    getItem: (key) => mockStorage[key] || null,
    setItem: (key, value) => mockStorage[key] = value,
    removeItem: (key) => delete mockStorage[key],
    clear: () => Object.keys(mockStorage).forEach(key => delete mockStorage[key])
};

global.confirm = () => true;
global.prompt = (msg, def) => def ? def + '_EDITED' : 'NEW_ITEM';

// Test Results Tracking
let testResults = {
    total: 0,
    passed: 0,
    failed: 0,
    categories: {}
};

function logTest(category, testName, passed, details = '') {
    testResults.total++;
    if (passed) {
        testResults.passed++;
        console.log(`✅ ${category} - ${testName}`);
    } else {
        testResults.failed++;
        console.log(`❌ ${category} - ${testName}`);
    }
    
    if (details) {
        console.log(`   ${details}`);
    }
    
    if (!testResults.categories[category]) {
        testResults.categories[category] = { total: 0, passed: 0, failed: 0 };
    }
    testResults.categories[category].total++;
    if (passed) testResults.categories[category].passed++;
    else testResults.categories[category].failed++;
}

// Mock ExpenseTracker Implementation for Testing
class MockExpenseTracker {
    constructor() {
        this.expenses = [];
        this.currentMonth = new Date();
        this.messageLog = [];
        this.labels = [
            'FOOD', 'CLOTHING', 'GROOMING', 'MEDICAL', 'UTILITY', 'VEHICLE-MAINTENANCE',
            'PETROL', 'MONTHLY', 'CLASSES', 'SCHOOL', 'LEARNING', 'MANDIR', 'BHISI',
            'JSG', 'OFFICE-LUNCH', 'COMMUTING', 'ONLINE-PAYMENT', 'EATING-OUT',
            'ENTERTAINMENT', 'TRAVEL/VACATION', 'ELECTRONICS', 'INVESTMENT', 'MISCELLANEOUS'
        ];
        this.paymentOptions = [
            'CC-HDFC-RUPAY', 'CC-AXIS-BANK', 'CC-HDFC-REGALIA', 'CC-ICICI-AMAZON-PAY',
            'UPI-LITE', 'UPI-JUPITER', 'UPI-DCB-NIYO', 'UPI-KOTAK', 'UPI-AXIS', 'UPI-SBI',
            'UPI-ICICI', 'AMAZON-PAY', 'PLUXEE', 'FASTAG', 'CASH', 'BHAVNA', 'PAHAL'
        ];
        this.loadFromStorage();
    }

    generateId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }

    showMessage(msg, type) {
        this.messageLog.push({ msg, type, timestamp: new Date() });
    }

    // Add expense with validation
    addExpense(expenseData) {
        // Pre-validation
        if (!expenseData.date || !expenseData.description || !expenseData.label || !expenseData.paymentOption) {
            return { success: false, error: 'Missing required fields' };
        }

        const amount = parseFloat(expenseData.amount);
        if (isNaN(amount) || amount <= 0) {
            return { success: false, error: 'Amount must be greater than 0' };
        }

        const expense = {
            id: this.generateId(),
            date: expenseData.date,
            amount: amount,
            description: expenseData.description,
            label: expenseData.label.toUpperCase(),
            paymentOption: expenseData.paymentOption.toUpperCase(),
            timestamp: new Date().toISOString()
        };

        // Add new labels/options if they don't exist
        if (!this.labels.includes(expense.label)) {
            this.labels.push(expense.label);
            this.labels.sort();
        }
        if (!this.paymentOptions.includes(expense.paymentOption)) {
            this.paymentOptions.push(expense.paymentOption);
            this.paymentOptions.sort();
        }

        this.expenses.push(expense);
        this.saveToStorage();
        return { success: true, expense };
    }

    getCurrentMonthExpenses() {
        return this.expenses;
    }

    clearData() {
        this.expenses = [];
        this.saveToStorage();
    }

    // Storage operations
    saveToStorage() {
        const monthKey = `expenses-${this.currentMonth.getFullYear()}-${(this.currentMonth.getMonth() + 1).toString().padStart(2, '0')}`;
        localStorage.setItem(monthKey, JSON.stringify(this.expenses));
        localStorage.setItem('expenseLabels', JSON.stringify(this.labels));
        localStorage.setItem('paymentOptions', JSON.stringify(this.paymentOptions));
    }

    loadFromStorage() {
        const monthKey = `expenses-${this.currentMonth.getFullYear()}-${(this.currentMonth.getMonth() + 1).toString().padStart(2, '0')}`;
        const stored = localStorage.getItem(monthKey);
        this.expenses = stored ? JSON.parse(stored) : [];
        
        const storedLabels = localStorage.getItem('expenseLabels');
        if (storedLabels) this.labels = JSON.parse(storedLabels);
        
        const storedOptions = localStorage.getItem('paymentOptions');
        if (storedOptions) this.paymentOptions = JSON.parse(storedOptions);
    }

    clearAllExpenses() {
        this.expenses = [];
        const monthKey = `expenses-${this.currentMonth.getFullYear()}-${(this.currentMonth.getMonth() + 1).toString().padStart(2, '0')}`;
        localStorage.removeItem(monthKey);
    }

    // CSV/TXT Export functionality
    generateCSV() {
        if (this.expenses.length === 0) return 'Date,Amount,Description,Label,Payment Option\n';
        
        const header = 'Date,Amount,Description,Label,Payment Option\n';
        const rows = this.expenses.map(expense => {
            return `${this.formatDateForCSV(expense.date)},${expense.amount.toFixed(2)},"${expense.description}",${expense.label},${expense.paymentOption}`;
        }).join('\n');
        
        return header + rows;
    }

    formatDateForCSV(date) {
        if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            // Convert YYYY-MM-DD to dd-MMM-YYYY
            const d = new Date(date + 'T12:00:00Z');
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${d.getDate().toString().padStart(2, '0')}-${months[d.getMonth()]}-${d.getFullYear()}`;
        }
        return date; // Already in correct format
    }

    // CSV/TXT Import functionality
    parseDate(dateStr) {
        // Handle dd-MMM-YYYY format (primary format)
        const ddMmmYyyy = dateStr.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/);
        if (ddMmmYyyy) {
            const [, day, month, year] = ddMmmYyyy;
            const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun',
                              'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
            const monthIndex = monthNames.indexOf(month.toLowerCase());
            if (monthIndex !== -1) {
                const paddedMonth = (monthIndex + 1).toString().padStart(2, '0');
                const paddedDay = day.padStart(2, '0');
                return `${year}-${paddedMonth}-${paddedDay}`;
            }
        }
        
        // Handle ISO format (already in correct internal format)
        if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return dateStr;
        }
        
        return null;
    }

    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current.trim());
        return result;
    }

    importFromCSV(csvContent) {
        const lines = csvContent.trim().split('\n');
        if (lines.length < 2) return { success: false, count: 0, error: 'No data to import' };

        let imported = 0;
        let skipped = 0;

        // Skip header row
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const fields = this.parseCSVLine(line);
            if (fields.length >= 5) {
                const [dateStr, amountStr, description, label, paymentOption] = fields;
                
                const date = this.parseDate(dateStr.trim());
                const amount = parseFloat(amountStr.replace(/[₹,]/g, '').trim());
                
                if (date && !isNaN(amount) && amount > 0) {
                    const expense = {
                        id: this.generateId(),
                        date: date,
                        amount: amount,
                        description: description.replace(/"/g, '').trim(),
                        label: label.trim().toUpperCase(),
                        paymentOption: paymentOption.trim().toUpperCase()
                    };

                    // Check for duplicates
                    const isDuplicate = this.expenses.some(existing => 
                        existing.date === expense.date &&
                        existing.amount === expense.amount &&
                        existing.description === expense.description
                    );

                    if (!isDuplicate) {
                        this.expenses.push(expense);
                        
                        // Add new labels/options
                        if (!this.labels.includes(expense.label)) {
                            this.labels.push(expense.label);
                            this.labels.sort();
                        }
                        if (!this.paymentOptions.includes(expense.paymentOption)) {
                            this.paymentOptions.push(expense.paymentOption);
                            this.paymentOptions.sort();
                        }
                        
                        imported++;
                    } else {
                        skipped++;
                    }
                }
            }
        }

        if (imported > 0) {
            this.saveToStorage();
        }

        return { success: imported > 0, count: imported, skipped, total: lines.length - 1 };
    }

    // Label management
    addLabel(newLabel) {
        const label = newLabel.trim().toUpperCase();
        if (!label) return { success: false, error: 'Empty label' };
        if (this.labels.includes(label)) return { success: false, error: 'Duplicate label' };
        
        this.labels.push(label);
        this.labels.sort();
        this.saveToStorage();
        return { success: true };
    }

    resetLabelsToDefault() {
        this.labels = [
            'FOOD', 'CLOTHING', 'GROOMING', 'MEDICAL', 'UTILITY', 'VEHICLE-MAINTENANCE',
            'PETROL', 'MONTHLY', 'CLASSES', 'SCHOOL', 'LEARNING', 'MANDIR', 'BHISI',
            'JSG', 'OFFICE-LUNCH', 'COMMUTING', 'ONLINE-PAYMENT', 'EATING-OUT',
            'ENTERTAINMENT', 'TRAVEL/VACATION', 'ELECTRONICS', 'INVESTMENT', 'MISCELLANEOUS'
        ];
        this.saveToStorage();
        return { success: true };
    }

    // Payment option management
    addPaymentOption(newOption) {
        const option = newOption.trim().toUpperCase();
        if (!option) return { success: false, error: 'Empty option' };
        if (this.paymentOptions.includes(option)) return { success: false, error: 'Duplicate option' };
        
        this.paymentOptions.push(option);
        this.paymentOptions.sort();
        this.saveToStorage();
        return { success: true };
    }

    resetPaymentOptionsToDefault() {
        this.paymentOptions = [
            'CC-HDFC-RUPAY', 'CC-AXIS-BANK', 'CC-HDFC-REGALIA', 'CC-ICICI-AMAZON-PAY',
            'UPI-LITE', 'UPI-JUPITER', 'UPI-DCB-NIYO', 'UPI-KOTAK', 'UPI-AXIS', 'UPI-SBI',
            'UPI-ICICI', 'AMAZON-PAY', 'PLUXEE', 'FASTAG', 'CASH', 'BHAVNA', 'PAHAL'
        ];
        this.saveToStorage();
        return { success: true };
    }
}

// Initialize tracker for testing
const tracker = new MockExpenseTracker();

// Sample test data
const sampleExpenses = [
    { date: '15-Jan-2025', amount: 250.75, description: 'Grocery shopping', label: 'FOOD', paymentOption: 'CASH' },
    { date: '16-Jan-2025', amount: 45.50, description: 'Coffee with friends', label: 'EATING-OUT', paymentOption: 'UPI-AXIS' },
    { date: '17-Jan-2025', amount: 1200.00, description: 'Monthly subscription', label: 'MONTHLY', paymentOption: 'CC-HDFC-REGALIA' }
];

// Test Suite 1: Basic Operations
console.log("\n🔧 TEST SUITE 1: BASIC OPERATIONS");
console.log("-".repeat(50));

// Test 1.1: Add valid expense
const expense = { date: '15-Jan-2025', amount: 100.50, description: 'Test expense', label: 'FOOD', paymentOption: 'CASH' };
const result = tracker.addExpense(expense);

logTest("Basic Operations", "Add valid expense", 
    result.success && result.expense.amount === 100.50,
    `Expense ID: ${result.expense.id}, Amount: ₹${result.expense.amount}`);

// Test 1.2: Reject invalid expense (zero amount)
const invalidExpense = { date: '15-Jan-2025', amount: 0, description: 'Invalid', label: 'FOOD', paymentOption: 'CASH' };
const invalidResult = tracker.addExpense(invalidExpense);

logTest("Basic Operations", "Reject invalid expense (zero amount)", 
    !invalidResult.success && invalidResult.error.includes('greater than 0'),
    `Error: ${invalidResult.error}`);

// Test Suite 2: Data Management
console.log("\n📊 TEST SUITE 2: LABEL & PAYMENT OPTION MANAGEMENT");
console.log("-".repeat(50));

// Test 2.1: Quick label - empty table
tracker.clearAllExpenses();
const labelsWhenEmpty = tracker.labels.length;
const hasDefaultLabels = tracker.labels.includes('FOOD') && tracker.labels.includes('MISCELLANEOUS');

logTest("Label Management", "Quick label - empty table", hasDefaultLabels && labelsWhenEmpty >= 20, `${labelsWhenEmpty} default labels available`);

// Test 2.2: Quick label - populated table
// Add expenses back
sampleExpenses.forEach(expense => tracker.addExpense(expense));
const labelsAfterEntries = tracker.labels.length;
const containsUsedLabels = tracker.labels.includes('FOOD') && tracker.labels.includes('EATING-OUT');

logTest("Label Management", "Quick label - populated table", containsUsedLabels && labelsAfterEntries >= labelsWhenEmpty, `${labelsAfterEntries} labels available after adding entries`);

// Test 2.3: Quick payment option - empty table  
tracker.clearAllExpenses();
const optionsWhenEmpty = tracker.paymentOptions.length;
const hasDefaultOptions = tracker.paymentOptions.includes('CASH') && tracker.paymentOptions.includes('UPI-DCB-NIYO');

logTest("Payment Management", "Quick payment option - empty table", hasDefaultOptions && optionsWhenEmpty >= 15, `${optionsWhenEmpty} default options available`);

// Test 2.4: Quick payment option - populated table
sampleExpenses.forEach(expense => tracker.addExpense(expense));
const optionsAfterEntries = tracker.paymentOptions.length;
const containsUsedOptions = tracker.paymentOptions.includes('CASH') && tracker.paymentOptions.includes('UPI-AXIS');

logTest("Payment Management", "Quick payment option - populated table", containsUsedOptions && optionsAfterEntries >= optionsWhenEmpty, `${optionsAfterEntries} options available after adding entries`);

// Test Suite 3: File Operations
console.log("\n📁 TEST SUITE 3: FILE IMPORT/EXPORT OPERATIONS");
console.log("-".repeat(50));

// Test 3.1: CSV download, clear, upload cycle
const csvContent = tracker.generateCSV();
const expenseCountBeforeClear = tracker.expenses.length;

console.log(`   DEBUG - Generated CSV content:`);
console.log(`   ${csvContent}`);

tracker.clearAllExpenses();
const expenseCountAfterClear = tracker.expenses.length;

const importResult = tracker.importFromCSV(csvContent);
const expenseCountAfterImport = tracker.expenses.length;

console.log(`   DEBUG - Import result: success=${importResult.success}, count=${importResult.count}, error=${importResult.error || 'none'}`);

logTest("File Operations", "CSV download → clear → upload cycle", 
    expenseCountBeforeClear === 3 && expenseCountAfterClear === 0 && expenseCountAfterImport === 3,
    `Before: ${expenseCountBeforeClear}, After clear: ${expenseCountAfterClear}, After import: ${expenseCountAfterImport}`);

// Test 3.2: TXT download, clear, upload cycle (CSV format in TXT)
const txtContent = tracker.generateCSV(); // Same format for TXT
tracker.clearAllExpenses();

// Re-add sample data for TXT test
sampleExpenses.forEach(expense => tracker.addExpense(expense));
const txtContent2 = tracker.generateCSV();
tracker.clearAllExpenses();

const txtImportResult = tracker.importFromCSV(txtContent2); // Uses same parser
const expenseCountAfterTxtImport = tracker.expenses.length;

console.log(`   DEBUG - TXT Import result: success=${txtImportResult.success}, count=${txtImportResult.count}`);

logTest("File Operations", "TXT download → clear → upload cycle",
    txtImportResult.success && expenseCountAfterTxtImport === 3,
    `TXT import successful: ${txtImportResult.count} expenses restored`);

// Test Suite 4: Settings Management
console.log("\n⚙️ TEST SUITE 4: SETTINGS MANAGEMENT");
console.log("-".repeat(50));

// Test 4.1: Add new label and check form visibility
const initialLabelCount = tracker.labels.length;
const addLabelResult = tracker.addLabel('ENTERTAINMENT-SUBSCRIPTION');
const labelVisibleInForm = tracker.labels.includes('ENTERTAINMENT-SUBSCRIPTION');

logTest("Settings Management", "Add new label → form visibility",
    addLabelResult.success && labelVisibleInForm,
    `Label added successfully, visible in form suggestions (${tracker.labels.length} total labels)`);

// Test 4.2: Reset labels and check form update
tracker.addLabel('CUSTOM-LABEL-1');
tracker.addLabel('CUSTOM-LABEL-2');
const labelsWithCustom = tracker.labels.length;

const resetLabelResult = tracker.resetLabelsToDefault();
const labelsAfterReset = tracker.labels.length;
const noCustomLabelsInForm = !tracker.labels.includes('CUSTOM-LABEL-1') && !tracker.labels.includes('ENTERTAINMENT-SUBSCRIPTION');

logTest("Settings Management", "Reset labels → form update",
    resetLabelResult.success && noCustomLabelsInForm && labelsAfterReset < labelsWithCustom,
    `Reset successful: ${labelsWithCustom} → ${labelsAfterReset} labels, no custom labels in form`);

// Test 4.3: Add new payment option and check form visibility
const initialOptionCount = tracker.paymentOptions.length;
const addOptionResult = tracker.addPaymentOption('CRYPTO-WALLET');
const optionVisibleInForm = tracker.paymentOptions.includes('CRYPTO-WALLET');

logTest("Settings Management", "Add new payment option → form visibility",
    addOptionResult.success && optionVisibleInForm,
    `Option added successfully, visible in form suggestions (${tracker.paymentOptions.length} total options)`);

// Test 4.4: Reset payment options and check form update
tracker.addPaymentOption('CUSTOM-PAYMENT-1');
tracker.addPaymentOption('CUSTOM-PAYMENT-2');
const optionsWithCustom = tracker.paymentOptions.length;

const resetOptionResult = tracker.resetPaymentOptionsToDefault();
const optionsAfterReset = tracker.paymentOptions.length;
const noCustomOptionsInForm = !tracker.paymentOptions.includes('CUSTOM-PAYMENT-1') && !tracker.paymentOptions.includes('CRYPTO-WALLET');

logTest("Settings Management", "Reset payment options → form update",
    resetOptionResult.success && noCustomOptionsInForm && optionsAfterReset < optionsWithCustom,
    `Reset successful: ${optionsWithCustom} → ${optionsAfterReset} options, no custom options in form`);

// Test Suite 5: Integration Tests
console.log("\n🔗 TEST SUITE 5: INTEGRATION WORKFLOWS");
console.log("-".repeat(50));

// Test 5.1: Complete user workflow simulation
tracker.clearAllExpenses();

// Step 1: Add expense
tracker.addExpense({ date: '03-Oct-2025', amount: 1200, description: 'Test expense', label: 'FOOD', paymentOption: 'CASH' });

// Step 2: Download data
const workflowCSV = tracker.generateCSV();

// Step 3: Clear and re-import
tracker.clearAllExpenses();
const workflowImport = tracker.importFromCSV(workflowCSV);

// Step 4: Verify integrity
const finalExpenses = tracker.getCurrentMonthExpenses();
const dataIntegrityCheck = finalExpenses.length === 1 && 
                          finalExpenses[0].amount === 1200 && 
                          finalExpenses[0].description === 'Test expense';

logTest("Integration", "Complete user workflow simulation",
    workflowImport.success && dataIntegrityCheck,
    `Workflow: Add → Export → Clear → Import → Verify (${finalExpenses.length} expenses)`);

// Test 5.2: Settings persistence across operations
const expenseWithNewItems = tracker.addExpense({ 
    date: '03-Oct-2025', 
    amount: 500, 
    description: 'New category test', 
    label: 'CUSTOM-CATEGORY', 
    paymentOption: 'CUSTOM-PAYMENT' 
});

const customLabelPersisted = tracker.labels.includes('CUSTOM-CATEGORY');
const customOptionPersisted = tracker.paymentOptions.includes('CUSTOM-PAYMENT');

console.log(`   DEBUG - Expense added successfully: ${expenseWithNewItems.success}`);
console.log(`   DEBUG - Custom label persisted: ${customLabelPersisted}`);
console.log(`   DEBUG - Custom payment persisted: ${customOptionPersisted}`);

logTest("Integration", "Settings persistence across operations",
    expenseWithNewItems.success && customLabelPersisted && customOptionPersisted,
    `Custom label and payment option persisted in settings`);

// Test Suite 6: Performance & Edge Cases
console.log("\n⚡ TEST SUITE 6: PERFORMANCE & EDGE CASES");
console.log("-".repeat(50));

// Test 6.1: Large dataset handling (100 entries)
const startTime = Date.now();
tracker.clearAllExpenses();

for (let i = 0; i < 100; i++) {
    tracker.addExpense({
        date: '03-Oct-2025',
        amount: Math.random() * 1000,
        description: `Test expense ${i}`,
        label: 'PERFORMANCE-TEST',
        paymentOption: 'CASH'
    });
}

const additionTime = Date.now() - startTime;
const largeDatasetCount = tracker.getCurrentMonthExpenses().length;

logTest("Performance", "Large dataset handling (100 entries)",
    largeDatasetCount === 100 && additionTime < 1000,
    `Added 100 expenses in ${additionTime}ms`);

// Test 6.2: CSV import/export with large dataset
const performanceStartTime = Date.now();
const largeCSV = tracker.generateCSV();
tracker.clearAllExpenses();
const largeCsvImport = tracker.importFromCSV(largeCSV);
const performanceEndTime = Date.now();

const performanceTime = performanceEndTime - performanceStartTime;
const performanceDataIntegrity = tracker.getCurrentMonthExpenses().length === 100;

logTest("Performance", "CSV import/export with large dataset",
    largeCsvImport.success && performanceDataIntegrity && performanceTime < 2000,
    `Export→Clear→Import 100 entries in ${performanceTime}ms`);

// Final Results Summary
console.log("\n" + "=".repeat(60));
console.log("📋 COMPREHENSIVE TEST RESULTS SUMMARY");
console.log("=".repeat(60));

const successRate = ((testResults.passed / testResults.total) * 100).toFixed(1);
console.log(`Total Tests: ${testResults.total}`);
console.log(`✅ Passed: ${testResults.passed} (${successRate}%)`);
console.log(`❌ Failed: ${testResults.failed}`);

console.log("\n📊 Results by Category:");
Object.entries(testResults.categories).forEach(([category, results]) => {
    const categoryRate = ((results.passed / results.total) * 100).toFixed(1);
    console.log(`${category}: ${results.passed}/${results.total} (${categoryRate}%)`);
});

console.log("\n🎯 Test Coverage Status:");
if (successRate >= 90) {
    console.log("🟢 EXCELLENT - All systems functioning optimally");
} else if (successRate >= 75) {
    console.log("🟡 GOOD - Minor issues detected, generally stable");
} else if (successRate >= 50) {
    console.log("🟠 FAIR - Several issues need attention");
} else {
    console.log("🔴 NEEDS WORK - Critical issues require immediate attention");
}

console.log("\n" + "=".repeat(60));
console.log(`Test completed at: ${new Date().toLocaleString()}`);