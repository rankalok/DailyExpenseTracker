// ExpenseTracker Class - Main Application Logic
class ExpenseTracker {
    constructor() {
        this.currentMonth = new Date();
        this.expenses = [];
        this.labels = [];
        this.paymentOptions = [];
        
        this.initializeApp();
        this.loadDefaultData();
        this.attachEventListeners();
        this.setCurrentDate();
        this.switchToPage('addExpense');
    }

    // Initialize application
    initializeApp() {
        this.loadLabels();
        this.loadPaymentOptions();
        this.loadCurrentMonthExpenses();
        this.updateDisplayMonth();
        
        // Set default date (today) and activate today button
        this.setQuickDate('today');
        
        // Update quick selection buttons based on current month's data
        this.updateQuickSelectionButtons();
    }

    // Load default labels
    loadLabels() {
        const defaultLabels = [
            'FOOD', 'CLOTHING', 'GROOMING', 'MEDICAL', 'UTILITY', 'VEHICLE-MAINTENANCE',
            'PETROL', 'MONTHLY', 'CLASSES', 'SCHOOL', 'LEARNING', 'MANDIR', 'BHISI',
            'JSG', 'OFFICE-LUNCH', 'COMMUTING', 'ONLINE-PAYMENT', 'EATING-OUT',
            'ENTERTAINMENT', 'TRAVEL/VACATION', 'ELECTRONICS', 'INVESTMENT', 'MISCELLANEOUS'
        ];
        
        const storedLabels = localStorage.getItem('expenseLabels');
        this.labels = storedLabels ? JSON.parse(storedLabels) : defaultLabels;
        this.updateLabelSuggestions();
    }

    // Load default payment options
    loadPaymentOptions() {
        const defaultPaymentOptions = [
            'CC-HDFC-RUPAY', 'CC-AXIS-BANK', 'CC-HDFC-REGALIA', 'CC-ICICI-AMAZON-PAY',
            'UPI-LITE', 'UPI-JUPITER', 'UPI-DCB-NIYO', 'UPI-KOTAK', 'UPI-AXIS',
            'UPI-SBI', 'UPI-ICICI', 'AMAZON-PAY', 'PLUXEE', 'FASTAG', 'CASH',
            'BHAVNA', 'PAHAL'
        ];
        
        const storedOptions = localStorage.getItem('paymentOptions');
        this.paymentOptions = storedOptions ? JSON.parse(storedOptions) : defaultPaymentOptions;
        this.updatePaymentSuggestions();
    }

    // Update label suggestions in datalist
    updateLabelSuggestions() {
        const datalist = document.getElementById('labelSuggestions');
        datalist.innerHTML = '';
        this.labels.forEach(label => {
            const option = document.createElement('option');
            option.value = label;
            datalist.appendChild(option);
        });
    }

    // Update payment suggestions in datalist
    updatePaymentSuggestions() {
        const datalist = document.getElementById('paymentSuggestions');
        datalist.innerHTML = '';
        this.paymentOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            datalist.appendChild(optionElement);
        });
    }

    // Set current date in the form
    setCurrentDate() {
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];
        document.getElementById('expenseDate').value = dateString;
        this.updateDateDisplay(dateString);
    }

    // Update the formatted date display
    updateDateDisplay(dateValue) {
        const date = new Date(dateValue + 'T12:00:00Z'); // Avoid timezone issues
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${months[date.getMonth()]}-${date.getFullYear()}`;
        document.getElementById('expenseDateDisplay').value = formattedDate;
    }

    // Quick date selection methods
    setQuickDate(type) {
        const today = new Date();
        let targetDate;
        const dateInput = document.getElementById('expenseDate');
        
        // Remove active class from all buttons
        document.querySelectorAll('.btn-quick-date').forEach(btn => btn.classList.remove('active'));
        
        switch(type) {
            case 'today':
                targetDate = today;
                document.getElementById('todayBtn').classList.add('active');
                dateInput.classList.remove('show-custom');
                break;
            case 'yesterday':
                targetDate = new Date(today);
                targetDate.setDate(targetDate.getDate() - 1);
                document.getElementById('yesterdayBtn').classList.add('active');
                dateInput.classList.remove('show-custom');
                break;
            case 'lastMonth':
                targetDate = new Date(today);
                targetDate.setMonth(targetDate.getMonth() - 1);
                document.getElementById('lastMonthBtn').classList.add('active');
                dateInput.classList.remove('show-custom');
                break;
            case 'custom':
                // Show the date input for manual selection
                document.getElementById('customDateBtn').classList.add('active');
                dateInput.classList.add('show-custom');
                dateInput.focus();
                return;
        }
        
        const dateString = targetDate.toISOString().split('T')[0];
        dateInput.value = dateString;
        this.updateDateDisplay(dateString);
    }

    // Quick label selection
    selectQuickLabel(label) {
        document.getElementById('expenseLabel').value = label;
        
        // Remove active class from all label buttons
        document.querySelectorAll('.btn-quick-label').forEach(btn => btn.classList.remove('active'));
        
        // Add active class to selected button
        document.querySelector(`[data-label="${label}"]`).classList.add('active');
    }

    // Quick payment selection
    selectQuickPayment(payment) {
        document.getElementById('paymentOption').value = payment;
        
        // Remove active class from all payment buttons
        document.querySelectorAll('.btn-quick-payment').forEach(btn => btn.classList.remove('active'));
        
        // Add active class to selected button
        document.querySelector(`[data-payment="${payment}"]`).classList.add('active');
    }

    // Show all labels in datalist
    showAllLabels() {
        const input = document.getElementById('expenseLabel');
        input.click(); // Trigger datalist dropdown
    }

    // Show all payments in datalist
    showAllPayments() {
        const input = document.getElementById('paymentOption');
        input.click(); // Trigger datalist dropdown
    }

    // Calculate frequency of labels and payment options from current month's expenses
    calculateFrequency(data, key) {
        const frequency = {};
        
        data.forEach(item => {
            const value = item[key];
            frequency[value] = (frequency[value] || 0) + 1;
        });
        
        // Sort by frequency (descending) and return top 5
        return Object.entries(frequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(entry => entry[0]);
    }

    // Update quick selection buttons based on current month's data
    updateQuickSelectionButtons() {
        const labelContainer = document.getElementById('quickLabelContainer');
        const paymentContainer = document.getElementById('quickPaymentContainer');
        
        // If no expenses this month, hide quick selection
        if (this.expenses.length === 0) {
            labelContainer.style.display = 'none';
            paymentContainer.style.display = 'none';
            return;
        }
        
        // Show containers if there are expenses
        labelContainer.style.display = 'flex';
        paymentContainer.style.display = 'flex';
        
        // Calculate top 5 most used labels and payment options
        const topLabels = this.calculateFrequency(this.expenses, 'label');
        const topPayments = this.calculateFrequency(this.expenses, 'paymentOption');
        
        // Generate quick label buttons
        this.generateQuickButtons(labelContainer, topLabels, 'label');
        
        // Generate quick payment buttons
        this.generateQuickButtons(paymentContainer, topPayments, 'payment');
    }

    // Generate quick selection buttons
    generateQuickButtons(container, items, type) {
        // Clear existing buttons
        container.innerHTML = '';
        
        // Create buttons for top items
        items.forEach(item => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = type === 'label' ? 'btn-quick-label' : 'btn-quick-payment';
            button.dataset[type] = item;
            
            // Format display text (capitalize first letter, replace hyphens)
            const displayText = this.formatDisplayText(item);
            button.textContent = displayText;
            
            // Add click event
            button.addEventListener('click', () => {
                if (type === 'label') {
                    this.selectQuickLabel(item);
                } else {
                    this.selectQuickPayment(item);
                }
            });
            
            container.appendChild(button);
        });
        
        // Add "More..." button if there are items
        if (items.length > 0) {
            const moreButton = document.createElement('button');
            moreButton.type = 'button';
            moreButton.className = type === 'label' ? 'btn-quick-label' : 'btn-quick-payment';
            moreButton.id = type === 'label' ? 'moreLabelsBtn' : 'morePaymentsBtn';
            moreButton.textContent = 'More...';
            
            // Add click event for More button
            moreButton.addEventListener('click', () => {
                if (type === 'label') {
                    document.getElementById('expenseLabel').focus();
                    this.showAllLabels();
                } else {
                    document.getElementById('paymentOption').focus();
                    this.showAllPayments();
                }
            });
            
            container.appendChild(moreButton);
        }
    }

    // Format text for display (make it more readable)
    formatDisplayText(text) {
        return text
            .toLowerCase()
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
            .substring(0, 12); // Limit length for button display
    }

    // Attach event listeners
    attachEventListeners() {
        // Tab navigation
        document.getElementById('addExpenseTab').addEventListener('click', () => this.switchToPage('addExpense'));
        document.getElementById('listExpensesTab').addEventListener('click', () => this.switchToPage('listExpenses'));
        document.getElementById('settingsTab').addEventListener('click', () => this.switchToPage('settings'));

        // Form submission
        document.getElementById('expenseForm').addEventListener('submit', (e) => this.handleFormSubmit(e));
        document.getElementById('clearForm').addEventListener('click', () => this.clearForm());

        // Quick date selection buttons
        document.getElementById('todayBtn').addEventListener('click', () => this.setQuickDate('today'));
        document.getElementById('yesterdayBtn').addEventListener('click', () => this.setQuickDate('yesterday'));
        document.getElementById('lastMonthBtn').addEventListener('click', () => this.setQuickDate('lastMonth'));
        document.getElementById('customDateBtn').addEventListener('click', () => this.setQuickDate('custom'));

        // Date input change handler
        document.getElementById('expenseDate').addEventListener('change', (e) => {
            this.updateDateDisplay(e.target.value);
            // Remove active class from quick date buttons when manually changing date
            document.querySelectorAll('.btn-quick-date').forEach(btn => btn.classList.remove('active'));
            document.getElementById('customDateBtn').classList.add('active');
        });

        // Note: Quick label and payment selection event listeners are now 
        // dynamically added in generateQuickButtons() method

        // Clear active states when typing manually
        document.getElementById('expenseLabel').addEventListener('input', () => {
            document.querySelectorAll('.btn-quick-label').forEach(btn => btn.classList.remove('active'));
        });

        document.getElementById('paymentOption').addEventListener('input', () => {
            document.querySelectorAll('.btn-quick-payment').forEach(btn => btn.classList.remove('active'));
        });

        // Character count for description
        document.getElementById('expenseDescription').addEventListener('input', (e) => this.updateCharCount(e));
        document.getElementById('editExpenseDescription').addEventListener('input', (e) => this.updateEditCharCount(e));

        // Month navigation
        document.getElementById('prevMonth').addEventListener('click', () => this.navigateMonth(-1));
        document.getElementById('nextMonth').addEventListener('click', () => this.navigateMonth(1));

        // Label and payment option handling
        document.getElementById('expenseLabel').addEventListener('change', (e) => this.handleNewLabel(e));
        document.getElementById('paymentOption').addEventListener('change', (e) => this.handleNewPaymentOption(e));
        document.getElementById('editExpenseLabel').addEventListener('change', (e) => this.handleNewLabel(e));
        document.getElementById('editPaymentOption').addEventListener('change', (e) => this.handleNewPaymentOption(e));

        // Edit modal event listeners
        document.getElementById('editExpenseForm').addEventListener('submit', (e) => this.handleEditFormSubmit(e));
        document.getElementById('closeEditModal').addEventListener('click', () => this.closeEditModal());
        document.getElementById('cancelEdit').addEventListener('click', () => this.closeEditModal());
        
        // Close modal when clicking outside
        document.getElementById('editModal').addEventListener('click', (e) => {
            if (e.target.id === 'editModal') {
                this.closeEditModal();
            }
        });

        // Download and load event listeners
        document.getElementById('downloadCSV').addEventListener('click', () => this.downloadCSV());
        document.getElementById('downloadTXT').addEventListener('click', () => this.downloadTXT());
        document.getElementById('loadFile').addEventListener('click', () => this.triggerFileInput());
        document.getElementById('fileInput').addEventListener('change', (e) => this.handleFileLoad(e));

        // Settings event listeners
        document.getElementById('addLabel').addEventListener('click', () => this.addNewLabel());
        document.getElementById('addPaymentOption').addEventListener('click', () => this.addNewPaymentOption());
        document.getElementById('resetLabels').addEventListener('click', () => this.resetLabelsToDefault());
        document.getElementById('resetPaymentOptions').addEventListener('click', () => this.resetPaymentOptionsToDefault());
        
        // Enter key support for adding new items
        document.getElementById('newLabel').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addNewLabel();
        });
        document.getElementById('newPaymentOption').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addNewPaymentOption();
        });
    }

    // Switch between pages
    switchToPage(page) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

        if (page === 'addExpense') {
            document.getElementById('addExpensePage').classList.add('active');
            document.getElementById('addExpenseTab').classList.add('active');
            // Refresh quick selection buttons when switching to add expense page
            this.updateQuickSelectionButtons();
        } else if (page === 'listExpenses') {
            document.getElementById('listExpensesPage').classList.add('active');
            document.getElementById('listExpensesTab').classList.add('active');
            this.loadCurrentMonthExpenses();
            this.displayExpenses();
        } else if (page === 'settings') {
            document.getElementById('settingsPage').classList.add('active');
            document.getElementById('settingsTab').classList.add('active');
            this.loadSettingsPage();
        }
    }

    // Handle form submission
    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const expense = {
            id: Date.now().toString(),
            date: document.getElementById('expenseDate').value,
            amount: parseFloat(document.getElementById('expenseAmount').value),
            description: document.getElementById('expenseDescription').value.trim(),
            label: document.getElementById('expenseLabel').value.trim().toUpperCase(),
            paymentOption: document.getElementById('paymentOption').value.trim().toUpperCase(),
            timestamp: new Date().toISOString()
        };

        // Validate expense
        if (!this.validateExpense(expense)) {
            return;
        }

        // Save expense
        this.saveExpense(expense);
        this.showMessage('Expense added successfully!', 'success');
        this.clearForm();
        
        // Update suggestions if new labels/payment options were added
        this.handleNewLabel({ target: { value: expense.label } });
        this.handleNewPaymentOption({ target: { value: expense.paymentOption } });
        
        // Update quick selection buttons with new frequency data
        this.updateQuickSelectionButtons();
    }

    // Validate expense data
    validateExpense(expense) {
        if (!expense.date || !expense.amount || !expense.description || !expense.label || !expense.paymentOption) {
            this.showMessage('Please fill in all required fields.', 'error');
            return false;
        }

        if (expense.amount <= 0) {
            this.showMessage('Amount must be greater than 0.', 'error');
            return false;
        }

        if (expense.description.length > 200) {
            this.showMessage('Description must be 200 characters or less.', 'error');
            return false;
        }

        return true;
    }

    // Save expense to localStorage
    saveExpense(expense) {
        const expenseDate = new Date(expense.date);
        const monthKey = `expenses-${expenseDate.getFullYear()}-${(expenseDate.getMonth() + 1).toString().padStart(2, '0')}`;
        
        let monthExpenses = JSON.parse(localStorage.getItem(monthKey)) || [];
        monthExpenses.push(expense);
        
        // Sort by date
        monthExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        localStorage.setItem(monthKey, JSON.stringify(monthExpenses));
    }

    // Handle new label
    handleNewLabel(e) {
        const newLabel = e.target.value.trim().toUpperCase();
        if (newLabel && !this.labels.includes(newLabel)) {
            this.labels.push(newLabel);
            this.labels.sort();
            localStorage.setItem('expenseLabels', JSON.stringify(this.labels));
            this.updateLabelSuggestions();
        }
    }

    // Handle new payment option
    handleNewPaymentOption(e) {
        const newOption = e.target.value.trim().toUpperCase();
        if (newOption && !this.paymentOptions.includes(newOption)) {
            this.paymentOptions.push(newOption);
            this.paymentOptions.sort();
            localStorage.setItem('paymentOptions', JSON.stringify(this.paymentOptions));
            this.updatePaymentSuggestions();
        }
    }

    // Clear form
    clearForm() {
        document.getElementById('expenseForm').reset();
        this.setQuickDate('today'); // This will set current date and activate today button
        this.updateCharCount({ target: { value: '' } });
        
        // Reset quick selection buttons
        document.querySelectorAll('.btn-quick-label').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.btn-quick-payment').forEach(btn => btn.classList.remove('active'));
    }

    // Update character count for description
    updateCharCount(e) {
        const count = e.target.value.length;
        const charCountElement = document.querySelector('.char-count');
        charCountElement.textContent = `${count}/200 characters`;
        
        if (count > 180) {
            charCountElement.style.color = '#e53e3e';
        } else if (count > 150) {
            charCountElement.style.color = '#dd6b20';
        } else {
            charCountElement.style.color = '#718096';
        }
    }

    // Navigate months
    navigateMonth(direction) {
        this.currentMonth.setMonth(this.currentMonth.getMonth() + direction);
        this.updateDisplayMonth();
        this.loadCurrentMonthExpenses();
        this.displayExpenses();
    }

    // Update display month
    updateDisplayMonth() {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        const monthYear = `${monthNames[this.currentMonth.getMonth()]} ${this.currentMonth.getFullYear()}`;
        document.getElementById('displayMonth').textContent = monthYear;
        document.getElementById('currentMonth').textContent = monthYear;
    }

    // Load expenses for current month
    loadCurrentMonthExpenses() {
        const monthKey = `expenses-${this.currentMonth.getFullYear()}-${(this.currentMonth.getMonth() + 1).toString().padStart(2, '0')}`;
        this.expenses = JSON.parse(localStorage.getItem(monthKey)) || [];
    }

    // Display expenses in tables
    displayExpenses() {
        this.displayExpenseTable();
        this.displayLabelSummary();
        this.displayPaymentSummary();
    }

    // Display expense table
    displayExpenseTable() {
        const tbody = document.getElementById('expenseTableBody');
        const totalAmountElement = document.getElementById('totalAmount');
        
        tbody.innerHTML = '';
        
        if (this.expenses.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <h3>No expenses found</h3>
                        <p>Start by adding your first expense!</p>
                    </td>
                </tr>
            `;
            totalAmountElement.textContent = '0.00';
            return;
        }

        let totalAmount = 0;
        this.expenses.forEach((expense, index) => {
            totalAmount += expense.amount;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${this.formatDate(expense.date)}</td>
                <td>₹${expense.amount.toFixed(2)}</td>
                <td>${expense.description}</td>
                <td><span class="label-badge">${expense.label}</span></td>
                <td><span class="payment-badge">${expense.paymentOption}</span></td>
                <td>
                    <button class="btn btn-edit" onclick="expenseTracker.openEditModal('${expense.id}')" title="Edit Expense">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="expenseTracker.deleteExpense('${expense.id}')" title="Delete Expense">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });

        totalAmountElement.textContent = totalAmount.toFixed(2);
    }

    // Display label summary
    displayLabelSummary() {
        const tbody = document.getElementById('labelSummaryBody');
        tbody.innerHTML = '';

        if (this.expenses.length === 0) return;

        const labelSums = {};
        let totalAmount = 0;

        this.expenses.forEach(expense => {
            labelSums[expense.label] = (labelSums[expense.label] || 0) + expense.amount;
            totalAmount += expense.amount;
        });

        // Sort by amount (descending)
        const sortedLabels = Object.entries(labelSums).sort((a, b) => b[1] - a[1]);

        sortedLabels.forEach(([label, amount]) => {
            const percentage = ((amount / totalAmount) * 100).toFixed(1);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><span class="label-badge">${label}</span></td>
                <td>₹${amount.toFixed(2)}</td>
                <td>${percentage}%</td>
            `;
            tbody.appendChild(row);
        });
    }

    // Display payment summary
    displayPaymentSummary() {
        const tbody = document.getElementById('paymentSummaryBody');
        tbody.innerHTML = '';

        if (this.expenses.length === 0) return;

        const paymentSums = {};
        let totalAmount = 0;

        this.expenses.forEach(expense => {
            paymentSums[expense.paymentOption] = (paymentSums[expense.paymentOption] || 0) + expense.amount;
            totalAmount += expense.amount;
        });

        // Sort by amount (descending)
        const sortedPayments = Object.entries(paymentSums).sort((a, b) => b[1] - a[1]);

        sortedPayments.forEach(([paymentOption, amount]) => {
            const percentage = ((amount / totalAmount) * 100).toFixed(1);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><span class="payment-badge">${paymentOption}</span></td>
                <td>₹${amount.toFixed(2)}</td>
                <td>${percentage}%</td>
            `;
            tbody.appendChild(row);
        });
    }

    // Open edit modal
    openEditModal(expenseId) {
        const expense = this.expenses.find(exp => exp.id === expenseId);
        if (!expense) {
            this.showMessage('Expense not found!', 'error');
            return;
        }

        // Store the expense ID being edited
        this.editingExpenseId = expenseId;

        // Populate form fields
        document.getElementById('editExpenseDate').value = expense.date;
        document.getElementById('editExpenseAmount').value = expense.amount;
        document.getElementById('editExpenseDescription').value = expense.description;
        document.getElementById('editExpenseLabel').value = expense.label;
        document.getElementById('editPaymentOption').value = expense.paymentOption;

        // Update character count
        this.updateEditCharCount({ target: { value: expense.description } });

        // Show modal
        const modal = document.getElementById('editModal');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    // Close edit modal
    closeEditModal() {
        const modal = document.getElementById('editModal');
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
        this.editingExpenseId = null;
        
        // Reset form
        document.getElementById('editExpenseForm').reset();
    }

    // Handle edit form submission
    handleEditFormSubmit(e) {
        e.preventDefault();

        if (!this.editingExpenseId) {
            this.showMessage('No expense selected for editing!', 'error');
            return;
        }

        const updatedExpense = {
            id: this.editingExpenseId,
            date: document.getElementById('editExpenseDate').value,
            amount: parseFloat(document.getElementById('editExpenseAmount').value),
            description: document.getElementById('editExpenseDescription').value.trim(),
            label: document.getElementById('editExpenseLabel').value.trim().toUpperCase(),
            paymentOption: document.getElementById('editPaymentOption').value.trim().toUpperCase(),
            timestamp: new Date().toISOString() // Update timestamp
        };

        // Validate expense
        if (!this.validateExpense(updatedExpense)) {
            return;
        }

        // Update expense in array
        const expenseIndex = this.expenses.findIndex(exp => exp.id === this.editingExpenseId);
        if (expenseIndex === -1) {
            this.showMessage('Expense not found!', 'error');
            return;
        }

        this.expenses[expenseIndex] = updatedExpense;

        // Save to localStorage
        const monthKey = `expenses-${this.currentMonth.getFullYear()}-${(this.currentMonth.getMonth() + 1).toString().padStart(2, '0')}`;
        localStorage.setItem(monthKey, JSON.stringify(this.expenses));

        // Update suggestions if new labels/payment options were added
        this.handleNewLabel({ target: { value: updatedExpense.label } });
        this.handleNewPaymentOption({ target: { value: updatedExpense.paymentOption } });

        // Refresh display
        this.displayExpenses();
        this.closeEditModal();
        this.showMessage('Expense updated successfully!', 'success');

        // Highlight the updated row
        setTimeout(() => {
            const rows = document.querySelectorAll('#expenseTableBody tr');
            if (rows[expenseIndex]) {
                rows[expenseIndex].classList.add('highlight-row');
            }
        }, 100);
    }

    // Update character count for edit form
    updateEditCharCount(e) {
        const count = e.target.value.length;
        const charCountElement = document.querySelector('.edit-char-count');
        charCountElement.textContent = `${count}/200 characters`;
        
        if (count > 180) {
            charCountElement.style.color = '#e53e3e';
        } else if (count > 150) {
            charCountElement.style.color = '#dd6b20';
        } else {
            charCountElement.style.color = '#718096';
        }
    }

    // Delete expense
    deleteExpense(expenseId) {
        if (!confirm('Are you sure you want to delete this expense?')) {
            return;
        }

        this.expenses = this.expenses.filter(expense => expense.id !== expenseId);
        
        const monthKey = `expenses-${this.currentMonth.getFullYear()}-${(this.currentMonth.getMonth() + 1).toString().padStart(2, '0')}`;
        localStorage.setItem(monthKey, JSON.stringify(this.expenses));
        
        this.displayExpenses();
        this.showMessage('Expense deleted successfully!', 'success');
        
        // Update quick selection buttons since data changed
        this.updateQuickSelectionButtons();
    }

    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const day = date.getDate().toString().padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        
        return `${day}-${month}-${year}`;
    }

    // Show message
    showMessage(text, type) {
        const messageContainer = document.getElementById('messageContainer');
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;
        
        messageContainer.appendChild(message);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 3000);
    }

    // Load default data if first time
    loadDefaultData() {
        // Check if this is first time user
        const hasData = localStorage.getItem('expenseLabels') || localStorage.getItem('paymentOptions');
        if (!hasData) {
            // Save default data
            localStorage.setItem('expenseLabels', JSON.stringify(this.labels));
            localStorage.setItem('paymentOptions', JSON.stringify(this.paymentOptions));
        }
    }

    // Export expenses (bonus feature)
    exportExpenses() {
        if (this.expenses.length === 0) {
            this.showMessage('No expenses to export!', 'error');
            return;
        }

        const monthYear = `${this.currentMonth.getFullYear()}-${(this.currentMonth.getMonth() + 1).toString().padStart(2, '0')}`;
        const csvContent = this.generateCSV();
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `expenses-${monthYear}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showMessage('Expenses exported successfully!', 'success');
    }

    // Generate CSV content
    generateCSV() {
        const headers = ['Date', 'Amount', 'Description', 'Label', 'Payment Option'];
        const rows = this.expenses.map(expense => [
            this.formatDate(expense.date),
            expense.amount.toFixed(2),
            `"${expense.description}"`,
            expense.label,
            expense.paymentOption
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    // Download expenses as CSV
    downloadCSV() {
        if (this.expenses.length === 0) {
            this.showMessage('No expenses to download!', 'error');
            return;
        }

        const csvContent = this.generateCSV();
        const monthYear = `${this.currentMonth.toLocaleString('default', { month: 'short' }).toUpperCase()}-${this.currentMonth.getFullYear()}`;
        const filename = `expenses-${monthYear}.csv`;
        
        this.downloadFile(csvContent, filename, 'text/csv');
        this.showMessage('CSV file downloaded successfully!', 'success');
    }

    // Download expenses as TXT
    downloadTXT() {
        if (this.expenses.length === 0) {
            this.showMessage('No expenses to download!', 'error');
            return;
        }

        const txtContent = this.generateTXT();
        const monthYear = `${this.currentMonth.toLocaleString('default', { month: 'short' }).toUpperCase()}-${this.currentMonth.getFullYear()}`;
        const filename = `expenses-${monthYear}.txt`;
        
        this.downloadFile(txtContent, filename, 'text/plain');
        this.showMessage('TXT file downloaded successfully!', 'success');
    }

    // Generate TXT content (same format as CSV)
    generateTXT() {
        const headers = ['Date', 'Amount', 'Description', 'Label', 'Payment Option'];
        const rows = this.expenses.map(expense => [
            this.formatDate(expense.date),
            expense.amount.toFixed(2),
            `"${expense.description}"`,
            expense.label,
            expense.paymentOption
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    // Helper function to download files
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    }

    // Trigger file input
    triggerFileInput() {
        document.getElementById('fileInput').click();
    }

    // Handle file load
    handleFileLoad(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                const fileExtension = file.name.toLowerCase().split('.').pop();
                
                let loadedExpenses = [];
                if (fileExtension === 'csv') {
                    loadedExpenses = this.parseCSV(content);
                } else if (fileExtension === 'txt') {
                    loadedExpenses = this.parseTXT(content);
                } else {
                    this.showMessage('Unsupported file format. Please use CSV or TXT files.', 'error');
                    return;
                }

                if (loadedExpenses.length > 0) {
                    this.mergeExpenses(loadedExpenses);
                    this.showMessage(`Successfully loaded ${loadedExpenses.length} expenses!`, 'success');
                    // Update quick selection buttons with new data
                    this.updateQuickSelectionButtons();
                } else {
                    this.showMessage('No valid expenses found in the file.', 'error');
                }
            } catch (error) {
                this.showMessage('Error reading file: ' + error.message, 'error');
            }
        };

        reader.readAsText(file);
        // Clear the input so the same file can be loaded again if needed
        event.target.value = '';
    }

    // Parse CSV content
    parseCSV(content) {
        const lines = content.trim().split('\n');
        if (lines.length < 2) return [];

        const expenses = [];
        // Skip header row
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // Parse CSV line (handling quoted fields)
            const fields = this.parseCSVLine(line);
            if (fields.length >= 5) {
                const expense = this.createExpenseFromFields(fields);
                if (expense) expenses.push(expense);
            }
        }

        return expenses;
    }

    // Parse CSV line handling quoted fields
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

    // Parse TXT content
    parseTXT(content) {
        // First, check if this TXT file is actually in CSV format
        const lines = content.trim().split('\n');
        if (lines.length >= 2) {
            const firstLine = lines[0].trim();
            // Check if first line looks like CSV header
            if (firstLine.toLowerCase().includes('date') && firstLine.includes(',') && 
                (firstLine.toLowerCase().includes('amount') || firstLine.toLowerCase().includes('description'))) {
                // This TXT file is actually in CSV format, use CSV parser
                console.log('TXT file detected as CSV format, using CSV parser');
                return this.parseCSV(content);
            }
        }

        // Parse as traditional TXT format
        const expenses = [];
        let currentExpense = {};
        let isParsingExpenses = false;

        for (const line of lines) {
            const trimmedLine = line.trim();
            
            // Skip empty lines and headers
            if (!trimmedLine || trimmedLine.startsWith('=') || trimmedLine.startsWith('-')) {
                continue;
            }

            // Check if we've reached the summary section
            if (trimmedLine.startsWith('Total Expenses:') || trimmedLine.startsWith('Number of Entries:')) {
                break;
            }

            // Check for expense entry start (number followed by dot and date)
            const entryMatch = trimmedLine.match(/^\d+\.\s+(.+)$/);
            if (entryMatch) {
                // Save previous expense if exists
                if (Object.keys(currentExpense).length > 0) {
                    const expense = this.createExpenseFromTXTData(currentExpense);
                    if (expense) expenses.push(expense);
                }
                
                // Start new expense
                currentExpense = { date: entryMatch[1] };
                isParsingExpenses = true;
                continue;
            }

            // Parse expense details
            if (isParsingExpenses && trimmedLine.includes(':')) {
                const [key, ...valueParts] = trimmedLine.split(':');
                const value = valueParts.join(':').trim();
                
                const cleanKey = key.trim().toLowerCase();
                if (cleanKey === 'amount') {
                    currentExpense.amount = value.replace('₹', '').trim();
                } else if (cleanKey === 'description') {
                    currentExpense.description = value;
                } else if (cleanKey === 'label') {
                    currentExpense.label = value;
                } else if (cleanKey === 'payment') {
                    currentExpense.paymentOption = value;
                }
            }
        }

        // Don't forget the last expense
        if (Object.keys(currentExpense).length > 0) {
            const expense = this.createExpenseFromTXTData(currentExpense);
            if (expense) expenses.push(expense);
        }

        return expenses;
    }

    // Create expense object from CSV fields
    createExpenseFromFields(fields) {
        try {
            const [dateStr, amountStr, description, label, paymentOption] = fields;
            
            // Parse date (try different formats)
            const date = this.parseDate(dateStr.trim());
            if (!date) return null;

            // Parse amount
            const amount = parseFloat(amountStr.replace(/[₹,]/g, '').trim());
            if (isNaN(amount) || amount < 0) return null;

            return {
                id: this.generateId(),
                date: date,
                amount: amount,
                description: description.replace(/"/g, '').trim(),
                label: label.trim().toUpperCase(),
                paymentOption: paymentOption.trim().toUpperCase()
            };
        } catch (error) {
            return null;
        }
    }

    // Create expense object from TXT data
    createExpenseFromTXTData(data) {
        try {
            if (!data.date || !data.amount || !data.description || !data.label || !data.paymentOption) {
                return null;
            }

            const date = this.parseDate(data.date.trim());
            if (!date) return null;

            const amount = parseFloat(data.amount.replace(/[₹,]/g, '').trim());
            if (isNaN(amount) || amount < 0) return null;

            return {
                id: this.generateId(),
                date: date,
                amount: amount,
                description: data.description.trim(),
                label: data.label.trim().toUpperCase(),
                paymentOption: data.paymentOption.trim().toUpperCase()
            };
        } catch (error) {
            return null;
        }
    }

    // Parse date from various formats
    parseDate(dateStr) {
        // Try dd-MMM-YYYY format first (02-Oct-2025) - this is the expected format for CSV
        const ddMmmYyyy = dateStr.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/);
        if (ddMmmYyyy) {
            const [, day, month, year] = ddMmmYyyy;
            const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun',
                              'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
            const monthIndex = monthNames.indexOf(month.toLowerCase());
            if (monthIndex !== -1) {
                // Create date in YYYY-MM-DD format to avoid timezone issues
                const paddedMonth = (monthIndex + 1).toString().padStart(2, '0');
                const paddedDay = day.padStart(2, '0');
                return `${year}-${paddedMonth}-${paddedDay}`;
            }
        }

        // Try ISO format (YYYY-MM-DD) - just validate and return as is
        const isoFormat = dateStr.match(/^\d{4}-\d{2}-\d{2}$/);
        if (isoFormat) {
            const date = new Date(dateStr + 'T12:00:00Z'); // Use noon UTC to avoid timezone issues
            if (!isNaN(date.getTime())) {
                return dateStr; // Return original ISO format
            }
        }

        return null;
    }

    // Merge loaded expenses with existing ones
    mergeExpenses(loadedExpenses) {
        // Group loaded expenses by month
        const expensesByMonth = {};
        
        loadedExpenses.forEach(expense => {
            const expenseDate = new Date(expense.date);
            const monthKey = `expenses-${expenseDate.getFullYear()}-${(expenseDate.getMonth() + 1).toString().padStart(2, '0')}`;
            
            if (!expensesByMonth[monthKey]) {
                expensesByMonth[monthKey] = [];
            }
            expensesByMonth[monthKey].push(expense);
        });

        // Merge with existing data
        Object.entries(expensesByMonth).forEach(([monthKey, expenses]) => {
            const existingExpenses = JSON.parse(localStorage.getItem(monthKey)) || [];
            
            // Add new expenses (avoid duplicates based on date, amount, and description)
            expenses.forEach(newExpense => {
                const isDuplicate = existingExpenses.some(existing => 
                    existing.date === newExpense.date &&
                    existing.amount === newExpense.amount &&
                    existing.description === newExpense.description
                );
                
                if (!isDuplicate) {
                    existingExpenses.push(newExpense);
                }
            });

            // Sort by date
            existingExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));
            
            // Save back to localStorage
            localStorage.setItem(monthKey, JSON.stringify(existingExpenses));
        });

        // Reload current month expenses if any were added to current month
        const currentMonthKey = `expenses-${this.currentMonth.getFullYear()}-${(this.currentMonth.getMonth() + 1).toString().padStart(2, '0')}`;
        if (expensesByMonth[currentMonthKey]) {
            this.loadCurrentMonthExpenses();
            this.displayExpenses();
        }

        // Update labels and payment options with new ones
        loadedExpenses.forEach(expense => {
            if (expense.label && !this.labels.includes(expense.label)) {
                this.labels.push(expense.label);
            }
            if (expense.paymentOption && !this.paymentOptions.includes(expense.paymentOption)) {
                this.paymentOptions.push(expense.paymentOption);
            }
        });

        // Sort and save updated lists
        this.labels.sort();
        this.paymentOptions.sort();
        localStorage.setItem('expenseLabels', JSON.stringify(this.labels));
        localStorage.setItem('paymentOptions', JSON.stringify(this.paymentOptions));
        this.updateLabelSuggestions();
        this.updatePaymentSuggestions();
    }

    // Settings Page Methods
    loadSettingsPage() {
        this.displayLabelsInSettings();
        this.displayPaymentOptionsInSettings();
    }

    // Display labels in settings page
    displayLabelsInSettings() {
        const container = document.getElementById('labelsList');
        container.innerHTML = '';

        if (this.labels.length === 0) {
            container.innerHTML = '<p class="empty-message">No labels found. Add one below!</p>';
            return;
        }

        this.labels.forEach((label, index) => {
            const labelItem = document.createElement('div');
            labelItem.className = 'settings-item';
            labelItem.innerHTML = `
                <span class="item-text">${label}</span>
                <div class="item-actions">
                    <button class="btn-small btn-edit" onclick="expenseTracker.editLabel(${index}, '${label}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-small btn-delete" onclick="expenseTracker.deleteLabel(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            container.appendChild(labelItem);
        });
    }

    // Display payment options in settings page
    displayPaymentOptionsInSettings() {
        const container = document.getElementById('paymentOptionsList');
        container.innerHTML = '';

        if (this.paymentOptions.length === 0) {
            container.innerHTML = '<p class="empty-message">No payment options found. Add one below!</p>';
            return;
        }

        this.paymentOptions.forEach((option, index) => {
            const optionItem = document.createElement('div');
            optionItem.className = 'settings-item';
            optionItem.innerHTML = `
                <span class="item-text">${option}</span>
                <div class="item-actions">
                    <button class="btn-small btn-edit" onclick="expenseTracker.editPaymentOption(${index}, '${option}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-small btn-delete" onclick="expenseTracker.deletePaymentOption(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            container.appendChild(optionItem);
        });
    }

    // Add new label
    addNewLabel() {
        const input = document.getElementById('newLabel');
        const newLabel = input.value.trim().toUpperCase();

        if (!newLabel) {
            this.showMessage('Please enter a label name.', 'error');
            return;
        }

        if (this.labels.includes(newLabel)) {
            this.showMessage('This label already exists.', 'error');
            return;
        }

        this.labels.push(newLabel);
        this.labels.sort();
        localStorage.setItem('expenseLabels', JSON.stringify(this.labels));
        this.updateLabelSuggestions();
        this.displayLabelsInSettings();
        
        input.value = '';
        this.showMessage('Label added successfully!', 'success');
    }

    // Add new payment option
    addNewPaymentOption() {
        const input = document.getElementById('newPaymentOption');
        const newOption = input.value.trim().toUpperCase();

        if (!newOption) {
            this.showMessage('Please enter a payment option name.', 'error');
            return;
        }

        if (this.paymentOptions.includes(newOption)) {
            this.showMessage('This payment option already exists.', 'error');
            return;
        }

        this.paymentOptions.push(newOption);
        this.paymentOptions.sort();
        localStorage.setItem('paymentOptions', JSON.stringify(this.paymentOptions));
        this.updatePaymentSuggestions();
        this.displayPaymentOptionsInSettings();
        
        input.value = '';
        this.showMessage('Payment option added successfully!', 'success');
    }

    // Edit label
    editLabel(index, currentLabel) {
        const newLabel = prompt('Edit label:', currentLabel);
        if (newLabel === null) return; // User cancelled

        const trimmedLabel = newLabel.trim().toUpperCase();
        if (!trimmedLabel) {
            this.showMessage('Label cannot be empty.', 'error');
            return;
        }

        if (trimmedLabel !== currentLabel && this.labels.includes(trimmedLabel)) {
            this.showMessage('This label already exists.', 'error');
            return;
        }

        this.labels[index] = trimmedLabel;
        this.labels.sort();
        localStorage.setItem('expenseLabels', JSON.stringify(this.labels));
        this.updateLabelSuggestions();
        this.displayLabelsInSettings();
        this.showMessage('Label updated successfully!', 'success');
    }

    // Edit payment option
    editPaymentOption(index, currentOption) {
        const newOption = prompt('Edit payment option:', currentOption);
        if (newOption === null) return; // User cancelled

        const trimmedOption = newOption.trim().toUpperCase();
        if (!trimmedOption) {
            this.showMessage('Payment option cannot be empty.', 'error');
            return;
        }

        if (trimmedOption !== currentOption && this.paymentOptions.includes(trimmedOption)) {
            this.showMessage('This payment option already exists.', 'error');
            return;
        }

        this.paymentOptions[index] = trimmedOption;
        this.paymentOptions.sort();
        localStorage.setItem('paymentOptions', JSON.stringify(this.paymentOptions));
        this.updatePaymentSuggestions();
        this.displayPaymentOptionsInSettings();
        this.showMessage('Payment option updated successfully!', 'success');
    }

    // Delete label
    deleteLabel(index) {
        const labelToDelete = this.labels[index];
        if (confirm(`Are you sure you want to delete the label "${labelToDelete}"?`)) {
            this.labels.splice(index, 1);
            localStorage.setItem('expenseLabels', JSON.stringify(this.labels));
            this.updateLabelSuggestions();
            this.displayLabelsInSettings();
            this.showMessage('Label deleted successfully!', 'success');
        }
    }

    // Delete payment option
    deletePaymentOption(index) {
        const optionToDelete = this.paymentOptions[index];
        if (confirm(`Are you sure you want to delete the payment option "${optionToDelete}"?`)) {
            this.paymentOptions.splice(index, 1);
            localStorage.setItem('paymentOptions', JSON.stringify(this.paymentOptions));
            this.updatePaymentSuggestions();
            this.displayPaymentOptionsInSettings();
            this.showMessage('Payment option deleted successfully!', 'success');
        }
    }

    // Reset labels to default
    resetLabelsToDefault() {
        if (confirm('Are you sure you want to reset all labels to default? This will remove any custom labels you have added.')) {
            const defaultLabels = [
                'FOOD', 'CLOTHING', 'GROOMING', 'MEDICAL', 'UTILITY', 'VEHICLE-MAINTENANCE',
                'PETROL', 'MONTHLY', 'CLASSES', 'SCHOOL', 'LEARNING', 'MANDIR', 'BHISI',
                'JSG', 'OFFICE-LUNCH', 'COMMUTING', 'ONLINE-PAYMENT', 'EATING-OUT',
                'ENTERTAINMENT', 'TRAVEL/VACATION', 'ELECTRONICS', 'INVESTMENT', 'MISCELLANEOUS'
            ];
            
            this.labels = [...defaultLabels];
            localStorage.setItem('expenseLabels', JSON.stringify(this.labels));
            this.updateLabelSuggestions();
            this.displayLabelsInSettings();
            this.showMessage('Labels reset to default successfully!', 'success');
        }
    }

    // Reset payment options to default
    resetPaymentOptionsToDefault() {
        if (confirm('Are you sure you want to reset all payment options to default? This will remove any custom payment options you have added.')) {
            const defaultPaymentOptions = [
                'CC-HDFC-RUPAY', 'CC-AXIS-BANK', 'CC-HDFC-REGALIA', 'CC-ICICI-AMAZON-PAY',
                'UPI-LITE', 'UPI-JUPITER', 'UPI-DCB-NIYO', 'UPI-KOTAK', 'UPI-AXIS',
                'UPI-SBI', 'UPI-ICICI', 'AMAZON-PAY', 'PLUXEE', 'FASTAG', 'CASH',
                'BHAVNA', 'PAHAL'
            ];
            
            this.paymentOptions = [...defaultPaymentOptions];
            localStorage.setItem('paymentOptions', JSON.stringify(this.paymentOptions));
            this.updatePaymentSuggestions();
            this.displayPaymentOptionsInSettings();
            this.showMessage('Payment options reset to default successfully!', 'success');
        }
    }

    // Generate unique ID for expenses
    generateId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.expenseTracker = new ExpenseTracker();
});

// Add some additional styling for badges
const additionalStyles = `
    .label-badge, .payment-badge {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
        white-space: nowrap;
        display: inline-block;
    }

    .payment-badge {
        background: linear-gradient(135deg, #48bb78, #38a169);
    }

    .empty-state td {
        text-align: center;
        padding: 40px 20px;
        color: #718096;
    }

    .empty-state i {
        font-size: 2rem;
        margin-bottom: 10px;
        color: #cbd5e0;
        display: block;
    }

    .empty-state h3 {
        margin-bottom: 5px;
        color: #4a5568;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);