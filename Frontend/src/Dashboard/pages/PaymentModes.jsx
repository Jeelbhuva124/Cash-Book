import React, { useState, useEffect } from 'react';
import { X, CreditCard, ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Dropdown from '../components/Dropdown';
import { useToast } from '../../context/ToastContext';

export default function PaymentModes() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [selectedMethod, setSelectedMethod] = useState('');
  const [chalans, setChalans] = useState([]);
  const [selectedChalanId, setSelectedChalanId] = useState('');

  // Add/Edit Card States
  const [newCardName, setNewCardName] = useState('');
  const [newCardCvv, setNewCardCvv] = useState('');
  const [newCardNumber, setNewCardNumber] = useState('');
  const [cardType, setCardType] = useState('mastercard');
  const [editingCardId, setEditingCardId] = useState(null);

  // Saved Cards List State
  const [cards, setCards] = useState([]);

  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;
  const userEmail = user?.email_id || '';

  useEffect(() => {
    // Load cashbooks list
    const storageKey = `cashbook_chalans_${userEmail || 'guest'}`;
    const savedChalans = localStorage.getItem(storageKey);
    if (savedChalans) {
      try {
        const parsed = JSON.parse(savedChalans);
        setChalans(parsed);
        if (parsed.length > 0) {
          setSelectedChalanId(parsed[0].id);
        }
      } catch (e) { }
    }
  }, [userEmail]);

  // Load Payment Modes from API matching the selected cashbook
  const loadPaymentModes = async () => {
    if (!selectedChalanId) {
      setCards([]);
      return;
    }
    try {
      const res = await fetch('http://localhost:5001/api/payment-mode/select');
      const data = await res.json();
      if (data.success && data.data) {
        // Filter by active and selected cashbook chalan_id
        const filtered = data.data.filter(pm => pm.chalan_id === selectedChalanId && pm.active);
        
        const mapped = filtered.map(pm => {
          let brand = 'Card';
          let last4 = '1234';
          let brandType = 'generic';
          let fullNumber = '4234 5678 9012 1234';
          
          if (pm.payment_mode.includes(' ** ')) {
            const parts = pm.payment_mode.split(' ** ');
            brand = parts[0];
            const numPart = parts[1];
            const cleanNum = numPart.replace(/\s/g, '');
            if (cleanNum.length >= 16) {
              fullNumber = numPart;
              last4 = cleanNum.slice(-4);
            } else {
              last4 = cleanNum;
              // Mock visible numbers for legacy 4-digit card records
              fullNumber = `4234 5678 9012 ${last4}`;
            }
          } else {
            brand = pm.payment_mode;
            last4 = pm.payment_mode.slice(-4) || '1234';
            fullNumber = `4234 5678 9012 ${last4}`;
          }
          
          const brandLower = brand.toLowerCase();
          if (brandLower.includes('mastercard')) brandType = 'mastercard';
          else if (brandLower.includes('visa')) brandType = 'visa';
          else if (brandLower.includes('paypal')) brandType = 'paypal';
          else if (brandLower.includes('apple')) brandType = 'apple';

          return {
            id: pm.id,
            brand: brand,
            last4: last4,
            expiry: '06/30',
            color: 
              brandType === 'visa' ? '#1434CB' : 
              brandType === 'paypal' ? '#003087' : 
              brandType === 'apple' ? '#000000' : 
              '#EB001B',
            isMastercard: brandType === 'mastercard',
            isApple: brandType === 'apple',
            isPaypal: brandType === 'paypal',
            isAmex: brandType === 'generic',
            cardholderName: pm.created_by || 'Johan Smit',
            cardNumber: fullNumber,
            cvv: '123'
          };
        });
        
        // Show default list fallback if DB has no custom payment modes for this cashbook yet
        if (mapped.length === 0) {
          const defaults = [
            { id: 'visa-6492', brand: 'VISA', last4: '6492', expiry: '11/30', color: '#1434CB', cardholderName: 'Johan Smit', cardNumber: '4234 5678 9012 6492', cvv: '123' },
            { id: 'mastercard-7294', brand: 'Mastercard', last4: '7294', expiry: '01/28', color: '#EB001B', isMastercard: true, cardholderName: 'Johan Smit', cardNumber: '5234 5678 9012 7294', cvv: '123' },
            { id: 'amex-8321', brand: 'AMEX', last4: '8321', expiry: '05/28', color: '#006FCF', isAmex: true, cardholderName: 'Johan Smit', cardNumber: '3734 5678 9012 8321', cvv: '123' },
          ];
          setCards(defaults);
          setSelectedMethod('visa-6492');
        } else {
          setCards(mapped);
          setSelectedMethod(mapped[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load payment modes:", err);
    }
  };

  useEffect(() => {
    loadPaymentModes();
  }, [selectedChalanId]);

  const handleStartEdit = (card, e) => {
    e.stopPropagation();
    setEditingCardId(card.id);
    setNewCardName(card.cardholderName || '');
    setNewCardCvv(card.cvv || '');
    setNewCardNumber(card.cardNumber || '');
    
    let type = 'generic';
    if (card.isMastercard || card.brand.toLowerCase().includes('mastercard')) type = 'mastercard';
    else if (card.brand.toLowerCase().includes('visa')) type = 'visa';
    else if (card.isPaypal || card.brand.toLowerCase().includes('paypal')) type = 'paypal';
    else if (card.isApple || card.brand.toLowerCase().includes('apple')) type = 'apple';
    setCardType(type);

    addToast('Editing card details...', 'info');
  };

  const handleSaveCard = async (e) => {
    e.preventDefault();
    if (!selectedChalanId) {
      addToast('Please select a cashbook first', 'warning');
      return;
    }

    const cleanNumber = newCardNumber.replace(/\s/g, '');

    if (!newCardName.trim()) {
      addToast('Please enter the Cardholder Name', 'error');
      return;
    }
    const digitsOnly = cleanNumber.replace(/\D/g, '');
    if (digitsOnly.length < 16) {
      addToast('Please enter a valid 16-digit card number', 'error');
      return;
    }
    if (newCardCvv.length < 3) {
      addToast('Please enter a valid CVV', 'error');
      return;
    }

    const last4 = digitsOnly.slice(-4);
    const brandLabel = cardType === 'generic' ? 'Card' : cardType.charAt(0).toUpperCase() + cardType.slice(1);
    const formattedBrand = brandLabel === 'Apple' ? 'Apple Card' : brandLabel;
    
    // Save the full visible card number formatted with spaces in the database
    const paymentModeName = `${formattedBrand} ** ${newCardNumber}`;

    if (editingCardId) {
      // Check if it's editing a local placeholder card vs DB entry
      const isMongoId = /^[0-9a-fA-F]{24}$/.test(editingCardId);
      if (!isMongoId) {
        // Update local default card in list
        const updated = cards.map(c => {
          if (c.id === editingCardId) {
            return {
              ...c,
              brand: formattedBrand,
              last4: last4,
              color: 
                cardType === 'visa' ? '#1434CB' : 
                cardType === 'paypal' ? '#003087' : 
                cardType === 'apple' ? '#000000' : 
                '#EB001B',
              isMastercard: cardType === 'mastercard',
              isAmex: cardType === 'generic',
              isPaypal: cardType === 'paypal',
              isApple: cardType === 'apple',
              cardholderName: newCardName,
              cardNumber: newCardNumber,
              cvv: newCardCvv
            };
          }
          return c;
        });
        setCards(updated);
        addToast('Card details updated!', 'success');
        setEditingCardId(null);
      } else {
        // Update DB payment mode
        try {
          const response = await fetch('http://localhost:5001/api/payment-mode/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: editingCardId,
              payment_mode: paymentModeName,
              active: true,
              updated_by: user?.username || 'Guest'
            })
          });
          const data = await response.json();
          if (data.success) {
            addToast('Card updated in database!', 'success');
            setEditingCardId(null);
            loadPaymentModes();
          } else {
            addToast(data.message || 'Failed to update card', 'error');
          }
        } catch (err) {
          console.error("Update card API call failed:", err);
          addToast('Failed to update card in database', 'error');
        }
      }
    } else {
      // Insert new card to DB
      try {
        const response = await fetch('http://localhost:5001/api/payment-mode/insert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            payment_mode: paymentModeName,
            chalan_id: selectedChalanId,
            active: true,
            created_by: newCardName.trim(),
            updated_by: user?.username || 'Guest',
            user_email: userEmail
          })
        });
        const data = await response.json();
        if (data.success) {
          addToast('New card saved and synced!', 'success');
          loadPaymentModes();
        } else {
          addToast(data.message || 'Failed to save card to database', 'error');
        }
      } catch (err) {
        console.error("Insert card API call failed:", err);
        addToast('Failed to save card to database', 'error');
      }
    }

    // Reset Form
    setNewCardName('');
    setNewCardNumber('');
    setNewCardCvv('');
    setCardType('mastercard');
  };

  const handleDeleteCard = async (cardId, e) => {
    e.stopPropagation();
    
    // Check if it is a local placeholder card vs DB entry
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(cardId);
    if (!isMongoId) {
      const updated = cards.filter(c => c.id !== cardId);
      setCards(updated);
      addToast('Card deleted!', 'success');
      
      if (editingCardId === cardId) {
        setEditingCardId(null);
        setNewCardName('');
        setNewCardNumber('');
        setNewCardCvv('');
        setCardType('mastercard');
      }

      if (selectedMethod === cardId) {
        if (updated.length > 0) setSelectedMethod(updated[0].id);
        else setSelectedMethod('');
      }
      return;
    }

    // Delete from DB
    try {
      const response = await fetch('http://localhost:5001/api/payment-mode/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: cardId })
      });
      const data = await response.json();
      if (data.success) {
        addToast('Card deleted from database!', 'success');
        
        if (editingCardId === cardId) {
          setEditingCardId(null);
          setNewCardName('');
          setNewCardNumber('');
          setNewCardCvv('');
          setCardType('mastercard');
        }
        
        loadPaymentModes();
      } else {
        addToast(data.message || 'Failed to delete card', 'error');
      }
    } catch (err) {
      console.error("Delete card API call failed:", err);
      addToast('Failed to delete card from database', 'error');
    }
  };

  return (
    <div className="p-6 md:p-8 w-full min-h-screen bg-transparent relative flex flex-col space-y-6">
      
      {/* Page Header */}
      <div className="flex items-center gap-3 w-full">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors text-gray-600 dark:text-slate-400"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#1e293b] dark:text-slate-100">
            Payment Modes
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">
            Select a payment method or add a new card
          </p>
        </div>
      </div>
      
      {/* Select Cashbook Card */}
      <div className="bg-white dark:bg-[#121827] border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 w-full">
        <div className="flex items-center gap-2 text-sm font-bold text-[#1e293b] dark:text-slate-100">
          <CreditCard className="w-4 h-4 text-[#5542F6]" />
          <span>Cashbook Selection</span>
        </div>
        <p className="text-xs text-muted-foreground font-medium">
          Choose a cashbook to view or manage its payment modes
        </p>

        <div className="space-y-1.5 w-full max-w-sm">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
            Select Cashbook
          </label>
          <Dropdown
            value={selectedChalanId}
            onChange={(e) => setSelectedChalanId(e.target.value)}
          >
            <option value="">Choose a Cashbook</option>
            {chalans.map(ch => (
              <option key={ch.id} value={ch.id}>{ch.name}</option>
            ))}
          </Dropdown>
        </div>
      </div>

      {/* Main Content Area: List and Add Form side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
        
        {/* Left Side: Select Payment Method Box */}
        <div className="bg-white dark:bg-[#121827] border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col lg:col-span-6 w-full">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-slate-800/60">
            <h2 className="text-[15px] font-semibold text-gray-800 dark:text-slate-100">Select Payment Method</h2>
          </div>

          {/* List Content */}
          <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
            {cards.length === 0 ? (
              <div className="text-center py-6 text-sm text-gray-500 dark:text-slate-400 font-medium">
                No payment modes added yet.
              </div>
            ) : (
              cards.map((card) => (
                <div 
                  key={card.id}
                  onClick={() => setSelectedMethod(card.id)}
                  className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${
                    selectedMethod === card.id 
                      ? 'border-[#5542F6] bg-[#5542F6]/[0.02] dark:bg-[#5542F6]/0.05' 
                      : 'border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex-1 flex gap-4">
                    {/* Card Brand Icon Placeholder */}
                    <div className="w-12 h-8 rounded bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 flex items-center justify-center shrink-0 overflow-hidden">
                      {card.isMastercard ? (
                         <div className="flex -space-x-1.5 items-center justify-center">
                           <div className="w-3.5 h-3.5 rounded-full bg-[#EB001B] opacity-90"></div>
                           <div className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] opacity-90"></div>
                         </div>
                      ) : card.isApple ? (
                        <svg className="w-4 h-4 text-black dark:text-slate-200 fill-current" viewBox="0 0 24 24">
                          <path d="M18.71,19.5 C17.88,20.74 17,21.95 15.66,21.97 C14.32,22 13.89,21.18 12.37,21.18 C10.84,21.18 10.37,21.95 9.1,22 C7.79,22.05 6.8,20.68 5.96,19.47 C4.25,17 2.94,12.45 4.7,9.39 C5.57,7.87 7.13,6.91 8.82,6.88 C10.1,6.86 11.32,7.75 12.11,7.75 C12.89,7.75 14.37,6.68 15.92,6.84 C16.57,6.87 18.39,7.1 19.56,8.82 C19.47,8.88 17.39,10.1 17.41,12.63 C17.44,15.65 20.06,16.66 20.1,16.67 C20.08,16.74 19.67,18.11 18.71,19.5 M15.97,4.17 C16.63,3.37 17.07,2.28 16.95,1 C16,1.04 14.9,1.6 14.24,2.38 C13.68,3.04 13.19,4.14 13.34,5.39 C14.39,5.47 15.4,4.88 15.97,4.17 Z" />
                        </svg>
                      ) : card.isPaypal ? (
                        <span className="text-[9px] font-extrabold italic text-blue-700">PayPal</span>
                      ) : card.isAmex ? (
                        <div className="bg-[#006FCF] w-full h-full flex items-center justify-center">
                          <span className="text-[9px] font-bold text-white italic tracking-tighter">AMEX</span>
                        </div>
                      ) : (
                        <span className="text-[11px] font-extrabold italic tracking-tighter" style={{ color: card.color }}>{card.brand}</span>
                      )}
                    </div>

                    <div className="flex-1 -mt-0.5 text-left">
                      <div className="text-sm font-semibold text-gray-800 dark:text-slate-100 flex gap-1.5 items-center">
                        {card.brand} <span className="text-gray-600 dark:text-slate-400 font-medium">** {card.last4}</span>
                      </div>
                      <div className="text-[13px] text-gray-500 dark:text-slate-400 mt-0.5 font-medium">Expires {card.expiry}</div>
                      <div className="flex gap-4 mt-2">
                        <button className="text-[13px] font-semibold text-[#5542F6] hover:text-[#4335c9] cursor-pointer">Set as default</button>
                        <button 
                          onClick={(e) => handleStartEdit(card, e)}
                          className="text-[13px] font-semibold text-gray-800 dark:text-slate-300 hover:text-black dark:hover:text-white cursor-pointer"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={(e) => handleDeleteCard(card.id, e)}
                          className="text-[13px] font-semibold text-red-500 hover:text-red-700 dark:hover:text-red-400 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Radio Button */}
                  <div className="shrink-0 ml-4 flex items-center justify-center h-8">
                    <div className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedMethod === card.id ? 'border-[#5542F6]' : 'border-gray-200 dark:border-slate-800'
                    }`}>
                      {selectedMethod === card.id && (
                        <div className="w-3 h-3 rounded-full bg-[#5542F6]" />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Add/Edit Card Form */}
        <div className="bg-white dark:bg-[#121827] border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col lg:col-span-6 w-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800/60 text-left">
            <h2 className="text-[15px] font-semibold text-gray-800 dark:text-slate-100">
              {editingCardId ? 'Edit Card Details' : 'Add New Card'}
            </h2>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            
            {/* Brand Selection Circles */}
            <div className="flex gap-4 items-center justify-start pb-2 p-1 overflow-x-auto select-none">
              {/* Generic (+) */}
              <div 
                onClick={() => setCardType('generic')}
                className={`w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-all border shadow-sm shrink-0 bg-white dark:bg-slate-900 ${
                  cardType === 'generic' ? 'ring-2 ring-[#FE5C2C] border-transparent scale-105 font-bold' : 'border-gray-200 dark:border-slate-800 hover:scale-105'
                }`}
              >
                <Plus className="w-5 h-5 text-gray-500" strokeWidth={2} />
              </div>

              {/* Mastercard */}
              <div 
                onClick={() => setCardType('mastercard')}
                className={`w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-all border shadow-sm shrink-0 bg-black ${
                  cardType === 'mastercard' ? 'ring-2 ring-[#FE5C2C] border-transparent scale-105' : 'border-gray-200 dark:border-slate-800 hover:scale-105'
                }`}
              >
                <div className="flex -space-x-1 items-center justify-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#EB001B] opacity-90"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] opacity-90"></div>
                </div>
              </div>

              {/* Visa */}
              <div 
                onClick={() => setCardType('visa')}
                className={`w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-all border shadow-sm shrink-0 bg-white dark:bg-slate-900 ${
                  cardType === 'visa' ? 'ring-2 ring-[#FE5C2C] border-transparent scale-105' : 'border-gray-200 dark:border-slate-800 hover:scale-105'
                }`}
              >
                <span className="text-[10px] font-extrabold italic tracking-tighter text-[#1434CB]">VISA</span>
              </div>

              {/* PayPal */}
              <div 
                onClick={() => setCardType('paypal')}
                className={`w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-all border shadow-sm shrink-0 bg-white dark:bg-slate-900 ${
                  cardType === 'paypal' ? 'ring-2 ring-[#FE5C2C] border-transparent scale-105' : 'border-gray-200 dark:border-slate-800 hover:scale-105'
                }`}
              >
                <svg className="w-4 h-4 text-[#003087] fill-current" viewBox="0 0 24 24">
                  <path d="M7.076 2.136C7.386 2.046 7.828 2 8.441 2c1.782 0 3.328.324 4.331 1.036 1.002.712 1.411 1.761 1.411 3.25 0 1.258-.299 2.45-.889 3.51-.59 1.06-1.42 1.83-2.452 2.316-.277.13-.675.24-1.12.33-.284.057-.468.225-.53.473L8.03 18.067c-.085.344-.393.59-.747.59H4.498c-.482 0-.825-.453-.717-.923L6.177 3.313c.097-.424.475-.723.9-.723l.001.001c.001 0-.001.272.001-.454H7.077z" />
                  <path d="M12.569 9.176c.277-.13.675-.24 1.12-.33.284-.057.468-.225.53-.473l.635-2.545c.085-.344.393-.59.747-.59h1.727c.482 0 .825.453.717.923l-2.07 9.155c-.097.424-.475.723-.9.723h-2.148c-.482 0-.825-.453-.717-.923L12.57 9.176z" opacity="0.6"/>
                </svg>
              </div>

              {/* Apple */}
              <div 
                onClick={() => setCardType('apple')}
                className={`w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-all border shadow-sm shrink-0 bg-white dark:bg-slate-900 ${
                  cardType === 'apple' ? 'ring-2 ring-[#FE5C2C] border-transparent scale-105' : 'border-gray-200 dark:border-slate-800 hover:scale-105'
                }`}
              >
                <svg className="w-4 h-4 text-black dark:text-slate-200 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71,19.5 C17.88,20.74 17,21.95 15.66,21.97 C14.32,22 13.89,21.18 12.37,21.18 C10.84,21.18 10.37,21.95 9.1,22 C7.79,22.05 6.8,20.68 5.96,19.47 C4.25,17 2.94,12.45 4.7,9.39 C5.57,7.87 7.13,6.91 8.82,6.88 C10.1,6.86 11.32,7.75 12.11,7.75 C12.89,7.75 14.37,6.68 15.92,6.84 C16.57,6.87 18.39,7.1 19.56,8.82 C19.47,8.88 17.39,10.1 17.41,12.63 C17.44,15.65 20.06,16.66 20.1,16.67 C20.08,16.74 19.67,18.11 18.71,19.5 M15.97,4.17 C16.63,3.37 17.07,2.28 16.95,1 C16,1.04 14.9,1.6 14.24,2.38 C13.68,3.04 13.19,4.14 13.34,5.39 C14.39,5.47 15.4,4.88 15.97,4.17 Z" />
                </svg>
              </div>
            </div>

            {/* Credit Card Visualization */}
            <div 
              className={`w-full aspect-[1.586/1] rounded-[24px] shadow-xl relative flex flex-col justify-between p-6 overflow-hidden select-none transition-all duration-500 ${
                cardType === 'apple' ? 'text-gray-800' : 'text-white'
              }`}
              style={{
                background: 
                  cardType === 'visa' ? 'linear-gradient(115deg, #3b4ca8 48%, #161f4d 48.2%)' :
                  cardType === 'paypal' ? 'linear-gradient(115deg, #0079C1 48%, #00457C 48.2%)' :
                  cardType === 'apple' ? 'linear-gradient(115deg, #F5F5F7 48%, #D2D2D7 48.2%)' :
                  cardType === 'generic' ? 'linear-gradient(115deg, #4A5568 48%, #2D3748 48.2%)' :
                  'linear-gradient(115deg, #FF7E4D 48%, #FF521A 48.2%)' // mastercard default
              }}
            >
              {/* Simplified World Map Watermark */}
              <svg className="absolute inset-0 w-full h-full text-white/[0.09] fill-current pointer-events-none" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
                <path d="M50,150 C70,120 120,80 180,90 C220,95 240,120 260,110 C280,100 300,120 310,150 C320,180 280,220 250,230 C220,240 210,210 180,220 C150,230 110,250 80,220 C50,190 30,180 50,150 Z" />
                <path d="M210,240 C230,240 260,260 250,290 C240,320 200,380 190,420 C180,460 160,490 140,490 C120,490 115,460 120,410 C125,360 140,320 150,290 C160,260 190,240 210,240 Z" />
                <path d="M380,120 C420,90 480,70 550,80 C620,90 680,60 750,70 C820,80 880,110 900,150 C920,190 890,240 850,260 C810,280 780,220 740,240 C700,260 650,280 600,250 C550,220 520,240 480,220 C440,200 410,220 380,190 C350,160 340,150 380,120 Z" />
                <path d="M420,230 C450,220 490,230 510,260 C530,290 540,340 520,380 C500,420 460,450 440,450 C420,450 405,420 400,380 C395,340 390,280 420,230 Z" />
                <path d="M780,380 C810,370 850,380 860,410 C870,440 830,470 790,470 C750,470 740,440 750,410 C760,380 750,390 780,380 Z" />
              </svg>

               {/* Top Row: CARD TYPE & BANK NAME / BRAND LOGO */}
              <div className="flex justify-between items-start z-10">
                <div className="text-sm font-bold tracking-wider uppercase opacity-95">
                  {cardType === 'generic' ? 'CARD TYPE' : cardType === 'apple' ? 'APPLE CARD' : cardType.toUpperCase()}
                </div>
                <div className="flex items-center gap-2">
                  {cardType === 'mastercard' && (
                    <div className="flex -space-x-1.5 items-center mr-1">
                      <div className="w-4.5 h-4.5 rounded-full bg-[#EB001B] opacity-90 border border-[#EB001B]"></div>
                      <div className="w-4.5 h-4.5 rounded-full bg-[#F79E1B] opacity-90 border border-[#F79E1B]"></div>
                    </div>
                  )}
                  {cardType === 'visa' && (
                    <span className="text-[12px] font-black italic tracking-tighter text-white mr-1">VISA</span>
                  )}
                  {cardType === 'paypal' && (
                    <span className="text-[10px] font-extrabold italic text-white bg-blue-900/30 px-1.5 py-0.5 rounded mr-1">PayPal</span>
                  )}
                  {cardType === 'apple' && (
                    <svg className="w-4 h-4 text-black fill-current mr-1" viewBox="0 0 24 24">
                      <path d="M18.71,19.5 C17.88,20.74 17,21.95 15.66,21.97 C14.32,22 13.89,21.18 12.37,21.18 C10.84,21.18 10.37,21.95 9.1,22 C7.79,22.05 6.8,20.68 5.96,19.47 C4.25,17 2.94,12.45 4.7,9.39 C5.57,7.87 7.13,6.91 8.82,6.88 C10.1,6.86 11.32,7.75 12.11,7.75 C12.89,7.75 14.37,6.68 15.92,6.84 C16.57,6.87 18.39,7.1 19.56,8.82 C19.47,8.88 17.39,10.1 17.41,12.63 C17.44,15.65 20.06,16.66 20.1,16.67 C20.08,16.74 19.67,18.11 18.71,19.5 M15.97,4.17 C16.63,3.37 17.07,2.28 16.95,1 C16,1.04 14.9,1.6 14.24,2.38 C13.68,3.04 13.19,4.14 13.34,5.39 C14.39,5.47 15.4,4.88 15.97,4.17 Z" />
                    </svg>
                  )}
                  <span className="text-sm font-bold tracking-wider uppercase opacity-95">BANK NAME</span>
                  {/* Contactless waves */}
                  <svg className={`w-4 h-4 ${cardType === 'apple' ? 'text-black' : 'text-white'} opacity-90`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 00-6-6M18 12a12 12 0 00-12-12M6 18.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                </div>
              </div>

              {/* Microchip with left pointing arrow */}
              <div className="flex items-center gap-1 z-10 -mt-1">
                {/* Left pointing arrow */}
                <span className="text-white/90 text-[10px] select-none">&#9664;</span>
                
                {/* Golden Microchip */}
                <svg viewBox="0 0 50 38" className="w-12 h-9 rounded-lg shadow-md bg-gradient-to-br from-[#FFE57F] via-[#FFD54F] to-[#FFB300] border border-amber-600/30 p-1">
                  <path d="M 0,12 L 50,12 M 0,26 L 50,26 M 15,0 L 15,38 M 35,0 L 35,38" stroke="#795548" strokeWidth="1.5" strokeOpacity="0.4" fill="none" />
                  <rect x="18" y="14" width="14" height="10" rx="3" fill="none" stroke="#795548" strokeWidth="1.5" strokeOpacity="0.4" />
                </svg>
              </div>

              {/* Card Number */}
              <div className="z-10 mt-1 text-left">
                <div className="text-xl md:text-2xl font-bold tracking-[0.16em] font-mono text-shadow-sm truncate">
                  {newCardNumber || '1234 5678 9012 3456'}
                </div>
                {/* Tiny sub-number representation */}
                <div className="text-[10px] font-mono opacity-80 mt-0.5 ml-0.5">
                  {newCardNumber ? newCardNumber.split(' ')[0] : '1234'}
                </div>
              </div>

              {/* Bottom Row: Cardholder Name & Valid Thru */}
              <div className="flex justify-between items-end z-10">
                <div className="flex flex-col text-left">
                  <span className="text-[13px] font-bold tracking-wide uppercase truncate max-w-[240px]">
                    {newCardName || 'CARDHOLDER NAME'}
                  </span>
                </div>
                
                <div className="flex flex-col items-end text-right">
                  <div className="flex items-center gap-1">
                    <span className="text-[7px] leading-3 uppercase opacity-75 font-semibold text-right">
                      VALID<br/>THRU
                    </span>
                    <span className="text-[11px] leading-3 font-semibold text-white/95">&#9658;</span>
                    <span className="text-sm font-bold font-mono tracking-wider">
                      06/30
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Input Fields Container */}
            <form onSubmit={handleSaveCard} className="space-y-4 pt-1">
              <div className="flex gap-4">
                {/* Cardholder Name Input */}
                <div className="flex-1 space-y-1.5 text-left">
                  <label className="text-[12px] font-semibold text-gray-500 dark:text-slate-400">
                    Cardholder Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="Johan Smit"
                    value={newCardName}
                    onChange={(e) => setNewCardName(e.target.value)}
                    className="w-full px-5 py-3 rounded-[20px] bg-[#F5F5F5] dark:bg-slate-900 border border-transparent dark:border-slate-800 text-sm text-gray-800 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-[#FE5C2C] focus:ring-1 focus:ring-[#FE5C2C] transition-all font-semibold placeholder:text-gray-400 placeholder:font-normal"
                  />
                </div>

                {/* CVV Input */}
                <div className="w-1/3 space-y-1.5 text-left">
                  <label className="text-[12px] font-semibold text-gray-500 dark:text-slate-400">
                    CVV
                  </label>
                  <input 
                    type="password" 
                    maxLength={4}
                    placeholder="123"
                    value={newCardCvv}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setNewCardCvv(val);
                    }}
                    className="w-full px-5 py-3 rounded-[20px] bg-[#F5F5F5] dark:bg-slate-900 border border-transparent dark:border-slate-800 text-sm text-gray-800 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-[#FE5C2C] focus:ring-1 focus:ring-[#FE5C2C] transition-all font-semibold placeholder:text-gray-400 placeholder:font-normal text-center"
                  />
                </div>
              </div>

              {/* Card Number Input */}
              <div className="space-y-1.5 text-left">
                <label className="text-[12px] font-semibold text-gray-500 dark:text-slate-400">
                  Card Number
                </label>
                <div className="relative flex items-center">
                  <input 
                    type="text" 
                    maxLength={19}
                    placeholder="1234 5678 9012 3456"
                    value={newCardNumber}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '');
                      if (val.length > 16) val = val.slice(0, 16);
                      let formatted = '';
                      for (let i = 0; i < val.length; i++) {
                        if (i > 0 && i % 4 === 0) formatted += ' ';
                        formatted += val[i];
                      }
                      setNewCardNumber(formatted);
                    }}
                    className="w-full pl-5 pr-12 py-3 rounded-[20px] bg-[#F5F5F5] dark:bg-slate-900 border border-transparent dark:border-slate-800 text-sm text-gray-800 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-[#FE5C2C] focus:ring-1 focus:ring-[#FE5C2C] transition-all font-semibold placeholder:text-gray-400 placeholder:font-normal font-mono"
                  />
                  <div className="absolute right-4 text-gray-400">
                    <CreditCard className="w-5 h-5" />
                  </div>
                </div>
              </div>
              
              {/* Save / Update Card Actions */}
              <div className="pt-4 flex gap-3">
                {editingCardId && (
                  <button 
                    type="button"
                    onClick={() => {
                      setEditingCardId(null);
                      setNewCardName('');
                      setNewCardNumber('');
                      setNewCardCvv('');
                      setCardType('mastercard');
                    }}
                    className="flex-1 py-3 border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-300 font-semibold rounded-[20px] text-[15px] hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button 
                  type="submit"
                  className="flex-[2] py-3 bg-[#FE5C2C] hover:bg-[#E04E1A] text-white font-semibold rounded-[20px] text-[15px] transition-colors shadow-md shadow-orange-500/20"
                >
                  {editingCardId ? 'Update Card' : 'Save Card'}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
