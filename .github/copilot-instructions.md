🧾 Daily Expense Tracker – Copilot Instructions
This module helps track daily expenses with a simple and intuitive UI. It includes two main pages:

📥 Add Expense Page
A form to capture daily expenses with the following fields:
1. Date

Format: dd-MMM-YYYY (e.g., 02-Oct-2025)
Input: Manual entry or calendar dropdown
Default: Set to today’s date on form load

2. Amount

Numeric input
Supports up to 2 decimal places

3. Description

Text input
Max 200 characters

4. Label

Text input with autocomplete suggestions
Suggestions based on existing labels from LABELS.txt
If a new label is entered:

It is capitalized
It is added to LABELS.txt

Default Labels:
FOOD, CLOTHING, GROOMING, MEDICAL, UTILITY, VEHICLE-MAINTENANCE, PETROL, MONTHLY,
CLASSES, SCHOOL, LEARNING, MANDIR, BHISI, JSG, OFFICE-LUNCH, COMMUTING,
ONLINE-PAYMENT, EATING-OUT, ENTERTAINMENT, TRAVEL/VACATION, ELECTRONICS,
INVESTMENT, MISCELLANEOUS

5. Payment Option

Text input with autocomplete suggestions
Suggestions based on existing options from PAYMENT-OPTIONS.txt
If a new option is entered:

It is capitalized
It is added to PAYMENT-OPTIONS.txt

Default Payment Options:
CC-HDFC-RUPAY, CC-AXIS-BANK, CC-HDFC-REGALIA, CC-ICICI-AMAZON-PAY,
UPI-LITE, UPI-JUPITER, UPI-DCB-NIYO, UPI-KOTAK, UPI-AXIS, UPI-SBI, UPI-ICICI,
AMAZON-PAY, PLUXEE, FASTAG, CASH, BHAVNA, PAHAL

6. Buttons

Add: Appends the entry to a file named MMM-YYYY.txt (e.g., OCT-2025.txt)
Clear: Resets the form fields


📄 List Added Expenses Page
Displays all entries from the current month’s file (MMM-YYYY.txt).
🔹 Table 1: Expense Entries
S.No, Date, Amount, Description, Label, Payment Option

🔹 Table 2: Summary by Label
Shows total amount grouped by label

🔹 Table 3: Summary by Payment Option
Shows total amount grouped by payment option