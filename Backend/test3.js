const http = require('http');

async function run() {
  const fetchJson = (url) => new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
  });

  const selectData = await fetchJson('http://localhost:5001/api/admin/select');
  const txData = await fetchJson('http://localhost:5001/api/admin/transactions');

  let cashbooks = selectData.data.cashbooks || selectData.data;
  const allTxns = txData.data;

  console.log("Cashbooks:", cashbooks.map(c => c.cashbook_name || c.name));
  
  if (cashbooks.length > 0 && cashbooks[0].total_income === undefined) {
    cashbooks = cashbooks.map(cb => {
      const cbId = String(cb.id || cb._id);
      const cbTxns = allTxns.filter(t => String(t.chalan_id) === cbId || String(t.chalanId) === cbId || (cbId === '1' && !t.chalan_id));
      let income = 0;
      let expense = 0;
      cbTxns.forEach(tx => {
        if (tx.type === 'income') income += Number(tx.amount) || 0;
        if (tx.type === 'expense') expense += Number(tx.amount) || 0;
      });
      return { ...cb, total_income: income, total_expense: expense };
    });
  }

  console.log(cashbooks.map(c => ({ name: c.cashbook_name || c.name, inc: c.total_income, exp: c.total_expense })));
}
run();
