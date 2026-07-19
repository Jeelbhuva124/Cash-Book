import React, { useState, useEffect, useRef } from 'react';
import { Camera, Pencil, Check, X } from 'lucide-react';

const Profile = () => {
  // Mock data matching the design, merged with real user data if available
  const [user, setUser] = useState({
    firstName: 'Natashia',
    lastName: 'Khaleira',
    email: 'info@binary-fusion.com',
    phone: '(+62) 821 2554-5846',
    dob: '12-10-1990',
    role: 'Admin',
    country: 'United Kingdom',
    city: 'Leeds, East London',
    postalCode: 'ERT 1254',
    avatar: 'https://i.pravatar.cc/150?img=11'
  });

  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [personalForm, setPersonalForm] = useState({});
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({});
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedUser = { ...user, avatar: reader.result };
        setUser(updatedUser);
        localStorage.setItem('profile_data', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('profileUpdated'));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    let currentUser = { ...user };

    // Check if they have a saved profile override
    const savedProfile = JSON.parse(localStorage.getItem('profile_data'));
    if (savedProfile) {
      currentUser = savedProfile;
    } else {
      // Otherwise, load initial details if they logged in
      const savedUser = JSON.parse(localStorage.getItem('user'));
      if (savedUser) {
         const nameParts = (savedUser.username || '').split(' ');
         currentUser = {
           ...currentUser,
           firstName: nameParts[0] || currentUser.firstName,
           lastName: nameParts.slice(1).join(' ') || currentUser.lastName,
           email: savedUser.email_id || currentUser.email,
         };
      }

      // Automatically sync their real location from their active session
      const currentSessionId = localStorage.getItem('current_session_id');
      const sessions = JSON.parse(localStorage.getItem('active_sessions') || '[]');
      const currentSession = sessions.find(s => s.id === currentSessionId);
      
      if (currentSession && currentSession.location && currentSession.location !== 'Unknown Location') {
        const parts = currentSession.location.split(',');
        if (parts.length >= 2) {
           currentUser.city = parts[0].trim();
           currentUser.country = parts[1].trim();
        } else if (parts.length === 1) {
           currentUser.city = parts[0].trim();
           // If they fallback to a timezone city like 'Kolkata', infer India
           if (['kolkata', 'mumbai', 'delhi', 'bangalore'].includes(parts[0].trim().toLowerCase())) {
             currentUser.country = 'India';
           }
        }
      }
    }

    // Enforce Indian Phone Format if country is India
    if (currentUser.country && currentUser.country.toLowerCase().includes('india')) {
      if (!currentUser.phone.includes('+91')) {
         // Replace the mock Indonesia number with an Indian mock number
         if (currentUser.phone.includes('+62')) {
           currentUser.phone = '(+91) 98765-43210';
         } else {
           currentUser.phone = '(+91) ' + currentUser.phone.replace(/[^0-9-\s]/g, '').trim();
         }
      }
    }

    setUser(currentUser);
  }, []);

  // Handlers for Personal Information
  const handleEditPersonal = () => {
    setPersonalForm({
      firstName: user.firstName,
      lastName: user.lastName,
      dob: user.dob,
      email: user.email,
      phone: user.phone,
      role: user.role
    });
    setIsEditingPersonal(true);
  };

  const handleSavePersonal = () => {
    let updatedUser = { ...user, ...personalForm };
    
    // Auto-format phone if they are from India
    if (updatedUser.country && updatedUser.country.toLowerCase().includes('india') && updatedUser.phone) {
       if (!updatedUser.phone.includes('+91')) {
         updatedUser.phone = '(+91) ' + updatedUser.phone.replace(/[^0-9-\s]/g, '').trim();
       }
    }
    
    setUser(updatedUser);
    localStorage.setItem('profile_data', JSON.stringify(updatedUser));
    window.dispatchEvent(new Event('profileUpdated'));
    setIsEditingPersonal(false);
  };

  const handlePersonalChange = (e) => {
    setPersonalForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handlers for Address
  const handleEditAddress = () => {
    setAddressForm({
      country: user.country,
      city: user.city,
      postalCode: user.postalCode
    });
    setIsEditingAddress(true);
  };

  const handleSaveAddress = () => {
    let updatedUser = { ...user, ...addressForm };
    
    // Auto-format phone if they change their country to India
    if (updatedUser.country && updatedUser.country.toLowerCase().includes('india') && updatedUser.phone) {
       if (!updatedUser.phone.includes('+91')) {
         // Only prepend +91 if it's missing, optionally stripping out other country codes if needed
         if (updatedUser.phone.includes('+62')) {
           updatedUser.phone = '(+91) 98765-43210';
         } else {
           updatedUser.phone = '(+91) ' + updatedUser.phone.replace(/[^0-9-\s]/g, '').trim();
         }
       }
    }
    
    setUser(updatedUser);
    localStorage.setItem('profile_data', JSON.stringify(updatedUser));
    window.dispatchEvent(new Event('profileUpdated'));
    setIsEditingAddress(false);
  };

  const handleAddressChange = (e) => {
    setAddressForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const inputClass = "w-full bg-background border border-border/80 rounded-md px-3 py-1.5 text-[14px] text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors";

  return (
    <div className="max-w-[1000px] mx-auto p-4 md:p-8 w-full bg-background/50 min-h-[calc(100vh-80px)]">
      <h1 className="text-xl font-bold text-primary mb-6">My Profile</h1>
      
      {/* Top Profile Card */}
      <div className="bg-card shadow-sm border border-border/60 rounded-2xl p-6 mb-6 flex items-center gap-6">
        <div className="relative">
          <div className="w-[100px] h-[100px] rounded-full overflow-hidden border-2 border-border/30 bg-muted">
            <img 
              src={user.avatar} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-1 right-0 bg-card border border-border shadow-sm p-1.5 rounded-full text-primary hover:bg-muted transition-colors z-10 flex items-center justify-center cursor-pointer"
            title="Update Profile Picture"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*" 
            className="hidden" 
          />
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-lg font-bold text-primary mb-1">{user.firstName} {user.lastName}</h2>
          <p className="text-muted-foreground text-[13px] font-medium mb-0.5">{user.role}</p>
          <p className="text-muted-foreground text-[13px] font-medium">{user.city.split(',')[0]}, {user.country}</p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-card shadow-sm border border-border/60 rounded-2xl p-6 mb-6 transition-all">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[17px] font-bold text-primary">Personal Information</h3>
          {!isEditingPersonal ? (
            <button 
              onClick={handleEditPersonal}
              className="flex items-center gap-1.5 bg-[#ef7a15] hover:bg-[#d66b10] text-white px-4 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              Edit <Pencil className="w-3 h-3" />
            </button>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={() => setIsEditingPersonal(false)}
                className="flex items-center gap-1.5 bg-muted hover:bg-muted/80 text-foreground px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors"
              >
                Cancel <X className="w-3 h-3" />
              </button>
              <button 
                onClick={handleSavePersonal}
                className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors"
              >
                Save <Check className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
        <hr className="border-border/60 mb-6" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-7 gap-x-6">
          <div>
            <p className="text-[13px] text-muted-foreground font-medium mb-1.5">First Name</p>
            {!isEditingPersonal ? (
              <p className="text-[15px] font-semibold text-foreground/90">{user.firstName}</p>
            ) : (
              <input type="text" name="firstName" value={personalForm.firstName} onChange={handlePersonalChange} className={inputClass} />
            )}
          </div>
          <div>
            <p className="text-[13px] text-muted-foreground font-medium mb-1.5">Last Name</p>
            {!isEditingPersonal ? (
              <p className="text-[15px] font-semibold text-foreground/90">{user.lastName}</p>
            ) : (
              <input type="text" name="lastName" value={personalForm.lastName} onChange={handlePersonalChange} className={inputClass} />
            )}
          </div>
          <div>
            <p className="text-[13px] text-muted-foreground font-medium mb-1.5">Date of Birth</p>
            {!isEditingPersonal ? (
              <p className="text-[15px] font-semibold text-foreground/90">{user.dob}</p>
            ) : (
              <input type="text" name="dob" value={personalForm.dob} onChange={handlePersonalChange} className={inputClass} placeholder="DD-MM-YYYY" />
            )}
          </div>
          <div>
            <p className="text-[13px] text-muted-foreground font-medium mb-1.5">Email Address</p>
            {!isEditingPersonal ? (
              <p className="text-[15px] font-semibold text-foreground/90">{user.email}</p>
            ) : (
              <input type="email" name="email" value={personalForm.email} onChange={handlePersonalChange} className={inputClass} />
            )}
          </div>
          <div>
            <p className="text-[13px] text-muted-foreground font-medium mb-1.5">Phone Number</p>
            {!isEditingPersonal ? (
              <p className="text-[15px] font-semibold text-foreground/90">{user.phone}</p>
            ) : (
              <input type="text" name="phone" value={personalForm.phone} onChange={handlePersonalChange} className={inputClass} />
            )}
          </div>
          <div>
            <p className="text-[13px] text-muted-foreground font-medium mb-1.5">User Role</p>
            {!isEditingPersonal ? (
              <p className="text-[15px] font-semibold text-foreground/90">{user.role}</p>
            ) : (
              <select name="role" value={personalForm.role} onChange={handlePersonalChange} className={inputClass}>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="User">User</option>
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="bg-card shadow-sm border border-border/60 rounded-2xl p-6 transition-all">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[17px] font-bold text-primary">Address</h3>
          {!isEditingAddress ? (
            <button 
              onClick={handleEditAddress}
              className="flex items-center gap-1.5 bg-transparent border border-border hover:bg-muted text-foreground/80 px-4 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              Edit <Pencil className="w-3 h-3" />
            </button>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={() => setIsEditingAddress(false)}
                className="flex items-center gap-1.5 bg-muted hover:bg-muted/80 text-foreground px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors"
              >
                Cancel <X className="w-3 h-3" />
              </button>
              <button 
                onClick={handleSaveAddress}
                className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors"
              >
                Save <Check className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
        <hr className="border-border/60 mb-6" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-7 gap-x-6">
          <div>
            <p className="text-[13px] text-muted-foreground font-medium mb-1.5">Country</p>
            {!isEditingAddress ? (
              <p className="text-[15px] font-semibold text-foreground/90">{user.country}</p>
            ) : (
              <input type="text" name="country" value={addressForm.country} onChange={handleAddressChange} className={inputClass} />
            )}
          </div>
          <div>
            <p className="text-[13px] text-muted-foreground font-medium mb-1.5">City</p>
            {!isEditingAddress ? (
              <p className="text-[15px] font-semibold text-foreground/90">{user.city}</p>
            ) : (
              <input type="text" name="city" value={addressForm.city} onChange={handleAddressChange} className={inputClass} />
            )}
          </div>
          <div>
            <p className="text-[13px] text-muted-foreground font-medium mb-1.5">Postal Code</p>
            {!isEditingAddress ? (
              <p className="text-[15px] font-semibold text-foreground/90">{user.postalCode}</p>
            ) : (
              <input type="text" name="postalCode" value={addressForm.postalCode} onChange={handleAddressChange} className={inputClass} />
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Profile;
