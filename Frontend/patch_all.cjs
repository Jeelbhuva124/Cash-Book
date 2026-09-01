const fs = require('fs');
const file = 'd:/Cash-Book/Frontend/src/Dashboard/pages/Transactions.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add state variables for Start Date, End Date, Total Days, Party Type, Party Name, Interest Rate
// and the computed variable `isInterestBasedEntry`
const oldStateVars = `  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);`;

const newStateVars = `  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [partyType, setPartyType] = useState('creditor');
  const [partyName, setPartyName] = useState('');

  const calculateTotalDays = (start, end) => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    const diffDays = Math.ceil(Math.abs(e - s) / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const selectedChalan = chalans.find(c => c.id === selectedChalanId);
  const isInterestBasedEntry = selectedChalan?.cashbook_type === 'interest_based';`;
content = content.replace(oldStateVars, newStateVars);

// 2. Clear interest fields when modal opens
const oldModalOpen = `    setCategory(categories[0]?.name || '');
    setPaymentMode(paymentModes[0]?.name || 'Bank Transfer');
    setShowAddForm(true);`;

const newModalOpen = `    setCategory(categories[0]?.name || '');
    setPaymentMode(paymentModes[0]?.name || 'Bank Transfer');
    setStartDate('');
    setEndDate('');
    setInterestRate('');
    setPartyType('creditor');
    setPartyName('');
    setShowAddForm(true);`;
content = content.replace(oldModalOpen, newModalOpen);

// 3. Edit payload
const oldPayload = `    const payload = {
      cashbook_id: selectedChalanId,
      type,
      title,
      amount: parseFloat(amount),
      date,
      category,
      subcategory: subcategory || undefined,
      payment_mode: paymentMode,
      month,
      year,
      notes: ''
    };`;

const newPayload = `    const isInterest = isInterestBasedEntry;
    const payload = {
      cashbook_id: selectedChalanId,
      type,
      title,
      amount: parseFloat(amount),
      date,
      category: isInterest ? 'Interest' : category,
      subcategory: isInterest ? undefined : subcategory,
      payment_mode: paymentMode,
      month,
      year,
      notes: ''
    };
    if (isInterest) {
      payload.interest_rate = parseFloat(interestRate) || 0;
      payload.party_type = partyType;
      payload.party_name = partyName;
      payload.start_date = startDate;
      payload.end_date = endDate;
      payload.total_days = calculateTotalDays(startDate, endDate);
    }`;
content = content.replace(oldPayload, newPayload);

// 4. Update UI to inject Interest section and hide Category/Subcategory
const oldUIBlock = `<div className="space-y-1">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Title / Description</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Chai & Snacks, Customer Inflow"
                    className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary text-sm font-medium text-foreground bg-white dark:bg-card"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Amount (₹)</label>
                    <input
                      type="number"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="150"
                      className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary text-sm font-bold text-foreground bg-white dark:bg-card"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Date</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary text-sm font-medium text-foreground bg-white dark:bg-card"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Category</label>
                    <Dropdown
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      onAddNew={handleAddNewCategory}
                    >
                      {categories.map(c => (
                         <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </Dropdown>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Subcategory</label>
                    <input
                      type="text"
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      placeholder="e.g. rent', dinner"
                      className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary text-sm font-medium text-foreground bg-white dark:bg-card"
                    />
                  </div>
                </div>`;

const newUIBlock = `<div className="space-y-1">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Title / Description</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Chai & Snacks, Customer Inflow"
                    className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary text-sm font-medium text-foreground bg-white dark:bg-card"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Amount (₹)</label>
                    <input
                      type="number"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="150"
                      className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary text-sm font-bold text-foreground bg-white dark:bg-card"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Date</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary text-sm font-medium text-foreground bg-white dark:bg-card"
                    />
                  </div>
                </div>

                {isInterestBasedEntry && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide flex justify-between">
                        Interest Rate (%)
                        <span className="text-amber-600/70 text-[9px]">Per Month</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        placeholder="e.g. 2.5"
                        className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-amber-500 text-sm font-bold text-foreground bg-white dark:bg-card"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">Party Type</label>
                      <Dropdown
                        value={partyType}
                        onChange={(e) => setPartyType(e.target.value)}
                      >
                        <option value="creditor">Creditor (Given to)</option>
                        <option value="debtor">Debtor (Taken from)</option>
                      </Dropdown>
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">Party Name</label>
                      <input
                        type="text"
                        value={partyName}
                        onChange={(e) => setPartyName(e.target.value)}
                        placeholder="Enter Name"
                        className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-amber-500 text-sm font-bold text-foreground bg-white dark:bg-card"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-amber-500 text-sm font-bold text-foreground bg-white dark:bg-card"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">End Date</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-amber-500 text-sm font-bold text-foreground bg-white dark:bg-card"
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">Total Days</label>
                      <div className="w-full px-4 py-2.5 rounded-xl border border-border bg-black/5 dark:bg-white/5 text-sm font-bold text-foreground flex items-center h-[42px]">
                        {calculateTotalDays(startDate, endDate)}
                      </div>
                    </div>
                  </div>
                )}

                {!isInterestBasedEntry && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Category</label>
                      <Dropdown
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        onAddNew={handleAddNewCategory}
                      >
                        {categories.map(c => (
                           <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </Dropdown>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Subcategory</label>
                      <input
                        type="text"
                        value={subcategory}
                        onChange={(e) => setSubcategory(e.target.value)}
                        placeholder="e.g. rent', dinner"
                        className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary text-sm font-medium text-foreground bg-white dark:bg-card"
                      />
                    </div>
                  </div>
                )}`;
content = content.replace(oldUIBlock, newUIBlock);

fs.writeFileSync(file, content, 'utf8');
